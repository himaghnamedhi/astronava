import React, { useState, useEffect } from 'react';
import { Sparkles, Coins, X, ArrowRight, Gift } from 'lucide-react';

interface FestivePopupProps {
  onNavigateStore: () => void;
  /** Optional override to force show for testing/demo purposes */
  forceShow?: boolean;
}

export const FestivePopup: React.FC<FestivePopupProps> = ({ onNavigateStore, forceShow = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    // Check if today matches October 29th (10/29), November 5th (11/05), or November 6th (11/06)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 10 = October, 11 = November
    const day = now.getDate();

    const isOctober29 = month === 10 && day === 29;
    const isNovember5 = month === 11 && day === 5;
    const isNovember6 = month === 11 && day === 6;

    const isTargetDate = isOctober29 || isNovember5 || isNovember6 || forceShow;

    // Check session storage so it displays once per session
    const dismissedKey = `festive_dhanteras_dismissed_${year}_${month}_${day}`;
    const dismissed = sessionStorage.getItem(dismissedKey);

    if (isTargetDate && !dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const handleClose = () => {
    setIsOpen(false);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    sessionStorage.setItem(`festive_dhanteras_dismissed_${year}_${month}_${day}`, 'true');
  };

  const handleStoreClick = () => {
    handleClose();
    onNavigateStore();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-yellow-950 border-2 border-amber-400/70 shadow-2xl text-amber-100 p-6 sm:p-8">
        
        {/* Ambient Gold Glow Effects */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-amber-300/80 hover:text-amber-100 bg-amber-900/40 hover:bg-amber-900/80 p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Close Dhanteras Greeting"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          
          {/* Animated Gold Icon Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-stone-950 shadow-lg shadow-amber-500/30 mx-auto ring-4 ring-amber-400/30 animate-pulse">
            <Coins className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest font-vedic">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shubh Dhanteras</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-vedic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
              Happy Dhanteras!
            </h3>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed font-sans px-2">
            May Lord Kuber and Goddess Lakshmi fill your home with infinite wealth, prosperity, good health, and auspicious divine grace on this sacred occasion.
          </p>

          <div className="bg-amber-950/70 border border-amber-500/40 rounded-2xl p-4 text-xs text-amber-200/90 flex items-center gap-3.5 text-left shadow-inner">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold block text-amber-100 text-sm">Auspicious Purchases</span>
              <span className="text-stone-300">Explore certified natural gemstones, energized Nepali Rudraksha & sacred yantras for prosperity.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStoreClick}
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold font-vedic text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Visit Sacred Store</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={handleClose}
              className="py-2.5 px-4 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white font-medium text-xs transition-colors cursor-pointer border border-stone-700"
            >
              Continue to Site
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
