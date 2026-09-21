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
  signInAnonymously,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, syncUserProfile } from '../lib/firebase';
import { AppUser, UserBirthDetails, UserAddress, UserPaymentMethod, UserDownloadItem } from '../types/user';

export type { AppUser, UserBirthDetails, UserAddress, UserPaymentMethod, UserDownloadItem };

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string, phoneNumber?: string, birthDetails?: UserBirthDetails) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInAsDemoUser: (name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateBirthDetails: (details: UserBirthDetails) => Promise<void>;
  updateGeneralProfile: (profile: Partial<AppUser>) => Promise<void>;
  saveUserAddress: (address: UserAddress) => Promise<void>;
  deleteUserAddress: (addressId: string) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'astronava_user_profile_cache';
const DEMO_STORAGE_KEY = 'astronava_demo_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    // Initial state check from localStorage cache
    try {
      const cached = localStorage.getItem(USER_STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<string>('Sign in to access personalized Vedic services');

  // Load Firestore extra profile data (birth details, phone, addresses)
  const fetchFirestoreProfile = async (uid: string): Promise<Partial<AppUser>> => {
    try {
      if (!db) return {};
      const userSnap = await getDoc(doc(db, 'users', uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        const birthDetails: UserBirthDetails | undefined = data.dob
          ? {
              dob: data.dob,
              tob: data.tob || '12:00',
              isTobUnknown: Boolean(data.isTobUnknown),
              birthPlace: data.birthPlace || 'New Delhi, India',
              latitude: Number(data.latitude) || 28.6139,
              longitude: Number(data.longitude) || 77.209,
              timezoneOffset: Number(data.timezoneOffset) || 5.5,
              gender: data.gender || 'other',
            }
          : data.horoscopeProfile
          ? {
              dob: data.horoscopeProfile.dob || '1995-01-01',
              tob: data.horoscopeProfile.tob || '12:00',
              isTobUnknown: Boolean(data.horoscopeProfile.isTobUnknown),
              birthPlace: data.horoscopeProfile.birthPlace || 'New Delhi, India',
              latitude: Number(data.horoscopeProfile.latitude) || 28.6139,
              longitude: Number(data.horoscopeProfile.longitude) || 77.209,
              timezoneOffset: Number(data.horoscopeProfile.timezoneOffset) || 5.5,
              gender: data.horoscopeProfile.gender || 'other',
            }
          : undefined;

        return {
          displayName: data.displayName || undefined,
          phoneNumber: data.phoneNumber || undefined,
          birthDetails,
          preferredLanguage: data.preferredLanguage || 'en',
          notificationTime: data.notificationTime || '07:00',
          notificationChannels: data.notificationChannels || ['email', 'push'],
          addresses: data.addresses || [],
          paymentMethods: data.paymentMethods || [],
        };
      }
    } catch (err) {
      console.warn('Note reading Firestore user profile:', err);
    }
    return {};
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Fetch any extra stored profile attributes from Firestore
        const extra = await fetchFirestoreProfile(firebaseUser.uid);

        const appUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || extra.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Vedic Seeker'),
          photoURL: firebaseUser.photoURL,
          phoneNumber: firebaseUser.phoneNumber || extra.phoneNumber || null,
          emailVerified: firebaseUser.emailVerified,
          isAnonymous: firebaseUser.isAnonymous,
          birthDetails: extra.birthDetails,
          preferredLanguage: extra.preferredLanguage || 'en',
          notificationTime: extra.notificationTime || '07:00',
          notificationChannels: extra.notificationChannels || ['email', 'push'],
          addresses: extra.addresses || [],
          paymentMethods: extra.paymentMethods || [],
        };

        setUser(appUser);
        try {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
          localStorage.removeItem(DEMO_STORAGE_KEY);
        } catch {}

        // Keep root doc in sync
        syncUserProfile(appUser).catch(() => {});
      } else {
        // If not in Firebase Auth, check if local demo user exists
        const demo = localStorage.getItem(DEMO_STORAGE_KEY);
        if (demo) {
          try {
            setUser(JSON.parse(demo));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
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
        const extra = await fetchFirestoreProfile(result.user.uid);
        const appUser: AppUser = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
          phoneNumber: result.user.phoneNumber || extra.phoneNumber || null,
          birthDetails: extra.birthDetails,
          preferredLanguage: extra.preferredLanguage || 'en',
          addresses: extra.addresses || [],
        };
        setUser(appUser);
        try {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        } catch {}
        await syncUserProfile(appUser);
        setIsAuthModalOpen(false);
      }
    } catch (error: any) {
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

  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    name?: string, 
    phoneNumber?: string,
    birthDetails?: UserBirthDetails
  ) => {
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
        emailVerified: userCred.user.emailVerified,
        birthDetails,
        preferredLanguage: 'en',
        notificationTime: '07:00',
        notificationChannels: ['email', 'push'],
      };

      setUser(appUser);
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
      } catch {}

      // Write complete profile to Firestore
      if (db) {
        const docRef = doc(db, 'users', userCred.user.uid);
        const firestorePayload: any = {
          id: userCred.user.uid,
          email: userCred.user.email,
          displayName: appUser.displayName,
          createdAt: serverTimestamp(),
        };
        if (phoneNumber) firestorePayload.phoneNumber = phoneNumber;
        if (birthDetails) {
          firestorePayload.dob = birthDetails.dob;
          firestorePayload.tob = birthDetails.tob;
          firestorePayload.isTobUnknown = birthDetails.isTobUnknown;
          firestorePayload.birthPlace = birthDetails.birthPlace;
          firestorePayload.latitude = birthDetails.latitude;
          firestorePayload.longitude = birthDetails.longitude;
          firestorePayload.timezoneOffset = birthDetails.timezoneOffset;
          firestorePayload.gender = birthDetails.gender;
        }
        await setDoc(docRef, firestorePayload, { merge: true });
      }

      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Email Sign-Up Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      const extra = await fetchFirestoreProfile(userCred.user.uid);

      const appUser: AppUser = {
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: userCred.user.displayName || extra.displayName || (email ? email.split('@')[0] : 'Vedic Seeker'),
        photoURL: userCred.user.photoURL,
        phoneNumber: extra.phoneNumber || null,
        emailVerified: userCred.user.emailVerified,
        birthDetails: extra.birthDetails,
        preferredLanguage: extra.preferredLanguage || 'en',
        addresses: extra.addresses || [],
      };

      setUser(appUser);
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
      } catch {}
      await syncUserProfile(appUser);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Email Sign-In Error:', error);
      throw error;
    }
  };

  const signInAsDemoUser = async (name: string = 'Vedic Explorer') => {
    try {
      try {
        const res = await signInAnonymously(auth);
        const appUser: AppUser = {
          uid: res.user.uid,
          email: `${res.user.uid.substring(0, 6)}@astronava.member`,
          displayName: name,
          photoURL: null,
          isAnonymous: true,
          birthDetails: {
            dob: '1995-11-23',
            tob: '06:45',
            isTobUnknown: false,
            birthPlace: 'New Delhi, India',
            latitude: 28.6139,
            longitude: 77.2090,
            timezoneOffset: 5.5,
            gender: 'male',
          },
        };
        setUser(appUser);
        try {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(appUser));
        } catch {}
        await syncUserProfile(appUser);
        setIsAuthModalOpen(false);
        return;
      } catch (fbAnonErr) {
        console.warn('Anonymous auth fallback:', fbAnonErr);
      }

      const demoUser: AppUser = {
        uid: 'demo_user_' + Date.now().toString(36),
        email: 'explorer@astronava.vedic',
        displayName: name,
        photoURL: null,
        isAnonymous: true,
        birthDetails: {
          dob: '1995-11-23',
          tob: '06:45',
          isTobUnknown: false,
          birthPlace: 'New Delhi, India',
          latitude: 28.6139,
          longitude: 77.2090,
          timezoneOffset: 5.5,
          gender: 'male',
        },
      };
      setUser(demoUser);
      try {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
      } catch {}
      setIsAuthModalOpen(false);
    } catch (error: any) {
      console.error('Demo Sign-In Error:', error);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (!email || !email.trim()) {
      throw new Error('Please enter a valid email address.');
    }
    await sendPasswordResetEmail(auth, email.trim());
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error('You must be signed in to send a verification email.');
    }
    await sendEmailVerification(auth.currentUser);
  };

  const updateBirthDetails = async (details: UserBirthDetails) => {
    if (!user) throw new Error('You must be signed in to update birth details.');

    const updatedUser: AppUser = {
      ...user,
      birthDetails: details,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch {}

    // Save to Firestore
    if (db && !user.isAnonymous) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          dob: details.dob,
          tob: details.tob,
          isTobUnknown: details.isTobUnknown,
          birthPlace: details.birthPlace,
          latitude: details.latitude,
          longitude: details.longitude,
          timezoneOffset: details.timezoneOffset,
          gender: details.gender,
        },
        { merge: true }
      );
    }
  };

  const updateGeneralProfile = async (profileUpdate: Partial<AppUser>) => {
    if (!user) throw new Error('You must be signed in to update your profile.');

    const updatedUser: AppUser = {
      ...user,
      ...profileUpdate,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch {}

    // Update Firebase Auth profile if displayName changed
    if (profileUpdate.displayName && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: profileUpdate.displayName });
    }

    // Save to Firestore
    if (db && !user.isAnonymous) {
      const userRef = doc(db, 'users', user.uid);
      const data: any = {};
      if (profileUpdate.displayName) data.displayName = profileUpdate.displayName;
      if (profileUpdate.phoneNumber !== undefined) data.phoneNumber = profileUpdate.phoneNumber;
      if (profileUpdate.preferredLanguage) data.preferredLanguage = profileUpdate.preferredLanguage;
      if (profileUpdate.notificationTime) data.notificationTime = profileUpdate.notificationTime;
      if (profileUpdate.notificationChannels) data.notificationChannels = profileUpdate.notificationChannels;
      await setDoc(userRef, data, { merge: true });
    }
  };

  const saveUserAddress = async (addr: UserAddress) => {
    if (!user) return;
    const currentAddrs = user.addresses || [];
    const index = currentAddrs.findIndex((a) => a.id === addr.id);
    let newAddrs: UserAddress[];
    if (index >= 0) {
      newAddrs = [...currentAddrs];
      newAddrs[index] = addr;
    } else {
      newAddrs = [...currentAddrs, addr];
    }
    await updateGeneralProfile({ addresses: newAddrs });
  };

  const deleteUserAddress = async (addressId: string) => {
    if (!user) return;
    const currentAddrs = user.addresses || [];
    const newAddrs = currentAddrs.filter((a) => a.id !== addressId);
    await updateGeneralProfile({ addresses: newAddrs });
  };

  const deleteUserAccount = async () => {
    if (!user) return;
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }
    if (db && !user.isAnonymous) {
      try {
        await deleteDoc(doc(db, 'users', user.uid));
      } catch (e) {
        console.warn('Note deleting user Firestore doc:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(DEMO_STORAGE_KEY);
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
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
        sendPasswordReset,
        sendVerificationEmail,
        updateBirthDetails,
        updateGeneralProfile,
        saveUserAddress,
        deleteUserAddress,
        deleteUserAccount,
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
