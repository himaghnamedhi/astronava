import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HouseNumber, PlanetId, ChartStyle } from './types/astrology';
import { Header } from './components/Header';

const KundliBuilder = lazy(() => import('./components/KundliBuilder').then(m => ({ default: m.KundliBuilder })));
const KundliGenerator = lazy(() => import('./components/KundliGenerator').then(m => ({ default: m.KundliGenerator })));
const GemstoneRecommender = lazy(() => import('./components/GemstoneRecommender').then(m => ({ default: m.GemstoneRecommender })));
const MatchFinder = lazy(() => import('./components/MatchFinder').then(m => ({ default: m.MatchFinder })));
const NumerologyCalculator = lazy(() => import('./components/NumerologyCalculator').then(m => ({ default: m.NumerologyCalculator })));
import { SearchModal } from './components/SearchModal';
import { CustomReportModal } from './components/CustomReportModal';
const FullAstrologyReportModal = lazy(() => import('./components/reports/FullAstrologyReportModal').then(m => ({ default: m.FullAstrologyReportModal })));
import { LegalModal } from './components/LegalModal';
import { LegalPage } from './components/LegalPage';
import { SitemapModal } from './components/SitemapModal';
import { SitemapPage } from './components/SitemapPage';
import { LegalDocType } from './data/legalPolicies';
import { CompleteKundliData, generateCompleteKundli } from './data/vedicEphemeris';
import { Sparkles, ArrowUp, Shield, FileText, AlertCircle, Mail, ExternalLink, Compass, RotateCcw } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { StoreProvider } from './context/StoreContext';
const StoreModule = lazy(() => import('./components/store/StoreModule').then(m => ({ default: m.StoreModule })));
import { HomePage } from './components/HomePage';
const HoroscopeDashboard = lazy(() => import('./components/horoscope/HoroscopeDashboard').then(m => ({ default: m.HoroscopeDashboard })));
const UserDashboard = lazy(() => import('./components/user/UserDashboard').then(m => ({ default: m.UserDashboard })));
import { NotificationToast } from './components/common/NotificationToast';
import { SellerPortalRoot } from './components/store/seller/SellerPortalRoot';
import { RequestDeletePage } from './components/user/RequestDeletePage';
import { injectDynamicMetaTags, findRouteByTab, AppTabType } from './utils/sitemap';

/**
 * Tab-specific descriptive suffixes engineered for high organic Click-Through Rates (CTR).
 * Each tab features a clear, keyword-targeted brand identifier.
 * (e.g. 'Kundli Maker | astronava.com' vs 'Gemstone Recommender | astronava.com')
 */
export const TAB_SEO_SUFFIXES: Record<AppTabType, string | ((doc?: LegalDocType) => string)> = {
  home: 'Astronava | Authentic Vedic Astrology, Kundli, Gemstones & Store',
  horoscope: 'Daily Horoscope | astronava.com',
  generator: 'Kundli Maker | astronava.com',
  builder: 'Kundli Builder | astronava.com',
  gemstones: 'Gemstone Recommender | astronava.com',
  match: 'Kundli Milan | astronava.com',
  numerology: 'Numerology Calculator | astronava.com',
  'name-correction': 'Vedic Name Correction & Spelling Tuning | astronava.com',
  store: 'Store | astronava.com',
  profile: 'My Profile & Account Dashboard | astronava.com',
  account: 'My Account & Preferences | astronava.com',
  sitemap: 'Sitemap Directory | astronava.com',
  legal: (doc?: LegalDocType) => {
    switch (doc) {
      case 'terms':
        return 'Terms & Conditions | astronava.com';
      case 'disclaimer':
        return 'Legal Disclaimer | astronava.com';
      case 'return-refund':
        return 'Return, Refund & Shipping Policy | astronava.com';
      case 'contact':
        return 'Contact Us | astronava.com';
      case 'privacy':
      default:
        return 'Privacy Policy | astronava.com';
    }
  },
};

/**
 * Tab-specific primary search intent lead hooks that combine with descriptive suffixes
 * to craft compelling, high-converting SERP titles.
 */
export const TAB_SEO_LEADS: Record<AppTabType, string | ((doc?: LegalDocType) => string)> = {
  home: 'Astronava — Vedic Astrology & Sacred Offerings Hub',
  horoscope: 'Personalized Daily Horoscope & Vedic Transits',
  generator: 'Free Janam Kundli & Vedic Birth Chart',
  builder: 'Interactive House & Planetary Visualizer',
  gemstones: 'Vedic Ratna Calculator & Remedies',
  match: '36 Guna Horoscope Matching & Compatibility',
  numerology: 'Mulank, Bhagyank & Destiny Number Analysis',
  'name-correction': 'Vedic Name Correction & Chaldean Spelling Harmonizer',
  store: 'Certified Gemstones, Nepali Rudraksha & Crystals',
  profile: 'Astronava Member Dashboard & Astrological Records',
  account: 'Astronava User Account & Dashboard Settings',
  sitemap: 'Directory of All Astronava Astrology Tools & Services',
  legal: (doc?: LegalDocType) => {
    switch (doc) {
      case 'terms':
        return 'Astrology Service Terms of Use';
      case 'disclaimer':
        return 'Educational Astrological Notice';
      case 'return-refund':
        return 'Store Return, Refund & Shipping Policy';
      case 'contact':
        return 'Customer Support & Inquiries';
      case 'privacy':
      default:
        return 'Data Protection & Privacy Notice';
    }
  },
};

/**
 * Resolves the descriptive tab suffix string.
 */
export function getDescriptiveTabSuffix(tab: AppTabType, legalDoc?: LegalDocType): string {
  const entry = TAB_SEO_SUFFIXES[tab];
  return typeof entry === 'function' ? entry(legalDoc) : entry;
}

/**
 * Resolves the primary CTR lead hook string.
 */
export function getDescriptiveTabLead(tab: AppTabType, legalDoc?: LegalDocType): string {
  const entry = TAB_SEO_LEADS[tab];
  return typeof entry === 'function' ? entry(legalDoc) : entry;
}

/**
 * Refactored dynamic meta tag injection logic:
 * Automatically formats and injects document title, description, Open Graph, and Twitter metadata,
 * appending specific, descriptive suffixes based on the active tab
 * (e.g. 'Kundli Maker | astronava.com' vs 'Gemstone Recommender | astronava.com')
 * to maximize click-through rates (CTR) on organic search and social platforms.
 */
export function updateTabMetaTags(
  tab: AppTabType,
  legalDoc?: LegalDocType,
  options?: {
    customPrefix?: string;
    isReportOpen?: boolean;
    reportType?: 'kundli' | 'match' | 'gemstone';
    personName?: string;
    isSitemapOpen?: boolean;
  }
) {
  const suffix = getDescriptiveTabSuffix(tab, legalDoc);
  const baseLead = options?.customPrefix || getDescriptiveTabLead(tab, legalDoc);

  let fullTitle = `${baseLead} | ${suffix}`;

  // If specialized overlays or reports are actively open, reflect that in the document title
  if (options?.isReportOpen) {
    if (options.reportType === 'kundli') {
      const person = options.personName ? `${options.personName}'s ` : '';
      fullTitle = `${person}Comprehensive Janam Kundli Report & Horoscopic Analysis | ${suffix}`;
    } else if (options.reportType === 'match') {
      fullTitle = `36 Guna Horoscope Milan & Compatibility Analysis Report | ${suffix}`;
    } else if (options.reportType === 'gemstone') {
      fullTitle = `Personalized Ratna & Gemstone Remedies Dosage Report | ${suffix}`;
    }
  } else if (options?.isSitemapOpen) {
    fullTitle = `Astrological Directory & Tools Index | ${suffix}`;
  }

  // Inject meta tags, canonical URL, and JSON-LD structured data
  return injectDynamicMetaTags(tab, legalDoc, undefined, {
    customTitle: fullTitle,
    customSuffix: suffix,
  });
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-24 min-h-[50vh]">
    <div className="text-center space-y-3">
      <div className="w-10 h-10 border-4 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-xs font-bold text-amber-900 tracking-wider uppercase font-vedic">Loading Vedic Astro Module...</p>
    </div>
  </div>
);

export default function App() {
  const [isSellerPortal] = useState(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hostname;
      const p = window.location.pathname;
      const q = window.location.search;
      const hash = window.location.hash;
      return h.startsWith('seller.') || h.includes('seller.astronava.com') || p.includes('/seller') || q.includes('view=seller') || hash.includes('seller') || q.includes('seller');
    }
    return false;
  });

  const [isRequestDeletePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      const hash = window.location.hash;
      const q = window.location.search;
      return p.includes('/request-delete') || hash.includes('request-delete') || q.includes('view=request-delete');
    }
    return false;
  });

  if (isRequestDeletePage) {
    return (
      <AuthProvider>
        <RequestDeletePage 
          onBackToHome={() => {
            window.location.hash = '';
            window.location.pathname = '/';
            window.location.reload();
          }}
          onOpenLogin={() => {
            window.location.hash = '';
            window.location.pathname = '/';
            window.location.reload();
          }}
        />
      </AuthProvider>
    );
  }

  if (isSellerPortal) {
    return (
      <AuthProvider>
        <StoreProvider>
          <SellerPortalRoot />
        </StoreProvider>
      </AuthProvider>
    );
  }

  const [activeTab, setActiveTab] = useState<AppTabType>('home');
  const [selectedHouse, setSelectedHouse] = useState<HouseNumber>(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetId>('sun');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north');

  // Custom placements for Kundli Builder & Visualizer
  const [customPlacements, setCustomPlacements] = useState<Record<PlanetId, HouseNumber>>({
    sun: 1,
    moon: 4,
    mars: 10,
    mercury: 2,
    jupiter: 5,
    venus: 7,
    saturn: 9,
    rahu: 11,
    ketu: 12,
  });

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<LegalDocType>('privacy');
  const [reportType, setReportType] = useState<'kundli' | 'match' | 'gemstone'>('kundli');
  const [reportMatchData, setReportMatchData] = useState<{ report?: any; p1?: any; p2?: any }>({});
  const [reportGemstoneData, setReportGemstoneData] = useState<{ lagna?: number; profile?: any; name?: string }>({});
  const [reportKundliData, setReportKundliData] = useState<CompleteKundliData | null>(null);

  // Full Astrology Report Modal state
  const [isFullReportOpen, setIsFullReportOpen] = useState(false);
  const [fullReportKundliData, setFullReportKundliData] = useState<CompleteKundliData | null>(null);
  const [fullReportInitialYears, setFullReportInitialYears] = useState<1 | 2 | 3 | 5>(3);
  const [fullReportInitialSection, setFullReportInitialSection] = useState<string>('sec-1-summary');

  // Helper to map pathname to view state
  const parsePathname = (path: string) => {
    const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';
    if (cleanPath === '/full-astrology-report' || cleanPath === '/full-report' || cleanPath === 'full-astrology-report' || cleanPath === 'full-report') {
      setTimeout(() => handleOpenFullReport(), 50);
      return true;
    }
    if (
      cleanPath === '/sitemap' ||
      cleanPath === '/sitemap.html' ||
      cleanPath === '/sitemap.xml' ||
      cleanPath === 'sitemap' ||
      cleanPath === 'sitemap.html' ||
      cleanPath === 'sitemap.xml'
    ) {
      setActiveTab('sitemap');
      return true;
    }
    if (cleanPath === '/privacy-policy' || cleanPath === '/privacy' || cleanPath === '/legal/privacy' || cleanPath === 'privacy-policy' || cleanPath === 'privacy' || cleanPath === 'legal/privacy') {
      setSelectedLegalDoc('privacy');
      setActiveTab('legal');
      return true;
    }
    if (cleanPath === '/terms-and-conditions' || cleanPath === '/terms' || cleanPath === '/terms-of-service' || cleanPath === '/legal/terms' || cleanPath === 'terms-and-conditions' || cleanPath === 'terms' || cleanPath === 'terms-of-service' || cleanPath === 'legal/terms') {
      setSelectedLegalDoc('terms');
      setActiveTab('legal');
      return true;
    }
    if (cleanPath === '/disclaimer' || cleanPath === '/legal/disclaimer' || cleanPath === 'disclaimer' || cleanPath === 'legal/disclaimer') {
      setSelectedLegalDoc('disclaimer');
      setActiveTab('legal');
      return true;
    }
    if (
      cleanPath === '/return-refund-policy' ||
      cleanPath === '/return-policy' ||
      cleanPath === '/refund-policy' ||
      cleanPath === '/shipping-policy' ||
      cleanPath === '/legal/return-refund' ||
      cleanPath === 'return-refund-policy' ||
      cleanPath === 'return-policy' ||
      cleanPath === 'refund-policy' ||
      cleanPath === 'shipping-policy' ||
      cleanPath === 'legal/return-refund'
    ) {
      setSelectedLegalDoc('return-refund');
      setActiveTab('legal');
      return true;
    }
    if (cleanPath === '/contact' || cleanPath === '/contact-us' || cleanPath === '/legal/contact' || cleanPath === 'contact' || cleanPath === 'contact-us' || cleanPath === 'legal/contact') {
      setSelectedLegalDoc('contact');
      setActiveTab('legal');
      return true;
    }
    if (cleanPath === '/horoscope' || cleanPath === '/daily-horoscope' || cleanPath === '/today-horoscope' || cleanPath === 'horoscope' || cleanPath === 'daily-horoscope' || cleanPath === 'today-horoscope') {
      setActiveTab('horoscope');
      return true;
    }
    if (cleanPath === '/builder' || cleanPath === 'builder') {
      setActiveTab('builder');
      return true;
    }
    if (cleanPath === '/gemstones' || cleanPath === '/ratna' || cleanPath === '/gemstone-calculator' || cleanPath === 'gemstones' || cleanPath === 'ratna' || cleanPath === 'gemstone-calculator') {
      setActiveTab('gemstones');
      return true;
    }
    if (cleanPath === '/match' || cleanPath === '/kundli-milan' || cleanPath === '/compatibility' || cleanPath === 'match' || cleanPath === 'kundli-milan' || cleanPath === 'compatibility') {
      setActiveTab('match');
      return true;
    }
    if (cleanPath === '/numerology' || cleanPath === '/mulank' || cleanPath === '/bhagyank' || cleanPath === 'numerology' || cleanPath === 'mulank' || cleanPath === 'bhagyank') {
      setActiveTab('numerology');
      return true;
    }
    if (cleanPath === '/name-correction' || cleanPath === '/name-tuning' || cleanPath === '/namecorrection' || cleanPath === '/namank' || cleanPath === 'name-correction' || cleanPath === 'name-tuning' || cleanPath === 'namecorrection' || cleanPath === 'namank') {
      setActiveTab('name-correction');
      return true;
    }
    if (cleanPath === '/store' || cleanPath === '/shop' || cleanPath === '/products' || cleanPath === '/cart' || cleanPath === '/checkout' || cleanPath === '/admin' || cleanPath === '/store/admin' || cleanPath === 'store' || cleanPath === 'shop' || cleanPath === 'products' || cleanPath === 'cart' || cleanPath === 'checkout' || cleanPath === 'admin' || cleanPath === 'store/admin') {
      setActiveTab('store');
      return true;
    }
    if (cleanPath === '/profile' || cleanPath === '/account' || cleanPath === '/dashboard' || cleanPath === 'profile' || cleanPath === 'account' || cleanPath === 'dashboard') {
      setActiveTab('profile');
      return true;
    }
    if (cleanPath === '' || cleanPath === '/' || cleanPath === '/home' || cleanPath === 'home') {
      setActiveTab('home');
      return true;
    }
    if (cleanPath === '/generator' || cleanPath === '/kundli' || cleanPath === 'generator' || cleanPath === 'kundli') {
      setActiveTab('generator');
      return true;
    }
    return false;
  };

  // Sync route on mount, hash change, and browser back/forward (popstate)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      if (hostname.startsWith('shop.') || hostname.includes('shop.astronava.com')) {
        const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
        if (!hash && (cleanPath === '' || cleanPath === '/')) {
          setActiveTab('store');
        }
      }
    }

    const parseCurrentUrl = () => {
      // 1. Check hash first (e.g. #generator or #/generator)
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        if (parsePathname(hash)) return;
      }

      // 2. Check query search params (e.g. ?tab=generator)
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') || params.get('view');
      if (tabParam) {
        if (parsePathname('/' + tabParam)) return;
      }

      // 3. Fallback to pathname
      parsePathname(window.location.pathname);
    };

    parseCurrentUrl();

    const handlePopState = () => {
      parseCurrentUrl();
    };

    const handleHashChange = () => {
      parseCurrentUrl();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Global Cmd+K / Ctrl+K shortcut for Search Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside an input or textarea (unless Cmd/Ctrl key is pressed)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dynamically inject descriptive meta tags and Open Graph data whenever activeTab, legalDoc, or report context changes
  useEffect(() => {
    updateTabMetaTags(activeTab, activeTab === 'legal' ? selectedLegalDoc : undefined, {
      isReportOpen,
      reportType,
      personName: reportKundliData?.personDetails?.name,
      isSitemapOpen,
    });
  }, [activeTab, selectedLegalDoc, isReportOpen, reportType, reportKundliData, isSitemapOpen]);

  const handleOpenLegal = (doc: LegalDocType) => {
    setSelectedLegalDoc(doc);
    setActiveTab('legal');

    const route = findRouteByTab('legal', doc);
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.startsWith('app.') || hostname.includes('app.astronava.com') || hostname.includes('ais-') || hostname === 'localhost') {
        const newHash = `#${route.path}`;
        if (window.location.hash !== newHash) {
          window.history.pushState(null, '', newHash);
        }
      } else {
        if (window.location.pathname !== route.path) {
          window.history.pushState(null, '', route.path);
        }
      }
    }
    updateTabMetaTags('legal', doc);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const handleTabChange = (tab: AppTabType) => {
    setActiveTab(tab);
    const route = findRouteByTab(tab, tab === 'legal' ? selectedLegalDoc : undefined);

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.startsWith('app.') || hostname.includes('app.astronava.com') || hostname.includes('ais-') || hostname === 'localhost') {
        const newHash = `#${route.path}`;
        if (window.location.hash !== newHash) {
          window.history.pushState(null, '', newHash);
        }
      } else {
        if (window.location.pathname !== route.path) {
          window.history.pushState(null, '', route.path);
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    updateTabMetaTags(tab, tab === 'legal' ? selectedLegalDoc : undefined);
  };

  const handleReturnHome = () => {
    handleTabChange('home');
  };

  const handleOpenReport = (type: 'kundli' | 'match' | 'gemstone' = 'kundli', data?: any) => {
    setReportType(type);
    if (type === 'kundli' && data) {
      setReportKundliData(data);
    } else if (type === 'match' && data) {
      setReportMatchData(data);
    } else if (type === 'gemstone' && data) {
      setReportGemstoneData(data);
    }
    setIsReportOpen(true);
  };

  const handleOpenFullReport = (
    data?: CompleteKundliData,
    years: 1 | 2 | 3 | 5 = 3,
    section: string = 'sec-1-summary'
  ) => {
    let targetData = data || reportKundliData;
    if (!targetData) {
      targetData = generateCompleteKundli({
        name: 'Seeker',
        gender: 'male',
        dob: '1950-09-17',
        tob: '11:00',
        city: 'Vadnagar, Gujarat, India',
        latitude: 23.7842,
        longitude: 72.6369,
        timezoneOffset: 5.5,
        weightKg: 78,
        weightUnit: 'kg',
      });
      setReportKundliData(targetData);
    }
    setFullReportKundliData(targetData);
    setFullReportInitialYears(years);
    setFullReportInitialSection(section);
    setIsFullReportOpen(true);
  };

  // Group placements by house number for the chart renderer
  const houseOccupants: Record<HouseNumber, PlanetId[]> = React.useMemo(() => {
    const map: Record<HouseNumber, PlanetId[]> = {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []
    };
    Object.entries(customPlacements).forEach(([pId, hNum]) => {
      map[hNum as HouseNumber].push(pId as PlanetId);
    });
    return map;
  }, [customPlacements]);

  const handleHouseSelect = (houseNum: HouseNumber) => {
    setSelectedHouse(houseNum);
  };

  const handlePlanetSelect = (planetId: PlanetId) => {
    setSelectedPlanet(planetId);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <StoreProvider>
        <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950 w-full max-w-full overflow-x-hidden">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        chartStyle={chartStyle}
        setChartStyle={setChartStyle}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFullReport={() => handleOpenFullReport()}
      />

      {/* Main App Container */}
      <main
        key={activeTab}
        className={`flex-1 w-full mx-auto min-w-0 box-border overflow-x-hidden animate-slide-in-tab ${
          activeTab === 'store'
            ? 'max-w-full p-0 space-y-0'
            : 'max-w-7xl px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8'
        }`}
      >
        
        {/* Dynamic Content Views based on activeTab */}
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'home' && (
            <HomePage onSelectTab={handleTabChange} />
          )}

          {activeTab === 'horoscope' && <HoroscopeDashboard />}

          {activeTab === 'generator' && (
            <KundliGenerator
              onOpenReportModal={(kData) => handleOpenReport('kundli', kData)}
              onOpenFullReportModal={(kData, yrs, sec) => handleOpenFullReport(kData, yrs, sec)}
              onKundliGenerated={(kData) => setReportKundliData(kData)}
              onApplyPlacementsToBuilder={(placements) => {
                setCustomPlacements(placements);
                handleTabChange('builder');
              }}
            />
          )}

          {activeTab === 'builder' && (
            <KundliBuilder
              placements={customPlacements}
              setPlacements={setCustomPlacements}
              onSelectHouse={(hNum) => {
                setSelectedHouse(hNum);
              }}
              onSelectPlanet={handlePlanetSelect}
              onOpenReport={() => handleOpenReport('kundli')}
            />
          )}

          {activeTab === 'gemstones' && (
            <GemstoneRecommender
              initialLagna={1}
              onNavigateToTab={(tab) => {
                if (tab === 'generator' || tab === 'builder' || tab === 'gemstones' || tab === 'match') {
                  handleTabChange(tab);
                }
              }}
              onOpenCustomReport={(data) => handleOpenReport('gemstone', data)}
            />
          )}

          {activeTab === 'match' && (
            <MatchFinder
              onNavigateToTab={(tab) => {
                if (tab === 'generator' || tab === 'builder' || tab === 'gemstones' || tab === 'match' || tab === 'numerology') {
                  handleTabChange(tab);
                }
              }}
              onOpenCustomReport={(data) => handleOpenReport('match', data)}
            />
          )}

          {activeTab === 'numerology' && (
            <NumerologyCalculator
              initialSection="overview"
              initialName={reportKundliData?.nativeName || ''}
              initialDob={{
                day: reportKundliData?.birthData.day || 17,
                month: reportKundliData?.birthData.month || 9,
                year: reportKundliData?.birthData.year || 1950,
              }}
            />
          )}

          {activeTab === 'name-correction' && (
            <NumerologyCalculator
              initialSection="name"
              initialName={reportKundliData?.nativeName || ''}
              initialDob={{
                day: reportKundliData?.birthData.day || 17,
                month: reportKundliData?.birthData.month || 9,
                year: reportKundliData?.birthData.year || 1950,
              }}
            />
          )}

          {activeTab === 'legal' && (
            <LegalPage
              activeDoc={selectedLegalDoc}
              onSelectDoc={(doc) => handleOpenLegal(doc)}
              onBack={handleReturnHome}
            />
          )}

          {activeTab === 'store' && <StoreModule />}

          {activeTab === 'sitemap' && (
            <SitemapPage
              onNavigate={(tab, doc) => {
                setSelectedLegalDoc(doc);
                handleTabChange(tab);
              }}
              onBack={handleReturnHome}
            />
          )}

          {activeTab === 'profile' && (
            <UserDashboard onNavigateTab={handleTabChange} />
          )}
        </Suspense>

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-12 sm:mt-16 pt-8 sm:pt-12 pb-6 sm:pb-8 w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 box-border">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Col 1: About */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleReturnHome}>
                <img
                  src="/icons/app_logo.svg"
                  alt="Astronava Logo"
                  className="w-6 h-6 rounded-md ring-1 ring-amber-400/30 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xl font-bold font-vedic text-white tracking-wider">ASTRONAVA</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                A modern Vedic astrology platform built on open-source technologies, using classical Vedic astrology principles and structured calculations to generate Kundli analysis, gemstone recommendations, and compatibility reports.
              </p>
            </div>

            {/* Col 2: Tools */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">Astrological Tools</h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button
                    onClick={() => {
                      handleTabChange('horoscope');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">1.</span>
                    <span>Personalized Daily Horoscope</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleTabChange('generator');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">2.</span>
                    <span>Kundli Maker &amp; Janam Patrika</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleTabChange('builder');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">3.</span>
                    <span>Kundli Builder &amp; Visualizer</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleTabChange('gemstones');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">4.</span>
                    <span>Find Gemstone You Need</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleTabChange('match');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">5.</span>
                    <span>Match Finder (Kundli Milan)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleTabChange('numerology');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">6.</span>
                    <span>Numerology Calculator</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleTabChange('name-correction');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">7.</span>
                    <span>Vedic Name Correction</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleTabChange('store');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">8.</span>
                    <span>Store</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Policies */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">Legal &amp; Policies</h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <a
                    href="/privacy-policy"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenLegal('privacy');
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-and-conditions"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenLegal('terms');
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Terms &amp; Conditions</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/return-refund-policy"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenLegal('return-refund');
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Return &amp; Refund Policy</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/disclaimer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenLegal('disclaimer');
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Disclaimer</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/sitemap"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabChange('sitemap');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Sitemap Directory</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact Us */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">
                <a
                  href="/contact"
                  id="footer-contact-us-heading-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenLegal('contact');
                  }}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </a>
              </h4>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 border-t border-stone-800 flex flex-col items-center justify-center text-xs text-stone-400 gap-4 sm:gap-6 relative">
            <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs text-stone-400">
              <a
                href="/privacy-policy"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenLegal('privacy');
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <span>&bull;</span>
              <a
                href="/terms-and-conditions"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenLegal('terms');
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Terms &amp; Conditions
              </a>
              <span>&bull;</span>
              <a
                href="/return-refund-policy"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenLegal('return-refund');
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Return &amp; Refund Policy
              </a>
              <span>&bull;</span>
              <a
                href="/disclaimer"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenLegal('disclaimer');
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Disclaimer
              </a>
              <span>&bull;</span>
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenLegal('contact');
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Contact Us
              </a>
              <span>&bull;</span>
              <a
                href="/store"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('store');
                  scrollToTop();
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Store
              </a>
              <span>&bull;</span>
              <a
                href="/sitemap"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('sitemap');
                  scrollToTop();
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer font-medium"
              >
                Sitemap
              </a>
              <span>&bull;</span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors cursor-pointer font-mono text-[11px]"
              >
                sitemap.xml
              </a>

            </div>

            <p className="text-center w-full max-w-sm sm:max-w-none">
              © {new Date().getFullYear()} <strong className="text-stone-200">Astronava</strong>. Developed by{' '}
              <a
                href="https://x.com/himaghnamedhi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors"
              >
                Himaghna Medhi
              </a>
            </p>

            <div className="mt-2 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 flex justify-center group">
              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full bg-stone-800 hover:bg-amber-900/80 text-amber-400 hover:text-amber-300 flex items-center justify-center border border-stone-700 hover:border-amber-500/50 shadow-md hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                title="Back to Top"
              >
                <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Life Query & Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToTab={(tab) => {
          handleTabChange(tab as AppTabType);
        }}
        onSelectHouse={(h) => {
          setSelectedHouse(h);
          handleTabChange('builder');
        }}
        onSelectPlanet={(p) => {
          setSelectedPlanet(p);
          handleTabChange('builder');
        }}
      />

      {/* Comprehensive 20-Section Full Astrology Report & Multi-Year Forecast Modal */}
      {fullReportKundliData && (
        <FullAstrologyReportModal
          isOpen={isFullReportOpen}
          onClose={() => setIsFullReportOpen(false)}
          kundliData={fullReportKundliData}
          initialYears={fullReportInitialYears}
          initialFocusedSection={fullReportInitialSection}
        />
      )}

      {/* Printable Custom Vedic Report Modal */}
      <CustomReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        initialReportType={reportType}
        placements={customPlacements}
        chartStyle={chartStyle}
        initialKundliData={reportKundliData}
        initialMatchReport={reportMatchData.report}
        initialP1Details={reportMatchData.p1}
        initialP2Details={reportMatchData.p2}
        initialGemstoneLagna={reportGemstoneData.lagna}
        initialGemstoneProfile={reportGemstoneData.profile}
        initialGemstoneNativeName={reportGemstoneData.name}
      />

      {/* Legal & Policies Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialDoc={selectedLegalDoc}
      />

      {/* Client-Side Sitemap & Astrological Directory Modal */}
      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
        onNavigate={(tab, doc) => {
          if (doc) {
            handleOpenLegal(doc);
          } else {
            handleTabChange(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* User Authentication & Sign-Up Modal */}
      <AuthModal />

      {/* Global Notification Toast */}
      <NotificationToast />

        </div>
      </StoreProvider>
    </AuthProvider>
  );
}
