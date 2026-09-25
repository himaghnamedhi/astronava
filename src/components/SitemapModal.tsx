import React, { useState } from 'react';
import {
  XCircle,
  Compass,
  FileCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  Layers,
  Globe,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  APP_ROUTES,
  CANONICAL_BASE_URL,
  generateClientSitemapXml,
  generateClientSitemapJson,
  downloadSitemapXmlFile,
  AppTabType,
  LegalDocType,
} from '../utils/sitemap';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: AppTabType, legalDoc?: LegalDocType) => void;
}

type ViewMode = 'catalog' | 'xml' | 'json';

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const xmlContent = generateClientSitemapXml(CANONICAL_BASE_URL);
  const jsonContent = generateClientSitemapJson(CANONICAL_BASE_URL);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkClick = (tab: AppTabType, legalDoc?: LegalDocType, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onNavigate(tab, legalDoc);
    onClose();
  };

  const tools = APP_ROUTES.filter((r) => r.category === 'Astrological Tools');
  const policies = APP_ROUTES.filter((r) => r.category === 'Policies & Legal');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-stone-900 text-stone-100 rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-800/40 w-full max-w-4xl my-auto overflow-hidden flex flex-col max-h-[92vh] min-w-0 box-border">
        {/* HEADER */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-stone-950 via-amber-950 to-stone-950 border-b border-amber-800/40 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-100 font-vedic">
                  Site Index &amp; Astrological Directory
                </h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {APP_ROUTES.length} Routes
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Client-side sitemap representation for search engine indexing &amp; tool discovery
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sitemap Modal"
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* TABS CONTROLLER */}
        <div className="px-5 sm:px-6 py-2.5 bg-stone-950 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setViewMode('catalog')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'catalog'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tool Directory</span>
            </button>
            <button
              onClick={() => setViewMode('xml')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'xml'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Sitemap.xml</span>
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'json'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>JSON-LD Representation</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(viewMode === 'xml' ? xmlContent : jsonContent)}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy current view to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={() => downloadSitemapXmlFile(CANONICAL_BASE_URL)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Download standard sitemap.xml file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download XML</span>
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {viewMode === 'catalog' && (
            <div className="space-y-6">
              {/* Category 1: Astrological Tools */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 font-vedic">
                    Vedic Astrological Tools &amp; Calculators
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {tools.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleLinkClick(item.tab, item.legalDoc)}
                      className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-900/90 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-stone-100 group-hover:text-amber-300 transition-colors font-vedic">
                            {item.shortTitle}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-800 text-amber-400 border border-stone-700">
                            {item.path}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
                        <span className="flex items-center gap-1 font-mono text-[10px] text-stone-400">
                          <Calendar className="w-3 h-3 text-stone-500" />
                          Priority: {item.priority.toFixed(1)} • {item.changefreq}
                        </span>
                        <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium">
                          Open Tool <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 2: Legal & Policies */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 font-vedic">
                    Official Policies, Terms &amp; Inquiries
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {policies.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleLinkClick(item.tab, item.legalDoc)}
                      className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/40 hover:bg-stone-900 transition-all cursor-pointer group space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-200 group-hover:text-amber-300 font-vedic">
                          {item.shortTitle}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500">
                          {item.path}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bot & Crawler Advisory Notice */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-amber-100 block">Search Crawler &amp; Bot Friendly:</strong>
                  All astrological tools and legal routes are synchronized with canonical URLs, responsive meta tags, Open Graph cards, and Schema.org JSON-LD navigation elements.
                </div>
              </div>
            </div>
          )}

          {viewMode === 'xml' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>sitemap.xml (RFC-compliant standard XML)</span>
                <span>{xmlContent.split('\n').length} lines</span>
              </div>
              <pre className="p-4 rounded-2xl bg-stone-950 border border-stone-800 font-mono text-[11px] text-amber-200/90 overflow-x-auto max-h-[55vh] leading-relaxed select-all">
                {xmlContent}
              </pre>
            </div>
          )}

          {viewMode === 'json' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>Schema.org JSON Representation</span>
                <span>{jsonContent.split('\n').length} lines</span>
              </div>
              <pre className="p-4 rounded-2xl bg-stone-950 border border-stone-800 font-mono text-[11px] text-stone-300 overflow-x-auto max-h-[55vh] leading-relaxed select-all">
                {jsonContent}
              </pre>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-5 sm:px-6 py-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <span className="font-mono text-[11px] text-stone-500">
            Canonical Host: {CANONICAL_BASE_URL}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
