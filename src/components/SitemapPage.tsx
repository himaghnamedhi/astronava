import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Shield,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Search,
  Download,
  FileCode,
  Globe,
  Layers,
  ChevronDown,
  ChevronUp,
  Store,
  BookOpen,
  Calendar,
  User,
  Info,
  RefreshCw,
  HelpCircle,
  Sun,
  Moon,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  APP_ROUTES,
  ASTROLOGICAL_REPORT_TYPES,
  AppTabType,
  LegalDocType,
  SitemapCategoryType,
  getCanonicalBaseUrl,
  generateClientSitemapXml,
  generateClientSitemapJson,
  downloadSitemapXmlFile,
  pingSearchEngines,
} from '../utils/sitemap';

interface SitemapPageProps {
  onNavigate: (tab: AppTabType, legalDoc?: LegalDocType) => void;
  onBack: () => void;
}

type ActiveViewTab = 'directory' | 'xml' | 'json';

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate, onBack }) => {
  const [activeViewTab, setActiveViewTab] = useState<ActiveViewTab>('directory');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showConsoleGuide, setShowConsoleGuide] = useState<boolean>(true);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [pingSuccess, setPingSuccess] = useState<boolean>(false);
  const [showWebmasterTools, setShowWebmasterTools] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true' || params.get('webmaster') === 'true' || params.get('gsc') === 'true';
    }
    return false;
  });

  const baseUrl = getCanonicalBaseUrl();
  const sitemapXmlUrl = `${baseUrl}/sitemap.xml`;
  const robotsTxtUrl = `${baseUrl}/robots.txt`;

  // Categories list
  const categories: { key: string; label: string; count: number; icon: React.ReactNode }[] = useMemo(() => {
    const counts: Record<string, number> = {};
    APP_ROUTES.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });

    return [
      { key: 'all', label: 'All Pages', count: APP_ROUTES.length, icon: <Layers className="w-4 h-4" /> },
      { key: 'Astrological Tools', label: 'Astrological Tools', count: counts['Astrological Tools'] || 0, icon: <Sparkles className="w-4 h-4" /> },
      { key: 'Kundli Calculations', label: 'Kundli & Patrika', count: counts['Kundli Calculations'] || 0, icon: <Compass className="w-4 h-4" /> },
      { key: 'Horoscope & Panchang', label: 'Horoscope & Panchang', count: counts['Horoscope & Panchang'] || 0, icon: <Sun className="w-4 h-4" /> },
      { key: 'Sacred Store & Items', label: 'Sacred Store', count: counts['Sacred Store & Items'] || 0, icon: <Store className="w-4 h-4" /> },
      { key: 'Astrology Reports', label: 'Reports & Forecasts', count: counts['Astrology Reports'] || 0, icon: <FileText className="w-4 h-4" /> },
      { key: 'User Services', label: 'Member Services', count: counts['User Services'] || 0, icon: <User className="w-4 h-4" /> },
      { key: 'Policies & Legal', label: 'Policies & Legal', count: counts['Policies & Legal'] || 0, icon: <Shield className="w-4 h-4" /> },
    ];
  }, []);

  // Filtered routes based on search and category
  const filteredRoutes = useMemo(() => {
    return APP_ROUTES.filter((route) => {
      const matchesCategory = selectedCategory === 'all' || route.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        route.title.toLowerCase().includes(q) ||
        route.shortTitle.toLowerCase().includes(q) ||
        route.path.toLowerCase().includes(q) ||
        route.description.toLowerCase().includes(q) ||
        route.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(label);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handlePing = async () => {
    setIsPinging(true);
    try {
      await pingSearchEngines(baseUrl);
      setPingSuccess(true);
      setTimeout(() => setPingSuccess(false), 4000);
    } catch {
      // ignore
    } finally {
      setIsPinging(false);
    }
  };

  const handleRouteClick = (
    e: React.MouseEvent,
    tab: AppTabType,
    legalDoc?: LegalDocType,
    path?: string
  ) => {
    e.preventDefault();
    if (path && (path.includes('?') || path.includes('#'))) {
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', path);
      }
    }
    onNavigate(tab, legalDoc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const xmlContent = useMemo(() => generateClientSitemapXml(baseUrl), [baseUrl]);
  const jsonContent = useMemo(() => generateClientSitemapJson(baseUrl), [baseUrl]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between selection:bg-amber-200 selection:text-amber-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 sm:space-y-10">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
            <button
              onClick={onBack}
              className="hover:text-amber-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Astronava Home</span>
            </button>
            <span>/</span>
            <span className="text-amber-900 font-bold">Sitemap Directory</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyText(sitemapXmlUrl, 'xml-url')}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Copy Sitemap XML URL for Google Search Console"
            >
              {copiedUrl === 'xml-url' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied XML URL!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-700" />
                  <span>Copy Sitemap URL</span>
                </>
              )}
            </button>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Open sitemap.xml</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950 text-white p-6 sm:p-10 border border-amber-900/40 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Vedic Directory &amp; Navigation Index</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-vedic text-stone-100 tracking-tight leading-tight">
              Astronava Directory &amp; Sitemap
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Complete index of all authentic Vedic astrology tools, Janam Kundli charts, personalized horoscopes, certified sacred gemstones, and legal policies on <span className="font-semibold text-amber-300">astronava.com</span>.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-stone-800">
              <div className="bg-stone-900/80 rounded-2xl p-3 border border-stone-800">
                <span className="text-[11px] text-stone-400 block">Total Vedic Pages</span>
                <span className="text-xl font-black font-mono text-amber-400">{APP_ROUTES.length} Routes</span>
              </div>
              <div className="bg-stone-900/80 rounded-2xl p-3 border border-stone-800">
                <span className="text-[11px] text-stone-400 block">Astrological Modules</span>
                <span className="text-xs font-bold text-stone-200 mt-1 block">7 Core Categories</span>
              </div>
              <div className="bg-stone-900/80 rounded-2xl p-3 border border-stone-800">
                <span className="text-[11px] text-stone-400 block">XML Sitemaps</span>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1 mt-1">
                  <span>/sitemap.xml</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="bg-stone-900/80 rounded-2xl p-3 border border-stone-800">
                <span className="text-[11px] text-stone-400 block">Robots Directives</span>
                <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 mt-1">
                  <span>/robots.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* GOOGLE SEARCH CONSOLE ASSISTANT CARD (Hidden from normal users; shown only if webmaster tools enabled) */}
        {showWebmasterTools && (
          <div className="bg-white rounded-3xl border border-amber-200/80 p-5 sm:p-7 shadow-sm space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-vedic text-stone-950 flex items-center gap-2">
                    <span>Google Search Console Integration</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">Live</span>
                  </h2>
                  <p className="text-xs text-stone-600">
                    Submit this URL directly in Google Search Console under <strong className="text-stone-800">Indexing &gt; Sitemaps</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setShowConsoleGuide(!showConsoleGuide)}
                  className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>{showConsoleGuide ? 'Hide Instructions' : 'Show Instructions'}</span>
                  {showConsoleGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowWebmasterTools(false)}
                  className="text-xs font-medium text-stone-400 hover:text-stone-600 px-2 py-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Close webmaster assistant"
                >
                  Hide
                </button>
              </div>
            </div>

            {/* Sitemap URL Input Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#FAF8F5] p-2.5 rounded-2xl border border-stone-200">
              <div className="flex-1 px-3 py-1 font-mono text-xs text-stone-800 break-all select-all font-semibold flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-800 shrink-0" />
                <span>{sitemapXmlUrl}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyText(sitemapXmlUrl, 'main-url')}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedUrl === 'main-url' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePing}
                  disabled={isPinging}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Ping Google and Bing with updated sitemap"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-amber-800' : ''}`} />
                  <span>{pingSuccess ? 'Engines Notified!' : 'Ping Search Engines'}</span>
                </button>
              </div>
            </div>

            {/* Collapsible Step-by-Step Instructions */}
            {showConsoleGuide && (
              <div className="pt-2 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-stone-600">
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 font-vedic">
                    <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[10px] inline-flex items-center justify-center">1</span>
                    <span>Open Console</span>
                  </span>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Visit <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-amber-800 font-semibold underline">Google Search Console</a> and select your verified property.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 font-vedic">
                    <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[10px] inline-flex items-center justify-center">2</span>
                    <span>Navigate Sitemaps</span>
                  </span>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    On the left navigation menu, click <strong className="text-stone-800">Sitemaps</strong> under the Index section.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 font-vedic">
                    <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[10px] inline-flex items-center justify-center">3</span>
                    <span>Enter Path</span>
                  </span>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Under &ldquo;Add a new sitemap&rdquo;, type <code className="bg-stone-200 px-1 py-0.5 rounded font-mono text-amber-900">sitemap.xml</code> and click <strong className="text-stone-800">Submit</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 font-vedic">
                    <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[10px] inline-flex items-center justify-center">4</span>
                    <span>Confirm Status</span>
                  </span>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Googlebot will crawl and report &ldquo;Success&rdquo; with all discovered pages and rich snippet metadata.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE TOGGLE (Directory vs XML vs JSON-LD) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-1.5 bg-stone-200/70 p-1.5 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveViewTab('directory')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewTab === 'directory'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Visual Directory</span>
            </button>
            <button
              onClick={() => setActiveViewTab('xml')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewTab === 'xml'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>XML Feed</span>
            </button>
            <button
              onClick={() => setActiveViewTab('json')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewTab === 'json'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>JSON-LD Schema</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadSitemapXmlFile(baseUrl)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-800" />
              <span>Download sitemap.xml</span>
            </button>
          </div>
        </div>

        {/* TAB 1: VISUAL DIRECTORY */}
        {activeViewTab === 'directory' && (
          <div className="space-y-6">
            
            {/* Search & Filter Header */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter pages, tools, calculators, keywords..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="text-xs text-stone-500 font-medium">
                Showing <strong className="text-stone-900 font-bold">{filteredRoutes.length}</strong> of {APP_ROUTES.length} indexable pages
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isSelected ? 'bg-amber-900 text-amber-200' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Routes Grid */}
            {filteredRoutes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
                <Search className="w-8 h-8 text-stone-300 mx-auto" />
                <h3 className="font-bold text-stone-800 font-vedic text-base">No matching pages found</h3>
                <p className="text-xs text-stone-500">
                  Try searching with different terms like &ldquo;Kundli&rdquo;, &ldquo;Horoscope&rdquo;, &ldquo;Gemstones&rdquo;, or reset the category filter.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRoutes.map((route) => {
                  const canonicalPath = `${baseUrl}${route.path === '/' ? '' : route.path}`;
                  return (
                    <div
                      key={route.id}
                      className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group space-y-3"
                    >
                      <div className="space-y-2">
                        {/* Badges Bar */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60 flex items-center gap-1">
                            <span>{route.path}</span>
                          </span>

                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-500">
                            <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                              Priority {route.priority.toFixed(1)}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold uppercase">
                              {route.changefreq}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-stone-950 font-vedic text-base group-hover:text-amber-900 transition-colors">
                          <a
                            href={route.path}
                            onClick={(e) => handleRouteClick(e, route.tab, route.legalDoc, route.path)}
                            className="hover:underline flex items-start justify-between gap-2"
                          >
                            <span>{route.title}</span>
                          </a>
                        </h3>

                        {/* Meta Description */}
                        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                          {route.description}
                        </p>

                        {/* Keyword Tags */}
                        {route.keywords && route.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {route.keywords.slice(0, 4).map((kw, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Canonical link & Action */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                        <span className="text-[10px] font-mono text-stone-400 truncate max-w-[200px]" title={canonicalPath}>
                          {canonicalPath}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyText(canonicalPath, route.id)}
                            className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                            title="Copy Canonical URL"
                          >
                            {copiedUrl === route.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={route.path}
                            onClick={(e) => handleRouteClick(e, route.tab, route.legalDoc, route.path)}
                            className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                          >
                            <span>Navigate</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Astrological Deep Insights & Dynamic Report Endpoints */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4 mt-8">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold font-vedic text-amber-950 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-800" />
                    <span>Astrological Report &amp; Calculation Endpoints</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Specialized computational sub-modules indexed in the XML sitemap for search crawlers.
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-900 font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
                  {ASTROLOGICAL_REPORT_TYPES.length} Endpoints
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {ASTROLOGICAL_REPORT_TYPES.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 hover:border-amber-300 transition-all space-y-1.5"
                  >
                    <span className="text-[10px] font-mono text-amber-900 font-bold block">{rep.path}</span>
                    <h4 className="text-xs font-bold text-stone-900 font-vedic">{rep.title}</h4>
                    <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">{rep.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: RAW XML FEED */}
        {activeViewTab === 'xml' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-bold font-vedic text-stone-950 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-800" />
                  <span>Standard RFC Sitemap XML</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Served natively at <a href="/sitemap.xml" target="_blank" className="text-amber-800 font-mono underline">/sitemap.xml</a> with XML schema definitions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyText(xmlContent, 'xml-raw')}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedUrl === 'xml-raw' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl === 'xml-raw' ? 'Copied XML!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => downloadSitemapXmlFile(baseUrl)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .xml</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-stone-950 font-mono text-[11px] text-amber-200/95 overflow-x-auto max-h-[60vh] leading-relaxed select-all">
              {xmlContent}
            </pre>
          </div>
        )}

        {/* TAB 3: JSON-LD SCHEMA */}
        {activeViewTab === 'json' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-bold font-vedic text-stone-950 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-800" />
                  <span>Schema.org JSON-LD Structured Navigation Data</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Used by Google search engines for rich search snippets and site breadcrumbs.
                </p>
              </div>

              <button
                onClick={() => handleCopyText(jsonContent, 'json-raw')}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedUrl === 'json-raw' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl === 'json-raw' ? 'Copied JSON!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-stone-950 font-mono text-[11px] text-stone-300 overflow-x-auto max-h-[60vh] leading-relaxed select-all">
              {jsonContent}
            </pre>
          </div>
        )}

        {/* CRAWLER DIRECTIVES & ROBOTS NOTICE */}
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-900/5 border border-amber-200 text-xs text-stone-700 leading-relaxed flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950 font-vedic text-sm">
              Standard Compliant Navigation &amp; Search Indexing
            </h4>
            <p>
              Astronava delivers server-side compliant <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950">/sitemap.xml</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950">/robots.txt</code> endpoints. All dynamic routes include canonical tags, mobile responsive meta tags, OpenGraph share banners, and Schema.org ItemList site navigation elements.
            </p>
          </div>
        </div>

      </div>

      {/* SITEMAP FOOTER */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 mt-16 py-8 px-6 text-center text-xs space-y-2">
        <p>
          &copy; {new Date().getFullYear()} <strong className="text-white">Astronava</strong>. Vedic Astrological Directory &amp; Sitemaps.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-400">
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
            sitemap.xml
          </a>
          <span>•</span>
          <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
            robots.txt
          </a>
          <span>•</span>
          <a href="/privacy-policy" onClick={(e) => handleRouteClick(e, 'legal', 'privacy')} className="hover:text-amber-400 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="/terms-and-conditions" onClick={(e) => handleRouteClick(e, 'legal', 'terms')} className="hover:text-amber-400 transition-colors">
            Terms of Service
          </a>
          <span>•</span>
          <button
            onClick={() => {
              setShowWebmasterTools((prev) => !prev);
              if (!showWebmasterTools) {
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }
            }}
            className="hover:text-amber-400 text-stone-500 transition-colors cursor-pointer"
          >
            {showWebmasterTools ? 'Hide SEO Console' : 'Webmaster Tools'}
          </button>
        </div>
      </footer>
    </div>
  );
};
