import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { HouseNumber, PlanetId, ChartStyle } from './types/astrology';
import { Header } from './components/Header';
import { KundliBuilder } from './components/KundliBuilder';
import { KundliGenerator } from './components/KundliGenerator';
import { GemstoneRecommender } from './components/GemstoneRecommender';
import { MatchFinder } from './components/MatchFinder';
import { SearchModal } from './components/SearchModal';
import { CustomReportModal } from './components/CustomReportModal';
import { LegalModal } from './components/LegalModal';
import { LegalPage } from './components/LegalPage';
import { LegalDocType } from './data/legalPolicies';
import { CompleteKundliData } from './data/vedicEphemeris';
import { Sparkles, ArrowUp, Shield, FileText, AlertCircle, Mail, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'builder' | 'gemstones' | 'match' | 'legal'>('generator');
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
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<LegalDocType>('privacy');
  const [reportType, setReportType] = useState<'kundli' | 'match' | 'gemstone'>('kundli');
  const [reportMatchData, setReportMatchData] = useState<{ report?: any; p1?: any; p2?: any }>({});
  const [reportGemstoneData, setReportGemstoneData] = useState<{ lagna?: number; profile?: any; name?: string }>({});
  const [reportKundliData, setReportKundliData] = useState<CompleteKundliData | null>(null);

  const handleOpenLegal = (doc: LegalDocType) => {
    setSelectedLegalDoc(doc);
    setActiveTab('legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        chartStyle={chartStyle}
        setChartStyle={setChartStyle}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Dynamic Content Views based on activeTab */}
        {activeTab === 'generator' && (
          <KundliGenerator
            onOpenReportModal={(kData) => handleOpenReport('kundli', kData)}
            onKundliGenerated={(kData) => setReportKundliData(kData)}
            onApplyPlacementsToBuilder={(placements) => {
              setCustomPlacements(placements);
              setActiveTab('builder');
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
                setActiveTab(tab);
              }
            }}
            onOpenCustomReport={(data) => handleOpenReport('gemstone', data)}
          />
        )}

        {activeTab === 'match' && (
          <MatchFinder
            onNavigateToTab={(tab) => {
              if (tab === 'generator' || tab === 'builder' || tab === 'gemstones' || tab === 'match') {
                setActiveTab(tab);
              }
            }}
            onOpenCustomReport={(data) => handleOpenReport('match', data)}
          />
        )}

        {activeTab === 'legal' && (
          <LegalPage
            activeDoc={selectedLegalDoc}
            onSelectDoc={(doc) => setSelectedLegalDoc(doc)}
            onBack={() => {
              setActiveTab('generator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Col 1: About */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
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
                      setActiveTab('generator');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">1.</span>
                    <span>Kundali Maker &amp; Janam Patrika</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('builder');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">2.</span>
                    <span>Kundli Reader &amp; Planetary Builder</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('gemstones');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">3.</span>
                    <span>Find Gemstone You Need</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('match');
                      scrollToTop();
                    }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">4.</span>
                    <span>Match Finder (Kundali Milan)</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Policies */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">Legal &amp; Policies</h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button
                    onClick={() => handleOpenLegal('privacy')}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Privacy Policy</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenLegal('terms')}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Terms &amp; Conditions</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenLegal('disclaimer')}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Disclaimer</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact Us */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">
                <button
                  id="footer-contact-us-heading-btn"
                  onClick={() => handleOpenLegal('contact')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </h4>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-stone-800 flex flex-col items-center justify-center text-xs text-stone-400 gap-6 relative">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-stone-400">
              <button
                onClick={() => handleOpenLegal('privacy')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>&bull;</span>
              <button
                onClick={() => handleOpenLegal('terms')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Terms &amp; Conditions
              </button>
              <span>&bull;</span>
              <button
                onClick={() => handleOpenLegal('disclaimer')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Disclaimer
              </button>
              <span>&bull;</span>
              <button
                onClick={() => handleOpenLegal('contact')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Contact Us
              </button>
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

            <div className="mt-2 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 flex justify-center">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5" />
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
          if (tab === 'generator' || tab === 'builder' || tab === 'gemstones' || tab === 'match') {
            setActiveTab(tab);
          }
        }}
        onSelectHouse={(h) => {
          setSelectedHouse(h);
          setActiveTab('builder');
        }}
        onSelectPlanet={(p) => {
          setSelectedPlanet(p);
          setActiveTab('builder');
        }}
      />

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

      {/* Vercel Web Analytics */}
      <Analytics />

    </div>
  );
}
