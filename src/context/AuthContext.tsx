import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import { auth, syncUserProfile } from '../lib/firebase';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string, phoneNumber?: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInAsDemoUser: (name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<string>('Sign in to unlock AI Astrological Summary');

  useEffect(() => {
    // Check if demo user was saved locally
    const savedDemoUser = localStorage.getItem('astronava_demo_user');
    if (savedDemoUser) {
      try {
        const parsed = JSON.parse(savedDemoUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('astronava_demo_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Vedic Seeker'),
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
        };
        setUser(appUser);
        localStorage.removeItem('astronava_demo_user');
        // Sync profile to firestore
        syncUserProfile(appUser);
      } else {
        // If not in firebase auth, check if demo user is still logged in
        const demo = localStorage.getItem('astronava_demo_user');
        if (demo) {
          try {
            setUser(JSON.parse(demo));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (reason?: string) => {
    if (reason) setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        const appUser: AppUser = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };
        setUser(appUser);
        await syncUserProfile(appUser);
        setIsAuthModalOpen(false);
      }
    } catch (error: any) {
      // User closed or dismissed the popup window before completing sign-in;
      // this is normal user cancellation behavior, not an application crash.
      if (
        error?.code === 'auth/popup-closed-by-user' ||
        error?.code === 'auth/cancelled-popup-request' ||
        (error?.message && error.message.includes('popup-closed-by-user'))
      ) {
        return;
      }
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string, phoneNumber?: string) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && userCred.user) {
        await updateProfile(userCred.user, { displayName: name });
      }
      const appUser: AppUser = {
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: name || (email ? email.split('@')[0] : 'Vedic Seeker'),
        photoURL: null,
        phoneNumber: phoneNumber || null,
      };
      setUser(appUser);
      await syncUserProfile(appUser);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Email Sign-Up Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      const appUser: AppUser = {
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: userCred.user.displayName || (email ? email.split('@')[0] : 'Vedic Seeker'),
        photoURL: userCred.user.photoURL,
      };
      setUser(appUser);
      await syncUserProfile(appUser);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Email Sign-In Error:', error);
      throw error;
    }
  };

  const signInAsDemoUser = async (name: string = 'Vedic Member') => {
    try {
      // Try anonymous firebase sign-in first
      try {
        const res = await signInAnonymously(auth);
        const appUser: AppUser = {
          uid: res.user.uid,
          email: `${res.user.uid.substring(0, 6)}@astronava.member`,
          displayName: name,
          photoURL: null,
          isAnonymous: true,
        };
        setUser(appUser);
        await syncUserProfile(appUser);
        setIsAuthModalOpen(false);
        return;
      } catch (fbAnonErr) {
        // Fallback to local demo session if anonymous auth is not enabled in Firebase
        console.warn('Anonymous auth fallback to local session:', fbAnonErr);
      }

      const demoUser: AppUser = {
        uid: 'demo_user_' + Date.now().toString(36),
        email: 'member@astronava.vedic',
        displayName: name,
        photoURL: null,
        isAnonymous: true,
      };
      setUser(demoUser);
      localStorage.setItem('astronava_demo_user', JSON.stringify(demoUser));
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Demo Sign-In Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('astronava_demo_user');
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error('Sign Out Error:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signInAsDemoUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
