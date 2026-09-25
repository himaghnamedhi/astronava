import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Compass,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

type AuthViewMode = 'signin' | 'signup' | 'forgot_password';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalReason, 
    signInWithGoogle, 
    signUpWithEmail, 
    signInWithEmail, 
    sendPasswordReset 
  } = useAuth();

  const [viewMode, setViewMode] = useState<AuthViewMode>('signin');
  const [showGuestComparisonPopup, setShowGuestComparisonPopup] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [unauthorizedDomainInfo, setUnauthorizedDomainInfo] = useState<{ domain: string; projectId: string } | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setUnauthorizedDomainInfo(null);
    setLoading(true);

    try {
      if (viewMode === 'signup') {
        if (!email || !password) {
          throw new Error('Please provide both email and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await signUpWithEmail(email, password, name, phoneNumber);
      } else if (viewMode === 'signin') {
        if (!email || !password) {
          throw new Error('Please provide both email and password.');
        }
        await signInWithEmail(email, password);
      } else if (viewMode === 'forgot_password') {
        if (!email) {
          throw new Error('Please enter your email to receive a password reset link.');
        }
        await sendPasswordReset(email);
        setSuccessMessage(`A password reset link has been dispatched to ${email}. Please check your inbox.`);
      }
    } catch (err: any) {
      let msg = err.message || 'Authentication operation failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
        setViewMode('signin');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        msg = 'Incorrect email or password. Please verify credentials or reset your password.';
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
    setSuccessMessage(null);
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
      } else if (err.code === 'auth/popup-blocked' || (err.message && err.message.includes('popup-blocked'))) {
        setError('The sign-in popup was blocked by your browser. Please allow popups or open in a new tab.');
      } else if (
        err.code !== 'auth/popup-closed-by-user' &&
        err.code !== 'auth/cancelled-popup-request' &&
        !err.message?.includes('popup-closed-by-user')
      ) {
        setError(err.message || 'Google Sign-in encountered an issue. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        className="relative w-full max-w-md sm:max-w-lg my-auto bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luxury Top Header */}
        <div className="bg-gradient-to-r from-[#170F0A] via-[#241710] to-[#170F0A] px-6 py-6 text-amber-50 relative shrink-0 text-center">
          <button
            onClick={closeAuthModal}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex justify-center mb-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Astronava Vedic Portal</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-vedic text-white leading-tight">
            {viewMode === 'signup' && 'Create Member Account'}
            {viewMode === 'signin' && 'Astronava Member Sign In'}
            {viewMode === 'forgot_password' && 'Password Recovery'}
          </h2>
          <p className="text-xs text-amber-200/90 mt-2 max-w-sm mx-auto leading-relaxed">
            {authModalReason || 'Access your personalized Janam Kundli, 36-Guna matching, and certified astrological remedies.'}
          </p>
        </div>

        {/* View Mode Switch Tabs */}
        {viewMode !== 'forgot_password' && (
          <div className="p-1.5 mx-6 mt-5 bg-stone-200/70 rounded-2xl flex items-center relative">
            <button
              type="button"
              onClick={() => {
                setViewMode('signin');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`relative flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer text-center z-10 ${
                viewMode === 'signin' ? 'text-amber-950' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {viewMode === 'signin' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-xs border border-stone-300/60 -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('signup');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`relative flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer text-center z-10 ${
                viewMode === 'signup' ? 'text-amber-950' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {viewMode === 'signup' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-xs border border-stone-300/60 -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span>Create Free Account</span>
            </button>
          </div>
        )}

        {/* Form & Main Body */}
        <div className="p-6 space-y-4">

          {/* Official Google Sign-In with Verified Identity Branding */}
          {viewMode !== 'forgot_password' && (
            <div className="space-y-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.015, translateY: -1 }}
                whileTap={{ scale: 0.985 }}
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm rounded-xl border border-stone-300 hover:border-stone-400 shadow-xs hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              </motion.button>

              <div className="flex items-center justify-center gap-3 py-1">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  or continue with email
                </span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{successMessage}</p>
                <button
                  type="button"
                  onClick={() => setViewMode('signin')}
                  className="text-[11px] text-emerald-900 font-bold underline mt-1.5 cursor-pointer block"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Domain Warning for Google Auth in Preview */}
          {unauthorizedDomainInfo && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Google Sign-In Domain Notice</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-normal">
                Google OAuth requires authorizing <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">{unauthorizedDomainInfo.domain}</code> in Firebase. You can use <strong>Email &amp; Password</strong> or <strong>Explore as Guest</strong> right now.
              </p>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {viewMode === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Arjuna Varma"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-800 shadow-2xs font-medium text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-800 shadow-2xs font-medium text-stone-900"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-800 shadow-2xs font-medium text-stone-900"
                />
              </div>
            </div>

            {viewMode !== 'forgot_password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Password
                  </label>
                  {viewMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('forgot_password');
                        setError(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-800 shadow-2xs font-medium text-stone-900"
                  />
                </div>
              </div>
            )}

            {/* Professionally Branded Primary Action Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.015, translateY: -1 }}
              whileTap={{ scale: 0.985 }}
              className="w-full mt-2 py-3 px-5 bg-gradient-to-r from-[#1E140E] via-[#2D1D14] to-[#1E140E] hover:from-[#261A12] hover:to-[#261A12] text-amber-100 font-bold text-xs sm:text-sm rounded-xl border border-amber-600/40 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Securely...</span>
                </div>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>
                    {viewMode === 'signup' && 'Create Free Member Account'}
                    {viewMode === 'signin' && 'Sign In as Verified Member'}
                    {viewMode === 'forgot_password' && 'Send Recovery Email'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </motion.button>
          </form>



          {/* Distinct Guest Seeker Exploration Button */}
          <div className="pt-2">
            <motion.button
              type="button"
              onClick={() => setShowGuestComparisonPopup(true)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-300/80 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5 text-stone-600" />
              <span>Continue as Guest Seeker (Preview Only)</span>
            </motion.button>
            <p className="text-[10px] text-stone-500 text-center mt-2 leading-relaxed">
              Explore sample charts, compatibility rules, and educational guides without signing in. You can upgrade to a free member account anytime to calculate your own birth chart.
            </p>
          </div>

        </div>
      </motion.div>

      {/* Guest Seeker vs Member Comparison Popup Dialog */}
      <AnimatePresence>
        {showGuestComparisonPopup && (
          <div 
            className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs animate-fadeIn"
            onClick={() => setShowGuestComparisonPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-amber-900/30 overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Luxury Header */}
              <div className="bg-gradient-to-r from-[#170F0A] via-[#241710] to-[#170F0A] px-6 py-5 text-amber-50 relative text-center">
                <button
                  type="button"
                  onClick={() => setShowGuestComparisonPopup(false)}
                  aria-label="Close popup"
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10.5px] font-bold tracking-wider uppercase mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Access Comparison</span>
                </div>

                <h3 className="text-xl font-bold font-vedic text-white leading-tight">
                  Guest Seeker vs. Astronava Member
                </h3>
                <p className="text-xs text-amber-200/90 mt-1 max-w-sm mx-auto leading-relaxed">
                  Understand what is included with Guest exploration versus a permanent free Member account.
                </p>
              </div>

              {/* Comparison Grid */}
              <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Guest Seeker Card */}
                  <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-2.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
                        <div className="flex items-center gap-1.5 font-bold text-stone-700 text-xs uppercase tracking-wider">
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>Guest Seeker</span>
                        </div>
                        <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          Preview
                        </span>
                      </div>
                      <ul className="mt-2.5 space-y-2 text-xs text-stone-600 leading-tight">
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Preview verified historical charts</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Sample 36-Guna Kundli Milan</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Browse 9 Navaratna stones</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Daily transit &amp; panchang</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-400 italic">
                      Personal chart generation &amp; PDF downloads require free sign up.
                    </div>
                  </div>

                  {/* Member Card */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100/60 border border-amber-300 space-y-2.5 flex flex-col justify-between shadow-xs ring-1 ring-amber-400/40">
                    <div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-amber-200">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                          <span>Member</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                          100% Free
                        </span>
                      </div>
                      <ul className="mt-2.5 space-y-2 text-xs text-amber-950 leading-tight font-medium">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>Personal Vedic Janam Kundli</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>Custom 36-Guna Kundli Milan</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>Body-weight calibrated gems</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>Download 3-Page A4 PDF Patrika</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>Save &amp; access charts anywhere</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-amber-200/80 text-[10px] text-amber-800 font-semibold">
                      Full access to all calculation engines &amp; downloads.
                    </div>
                  </div>
                </div>

                {/* Popup Action Buttons */}
                <div className="pt-2 space-y-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setShowGuestComparisonPopup(false);
                      setViewMode('signup');
                    }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-[#1E140E] via-[#2D1D14] to-[#1E140E] hover:from-[#261A12] hover:to-[#261A12] text-amber-100 font-bold text-xs rounded-xl border border-amber-600/40 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Create Free Member Account</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowGuestComparisonPopup(false);
                      closeAuthModal();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
                  >
                    <Compass className="w-3.5 h-3.5 text-stone-500" />
                    <span>Proceed as Guest Seeker</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


