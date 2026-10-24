import React, { useState, useEffect } from 'react';
import { Shield, Cookie, X, ExternalLink, Check, Settings2 } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [adCookiesAllowed, setAdCookiesAllowed] = useState(true);

  useEffect(() => {
    // Check if consent has already been recorded
    const savedConsent = localStorage.getItem('astronava_cookie_consent');
    if (!savedConsent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for custom trigger to reopen cookie settings from footer
  useEffect(() => {
    const handleReopen = () => {
      setIsCustomizeOpen(true);
      setIsVisible(true);
    };
    window.addEventListener('astronava_open_cookie_settings', handleReopen);
    return () => window.removeEventListener('astronava_open_cookie_settings', handleReopen);
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('astronava_cookie_consent', 'accepted');
      localStorage.setItem('astronava_ad_cookies', 'true');
    } catch {}
    setIsVisible(false);
  };

  const handleDeclineNonEssential = () => {
    try {
      localStorage.setItem('astronava_cookie_consent', 'essential_only');
      localStorage.setItem('astronava_ad_cookies', 'false');
    } catch {}
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem('astronava_cookie_consent', adCookiesAllowed ? 'accepted' : 'essential_only');
      localStorage.setItem('astronava_ad_cookies', adCookiesAllowed ? 'true' : 'false');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-2xl p-4 sm:p-5 text-stone-800 space-y-3.5 ring-1 ring-black/5">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-200">
              <Cookie className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-vedic text-stone-900">
                Cookie &amp; Privacy Notice
              </h3>
              <p className="text-[10px] text-stone-500">
                Tracking, Advertising &amp; Privacy Preferences
              </p>
            </div>
          </div>

          <button
            onClick={handleDeclineNonEssential}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            title="Dismiss with essential cookies only"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Body */}
        {!isCustomizeOpen ? (
          <p className="text-xs text-stone-600 leading-relaxed">
            Astronava uses essential cookies to power precision Vedic calculations, analyze site performance, and support our free services through tracking and advertising partners. You may customize your choices or read our full disclosure in our{' '}
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-2 cursor-pointer inline-flex items-center gap-0.5"
            >
              <span>Privacy Policy</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>.
          </p>
        ) : (
          <div className="space-y-2.5 pt-1 text-xs text-stone-700 border-t border-stone-100">
            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100">
              <div>
                <span className="font-bold text-stone-900 block text-xs">Essential &amp; Calculation Cookies</span>
                <span className="text-[11px] text-stone-500">Required for chart generation, storage, and sessions.</span>
              </div>
              <span className="text-[11px] font-bold text-stone-500 px-2 py-0.5 rounded bg-stone-200">Always Active</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100">
              <div>
                <span className="font-bold text-stone-900 block text-xs">Tracking and Advertising</span>
                <span className="text-[11px] text-stone-500">Allows analytics, campaign tracking, and advertising partners to deliver tailored experiences.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adCookiesAllowed}
                  onChange={(e) => setAdCookiesAllowed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-800"></div>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
          {!isCustomizeOpen ? (
            <>
              <button
                onClick={() => setIsCustomizeOpen(true)}
                className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Settings2 className="w-3 h-3 text-stone-500" />
                <span>Customize</span>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleDeclineNonEssential}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                &larr; Back
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer ml-auto"
              >
                Save Preferences
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
