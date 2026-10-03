import React from 'react';
import { Compass, Sparkles, ArrowLeft, ExternalLink, Shield, FileText, AlertCircle } from 'lucide-react';
import { APP_ROUTES, AppTabType, LegalDocType } from '../utils/sitemap';

interface SitemapPageProps {
  onNavigate: (tab: AppTabType, legalDoc?: LegalDocType) => void;
  onBack: () => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate, onBack }) => {
  const tools = APP_ROUTES.filter((r) => r.category === 'Astrological Tools');
  const policies = APP_ROUTES.filter((r) => r.category === 'Policies & Legal');

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-6 py-12 w-full space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold tracking-wide">
              <Compass className="w-3.5 h-3.5" />
              <span>Google Search Console Indexable Sitemap</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-vedic text-stone-950 tracking-tight">
              Astronava Directory &amp; Sitemap
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
              Complete index of all astrological tools, Kundli generators, Vedic calculation calculators, and legal policies on astronava.com.
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Directory Sections */}
        <div className="space-y-8">
          
          {/* Astrological Tools Section */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-xl font-black font-vedic text-amber-950 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <span>Astrological Tools &amp; Calculators</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">Core Vedic calculations, horoscopes, matchmaking, and gemstone recommendations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => onNavigate(tool.tab, tool.legalDoc)}
                  className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-800 font-bold uppercase">{tool.path}</span>
                    <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-amber-800 transition-colors" />
                  </div>
                  <h3 className="font-bold text-stone-900 font-vedic text-base group-hover:text-amber-900 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal & Policies Section */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-xl font-black font-vedic text-amber-950 flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-700" />
                <span>Legal &amp; Policies Directory</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">Privacy policies, terms of service, disclaimers, and customer support.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  onClick={() => onNavigate(policy.tab, policy.legalDoc)}
                  className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-800 font-bold uppercase">{policy.path}</span>
                    <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-amber-800 transition-colors" />
                  </div>
                  <h3 className="font-bold text-stone-900 font-vedic text-base group-hover:text-amber-900 transition-colors">
                    {policy.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {policy.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16 py-8 px-6 text-center text-xs">
        &copy; {new Date().getFullYear()} Astronava. Official Search Engine Index &amp; Sitemap.
      </footer>
    </div>
  );
};
