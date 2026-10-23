/**
 * Client-Side Sitemap & SEO Metadata Generator for astronava.com
 * Provides structured route cataloging, XML sitemap generation, JSON-LD Schema data,
 * and dynamic meta tag injection for search engine crawlability across all astrological tools.
 */

export type AppTabType = 'home' | 'horoscope' | 'generator' | 'builder' | 'gemstones' | 'account' | 'match' | 'numerology' | 'name-correction' | 'legal' | 'store' | 'profile' | 'sitemap';
export type LegalDocType = 'privacy' | 'terms' | 'disclaimer' | 'return-refund' | 'contact';

export type SitemapCategoryType =
  | 'Astrological Tools'
  | 'Kundli Calculations'
  | 'Horoscope & Panchang'
  | 'Sacred Store & Items'
  | 'Astrology Reports'
  | 'Policies & Legal'
  | 'User Services';

export interface AppViewRoute {
  id: string;
  tab: AppTabType;
  legalDoc?: LegalDocType;
  path: string;
  aliases?: string[];
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  ogType: 'website' | 'article';
  priority: number; // 0.0 to 1.0
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  category: SitemapCategoryType;
  lastmod: string;
}

export const CANONICAL_BASE_URL = 'https://www.astronava.com';

export function getCanonicalBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.startsWith('app.') || hostname.includes('app.astronava.com')) {
      return `https://${hostname}`;
    }
    if (hostname && hostname !== 'localhost' && !hostname.includes('127.0.0.1')) {
      return `https://${hostname}`;
    }
  }
  return CANONICAL_BASE_URL;
}

/**
 * Standard registry of all indexable app views & astrological tools
 */
export const APP_ROUTES: AppViewRoute[] = [
  {
    id: 'home',
    tab: 'home',
    path: '/',
    aliases: ['/home'],
    title: 'Astronava | Authentic Vedic Astrology, Kundli Maker, Gemstones, Match & Store',
    shortTitle: 'Home',
    description: 'Explore authentic Vedic astrology tools on Astronava: Janam Kundli Maker, Gemstone Recommender, 36 Guna Kundli Milan Match Finder, Numerology Calculator, and Certified Sacred Store.',
    keywords: [
      'vedic astrology',
      'kundli maker',
      'gemstone recommender',
      'kundli milan',
      'match finder',
      'numerology calculator',
      'astrology store',
      'certified gemstones'
    ],
    ogType: 'website',
    priority: 1.0,
    changefreq: 'daily',
    category: 'Astrological Tools',
    lastmod: '2026-10-23',
  },
  {
    id: 'daily-horoscope',
    tab: 'horoscope',
    path: '/horoscope',
    aliases: ['/daily-horoscope', '/today-horoscope'],
    title: 'Personalized Daily Horoscope & Vedic Transits | astronava.com',
    shortTitle: 'Daily Horoscope',
    description: 'Accurate personalized daily Vedic horoscope predictions calculated with real planetary transits (Gochar), Vimshottari Dasha, Sarvashtakavarga, Panchang, and 20 life domain scores.',
    keywords: [
      'daily horoscope',
      'personalized horoscope',
      'vedic daily predictions',
      'astrology transits',
      'gochar today',
      'panchang today',
      'choghadiya muhurat',
      'career horoscope today',
      'astronava horoscope'
    ],
    ogType: 'website',
    priority: 0.95,
    changefreq: 'daily',
    category: 'Horoscope & Panchang',
    lastmod: '2026-10-23',
  },
  {
    id: 'kundli-maker',
    tab: 'generator',
    path: '/generator',
    aliases: ['/kundli'],
    title: 'Free Janam Kundli & Vedic Birth Chart | Kundli Maker | astronava.com',
    shortTitle: 'Kundli Maker & Janam Patrika',
    description: 'Generate authentic Vedic Janam Kundli birth charts with Lahiri Ayanamsha, 7 divisional charts (D1 to D12), Vimshottari Dasha timeline, Sarvashtakavarga 337 bindus, and Parashari Yoga diagnostics.',
    keywords: [
      'vedic kundli',
      'janam kundli',
      'birth chart generator',
      'lahiri ayanamsha',
      'vimshottari dasha',
      'divisional charts',
      'sarvashtakavarga',
      'jyotish chart',
      'lagna chart'
    ],
    ogType: 'website',
    priority: 0.95,
    changefreq: 'daily',
    category: 'Kundli Calculations',
    lastmod: '2026-10-23',
  },
  {
    id: 'kundli-builder',
    tab: 'builder',
    path: '/builder',
    aliases: ['/reader'],
    title: 'Interactive House & Planetary Visualizer | Kundli Builder | astronava.com',
    shortTitle: 'Kundli Builder & Visualizer',
    description: 'Interactive Vedic Kundli house builder and planetary visualizer. Customize Lagna, explore house placements (Bhavas), planetary aspects (Drishti), and classical Parashari planetary combinations in real-time.',
    keywords: [
      'kundli builder',
      'vedic horoscope visualizer',
      'planetary drishti',
      'bhava analysis',
      'parashari astrology',
      'astrological chart builder',
      'vedic house calculator'
    ],
    ogType: 'website',
    priority: 0.9,
    changefreq: 'weekly',
    category: 'Kundli Calculations',
    lastmod: '2026-10-23',
  },
  {
    id: 'full-astrology-report',
    tab: 'home',
    path: '/full-astrology-report',
    aliases: ['/full-report'],
    title: '20-Section Comprehensive Vedic Astrology Life Report & Multi-Year Forecast | astronava.com',
    shortTitle: '20-Section Full Astrology Report',
    description: 'Full life Vedic astrology report featuring 20 distinct analytical sections: Lagna & Navamsha analysis, Mahadasha timing, career, wealth, relationships, health, spiritual remedies, and multi-year planetary forecasts.',
    keywords: [
      'full astrology report',
      'comprehensive kundli report',
      'life horoscope prediction',
      'multi year forecast',
      'astrology forecast pdf'
    ],
    ogType: 'website',
    priority: 0.9,
    changefreq: 'daily',
    category: 'Astrology Reports',
    lastmod: '2026-10-23',
  },
  {
    id: 'gemstone-recommender',
    tab: 'gemstones',
    path: '/gemstones',
    aliases: ['/ratna', '/gemstone-calculator'],
    title: 'Vedic Gemstone Recommender & Ratna Calculator | astronava.com',
    shortTitle: 'Gemstone Recommender',
    description: 'Discover your auspicious Life Stone (Jeevan Ratna), Lucky Stone (Bhagya Ratna), and Dharma Stone with body-weight calibrated Ratti dosages, metals, and Vedic mantras.',
    keywords: [
      'gemstone recommender',
      'vedic ratna calculator',
      'life stone calculator',
      'lucky gemstone by birth chart',
      'pukhraj neelam ruby emerald',
      'ratti dosage calculator'
    ],
    ogType: 'website',
    priority: 0.9,
    changefreq: 'weekly',
    category: 'Astrological Tools',
    lastmod: '2026-10-23',
  },
  {
    id: 'match-finder',
    tab: 'match',
    path: '/match',
    aliases: ['/kundli-milan', '/compatibility'],
    title: '36 Guna Horoscope Matching & Compatibility | Kundli Milan | astronava.com',
    shortTitle: 'Match Finder (Kundli Milan)',
    description: 'Authentic Vedic Kundli Milan and marriage compatibility calculator based on the 8 sacred Ashta Kuta dimensions (36 Gunas), Manglik (Kuja) Dosha diagnostics, Rajju longevity, and Nadi harmony.',
    keywords: [
      'kundli milan',
      'horoscope matching',
      'ashtakoota 36 gunas',
      'gun milan',
      'manglik dosha check',
      'vedic marriage compatibility',
      'rajju dosha',
      'nadi kuta'
    ],
    ogType: 'website',
    priority: 0.9,
    changefreq: 'weekly',
    category: 'Astrological Tools',
    lastmod: '2026-10-23',
  },
  {
    id: 'numerology-calculator',
    tab: 'numerology',
    path: '/numerology',
    aliases: ['/mulank', '/bhagyank'],
    title: 'Mulank, Bhagyank & Destiny Number Analysis | Numerology Calculator | astronava.com',
    shortTitle: 'Numerology Calculator',
    description: 'Calculate your Vedic Psychic Root number (Mulank), Destiny Life Path number (Bhagyank), Name number (Namank), ruling planet, and favorable dates, colors, and compatible life partners according to Cheiro and Vedic Sankhya Shastra.',
    keywords: [
      'vedic numerology',
      'mulank calculator',
      'bhagyank destiny number',
      'cheiro numerology',
      'sankhya shastra',
      'numerology compatibility',
      'life path number'
    ],
    ogType: 'website',
    priority: 0.85,
    changefreq: 'weekly',
    category: 'Astrological Tools',
    lastmod: '2026-10-23',
  },
  {
    id: 'name-correction',
    tab: 'name-correction',
    path: '/name-correction',
    aliases: ['/name-tuning', '/namecorrection', '/namank'],
    title: 'Vedic Name Correction & Spelling Tuning | Chaldean & Pythagorean | astronava.com',
    shortTitle: 'Name Correction',
    description: 'Harmonize your name vibrations with your Mulank and Bhagyank. Tune your name spelling with classical Chaldean and Pythagorean compound analysis to attract luck, prosperity, and cosmic harmony.',
    keywords: [
      'name correction',
      'vedic name correction',
      'chaldean name numerology',
      'spelling tuning',
      'namank vibration',
      'lucky name spelling',
      'pythagorean name calculator'
    ],
    ogType: 'website',
    priority: 0.85,
    changefreq: 'weekly',
    category: 'Astrological Tools',
    lastmod: '2026-10-23',
  },
  {
    id: 'sacred-store',
    tab: 'store',
    path: '/store',
    aliases: ['/shop', '/products'],
    title: 'Certified Vedic Gemstones, Nepali Rudraksha & Crystals | Sacred Store | astronava.com',
    shortTitle: 'Sacred Store (All Items)',
    description: 'Shop energized, lab-certified Vedic gemstones (Pukhraj, Neelam, Manik), authentic Himalayan Rudraksha beads, and sacred energizing crystals with complimentary Vedic Prana Pratishtha rituals.',
    keywords: [
      'vedic store',
      'certified gemstones',
      'buy pukhraj',
      'blue sapphire',
      'nepali rudraksha',
      'crystals for planetary remedies',
      'energized talismans',
      'prana pratishtha'
    ],
    ogType: 'website',
    priority: 0.9,
    changefreq: 'daily',
    category: 'Sacred Store & Items',
    lastmod: '2026-10-23',
  },
  {
    id: 'store-gemstones',
    tab: 'store',
    path: '/store?category=gemstones',
    aliases: ['/store/gemstones'],
    title: '100% Natural Lab-Certified Vedic Gemstones | Sacred Store | astronava.com',
    shortTitle: 'Gemstones Collection',
    description: 'Authentic untreated Yellow Sapphire, Blue Sapphire, Natural Ruby, Emerald, and Red Coral lab-certified for astrological remedies with sanctified Vedic consecration.',
    keywords: ['natural gemstones', 'yellow sapphire pukhraj', 'blue sapphire neelam', 'burma ruby', 'colombian emerald'],
    ogType: 'website',
    priority: 0.85,
    changefreq: 'daily',
    category: 'Sacred Store & Items',
    lastmod: '2026-10-23',
  },
  {
    id: 'store-rudraksha',
    tab: 'store',
    path: '/store?category=rudraksha',
    aliases: ['/store/rudraksha'],
    title: 'Authentic Himalayan Nepali Rudraksha Beads & Japa Malas | astronava.com',
    shortTitle: 'Rudraksha & Malas',
    description: 'Genuine Nepal-sourced 1 to 21 Mukhi collector Rudraksha beads, Siddh Mala combinations, and protective silver-capped bracelets energized by Vedic priests.',
    keywords: ['nepali rudraksha', '5 mukhi rudraksha', '7 mukhi rudraksha', 'siddh mala', 'rudraksha japa mala'],
    ogType: 'website',
    priority: 0.85,
    changefreq: 'daily',
    category: 'Sacred Store & Items',
    lastmod: '2026-10-23',
  },
  {
    id: 'store-crystals',
    tab: 'store',
    path: '/store?category=crystals',
    aliases: ['/store/crystals'],
    title: 'Natural Healing Crystals, Pyramids & Sphatik Malas | astronava.com',
    shortTitle: 'Healing Crystals',
    description: 'High-vibrational Clear Quartz, Rose Quartz, Amethyst, Citrine towers, and Himalayan Sphatik rosaries for chakra balance and spatial aura protection.',
    keywords: ['sphatik mala', 'amethyst cluster', 'citrine pyramid', 'clear quartz', 'healing crystals'],
    ogType: 'website',
    priority: 0.85,
    changefreq: 'daily',
    category: 'Sacred Store & Items',
    lastmod: '2026-10-23',
  },
  {
    id: 'seller-portal',
    tab: 'home',
    path: '/seller',
    aliases: ['/store/seller'],
    title: 'Artisan & Vedic Merchant Onboarding Portal | astronava.com',
    shortTitle: 'Artisan Seller Portal',
    description: 'Join the Astronava certified network of sacred gemologists, Himalayan collectors, and spiritual crafts merchants.',
    keywords: ['astronava seller', 'artisan portal', 'vedic merchant', 'sell gemstones'],
    ogType: 'website',
    priority: 0.7,
    changefreq: 'monthly',
    category: 'Sacred Store & Items',
    lastmod: '2026-10-23',
  },
  {
    id: 'account-dashboard',
    tab: 'account',
    path: '/account',
    aliases: ['/my-account', '/dashboard'],
    title: 'Account & Member Dashboard | astronava.com',
    shortTitle: 'Account Dashboard',
    description: 'Manage your Astronava account, saved birth details, astrological records, and member profile settings.',
    keywords: ['astronava account', 'member dashboard', 'saved kundlis', 'user profile'],
    ogType: 'website',
    priority: 0.8,
    changefreq: 'weekly',
    category: 'User Services',
    lastmod: '2026-10-23',
  },
  {
    id: 'user-profile',
    tab: 'profile',
    path: '/profile',
    aliases: ['/account', '/dashboard'],
    title: 'Astronava Member Profile & Dashboard | astronava.com',
    shortTitle: 'My Member Profile',
    description: 'Manage your Astronava member profile, permanent birth coordinates, horoscope history, wishlist, and consecrated orders in one centralized dashboard.',
    keywords: ['astronava member', 'user dashboard', 'birth details', 'astronava account'],
    ogType: 'website',
    priority: 0.8,
    changefreq: 'daily',
    category: 'User Services',
    lastmod: '2026-10-23',
  },
  {
    id: 'request-delete',
    tab: 'home',
    path: '/request-delete',
    aliases: ['/delete-account', '/privacy-delete'],
    title: 'Data & Account Erasure Request | Privacy Controls | astronava.com',
    shortTitle: 'Delete Account & Data',
    description: 'Submit an immediate, GDPR/CCPA compliant request to delete your Astronava account, saved birth charts, astrological records, and personal profile data.',
    keywords: ['delete account', 'data deletion', 'gdpr deletion', 'privacy rights'],
    ogType: 'website',
    priority: 0.5,
    changefreq: 'yearly',
    category: 'User Services',
    lastmod: '2026-10-23',
  },
  {
    id: 'privacy-policy',
    tab: 'legal',
    legalDoc: 'privacy',
    path: '/privacy-policy',
    aliases: ['/privacy', '/legal/privacy'],
    title: 'Data Protection & Privacy Notice | Privacy Policy | astronava.com',
    shortTitle: 'Privacy Policy',
    description: 'Official Privacy Policy for astronava.com. Learn how we handle your birth data, Google authentication, and security protections across all Vedic astrology tools.',
    keywords: ['astronava privacy policy', 'vedic astrology privacy', 'data protection', 'user privacy'],
    ogType: 'article',
    priority: 0.6,
    changefreq: 'monthly',
    category: 'Policies & Legal',
    lastmod: '2026-10-23',
  },
  {
    id: 'terms-and-conditions',
    tab: 'legal',
    legalDoc: 'terms',
    path: '/terms-and-conditions',
    aliases: ['/terms', '/terms-of-service', '/legal/terms'],
    title: 'Astrology Service Terms of Use | Terms & Conditions | astronava.com',
    shortTitle: 'Terms & Conditions',
    description: 'Terms and conditions governing the use of astronava.com astrology software, Kundli generation, calculation algorithms, and educational resources.',
    keywords: ['terms and conditions', 'astronava terms of service', 'user agreement'],
    ogType: 'article',
    priority: 0.6,
    changefreq: 'monthly',
    category: 'Policies & Legal',
    lastmod: '2026-10-23',
  },
  {
    id: 'disclaimer',
    tab: 'legal',
    legalDoc: 'disclaimer',
    path: '/disclaimer',
    aliases: ['/legal/disclaimer'],
    title: 'Educational Astrological Notice | Legal Disclaimer | astronava.com',
    shortTitle: 'Disclaimer',
    description: 'Astrological disclaimer and terms for astronava.com. Educational and informational Vedic Jyotish calculations provided without warranties or medical/financial advice.',
    keywords: ['astrology disclaimer', 'educational astrology notice', 'terms of information'],
    ogType: 'article',
    priority: 0.6,
    changefreq: 'monthly',
    category: 'Policies & Legal',
    lastmod: '2026-10-23',
  },
  {
    id: 'return-refund-policy',
    tab: 'legal',
    legalDoc: 'return-refund',
    path: '/return-refund-policy',
    aliases: ['/return-policy', '/refund-policy', '/shipping-policy', '/legal/return-refund'],
    title: 'Return, Refund & Shipping Policy | astronava.com',
    shortTitle: 'Return, Refund & Shipping Policy',
    description: 'Official Return, Refund, and Shipping Policy for the Astronava Sacred Store. Learn about our 7-day return eligibility, refund timelines across UPI/Cards/Net Banking, Pan-India & international shipping, and customer support at customer-support@astronava.com.',
    keywords: ['return policy', 'refund policy', 'shipping policy', 'astronava store returns', 'customer-support@astronava.com'],
    ogType: 'article',
    priority: 0.6,
    changefreq: 'monthly',
    category: 'Policies & Legal',
    lastmod: '2026-10-23',
  },
  {
    id: 'contact',
    tab: 'legal',
    legalDoc: 'contact',
    path: '/contact',
    aliases: ['/contact-us', '/legal/contact'],
    title: 'Customer Support & Inquiries | Contact Us | astronava.com',
    shortTitle: 'Contact Us',
    description: 'Get in touch with the Astronava development and Vedic research team for technical support, feedback, or astrological feature inquiries.',
    keywords: ['contact astronava', 'astrology support', 'feedback', 'inquiries'],
    ogType: 'article',
    priority: 0.6,
    changefreq: 'monthly',
    category: 'Policies & Legal',
    lastmod: '2026-10-23',
  },
  {
    id: 'sitemap-directory',
    tab: 'sitemap',
    path: '/sitemap',
    aliases: ['/sitemap.html'],
    title: 'Astronava Directory & Sitemap | All Astrological Tools & Pages',
    shortTitle: 'Sitemap',
    description: 'Complete HTML sitemap directory of all Vedic astrology tools, Kundli generators, gemstone calculators, and legal policies on astronava.com for Google Search Console.',
    keywords: ['astronava sitemap', 'site index', 'vedic tools directory', 'google search console sitemap', 'kundli tool list'],
    ogType: 'website',
    priority: 0.8,
    changefreq: 'daily',
    category: 'Policies & Legal',
    lastmod: '2026-10-23',
  },
];

export const ASTROLOGICAL_REPORT_TYPES = [
  { id: 'report-kundli', path: '/report/kundli', title: 'Free Janam Kundli Report & Vedic Birth Chart', description: 'Comprehensive Janam Kundli birth chart analysis with planetary positions and dashas.' },
  { id: 'report-match', path: '/report/match', title: '36 Guna Horoscope Matching Report', description: 'Detailed Ashtakoota compatibility and Guna Milan report for marriage.' },
  { id: 'report-gemstone', path: '/report/gemstone', title: 'Vedic Gemstone Prescription & Navaratna Report', description: 'Personalized gemstone recommendations based on Lagna and favorable planet lords.' },
  { id: 'report-horoscope', path: '/report/horoscope', title: 'Daily Vedic Transit & Gochar Horoscope Report', description: 'In-depth daily planetary transit analysis and life domain forecasts.' },
  { id: 'report-numerology', path: '/report/numerology', title: 'Mulank & Bhagyank Numerology Report', description: 'Vedic Sankhya Shastra psychic root and destiny number report.' },
  { id: 'report-dasha', path: '/report/dasha', title: 'Vimshottari Dasha Planetary Period Report', description: 'Detailed planetary Mahadasha and Antardasha timeline analysis.' },
  { id: 'report-ashtakavarga', path: '/report/ashtakavarga', title: 'Sarvashtakavarga Bindus & House Strength Report', description: 'Sarvashtakavarga planetary bindus and house strength breakdown.' },
  { id: 'report-panchang', path: '/report/panchang', title: 'Vedic Panchang & Muhurat Report', description: 'Precise daily Tithi, Nakshatra, Yoga, Karana, and auspicious timings.' },
];

/**
 * Pings major search engines (Google and Bing) with the updated sitemap URL.
 */
export async function pingSearchEngines(baseUrl: string = getCanonicalBaseUrl()): Promise<void> {
  if (typeof window === 'undefined') return;
  const sitemapUrl = `${baseUrl.replace(/\/$/, '')}/sitemap.xml`;
  const endpoints = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];

  try {
    await Promise.allSettled(
      endpoints.map((endpoint) =>
        fetch(endpoint, { method: 'GET', mode: 'no-cors' }).catch(() => {})
      )
    );
    console.log('Successfully pinged search engines with sitemap:', sitemapUrl);
  } catch (err) {
    console.error('Error pinging search engines:', err);
  }
}

/**
 * Returns all active app routes with their canonical URLs, including dynamic astrological report routes.
 */
export function getAppSitemapRoutes(baseUrl: string = CANONICAL_BASE_URL): (AppViewRoute & { canonicalUrl: string })[] {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const staticRoutes = APP_ROUTES.map((route) => ({
    ...route,
    canonicalUrl: `${normalizedBase}${route.path === '/' ? '' : route.path}`,
  }));

  const dynamicReportRoutes = ASTROLOGICAL_REPORT_TYPES.map((rep) => ({
    id: rep.id,
    tab: 'generator' as AppTabType,
    path: rep.path,
    title: `${rep.title} | astronava.com`,
    shortTitle: rep.title,
    description: rep.description,
    keywords: ['vedic report', 'astrology report', rep.id.replace('-', ' ')],
    ogType: 'website' as const,
    priority: 0.85,
    changefreq: 'weekly' as const,
    category: 'Astrology Reports' as const,
    lastmod: new Date().toISOString().split('T')[0],
    canonicalUrl: `${normalizedBase}${rep.path}`,
  }));

  return [...staticRoutes, ...dynamicReportRoutes];
}

/**
 * Finds a matching route definition by active tab and optional legal document.
 */
export function findRouteByTab(tab: AppTabType, legalDoc?: LegalDocType): AppViewRoute {
  if (tab === 'legal' && legalDoc) {
    const match = APP_ROUTES.find((r) => r.tab === 'legal' && r.legalDoc === legalDoc);
    if (match) return match;
  }
  const match = APP_ROUTES.find((r) => r.tab === tab);
  return match || APP_ROUTES[0];
}

/**
 * Finds a route by pathname (including aliases).
 */
export function findRouteByPath(rawPath: string): AppViewRoute | undefined {
  const cleanPath = (rawPath.toLowerCase().replace(/\/$/, '') || '/').trim();
  return APP_ROUTES.find((r) => r.path === cleanPath || (r.aliases && r.aliases.includes(cleanPath)));
}

/**
 * Section definitions for the modular Sitemap Index
 */
export interface SitemapSectionDefinition {
  id: string;
  filename: string;
  title: string;
  description: string;
  path: string;
  filter: (route: AppViewRoute) => boolean;
}

export const SITEMAP_SECTIONS: SitemapSectionDefinition[] = [
  {
    id: 'tools',
    filename: 'sitemap-tools.xml',
    path: '/sitemap-tools.xml',
    title: 'Vedic Astrological Tools & Calculators',
    description: 'Janam Kundli Maker, Kundli Builder, Daily Horoscope, Gemstones, Match Finder, and Numerology calculators',
    filter: (r) => r.category === 'Astrological Tools' || r.category === 'Kundli Calculations' || r.category === 'Horoscope & Panchang',
  },
  {
    id: 'store',
    filename: 'sitemap-store.xml',
    path: '/sitemap-store.xml',
    title: 'Sacred Store & Items',
    description: 'Certified Vedic gemstones, energized Rudraksha beads, sacred yantras, healing bracelets, and japa malas',
    filter: (r) => r.category === 'Sacred Store & Items' || r.path.startsWith('/store'),
  },
  {
    id: 'reports',
    filename: 'sitemap-reports.xml',
    path: '/sitemap-reports.xml',
    title: 'Astrology Reports & Forecast Endpoints',
    description: '20-section comprehensive life reports, Vimshottari dasha timelines, and Vedic calculation endpoints',
    filter: (r) => r.category === 'Astrology Reports' || r.path.startsWith('/report') || r.path.startsWith('/full-astrology-report'),
  },
  {
    id: 'legal',
    filename: 'sitemap-legal.xml',
    path: '/sitemap-legal.xml',
    title: 'Policies, Terms & Legal Documentation',
    description: 'Privacy policy, terms and conditions, astrological disclaimer, return & refund policy, and contact channels',
    filter: (r) => r.category === 'Policies & Legal' || r.tab === 'legal',
  },
  {
    id: 'general',
    filename: 'sitemap-general.xml',
    path: '/sitemap-general.xml',
    title: 'Core Platform & Directory Pages',
    description: 'Homepage, complete navigation directory, and authenticated user services',
    filter: (r) => r.path === '/' || r.path === '/sitemap' || r.category === 'User Services' || r.tab === 'profile',
  },
];

/**
 * Generates an RFC-compliant Sitemap Index XML string (sitemap-index.xml)
 * referencing different modular sitemap sections.
 */
export function generateSitemapIndexXml(baseUrl: string = CANONICAL_BASE_URL): string {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const section of SITEMAP_SECTIONS) {
    lines.push('  <sitemap>');
    lines.push(`    <loc>${normalizedBase}/${section.filename}</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    lines.push('  </sitemap>');
  }

  // Also include the consolidated comprehensive sitemap.xml in index
  lines.push('  <sitemap>');
  lines.push(`    <loc>${normalizedBase}/sitemap.xml</loc>`);
  lines.push(`    <lastmod>${today}</lastmod>`);
  lines.push('  </sitemap>');

  lines.push('</sitemapindex>');
  return lines.join('\n');
}

/**
 * Generates section-specific sitemap XML (e.g. sitemap-tools.xml, sitemap-store.xml)
 */
export function generateSectionSitemapXml(sectionId: string, baseUrl: string = CANONICAL_BASE_URL): string {
  const section = SITEMAP_SECTIONS.find((s) => s.id === sectionId || s.filename === sectionId);
  if (!section) {
    return generateClientSitemapXml(baseUrl);
  }

  const allRoutes = getAppSitemapRoutes(baseUrl);
  let sectionRoutes: (AppViewRoute & { canonicalUrl: string })[] = [];

  if (section.id === 'reports') {
    sectionRoutes = allRoutes.filter((r) => section.filter(r));
  } else if (section.id === 'store') {
    const baseStore = allRoutes.find((r) => r.path === '/store') || allRoutes[0];
    const storeCategories = ['gemstones', 'rudraksha', 'yantras', 'bracelets', 'malas', 'dhoop'];
    const catRoutes = storeCategories.map((cat) => ({
      ...baseStore,
      id: `store-${cat}`,
      path: `/store?category=${cat}`,
      canonicalUrl: `${baseUrl.replace(/\/$/, '')}/store?category=${cat}`,
      title: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Collection | Sacred Store | astronava.com`,
      shortTitle: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Collection`,
      priority: 0.85,
      changefreq: 'weekly' as const,
      category: 'Sacred Store & Items' as const,
    }));
    sectionRoutes = [baseStore, ...catRoutes];
  } else {
    sectionRoutes = allRoutes.filter((r) => section.filter(r));
  }

  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
  ];

  for (const route of sectionRoutes) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${escapeXml(route.canonicalUrl)}</loc>`);
    xmlLines.push(`    <lastmod>${route.lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${route.priority.toFixed(1)}</priority>`);
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');
  return xmlLines.join('\n');
}

/**
 * Generates an RFC-compliant XML Sitemap string for all app views.
 * Can be rendered on client or returned via API.
 */
export function generateClientSitemapXml(baseUrl: string = CANONICAL_BASE_URL): string {
  const routes = getAppSitemapRoutes(baseUrl);
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
  ];

  for (const route of routes) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${escapeXml(route.canonicalUrl)}</loc>`);
    xmlLines.push(`    <lastmod>${route.lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${route.priority.toFixed(1)}</priority>`);
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');
  return xmlLines.join('\n');
}

/**
 * Generates a JSON representation of the app sitemap.
 */
export function generateClientSitemapJson(baseUrl: string = CANONICAL_BASE_URL): string {
  const routes = getAppSitemapRoutes(baseUrl);
  return JSON.stringify(
    {
      hostname: baseUrl,
      generatedAt: new Date().toISOString(),
      totalUrls: routes.length,
      routes: routes.map((r) => ({
        id: r.id,
        path: r.path,
        url: r.canonicalUrl,
        title: r.title,
        shortTitle: r.shortTitle,
        description: r.description,
        category: r.category,
        priority: r.priority,
        changefreq: r.changefreq,
        keywords: r.keywords,
        lastmod: r.lastmod,
      })),
    },
    null,
    2
  );
}

/**
 * Generates an HTML sitemap representation with semantic anchor tags for crawlability.
 */
export function generateClientSitemapHtml(baseUrl: string = CANONICAL_BASE_URL): string {
  const routes = getAppSitemapRoutes(baseUrl);
  const categories = Array.from(new Set(routes.map((r) => r.category)));

  let html = '<div class="astronava-sitemap space-y-6">\n';
  for (const cat of categories) {
    const items = routes.filter((r) => r.category === cat);
    html += `  <div class="sitemap-category">\n`;
    html += `    <h3 class="text-sm font-bold text-amber-950 font-vedic uppercase tracking-wider mb-2">${escapeHtml(cat)}</h3>\n`;
    html += `    <ul class="space-y-2">\n`;
    for (const item of items) {
      html += `      <li>\n`;
      html += `        <a href="${item.canonicalUrl}" data-path="${item.path}" class="text-amber-800 font-semibold hover:underline">${escapeHtml(item.title)}</a>\n`;
      html += `        <p class="text-xs text-stone-600">${escapeHtml(item.description)}</p>\n`;
      html += `      </li>\n`;
    }
    html += `    </ul>\n`;
    html += `  </div>\n`;
  }
  html += '</div>';
  return html;
}

/**
 * Injects or updates a DOM meta/link tag safely.
 */
function setMetaTag(selector: string, attributes: Record<string, string>, tagName: 'meta' | 'link' = 'meta'): void {
  if (typeof document === 'undefined') return;

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
}

/**
 * Injects or updates JSON-LD script tag in the document head.
 */
function setJsonLdScript(id: string, data: object): void {
  if (typeof document === 'undefined') return;

  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export interface DynamicMetaOptions {
  customTitle?: string;
  customDescription?: string;
  customSuffix?: string;
}

/**
 * Returns the exact descriptive, CTR-optimized suffix for a specific active tab and optional legal document.
 * (e.g. 'Kundli Maker | astronava.com' vs 'Gemstone Recommender | astronava.com')
 */
export function getTabSeoSuffix(tab: AppTabType, legalDoc?: LegalDocType): string {
  switch (tab) {
    case 'horoscope':
      return 'Daily Horoscope | astronava.com';
    case 'generator':
      return 'Kundli Maker | astronava.com';
    case 'builder':
      return 'Kundli Builder | astronava.com';
    case 'gemstones':
      return 'Gemstone Recommender | astronava.com';
    case 'match':
      return 'Kundli Milan | astronava.com';
    case 'numerology':
      return 'Numerology Calculator | astronava.com';
    case 'name-correction':
      return 'Name Correction & Spelling Tuning | astronava.com';
    case 'store':
      return 'Sacred Store | astronava.com';
    case 'sitemap':
      return 'Sitemap Directory | astronava.com';
    case 'legal':
      switch (legalDoc) {
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
    default:
      return 'astronava.com';
  }
}

/**
 * Dynamically updates all document title, meta tags, and Open Graph tags for the current active view.
 * Ensures search crawlers and social shares index page-specific content properly.
 * Automatically respects or appends specific, descriptive tab suffixes to increase click-through rates.
 */
export function injectDynamicMetaTags(
  tab: AppTabType,
  legalDoc?: LegalDocType,
  baseUrl: string = getCanonicalBaseUrl(),
  options?: DynamicMetaOptions
): AppViewRoute {
  const route = findRouteByTab(tab, legalDoc);
  if (typeof document === 'undefined') return route;

  const normalizedBase = baseUrl.replace(/\/$/, '');
  const canonicalUrl = `${normalizedBase}${route.path === '/' ? '' : route.path}`;

  // Automatically determine or format title with tab-specific descriptive suffix
  const tabSuffix = options?.customSuffix || getTabSeoSuffix(tab, legalDoc);
  let appliedTitle = options?.customTitle || route.title;
  if (!options?.customTitle && !appliedTitle.includes(tabSuffix)) {
    const cleanBase = appliedTitle
      .replace(/\s*[—|]\s*astronava\.com.*$/i, '')
      .replace(/^astronava\.com\s*[—|]\s*/i, '')
      .trim();
    appliedTitle = cleanBase ? `${cleanBase} | ${tabSuffix}` : tabSuffix;
  }
  const appliedDescription = options?.customDescription || route.description;

  // 1. Browser Tab Title
  document.title = appliedTitle;

  // 2. Standard Search Meta Tags
  setMetaTag('meta[name="description"]', { name: 'description', content: appliedDescription });
  setMetaTag('meta[name="keywords"]', { name: 'keywords', content: route.keywords.join(', ') });

  // 3. Open Graph Tags
  setMetaTag('meta[property="og:title"]', { property: 'og:title', content: appliedTitle });
  setMetaTag('meta[property="og:description"]', { property: 'og:description', content: appliedDescription });
  setMetaTag('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  setMetaTag('meta[property="og:type"]', { property: 'og:type', content: route.ogType });
  setMetaTag('meta[property="og:site_name"]', { property: 'og:site_name', content: 'astronava.com' });

  // 4. Twitter Card Tags
  setMetaTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  setMetaTag('meta[name="twitter:title"]', { name: 'twitter:title', content: appliedTitle });
  setMetaTag('meta[name="twitter:description"]', { name: 'twitter:description', content: appliedDescription });
  setMetaTag('meta[name="twitter:image"]', { name: 'twitter:image', content: `${normalizedBase}/icons/app_logo.svg` });
  setMetaTag('meta[name="twitter:site"]', { name: 'twitter:site', content: '@astronava' });
  setMetaTag('meta[property="og:image"]', { property: 'og:image', content: `${normalizedBase}/icons/app_logo.svg` });

  // 5. Canonical Link
  setMetaTag('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl }, 'link');

  // 6. JSON-LD Structured Data for Current Tool / Page
  setJsonLdScript('astronava-page-jsonld', {
    '@context': 'https://schema.org',
    '@type': route.tab === 'legal' ? 'WebPage' : 'SoftwareApplication',
    name: route.shortTitle,
    headline: appliedTitle,
    description: appliedDescription,
    url: canonicalUrl,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Astronava',
      url: normalizedBase,
      logo: `${normalizedBase}/icons/app_logo.svg`,
    },
  });

  // 7. JSON-LD WebSite for Search Bar Sitelinks
  setJsonLdScript('astronava-website-jsonld', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Astronava',
    url: normalizedBase,
  });

  // 8. JSON-LD Organization for Entity Visibility
  setJsonLdScript('astronava-org-jsonld', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Astronava',
    url: normalizedBase,
    logo: `${normalizedBase}/icons/app_logo.svg`,
    sameAs: [
      'https://www.linkedin.com/company/astronava_official/',
      'https://x.com/himaghnamedhi',
    ],
  });

  // 9. JSON-LD SiteNavigationElement for Full Site Indexing
  const allRoutes = getAppSitemapRoutes(normalizedBase);
  setJsonLdScript('astronava-navigation-jsonld', {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Astronava Vedic Astrology Tools Sitemap',
    description: 'Complete directory of Vedic astrology tools, Kundli generators, gemstone recommendations, and match making',
    itemListElement: allRoutes.map((r, index) => ({
      '@type': 'SiteNavigationElement',
      position: index + 1,
      name: r.shortTitle,
      url: r.canonicalUrl,
      description: r.description,
    })),
  });

  return route;
}

/**
 * Triggers a client-side download of the sitemap.xml file.
 */
export function downloadSitemapXmlFile(baseUrl: string = CANONICAL_BASE_URL): void {
  if (typeof window === 'undefined') return;
  const xml = generateClientSitemapXml(baseUrl);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a client-side download of the sitemap-index.xml file.
 */
export function downloadSitemapIndexXmlFile(baseUrl: string = CANONICAL_BASE_URL): void {
  if (typeof window === 'undefined') return;
  const xml = generateSitemapIndexXml(baseUrl);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap-index.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a client-side download of a specific section sitemap file.
 */
export function downloadSectionSitemapXmlFile(sectionId: string, filename: string, baseUrl: string = CANONICAL_BASE_URL): void {
  if (typeof window === 'undefined') return;
  const xml = generateSectionSitemapXml(sectionId, baseUrl);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
