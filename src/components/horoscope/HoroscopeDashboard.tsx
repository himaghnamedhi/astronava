import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Sliders,
  ShieldCheck,
  Star,
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sun,
  Moon,
  Compass,
  Flame,
  Volume2,
  RotateCcw,
  Heart,
  Briefcase,
  TrendingUp,
  Brain,
  Eye,
  Share2,
  BookOpen,
} from 'lucide-react';
import {
  DailyHoroscopeResult,
  HoroscopeUserProfile,
  DailyHoroscopeCategoryKey,
  CategoryScoreDetail,
} from '../../types/horoscope';
import { generateDailyHoroscope } from '../../data/horoscopeEngine';
import { HoroscopeRegistrationModal } from './HoroscopeRegistrationModal';
import { HoroscopeAdminModal } from './HoroscopeAdminModal';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const HoroscopeDashboard: React.FC = () => {
  const { user, openAuthModal, updateBirthDetails } = useAuth();

  // Check if authenticated user has existing birth details saved
  const userHasSavedDetails = Boolean(
    user &&
    !user.isAnonymous &&
    user.birthDetails?.dob &&
    user.birthDetails?.birthPlace
  );

  // Gated state: only calculate/display if user has saved details or entered details in form
  const [hasCalculated, setHasCalculated] = useState<boolean>(() => userHasSavedDetails);

  // User Profile State - initialized only if user is logged in with birth details
  const [userProfile, setUserProfile] = useState<HoroscopeUserProfile | null>(() => {
    if (user && !user.isAnonymous && user.birthDetails?.dob && user.birthDetails?.birthPlace) {
      return {
        uid: user.uid,
        name: user.displayName || 'Vedic Seeker',
        email: user.email || 'seeker@astronava.com',
        phone: user.phoneNumber || '',
        dob: user.birthDetails.dob,
        tob: user.birthDetails.tob || '12:00',
        isTobUnknown: Boolean(user.birthDetails.isTobUnknown),
        birthPlace: user.birthDetails.birthPlace,
        latitude: user.birthDetails.latitude || 28.6139,
        longitude: user.birthDetails.longitude || 77.2090,
        timezoneOffset: user.birthDetails.timezoneOffset || 5.5,
        gender: user.birthDetails.gender || 'male',
        notificationChannels: user.notificationChannels || ['email', 'push'],
        preferredNotificationTime: user.notificationTime || '07:00',
        consentGiven: true,
        registeredAt: new Date().toISOString(),
      };
    }
    return null;
  });

  // Sync when user logs in or updates their birthDetails in AuthContext
  useEffect(() => {
    if (user && !user.isAnonymous && user.birthDetails?.dob && user.birthDetails?.birthPlace) {
      setUserProfile((prev) => ({
        uid: user.uid,
        name: user.displayName || prev?.name || 'Vedic Seeker',
        email: user.email || prev?.email || 'seeker@astronava.com',
        phone: user.phoneNumber || prev?.phone || '',
        dob: user.birthDetails!.dob,
        tob: user.birthDetails!.tob || '12:00',
        isTobUnknown: Boolean(user.birthDetails!.isTobUnknown),
        birthPlace: user.birthDetails!.birthPlace,
        latitude: user.birthDetails!.latitude || 28.6139,
        longitude: user.birthDetails!.longitude || 77.2090,
        timezoneOffset: user.birthDetails!.timezoneOffset || 5.5,
        gender: user.birthDetails!.gender || 'male',
        notificationChannels: user.notificationChannels || prev?.notificationChannels || ['email', 'push'],
        preferredNotificationTime: user.notificationTime || prev?.preferredNotificationTime || '07:00',
        consentGiven: true,
        registeredAt: prev?.registeredAt || new Date().toISOString(),
      }));
      setHasCalculated(true);
    }
  }, [user?.birthDetails, user?.displayName, user?.email, user?.isAnonymous]);

  // Target Date State
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Horoscope Data & Status
  const [horoscope, setHoroscope] = useState<DailyHoroscopeResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [showConfidenceModal, setShowConfidenceModal] = useState(false);

  // Prompts & Settings
  const [currentPromptVersion, setCurrentPromptVersion] = useState('v1.0-Classical');

  // Category Filtering & Search
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'vitality' | 'career' | 'love' | 'growth' | 'action'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategoryKey, setExpandedCategoryKey] = useState<string | null>(null);

  // Sacred Mantra Interactive Counter
  const [chantCount, setChantCount] = useState(0);

  // User Feedback
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [selectedFeedbackTags, setSelectedFeedbackTags] = useState<string[]>([]);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Load / Compute Horoscope whenever userProfile or selectedDate changes
  useEffect(() => {
    if (hasCalculated && userProfile) {
      loadHoroscope();
    }
  }, [hasCalculated, userProfile, selectedDate, currentPromptVersion]);

  const loadHoroscope = async () => {
    if (!userProfile) return;
    setLoading(true);
    setError(null);

    try {
      // 1. First attempt server API with AI interpretation
      const res = await fetch('/api/horoscope/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          targetDate: selectedDate,
          promptVersion: currentPromptVersion,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHoroscope(data);
      } else {
        // 2. Client-side pure calculation fallback
        console.warn('API returned non-OK, using direct local calculation engine.');
        const localResult = generateDailyHoroscope(userProfile, selectedDate);
        setHoroscope(localResult);
      }
    } catch (err: any) {
      console.warn('Horoscope API call failed, calculating client-side:', err);
      const localResult = generateDailyHoroscope(userProfile, selectedDate);
      setHoroscope(localResult);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (profile: HoroscopeUserProfile) => {
    setUserProfile(profile);
    setHasCalculated(true);
    setIsRegModalOpen(false);

    // Save to AuthContext and Firestore if authenticated
    if (user && !user.isAnonymous) {
      try {
        await updateBirthDetails({
          dob: profile.dob,
          tob: profile.tob,
          isTobUnknown: profile.isTobUnknown,
          birthPlace: profile.birthPlace,
          latitude: profile.latitude,
          longitude: profile.longitude,
          timezoneOffset: profile.timezoneOffset,
          gender: profile.gender,
        });
      } catch (err) {
        console.warn('Could not update birth details in AuthContext:', err);
      }
    }
  };

  // Date Navigation Helpers
  const handleDateShift = (days: number) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + days);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  // Feedback Submission
  const handleSubmitFeedback = async () => {
    if (!feedbackRating) return;

    setFeedbackSubmitted(true);
    // If authenticated, save to subcollection
    if (user && db) {
      try {
        const feedbackRef = doc(db, 'users', user.uid, 'horoscopeFeedback', selectedDate);
        await setDoc(feedbackRef, {
          userId: user.uid,
          date: selectedDate,
          rating: feedbackRating,
          tags: selectedFeedbackTags,
          notes: feedbackNotes,
          submittedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Feedback save note:', err);
      }
    }
  };

  const toggleFeedbackTag = (tag: string) => {
    if (selectedFeedbackTags.includes(tag)) {
      setSelectedFeedbackTags(selectedFeedbackTags.filter((t) => t !== tag));
    } else {
      setSelectedFeedbackTags([...selectedFeedbackTags, tag]);
    }
  };

  // Filter Categories
  const filteredCategories = (horoscope?.categories || []).filter((cat) => {
    // 1. Search Query
    if (
      searchQuery.trim() &&
      !cat.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !cat.sanskritName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 2. Tab Filter
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'vitality') {
      return ['overall', 'health', 'mentalHealth', 'energy'].includes(cat.key);
    }
    if (categoryFilter === 'career') {
      return ['career', 'finance', 'business', 'investment', 'decisionMaking'].includes(cat.key);
    }
    if (categoryFilter === 'love') {
      return ['love', 'marriage', 'family', 'children', 'socialLife'].includes(cat.key);
    }
    if (categoryFilter === 'growth') {
      return ['education', 'spirituality', 'luck', 'creativity'].includes(cat.key);
    }
    if (categoryFilter === 'action') {
      return ['communication', 'travel', 'decisionMaking', 'energy'].includes(cat.key);
    }
    return true;
  });

  // If user has not calculated or has no profile, render the birth details registration gate
  if (!hasCalculated || !userProfile) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12 px-2 sm:px-4">
        {!user && (
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-600/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs w-full">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-amber-950 font-medium">
                Already have an Astronava Account with saved birth details? Sign in to view your personalized daily horoscope automatically.
              </span>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('Sign in to view your personalized daily horoscope')}
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold whitespace-nowrap cursor-pointer shrink-0 transition-all shadow-xs"
            >
              Sign In with My Chart
            </button>
          </div>
        )}

        <HoroscopeRegistrationModal
          isOpen={true}
          isInline={true}
          onSaveProfile={handleSaveProfile}
          onClose={userProfile ? () => setHasCalculated(true) : undefined}
          initialProfile={
            userProfile ||
            (user
              ? {
                  uid: user.uid,
                  name: user.displayName || '',
                  email: user.email || '',
                  phone: user.phoneNumber || '',
                  dob: user.birthDetails?.dob || '',
                  tob: user.birthDetails?.tob || '12:00',
                  isTobUnknown: Boolean(user.birthDetails?.isTobUnknown),
                  birthPlace: user.birthDetails?.birthPlace || '',
                  latitude: user.birthDetails?.latitude || 0,
                  longitude: user.birthDetails?.longitude || 0,
                  timezoneOffset: user.birthDetails?.timezoneOffset || 5.5,
                  gender: user.birthDetails?.gender || 'male',
                  notificationChannels: user.notificationChannels || ['email', 'push'],
                  preferredNotificationTime: user.notificationTime || '07:00',
                  consentGiven: true,
                  registeredAt: new Date().toISOString(),
                }
              : null)
          }
        />

        <HoroscopeAdminModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          currentPromptVersion={currentPromptVersion}
          onSelectPromptVersion={(v) => {
            setCurrentPromptVersion(v);
            setIsAdminModalOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto pb-8 sm:pb-12 w-full max-w-full min-w-0 box-border">
      
      {/* Session / Guest Notice Banner */}
      {!user && (
        <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-amber-500/10 border border-amber-600/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs w-full min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="text-amber-950 font-medium">
              Horoscope calculated for <strong>{userProfile.name}</strong> ({userProfile.birthPlace}). Sign in to Astronava to link these birth coordinates to your permanent account.
            </span>
          </div>
          <button
            onClick={() => openAuthModal('Sign in to save your birth coordinates permanently')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold whitespace-nowrap cursor-pointer shrink-0 transition-all shadow-xs text-center"
          >
            Save to My Account
          </button>
        </div>
      )}

      {/* 1. TOP PROFILE & NAVIGATION HEADER BAR */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-stone-200/90 shadow-sm relative overflow-hidden w-full min-w-0 box-border">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative">
          
          {/* User Astrological Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-900 text-amber-50 text-xs font-bold font-vedic tracking-wide flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>PERSONALIZED HOROSCOPE</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-400" />
                <span>{userProfile.birthPlace}</span>
              </span>
              {userProfile.isTobUnknown && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold">
                  Solar Noon Lagna
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-vedic tracking-tight">
                {userProfile.name}
              </h1>
              {horoscope && (
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 flex-wrap">
                  <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200/60">
                    Lagna: {horoscope.birthDetails.lagnaSign}
                  </span>
                  <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg border border-stone-200">
                    Rashi: {horoscope.birthDetails.moonSign}
                  </span>
                  <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg border border-stone-200">
                    Nakshatra: {horoscope.birthDetails.nakshatra} (P{horoscope.birthDetails.pada})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
            
            {/* Date Shift Buttons */}
            <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200">
              <button
                id="btn-date-prev"
                onClick={() => handleDateShift(-1)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-950 hover:bg-white transition-all cursor-pointer"
                title="Yesterday"
              >
                Yesterday
              </button>

              <button
                id="btn-date-today"
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isToday
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-white'
                }`}
              >
                Today
              </button>

              <button
                id="btn-date-next"
                onClick={() => handleDateShift(1)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-950 hover:bg-white transition-all cursor-pointer"
                title="Tomorrow"
              >
                Tomorrow
              </button>
            </div>

            {/* Custom Date Input */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-2xl border border-stone-200 bg-white text-stone-700 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-2xs"
            />

            {/* Edit Profile Button */}
            <button
              id="btn-edit-horoscope-profile"
              onClick={() => setHasCalculated(false)}
              className="px-3 py-2 rounded-2xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
              <span>Edit Details</span>
            </button>

            {/* Admin Console Trigger */}
            <button
              id="btn-open-admin-console"
              onClick={() => setIsAdminModalOpen(true)}
              className="p-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer border border-stone-200"
              title="Astrologer Admin & Prompts Console"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. LOADING OR ERROR STATES */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-4">
          <div className="w-12 h-12 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-stone-700">
            Calculating Lahiri Ephemeris & Transits for {userProfile.name}...
          </p>
          <p className="text-xs text-stone-400">
            Evaluating planetary degrees, 20 life categories, and Gochar aspects.
          </p>
        </div>
      )}

      {!loading && horoscope && (
        <>
          {/* 3. PRIMARY COSMIC ALIGNMENT GAUGE & EXECUTIVE SYNTHESIS */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Gauge Box (4 Cols) */}
            <div className="lg:col-span-4 bg-gradient-to-b from-stone-900 to-amber-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-800 flex flex-col justify-between relative overflow-hidden w-full min-w-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-widest font-vedic mb-4">
                  <span>Daily Cosmic Index</span>
                  <span className="font-mono text-stone-400">{horoscope.date}</span>
                </div>

                {/* Big Score Circular Display */}
                <div className="text-center my-4">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-amber-500/20 flex flex-col items-center justify-center bg-stone-950/40 backdrop-blur-xs">
                      <span className="text-4xl sm:text-5xl font-black text-amber-300 font-vedic leading-none">
                        {horoscope.overallScore}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-stone-400 font-bold uppercase tracking-wider mt-1">
                        Out of 100
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-bold tracking-wide">
                      {horoscope.overallScore >= 80
                        ? 'Peak Auspicious Alignment'
                        : horoscope.overallScore >= 65
                        ? 'Favorable & Productive'
                        : 'Delicate / Remedial Fortitude'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Astrological Confidence Score Bar */}
              <div className="mt-4 pt-4 border-t border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Astrological Confidence</span>
                  </span>
                  <button
                    onClick={() => setShowConfidenceModal(!showConfidenceModal)}
                    className="text-amber-300 font-bold hover:underline flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <span>{horoscope.confidenceScore.percentage}% ({horoscope.confidenceScore.level})</span>
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${horoscope.confidenceScore.percentage}%` }}
                  />
                </div>

                {showConfidenceModal && (
                  <div className="mt-3 p-3 bg-stone-950/90 rounded-2xl border border-stone-700 text-xs space-y-2 animate-fadeIn">
                    <div className="font-bold text-amber-300">Confidence Transparency:</div>
                    <ul className="space-y-1 text-stone-300 text-[11px]">
                      {horoscope.confidenceScore.supportingFactors.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                      {horoscope.confidenceScore.conflictingFactors.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-amber-200">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Flowing Synthesis (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-stone-200/90 shadow-sm flex flex-col justify-between w-full min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
                    <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider font-vedic">
                      Verified Jyotish Interpretation
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200">
                    {horoscope.aiPromptVersion}
                  </span>
                </div>

                <div className="text-stone-700 text-sm leading-relaxed space-y-3 font-sans">
                  {horoscope.summary.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Practical Morning Guidance */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Compass className="w-4 h-4 text-amber-700" />
                    <span>Actionable Daily Guidance:</span>
                  </div>
                  <p className="leading-relaxed text-stone-800">
                    {horoscope.dailyAdvice}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 flex-wrap gap-2">
                <span>Panchang: {horoscope.panchang.tithi.name} • {horoscope.panchang.yoga.name} Yoga</span>
                <span className="font-semibold text-amber-900">Dasha: {horoscope.activeDasha.mahadasha.lord} / {horoscope.activeDasha.antardasha.lord}</span>
              </div>
            </div>
          </section>

          {/* 4. DAILY HIGHLIGHTS BENTO GRID */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Strongest Planet Today */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-vedic">
                    Dominant Graha
                  </span>
                  <span className="text-2xl">{horoscope.strongestPlanet.symbol}</span>
                </div>

                <h4 className="text-lg font-bold text-amber-950">
                  {horoscope.strongestPlanet.name} ({horoscope.strongestPlanet.sanskrit})
                </h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {horoscope.strongestPlanet.reason}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-amber-800">
                Peak Gochar Radiance
              </div>
            </div>

            {/* Card 2: Prime Opportunity */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-vedic">
                    Top Opportunity
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    ✦
                  </div>
                </div>

                <h4 className="text-lg font-bold text-stone-900">
                  {horoscope.biggestOpportunity.domain}
                </h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {horoscope.biggestOpportunity.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-emerald-700">
                Supported by {horoscope.biggestOpportunity.supportingPlanet}
              </div>
            </div>

            {/* Card 3: Primary Caution & Remedy */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm hover:border-rose-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider font-vedic">
                    Gentle Caution
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
                    !
                  </div>
                </div>

                <h4 className="text-lg font-bold text-stone-900">
                  {horoscope.biggestChallenge.domain}
                </h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {horoscope.biggestChallenge.remedy}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-rose-700">
                {horoscope.biggestChallenge.mitigatingFactor}
              </div>
            </div>

            {/* Card 4: Auspicious Lucky Attributes */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-vedic">
                    Auspicious Matrix
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Lucky Number:</span>
                    <span className="font-bold text-stone-900 font-mono text-sm px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-md">
                      {horoscope.luckyNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Lucky Direction:</span>
                    <span className="font-bold text-stone-900">{horoscope.luckyDirection.dir}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Lucky Color:</span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full border border-stone-300"
                        style={{ backgroundColor: horoscope.luckyColor.hex }}
                      />
                      <span className="font-bold text-stone-900">{horoscope.luckyColor.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-600 font-medium">
                Best Window: <strong className="text-amber-900">{horoscope.luckyTime.window}</strong>
              </div>
            </div>
          </section>

          {/* 5. SACRED DAILY MANTRA CARD WITH INTERACTIVE CHANT COUNTER */}
          <section className="bg-gradient-to-r from-amber-900 via-amber-950 to-stone-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-lg border border-stone-800 w-full min-w-0">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
              
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-vedic">
                    Sacred Daily Resonance
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full">
                    {horoscope.mantra.deityOrPlanet}
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-bold font-vedic text-amber-200">
                  {horoscope.mantra.sanskritText}
                </div>
                <div className="text-sm font-semibold text-amber-100/90 italic">
                  "{horoscope.mantra.phonetic}"
                </div>
                <p className="text-xs text-stone-300 leading-relaxed pt-1">
                  {horoscope.mantra.meaning}
                </p>
              </div>

              {/* Interactive Chanting Tool */}
              <div className="bg-stone-900/80 border border-amber-500/20 rounded-2xl p-4 text-center min-w-[200px] shrink-0">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
                  Chant Counter (Target 108)
                </span>
                <div className="text-3xl font-black text-amber-400 font-mono my-1">
                  {chantCount} <span className="text-xs text-stone-500">/ 108</span>
                </div>

                <div className="flex items-center justify-center gap-2 mt-2">
                  <button
                    onClick={() => setChantCount(Math.min(108, chantCount + 1))}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    + Chant (Japa)
                  </button>
                  <button
                    onClick={() => setChantCount(0)}
                    className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 transition-colors cursor-pointer"
                    title="Reset"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 6. TWENTY ASTROLOGICAL CATEGORIES SHOWCASE */}
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-stone-200/90 shadow-sm space-y-4 sm:space-y-6 w-full min-w-0">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest font-vedic">
                    Comprehensive Life Dimensions
                  </span>
                  <span className="text-xs text-stone-400">({filteredCategories.length} Categories)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-vedic text-amber-950">
                  20 Vedic Life Domains & Real Astrological Drivers
                </h3>
              </div>

              {/* Search Box */}
              <div className="w-full lg:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by category name..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {/* Category Sub-Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {[
                { id: 'all', label: 'All 20 Categories' },
                { id: 'vitality', label: 'Vitality & Mind (4)' },
                { id: 'career', label: 'Career & Wealth (5)' },
                { id: 'love', label: 'Love & Family (5)' },
                { id: 'growth', label: 'Wisdom & Luck (4)' },
                { id: 'action', label: 'Drive & Decisions (4)' },
              ].map((tab) => {
                const isActive = categoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id as any)}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCategories.map((cat: CategoryScoreDetail) => {
                const isExpanded = expandedCategoryKey === cat.key;
                const scoreColor =
                  cat.score >= 80
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : cat.score >= 65
                    ? 'text-amber-800 bg-amber-50 border-amber-200'
                    : 'text-rose-700 bg-rose-50 border-rose-200';

                const barColor =
                  cat.score >= 80
                    ? 'bg-emerald-600'
                    : cat.score >= 65
                    ? 'bg-amber-600'
                    : 'bg-rose-500';

                return (
                  <div
                    key={cat.key}
                    className="rounded-2xl border border-stone-200/90 p-5 hover:border-amber-400 transition-all flex flex-col justify-between bg-[#FCFBF9]"
                  >
                    <div className="space-y-3">
                      
                      {/* Top Row: Title & Score */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 font-vedic block">
                            {cat.sanskritName} • H{cat.primaryHouse} ({cat.rulingLord})
                          </span>
                          <h4 className="text-base font-bold text-stone-900 font-sans">
                            {cat.label}
                          </h4>
                        </div>

                        <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold font-mono ${scoreColor}`}>
                          {cat.score}/100
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${barColor} transition-all duration-500`}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>

                      {/* Astrological Driver */}
                      <div className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-100">
                        <strong className="text-amber-950 font-semibold block mb-1">
                          Astrological Driver:
                        </strong>
                        {cat.astrologicalDriver}
                      </div>

                      {/* Actionable Advice */}
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {cat.actionableAdvice}
                      </p>

                      {/* Expandable Do's & Don'ts */}
                      {isExpanded && (
                        <div className="pt-2 border-t border-stone-200/80 space-y-2 animate-fadeIn text-[11px]">
                          <div>
                            <span className="font-bold text-emerald-800">✓ Do's:</span>
                            <ul className="list-disc list-inside text-stone-600 space-y-0.5 mt-0.5">
                              {cat.doList.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="font-bold text-rose-800">✗ Don'ts:</span>
                            <ul className="list-disc list-inside text-stone-600 space-y-0.5 mt-0.5">
                              {cat.dontList.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Toggle */}
                    <div className="pt-3 mt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                      <span>Status: <strong className="text-stone-800">{cat.status}</strong></span>
                      <button
                        onClick={() => setExpandedCategoryKey(isExpanded ? null : cat.key)}
                        className="text-amber-800 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Less' : 'Do’s & Don’ts'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 7. LIVE PLANETARY TRANSITS BOARD (GOCHAR CHAKRA) */}
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-stone-200/90 shadow-sm space-y-4 w-full min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest font-vedic">
                  Astronomical Ephemeris Data
                </span>
                <h3 className="text-xl font-bold font-vedic text-amber-950">
                  Current Gochar Positions & Dignities
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded-xl">
                Ayanamsha: 24.12° Lahiri Chitrapaksha
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Graha (Planet)</th>
                    <th className="p-3">Transit Sign</th>
                    <th className="p-3">Degrees</th>
                    <th className="p-3">House (Lagna)</th>
                    <th className="p-3">House (Moon)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Dignity</th>
                    <th className="p-3">SAV Bindus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {horoscope.transitPlanets.map((p) => (
                    <tr key={p.planetId} className="hover:bg-amber-50/40">
                      <td className="p-3 font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{p.name}</span>
                        <span className="text-stone-400 font-normal">({p.sanskritName})</span>
                      </td>
                      <td className="p-3 font-medium">{p.transitSignName}</td>
                      <td className="p-3 font-mono">{p.formattedDegree}</td>
                      <td className="p-3 font-semibold text-amber-900">House {p.houseFromLagna}</td>
                      <td className="p-3 text-stone-600">House {p.houseFromMoon}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {p.isRetrograde && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                              Retro (Vakri)
                            </span>
                          )}
                          {p.isCombust && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 font-bold text-[10px]">
                              Combust (Asta)
                            </span>
                          )}
                          {!p.isRetrograde && !p.isCombust && (
                            <span className="text-stone-400">Direct</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-semibold ${
                            p.dignity.includes('Exalted') || p.dignity.includes('Swakshetra')
                              ? 'text-emerald-700'
                              : p.dignity.includes('Debilitated')
                              ? 'text-rose-700'
                              : 'text-stone-700'
                          }`}
                        >
                          {p.dignity}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-stone-800">
                        {p.savBindus} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 8. DAILY PANCHANG & 8 CHOGHADIYA MUHURAT SLOTS */}
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-stone-200/90 shadow-sm space-y-4 sm:space-y-6 w-full min-w-0">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest font-vedic">
                  Panchang & Muhurat
                </span>
                <h3 className="text-xl font-bold font-vedic text-amber-950">
                  {horoscope.panchang.dayOfWeek} Vedic Panchang & Choghadiya Windows
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100/70 px-3 py-1 rounded-xl">
                Day Ruler: {horoscope.panchang.varaLord} ({horoscope.panchang.varaLordSanskrit})
              </span>
            </div>

            {/* Panchang Core Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Tithi</span>
                <span className="text-xs font-bold text-amber-950">{horoscope.panchang.tithi.name}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Nakshatra</span>
                <span className="text-xs font-bold text-amber-950">
                  {horoscope.panchang.nakshatra.name} (P{horoscope.panchang.nakshatra.pada})
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Yoga</span>
                <span className="text-xs font-bold text-amber-950">
                  {horoscope.panchang.yoga.name} ({horoscope.panchang.yoga.nature})
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Karana</span>
                <span className="text-xs font-bold text-amber-950">{horoscope.panchang.karana.name}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Current Hora</span>
                <span className="text-xs font-bold text-amber-950">{horoscope.panchang.currentHora.planet}</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Best Muhurat</span>
                <span className="text-xs font-bold text-amber-950">{horoscope.luckyTime.window}</span>
              </div>
            </div>

            {/* Choghadiya Slots Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Day Choghadiya Timings (Sunrise to Sunset)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {horoscope.panchang.choghadiyaWindows.map((slot, idx) => {
                  const isAuspicious = slot.nature === 'Auspicious';
                  const isModerate = slot.nature === 'Moderate';

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isAuspicious
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                          : isModerate
                          ? 'bg-stone-50 border-stone-200 text-stone-800'
                          : 'bg-rose-50/60 border-rose-200 text-rose-950'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-stone-500 block mb-1">
                        {slot.timeWindow}
                      </span>
                      <span className="text-xs font-bold block">{slot.name}</span>
                      <span
                        className={`text-[10px] font-semibold mt-1 inline-block px-1.5 py-0.2 rounded ${
                          isAuspicious
                            ? 'bg-emerald-200/60 text-emerald-900'
                            : isModerate
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-rose-200/60 text-rose-900'
                        }`}
                      >
                        {slot.nature}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 9. USER ACCURACY RATING & FEEDBACK */}
          <section className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-vedic">
                  Continuous Accuracy Feedback
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-vedic text-white">
                  How Accurate Was Today's Prediction For You?
                </h3>
                <p className="text-xs text-stone-400">
                  Your feedback helps continuously calibrate the explanation layer while respecting zero-trust privacy.
                </p>
              </div>

              {!feedbackSubmitted ? (
                <div className="space-y-4 pt-2">
                  {/* Star Selector */}
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className={`p-2 transition-transform hover:scale-110 cursor-pointer ${
                          feedbackRating >= star ? 'text-amber-400 fill-amber-400' : 'text-stone-600'
                        }`}
                      >
                        <Star className={`w-8 h-8 ${feedbackRating >= star ? 'fill-amber-400' : ''}`} />
                      </button>
                    ))}
                  </div>

                  {/* Feedback Tags */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {[
                      'Spot on Career',
                      'Accurate Timing Window',
                      'Remedy Helped Peace',
                      'Financial Insight True',
                      'Relationship Guidance Helpful',
                      'Needs More Nuance',
                    ].map((tag) => {
                      const isSel = selectedFeedbackTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleFeedbackTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                            isSel
                              ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                              : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional Review Text */}
                  <textarea
                    rows={2}
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="Share any specific observations from today (optional)..."
                    className="w-full max-w-lg mx-auto p-3 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder:text-stone-500 outline-none focus:border-amber-500"
                  />

                  <div>
                    <button
                      type="button"
                      onClick={handleSubmitFeedback}
                      disabled={feedbackRating === 0}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-40 cursor-pointer"
                    >
                      Submit Accuracy Feedback
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-stone-800/80 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Thank you! Your feedback for {selectedDate} has been recorded securely.</span>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* 10. MODALS */}
      <HoroscopeRegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={userProfile}
      />


      <HoroscopeAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentPromptVersion={currentPromptVersion}
        onSelectPromptVersion={(v) => {
          setCurrentPromptVersion(v);
          setIsAdminModalOpen(false);
        }}
      />
    </div>
  );
};
