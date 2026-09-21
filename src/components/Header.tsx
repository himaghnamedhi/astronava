import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Gem,
  Heart,
  Hash,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  ShoppingBag,
  ShieldCheck,
  Sun,
  Search,
  ArrowRight,
  X
} from 'lucide-react';
import { ChartStyle } from '../types/astrology';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext.tsx';
import { AppTabType } from '../utils/sitemap';

interface HeaderProps {
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  chartStyle: ChartStyle;
  setChartStyle: (style: ChartStyle) => void;
  onOpenSearch: () => void;
}

interface ServiceItem {
  id: string;
  name: string;
  category: 'core' | 'remedies';
  tagline: string;
  icon: React.FC<{ className?: string }>;
  tab: AppTabType;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { user, openAuthModal, signOut } = useAuth();
  const { navigateToAdmin, cartCount } = useStore();

  const ADMIN_EMAILS = ['himaghnamedhi1@gmail.com'];
  const isAdminUser = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim()));

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const servicesList: ServiceItem[] = [
    {
      id: 'kundli-maker',
      name: 'Kundli Maker',
      category: 'core',
      tagline: 'Janam Kundli, D1, D9 Navamsha & Bhavat Bhavam',
      icon: Sparkles,
      tab: 'generator',
    },
    {
      id: 'daily-horoscope',
      name: 'Daily Horoscope',
      category: 'core',
      tagline: 'Personalized transit predictions using natal lagna',
      icon: Sun,
      tab: 'horoscope',
    },
    {
      id: 'match-finder',
      name: 'Match Finder (Kundli Milan)',
      category: 'core',
      tagline: '36 Guna Ashtakoota Milan, Manglik dosha & synastry compatibility',
      icon: Heart,
      tab: 'match',
    },
    {
      id: 'gemstones',
      name: 'Gemstones',
      category: 'remedies',
      tagline: 'Vedic Ratna recommendations calibrated to Ratti dosage',
      icon: Gem,
      tab: 'gemstones',
    },
    {
      id: 'numerology',
      name: 'Numerology',
      category: 'remedies',
      tagline: 'Mulank, Bhagyank, and Namank destiny vibration numbers',
      icon: Hash,
      tab: 'numerology',
    },
  ];

  const filteredServices = servicesList.filter((s) => {
    if (!serviceSearch.trim()) return true;
    const q = serviceSearch.toLowerCase().trim();
    return s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q);
  });

  const isServicesActive = ['generator', 'horoscope', 'match', 'gemstones', 'numerology', 'builder'].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0" 
            onClick={() => setActiveTab('home')}
          >
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

          {/* Desktop Navigation: Home | Services ▼ | Store | Profile */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-200/50 p-1 rounded-xl border border-stone-300/60 text-xs lg:text-sm font-medium shrink-0">
            {/* 1. Home */}
            <button
              id="nav-tab-home"
              onClick={() => setActiveTab('home')}
              className={`px-3 lg:px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-amber-900 text-amber-50 shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Home className="w-3.5 h-3.5 shrink-0" />
              <span>Home</span>
            </button>

            {/* 2. Services Dropdown ▼ */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-tab-services"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`px-3 lg:px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isServicesActive
                    ? 'bg-amber-900 text-amber-50 shadow-xs font-semibold'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    servicesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Animated, Modern, Searchable Services Dropdown */}
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-stone-200 shadow-2xl p-3 z-50 animate-fadeIn space-y-3">
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      placeholder="Search astrology services..."
                      className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:bg-white transition-all"
                      autoFocus
                    />
                    {serviceSearch && (
                      <button
                        onClick={() => setServiceSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Services List Grouped */}
                  <div className="max-h-80 overflow-y-auto space-y-1 divide-y divide-stone-100 pr-1">
                    {filteredServices.length === 0 ? (
                      <div className="p-4 text-center text-xs text-stone-400">
                        No service found matching "{serviceSearch}"
                      </div>
                    ) : (
                      filteredServices.map((service) => {
                        const Icon = service.icon;
                        const isCurrent = activeTab === service.tab;
                        return (
                          <div
                            key={service.id}
                            onClick={() => {
                              setActiveTab(service.tab);
                              setServicesDropdownOpen(false);
                              setServiceSearch('');
                            }}
                            className={`pt-2 pb-2 px-2 rounded-xl transition-all flex items-start justify-between gap-2.5 cursor-pointer hover:bg-amber-50/70 group ${
                              isCurrent ? 'bg-amber-50 border border-amber-200/60' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-amber-100/70 text-amber-900 group-hover:bg-amber-900 group-hover:text-white transition-colors">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-stone-900 truncate">
                                    {service.name}
                                  </span>
                                </div>
                                <p className="text-[11px] text-stone-500 leading-tight mt-0.5 line-clamp-1">
                                  {service.tagline}
                                </p>
                              </div>
                            </div>

                            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Store (Always visible, NEVER placed inside services) */}
            <button
              id="nav-tab-store"
              onClick={() => setActiveTab('store')}
              className={`px-3 lg:px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'store'
                  ? 'bg-amber-900 text-amber-50 shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Store</span>
            </button>

            {/* 4. Profile (Astronava Member Dashboard) */}
            <button
              id="nav-tab-profile"
              onClick={() => {
                if (user) {
                  setActiveTab('profile');
                } else {
                  openAuthModal('Sign in to access your Astronava Member Profile & Birth Details');
                }
              }}
              className={`px-3 lg:px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-amber-900 text-amber-50 shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Profile</span>
            </button>
          </nav>

          {/* Quick Actions (User Dropdown or Sign In) */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="relative" ref={userDropdownRef}>
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
                    </div>

                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-stone-800 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-amber-800" />
                      <span>My Profile &amp; Birth Details</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('horoscope')}
                      className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>Personalized Horoscope</span>
                    </button>

                    {isAdminUser && (
                      <button
                        onClick={() => {
                          setActiveTab('store');
                          navigateToAdmin();
                        }}
                        className="w-full px-2.5 py-2 text-left text-xs font-bold text-amber-950 bg-amber-500/15 hover:bg-amber-500/25 rounded-xl transition-colors flex items-center gap-2 cursor-pointer border border-amber-500/30"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">Admin Console</span>
                          <span className="text-[10px] font-medium text-amber-800">Categories &amp; Orders</span>
                        </div>
                      </button>
                    )}

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
                onClick={() => openAuthModal('Sign in as an Astronava Member to access personalized astrology services.')}
                className="h-9 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
              >
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden xs:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row (TASK 9) */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-stone-200/80 no-scrollbar -mx-4 px-4">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'generator', label: 'Kundli', icon: Sparkles },
            { id: 'horoscope', label: 'Horoscope', icon: Sun },
            { id: 'match', label: 'Match', icon: Heart },
            { id: 'gemstones', label: 'Gemstones', icon: Gem },
            { id: 'numerology', label: 'Numerology', icon: Hash },
            { id: 'store', label: 'Store', icon: ShoppingBag },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile' && !user) {
                    openAuthModal('Sign in to access your Profile');
                  } else {
                    setActiveTab(item.id as any);
                  }
                }}
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
