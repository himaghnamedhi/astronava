/**
 * Client-Side Sitemap & SEO Metadata Generator for astronava.com
 * Provides structured route cataloging, XML sitemap generation, JSON-LD Schema data,
 * and dynamic meta tag injection for search engine crawlability across all astrological tools.
 */

export type AppTabType = 'generator' | 'builder' | 'gemstones' | 'match' | 'numerology' | 'legal';
export type LegalDocType = 'privacy' | 'terms' | 'disclaimer' | 'contact';

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
  category: 'Astrological Tools' | 'Kundli Calculations' | 'Policies & Legal';
  lastmod: string;
}

export const CANONICAL_BASE_URL = 'https://www.astronava.com';

/**
 * Standard registry of all indexable app views & astrological tools
 */
export const APP_ROUTES: AppViewRoute[] = [
  {
    id: 'kundli-maker',
    tab: 'generator',
    path: '/',
    aliases: ['/generator', '/kundli'],
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
    priority: 1.0,
    changefreq: 'daily',
    category: 'Astrological Tools',
    lastmod: '2026-09-14',
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
    category: 'Astrological Tools',
    lastmod: '2026-09-14',
  },
  {
    id: 'gemstone-recommender',
    tab: 'gemstones',
    path: '/gemstones',
    aliases: ['/ratna', '/gemstone-calculator'],
    title: 'Vedic Ratna Calculator & Remedies | Gemstone Recommender | astronava.com',
    shortTitle: 'Gemstone Recommendations',
    description: 'Personalized Vedic Gemstone recommendations calculated from Lagna Lord, 5th and 9th Trikona lords. Discover your auspicious Life Stone (Jeevan Ratna), Lucky Stone (Bhagya Ratna), wearing days, metals, mantras, and body weight calibrated Ratti dosage.',
    keywords: [
      'gemstone recommendations',
      'vedic ratna calculator',
      'lagna lord gemstone',
      'jeevan ratna',
      'bhagya ratna',
      'gemstone weight in ratti',
      'vedic remedies',
      'wearing finger and metal'
    ],
    ogType: 'website',
    priority: 0.9,
    changefreq: 'weekly',
    category: 'Astrological Tools',
    lastmod: '2026-09-14',
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
    lastmod: '2026-09-14',
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
    priority: 0.8,
    changefreq: 'weekly',
    category: 'Astrological Tools',
    lastmod: '2026-09-14',
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
    priority: 0.5,
    changefreq: 'monthly',
    category: 'Policies & Legal',
    lastmod: '2026-09-14',
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
    priority: 0.5,
    changefreq: 'monthly',
    category: 'Policies & Legal',
    lastmod: '2026-09-14',
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
    priority: 0.5,
    changefreq: 'monthly',
    category: 'Policies & Legal',
    lastmod: '2026-09-14',
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
    lastmod: '2026-09-14',
  },
];

/**
 * Returns all active app routes with their canonical URLs.
 */
export function getAppSitemapRoutes(baseUrl: string = CANONICAL_BASE_URL): (AppViewRoute & { canonicalUrl: string })[] {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  return APP_ROUTES.map((route) => ({
    ...route,
    canonicalUrl: `${normalizedBase}${route.path === '/' ? '' : route.path}`,
  }));
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
    case 'legal':
      switch (legalDoc) {
        case 'terms':
          return 'Terms & Conditions | astronava.com';
        case 'disclaimer':
          return 'Legal Disclaimer | astronava.com';
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
  baseUrl: string = CANONICAL_BASE_URL,
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

  // 7. JSON-LD SiteNavigationElement for Full Site Indexing
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
