import React, { useState } from 'react';
import { Gem, Heart, Hash, User, LogOut, Sparkles, ChevronDown } from 'lucide-react';
import { ChartStyle } from '../types/astrology';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: 'generator' | 'builder' | 'gemstones' | 'match' | 'numerology' | 'legal';
  setActiveTab: (tab: 'generator' | 'builder' | 'gemstones' | 'match' | 'numerology' | 'legal') => void;
  chartStyle: ChartStyle;
  setChartStyle: (style: ChartStyle) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, openAuthModal, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('generator')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl shadow-md ring-2 ring-amber-500/40 overflow-hidden shrink-0 bg-[#2a0e05]">
              <img
                src="/icons/app_logo.svg"
                alt="Astronava Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-wider text-amber-950 font-vedic leading-tight">
                  ASTR<span className="relative inline-flex items-center justify-center">O<span className="absolute inset-0 flex items-center justify-center text-[9px] sm:text-[11px] text-amber-500 select-none pointer-events-none">✦</span></span>NAVA
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-stone-200/50 p-1 rounded-xl border border-stone-300/60 text-xs lg:text-sm font-medium shrink-0">
            <button
              id="nav-tab-generator"
              onClick={() => setActiveTab('generator')}
              className={`px-2.5 lg:px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'generator'
                  ? 'bg-amber-900 text-amber-50 shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <img
                src="/icons/app_logo.svg"
                alt="Kundli Maker"
                className="w-3.5 h-3.5 rounded-xs shrink-0 object-cover"
                referrerPolicy="no-referrer"
              />
              <span>Kundli Maker</span>
            </button>

            <button
              id="nav-tab-gemstones"
              onClick={() => setActiveTab('gemstones')}
              className={`px-2.5 lg:px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'gemstones'
                  ? 'bg-amber-900 text-amber-50 shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Gem className="w-3.5 h-3.5 shrink-0" />
              <span>Gemstones</span>
            </button>

            <button
              id="nav-tab-match"
              onClick={() => setActiveTab('match')}
              className={`px-2.5 lg:px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'match'
                  ? 'bg-amber-900 text-amber-50 shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30 shrink-0" />
              <span>Match Finder</span>
            </button>

            <button
              id="nav-tab-numerology"
              onClick={() => setActiveTab('numerology')}
              className={`px-2.5 lg:px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'numerology'
                  ? 'bg-amber-900 text-amber-50 shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Hash className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Numerology</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* User Account / Membership Control */}
            {user ? (
              <div className="relative">
                <button
                  id="btn-user-profile"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="h-9 px-2.5 sm:px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-100 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-600/30 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[70px] sm:max-w-[100px] truncate hidden xs:inline">
                    {user.displayName || 'Member'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-stone-200 shadow-xl p-3 z-50 animate-fadeIn space-y-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-2 py-1.5 border-b border-stone-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Astronava Member</span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {user.email || 'Member Account'}
                      </p>
                      {user.phoneNumber && (
                        <p className="text-[10px] text-stone-400 truncate">
                          {user.phoneNumber}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('generator');
                      }}
                      className="w-full px-2 py-1.5 text-left text-xs font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>AI Kundli Summary</span>
                    </button>

                    <button
                      onClick={() => signOut()}
                      className="w-full px-2 py-1.5 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2 cursor-pointer border-t border-stone-100 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-open-login"
                onClick={() => openAuthModal('Sign up to unlock AI Astrological Summary with planetary house and lord interpretations.')}
                className="h-9 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
              >
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-stone-200/80 no-scrollbar -mx-4 px-4">
          {[
            { id: 'generator', label: 'Kundli Maker', icon: Sparkles },
            { id: 'gemstones', label: 'Gemstones', icon: Gem },
            { id: 'match', label: 'Match Finder', icon: Heart },
            { id: 'numerology', label: 'Numerology', icon: Hash },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-2xs ${
                  isActive
                    ? 'bg-amber-900 text-amber-50 font-bold shadow-xs'
                    : 'bg-stone-100/90 text-stone-700 hover:bg-stone-200 border border-stone-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
