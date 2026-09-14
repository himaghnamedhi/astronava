import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, Phone, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalReason, 
    signInWithGoogle, 
    signUpWithEmail, 
    signInWithEmail, 
    signInAsDemoUser 
  } = useAuth();

  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomainInfo, setUnauthorizedDomainInfo] = useState<{ domain: string; projectId: string } | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUnauthorizedDomainInfo(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!email || !password) {
          throw new Error('Please provide both email and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await signUpWithEmail(email, password, name, phoneNumber);
      } else {
        if (!email || !password) {
          throw new Error('Please provide both email and password.');
        }
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      let msg = err.message || 'Authentication failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
        setIsSignUp(false);
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect email or password. Please try again.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in window was closed before completion.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setUnauthorizedDomainInfo(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('auth/unauthorized-domain'))) {
        const currentDomain = typeof window !== 'undefined' ? (window.location.hostname || 'www.astronava.com') : 'www.astronava.com';
        setUnauthorizedDomainInfo({
          domain: currentDomain,
          projectId: 'project-51605426-b73c-4f18-be6',
        });
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Sign-in was cancelled or encountered an issue.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setUnauthorizedDomainInfo(null);
    setLoading(true);
    try {
      await signInAsDemoUser(name || 'Vedic Explorer');
    } catch (err: any) {
      setError(err.message || 'Could not start demo session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-sm sm:max-w-md my-auto bg-[#FAF8F5] rounded-2xl sm:rounded-3xl border border-amber-900/20 shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-4 py-3 sm:px-5 sm:py-3.5 text-amber-50 relative shrink-0 text-center">
          <button
            onClick={closeAuthModal}
            aria-label="Close modal"
            className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="flex justify-center mb-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] sm:text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Astronava Membership</span>
            </div>
          </div>

          <h2 className="text-base sm:text-lg font-bold font-vedic text-white leading-tight">
            {isSignUp ? 'Create Free Account' : 'Welcome Back'}
          </h2>
          <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5 leading-snug">
            {authModalReason || 'Sign up to unlock deep AI synthesis of planets, house lords & timing.'}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Google 1-Click Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2 px-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Centered Divider ("or with email" in the exact middle) */}
          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-stone-300"></div>
            <span className="px-3 text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-wider font-semibold text-center select-none shrink-0">
              or with email
            </span>
            <div className="flex-1 border-t border-stone-300"></div>
          </div>

          {/* Error & Unauthorized Domain Messages */}
          {unauthorizedDomainInfo ? (
            <div className="p-3 sm:p-3.5 bg-amber-50/95 border border-amber-300/90 rounded-2xl text-stone-800 text-xs space-y-2 animate-fadeIn shadow-xs">
              <div className="flex items-start gap-2 text-amber-950 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold leading-tight">Domain Authorization Needed for Google Sign-In</h4>
                  <p className="text-[10.5px] font-normal text-stone-600 mt-0.5">
                    Google Sign-In on <strong className="text-stone-900 font-semibold">{unauthorizedDomainInfo.domain}</strong> requires adding the domain to your Firebase Authorized Domains whitelist.
                  </p>
                </div>
              </div>

              <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/80 text-[10.5px] sm:text-[11px] space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-[9.5px]">
                  <span className="font-semibold uppercase tracking-wider">FIREBASE PROJECT</span>
                  <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded font-mono text-[9.5px]">{unauthorizedDomainInfo.projectId}</code>
                </div>
                <p className="font-semibold text-stone-800">Quick 1-Minute Configuration:</p>
                <ol className="list-decimal list-inside text-stone-600 space-y-0.5">
                  <li>Go to <strong>Firebase Console &gt; Authentication &gt; Settings</strong></li>
                  <li>In <strong>Authorized domains</strong>, click <strong>Add domain</strong></li>
                  <li>Add: <code className="bg-amber-100/90 text-amber-950 px-1 py-0.5 rounded font-mono font-bold">astronava.com</code> and <code className="bg-amber-100/90 text-amber-950 px-1 py-0.5 rounded font-mono font-bold">www.astronava.com</code></li>
                </ol>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-200/70 text-[11px]">
                <span className="text-stone-600">Available instantly:</span>
                <button
                  type="button"
                  onClick={() => {
                    setUnauthorizedDomainInfo(null);
                    setIsSignUp(true);
                  }}
                  className="text-amber-900 font-bold hover:underline cursor-pointer"
                >
                  Use Email / Password Below ↓
                </button>
              </div>
            </div>
          ) : error ? (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : null}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
            {isSignUp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Your Name <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rohini"
                      className="w-full pl-8 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Phone Number <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 or +1 number"
                      className="w-full pl-8 pr-2.5 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 text-stone-900"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 sm:py-2.5 px-4 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Sign Up to Unlock AI Summary' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign Up and Sign In */}
          <div className="text-center pt-1 border-t border-stone-200">
            {isSignUp ? (
              <p className="text-[11px] sm:text-xs text-stone-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                    setUnauthorizedDomainInfo(null);
                  }}
                  className="text-amber-900 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-[11px] sm:text-xs text-stone-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                    setUnauthorizedDomainInfo(null);
                  }}
                  className="text-amber-900 font-bold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            )}
          </div>

          {/* Fast Demo Access Button */}
          <div className="pt-0.5 text-center">
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="text-[10px] sm:text-[11px] text-stone-500 hover:text-stone-800 underline decoration-dotted transition-colors cursor-pointer"
            >
              Instant Preview: Continue as Demo Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
