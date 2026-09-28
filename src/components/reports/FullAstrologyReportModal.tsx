import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Compass, 
  Award, 
  ShieldCheck, 
  Heart, 
  TrendingUp, 
  BookOpen, 
  Layers, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Sliders, 
  Search, 
  Copy, 
  Check, 
  FileText, 
  Loader2, 
  Info, 
  Zap, 
  Activity, 
  Plane, 
  Users, 
  Briefcase, 
  DollarSign, 
  GraduationCap, 
  Sparkle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { CompleteKundliData } from '../../data/vedicEphemeris';
import { 
  generateFullAstrologyReport, 
  FullAstrologyReportData, 
  HouseAnalysisReport, 
  PlanetAnalysisReport,
  MultiYearForecastPeriod,
  DomainForecastItem
} from '../../data/fullAstrologyReportEngine';
import { VedicOrnamentalBorder } from './VedicOrnamentalBorder';

interface FullAstrologyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kundliData: CompleteKundliData;
  initialYears?: 1 | 2 | 3 | 5;
  initialFocusedSection?: string;
}

export const FullAstrologyReportModal: React.FC<FullAstrologyReportModalProps> = ({
  isOpen,
  onClose,
  kundliData,
  initialYears = 3,
  initialFocusedSection = 'sec-1-summary',
}) => {
  const safeInitialYears: 1 | 2 | 3 | 5 = (initialYears === 1 || initialYears === 2 || initialYears === 3 || initialYears === 5) ? initialYears : 3;
  const [forecastYears, setForecastYears] = useState<1 | 2 | 3 | 5>(safeInitialYears);
  const [activeSectionTab, setActiveSectionTab] = useState<string>(initialFocusedSection);
  const [report, setReport] = useState<FullAstrologyReportData>(() => 
    generateFullAstrologyReport(kundliData, safeInitialYears)
  );
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTechnical, setExpandedTechnical] = useState<boolean>(false);
  const [expandedHouses, setExpandedHouses] = useState<Record<number, boolean>>({});
  const [selectedForecastIndex, setSelectedForecastIndex] = useState<number>(0);

  const reportContainerRef = useRef<HTMLDivElement>(null);

  // Sync report when forecastYears or kundliData changes
  useEffect(() => {
    const base = generateFullAstrologyReport(kundliData, forecastYears);
    setReport(base);
  }, [kundliData, forecastYears]);

  // Handle optional AI enrichment
  const handleEnhanceWithAi = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/full-astrology-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kundliData, forecastYears }),
      });
      if (res.ok) {
        const enriched = await res.json();
        setReport(enriched);
      }
    } catch (e) {
      console.warn('AI enhancement fallback to baseline:', e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopySummary = () => {
    const summaryText = `ASTROLOGY REPORT: ${report.nativeName}
Ascendant: ${report.ascendantAnalysis.sign} (${report.ascendantAnalysis.exactDegree}) • Moon: ${report.chartOverview.moonSign} • Sun: ${report.chartOverview.sunSign}
Theme: ${report.executiveSummary.headline}
Key Guidance:
${report.executiveSummary.mindsetGuidance.map((g) => `- ${g}`).join('\n')}
Multi-Year Prediction (${report.selectedForecastYears} Years):
${report.multiYearForecast.periods.map((p) => `${p.label}: ${p.overallPeriodTheme}`).join('\n')}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!reportContainerRef.current) return;
    setIsExportingPdf(true);
    try {
      const opt = {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FAF8F5',
      };
      const canvas = await html2canvas(reportContainerRef.current, opt);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let position = 0;
      let heightLeft = pdfHeight;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${report.nativeName.replace(/\s+/g, '_')}_Full_Astrology_Report.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const toggleHouseExpand = (hNum: number) => {
    setExpandedHouses((prev) => ({
      ...prev,
      [hNum]: !prev[hNum],
    }));
  };

  const scrollToSection = (secId: string) => {
    setActiveSectionTab(secId);
    const element = document.getElementById(secId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const SECTIONS = [
    { id: 'sec-1-summary', label: '1. Executive Summary', icon: Sparkles },
    { id: 'sec-2-overview', label: '2. Chart Overview', icon: Compass },
    { id: 'sec-3-ascendant', label: '3. Ascendant (Lagna)', icon: UserCheckIcon },
    { id: 'sec-4-houses', label: '4. 12 Houses Analysis', icon: Layers },
    { id: 'sec-5-planets', label: '5. All 9 Planets', icon: Sparkle },
    { id: 'sec-6-lords', label: '6. House Lords Matrix', icon: Award },
    { id: 'sec-7-aspects', label: '7. Planetary Aspects', icon: Zap },
    { id: 'sec-8-yogas', label: '8. Auspicious Yogas', icon: ShieldCheck },
    { id: 'sec-9-dasha', label: '9. Vimshottari Dasha', icon: Clock },
    { id: 'sec-10-forecast', label: `10. Multi-Year Forecast (${forecastYears} Yrs)`, icon: TrendingUp },
    { id: 'sec-11-career', label: '11. Career & Purpose', icon: Briefcase },
    { id: 'sec-12-money', label: '12. Wealth & Assets', icon: DollarSign },
    { id: 'sec-13-education', label: '13. Education & Skills', icon: GraduationCap },
    { id: 'sec-14-relationships', label: '14. Relationships & Marriage', icon: Heart },
    { id: 'sec-15-family', label: '15. Family & Heritage', icon: Users },
    { id: 'sec-16-health', label: '16. Health & Wellbeing', icon: Activity },
    { id: 'sec-17-travel', label: '17. Travel & Foreign Horizons', icon: Plane },
    { id: 'sec-18-strengths', label: '18. Strengths & Challenges', icon: Award },
    { id: 'sec-19-manifestations', label: '19. Real-Life Manifestations', icon: BookOpen },
    { id: 'sec-20-technical', label: '20. Technical Calculations', icon: Info },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md overflow-hidden p-0 sm:p-3 md:p-6 animate-fadeIn">
      {/* Modal Window Container */}
      <div className="w-full h-full max-w-7xl max-h-[100vh] sm:max-h-[96vh] bg-[#FAF8F5] rounded-none sm:rounded-3xl shadow-2xl flex flex-col border border-amber-900/20 overflow-hidden">
        
        {/* Top Sticky Header Toolbar */}
        <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-amber-900/15 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2a0e05] text-amber-300 flex items-center justify-center ring-2 ring-amber-500/40 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-amber-950 font-vedic truncate">
                  Full Vedic Astrology Report
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/70 text-amber-950 border border-amber-400/40">
                  {forecastYears}-Year Forecast
                </span>
              </div>
              <p className="text-[11px] text-stone-600 truncate">
                Native: <strong className="text-stone-900 font-semibold">{report.nativeName}</strong> • {report.ascendantAnalysis.sign} Lagna • {report.chartOverview.moonSign} Moon
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Forecast Years Switcher */}
            <div className="hidden md:flex items-center gap-1 bg-stone-200/70 p-1 rounded-xl border border-stone-300/80 text-xs">
              <span className="text-[10px] font-bold text-stone-600 px-1.5">Forecast:</span>
              {([1, 2, 3, 5] as const).map((yr) => (
                <button
                  key={yr}
                  onClick={() => setForecastYears(yr)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    forecastYears === yr
                      ? 'bg-amber-900 text-amber-50 shadow-2xs'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200'
                  }`}
                  title={`Generate ${yr}-Year Multi-Year Forecast`}
                >
                  {yr} {yr === 1 ? 'Yr' : 'Yrs'}
                </button>
              ))}
            </div>

            {/* AI Synthesizer button */}
            <button
              onClick={handleEnhanceWithAi}
              disabled={loadingAi}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              title="Enhance executive summary with AI interpretation"
            >
              {loadingAi ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-200" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span className="hidden sm:inline">AI Synthesis</span>
            </button>

            {/* Copy Summary */}
            <button
              onClick={handleCopySummary}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors cursor-pointer flex items-center gap-1"
              title="Copy Executive Summary to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors cursor-pointer"
              title="Print Full Report"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span>Print</span>
            </button>

            {/* PDF Export */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Download Full Report as PDF"
            >
              {isExportingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Close Report"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Sub-header Navigation: 20-Section Quick Anchor Bar */}
        <div className="bg-stone-100/90 border-b border-stone-200/90 px-3 sm:px-6 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs font-medium">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSectionTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer text-[11px] ${
                  isActive
                    ? 'bg-amber-950 text-amber-100 font-bold shadow-2xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200'
                }`}
              >
                <Icon className="w-3 h-3 text-amber-500 shrink-0" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Report Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 scroll-smooth" ref={reportContainerRef}>
          
          {/* Printable Decorative Header Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#2a0e05] via-[#43180a] to-[#1c0803] text-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-lg">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide uppercase font-vedic">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Comprehensive Classical Vedic Horoscope Dossier</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-50 font-vedic tracking-tight">
                  {report.nativeName}'s Full Astrology Report
                </h1>
                <p className="text-xs sm:text-sm text-amber-200/80 max-w-2xl leading-relaxed">
                  Calculated using high-precision Sidereal Ephemeris &amp; Lahiri Ayanamsha ({report.technicalDetails.ayanamsha}). Interpreted into plain, empowering human language covering all 12 houses, 9 planets, planetary aspects, yogas, and a dynamic {forecastYears}-year forecast.
                </p>
              </div>

              {/* Native Meta Snapshot */}
              <div className="bg-amber-950/70 border border-amber-600/40 rounded-2xl p-4 text-xs space-y-1.5 min-w-[240px] shrink-0 text-amber-100">
                <div className="font-bold text-amber-300 text-sm border-b border-amber-700/50 pb-1 mb-1 font-vedic">
                  Birth Profile Reference
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Date:</span>
                  <span className="font-semibold text-white">{report.birthDateFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Time:</span>
                  <span className="font-semibold text-white">{report.birthTimeFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Place:</span>
                  <span className="font-semibold text-white truncate max-w-[130px]" title={report.birthPlace}>{report.birthPlace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Ascendant (Lagna):</span>
                  <span className="font-semibold text-amber-300">{report.ascendantAnalysis.sign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Moon Sign (Rashi):</span>
                  <span className="font-semibold text-amber-300">{report.chartOverview.moonSign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Active Dasha:</span>
                  <span className="font-semibold text-amber-300">{report.dashaAnalysis.currentMahadasha}-{report.dashaAnalysis.currentAntardasha}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 1: EXECUTIVE SUMMARY */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-1-summary" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    Executive Summary
                  </h3>
                  <p className="text-xs text-stone-500">Concise synthesis of your chart's overarching destiny and psychological makeup.</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                Core Synthesis
              </span>
            </div>

            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 space-y-3">
              <h4 className="text-base font-bold text-amber-950 font-vedic leading-snug">
                {report.executiveSummary.headline}
              </h4>
              <p className="text-stone-700 text-sm leading-relaxed">
                {report.executiveSummary.lifeCoreTheme}
              </p>
              <div className="pt-2 border-t border-amber-200/60 text-xs text-stone-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>Cosmic Weather:</strong> {report.executiveSummary.currentCosmicClimate}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 font-vedic">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
                  <span>Key Life Opportunities</span>
                </h5>
                <ul className="space-y-2 text-xs text-stone-700">
                  {report.executiveSummary.majorOpportunities.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 font-vedic">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Mindset &amp; Operating Guidance</span>
                </h5>
                <ul className="space-y-2 text-xs text-stone-700">
                  {report.executiveSummary.mindsetGuidance.map((guid, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span>{guid}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 2: CHART OVERVIEW */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-2-overview" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    Chart Overview &amp; Elemental Distribution
                  </h3>
                  <p className="text-xs text-stone-500">Structural balance of elemental energies and cardinal action centers.</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed">
              {report.chartOverview.overviewNarrative}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-800">Fire (Agni)</span>
                <div className="text-xl font-extrabold text-red-950">{report.chartOverview.chartElementBalance.fire} Planets</div>
                <p className="text-[10px] text-red-700">Initiative, Courage, Drive</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Earth (Prithvi)</span>
                <div className="text-xl font-extrabold text-amber-950">{report.chartOverview.chartElementBalance.earth} Planets</div>
                <p className="text-[10px] text-amber-700">Practicality, Stability, Assets</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">Air (Vayu)</span>
                <div className="text-xl font-extrabold text-sky-950">{report.chartOverview.chartElementBalance.air} Planets</div>
                <p className="text-[10px] text-sky-700">Intellect, Communication, Ideas</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Water (Jala)</span>
                <div className="text-xl font-extrabold text-blue-950">{report.chartOverview.chartElementBalance.water} Planets</div>
                <p className="text-[10px] text-blue-700">Intuition, Empathy, Depth</p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 3: ASCENDANT (LAGNA) */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-3-ascendant" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    Ascendant (Lagna) &amp; Self-Identity
                  </h3>
                  <p className="text-xs text-stone-500">The gateway of your horoscope: physical presence, persona, and soul orientation.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-900 text-amber-50">
                {report.ascendantAnalysis.sign} ({report.ascendantAnalysis.exactDegree})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 font-vedic">Physical Impression &amp; Aura</span>
                <p className="text-xs text-stone-700 leading-relaxed">{report.ascendantAnalysis.physicalTraitsAndVibe}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 font-vedic">Psychological Temperament</span>
                <p className="text-xs text-stone-700 leading-relaxed">{report.ascendantAnalysis.psychologicalTemperament}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 font-vedic">Life Orientation &amp; Purpose</span>
                <p className="text-xs text-stone-700 leading-relaxed">{report.ascendantAnalysis.lifeOrientation}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-stone-700 space-y-1">
              <strong>Ascendant Lord Placement:</strong> {report.ascendantAnalysis.lord} sits in your {report.ascendantAnalysis.lordPlacedInHouse}th house ({report.ascendantAnalysis.lordPlacedInSign}). This anchors your self-directed vitality directly into the affairs of the {report.ascendantAnalysis.lordPlacedInHouse}th house.
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 4: 12 HOUSES DETAILED ANALYSIS */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-4-houses" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    Detailed 12 Bhavas (Houses) Analysis
                  </h3>
                  <p className="text-xs text-stone-500">Every life house explained in plain language with 3–7 real-life scenarios each.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const allOpen = Object.keys(expandedHouses).length === 12 && Object.values(expandedHouses).every(Boolean);
                  const nextState: Record<number, boolean> = {};
                  for (let i = 1; i <= 12; i++) nextState[i] = !allOpen;
                  setExpandedHouses(nextState);
                }}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer self-start sm:self-auto"
              >
                {Object.keys(expandedHouses).length === 12 && Object.values(expandedHouses).every(Boolean) ? 'Collapse All Houses' : 'Expand All Houses'}
              </button>
            </div>

            <div className="space-y-4">
              {report.houses.map((house) => {
                const isExpanded = expandedHouses[house.houseNumber] !== false; // expanded by default
                return (
                  <div key={house.houseNumber} className="border border-stone-200 rounded-2xl overflow-hidden transition-all bg-stone-50/50">
                    {/* House Header Bar */}
                    <div 
                      onClick={() => toggleHouseExpand(house.houseNumber)}
                      className="p-4 sm:p-5 bg-white hover:bg-stone-50/90 transition-colors flex items-center justify-between cursor-pointer border-b border-stone-100 gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-amber-950 text-amber-200 flex items-center justify-center font-bold text-sm shrink-0">
                          {house.houseNumber}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-bold text-stone-900 font-vedic truncate">
                              {house.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 shrink-0">
                              {house.signName} ({house.signElement})
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 truncate">
                            Ruled by <strong>{house.houseLord.name}</strong> (placed in House {house.houseLord.placedInHouse}) • {house.planetsInHouse.length === 0 ? 'No resident planets' : `Occupants: ${house.planetsInHouse.map((p) => p.name).join(', ')}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* House Expanded Content */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 space-y-5 bg-white">
                        {/* What house represents */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block font-vedic mb-1">
                            Core Domain &amp; Significance
                          </span>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                            {house.whatHouseRepresents}
                          </p>
                        </div>

                        {/* Resident Planets & Meanings */}
                        {house.planetsInHouse.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block font-vedic">
                              Planets In This House &amp; What They Mean
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {house.planetsInHouse.map((p) => (
                                <div key={p.planetId} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                                  <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                                    <span>{p.name} ({p.sanskritName})</span>
                                    <span className="text-[10px] px-2 py-0.2 rounded bg-amber-200/60 text-amber-900 font-semibold">{p.dignity}</span>
                                  </div>
                                  <p className="text-xs text-stone-700 leading-relaxed">
                                    {p.plainEnglishMeaning}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* House Lord Connection (Normal Language + Technical Basis) */}
                        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 font-vedic">
                              House Lord Connection
                            </span>
                            <span className="text-[10px] font-mono bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                              Technical: {house.houseLord.technicalCode}
                            </span>
                          </div>
                          <p className="text-xs text-stone-700 leading-relaxed">
                            {house.houseLord.plainEnglishConnection}
                          </p>
                        </div>

                        {/* Real-Life Scenarios (3 to 7 Possibilities) */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1 font-vedic">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>What Could This Look Like In Real Life? (Practical Scenarios)</span>
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {house.realLifeScenarios.map((scen, idx) => (
                              <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60 text-xs text-stone-800 flex items-start gap-2">
                                <span className="font-bold text-emerald-700 shrink-0">{idx + 1}.</span>
                                <span>{scen}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Positive Manifestations & Challenges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block font-vedic">
                              Positive Potential
                            </span>
                            <ul className="space-y-1 text-xs text-stone-700">
                              {house.possiblePositiveManifestations.map((m, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-amber-600 font-bold">•</span>
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 block font-vedic">
                              Vulnerabilities &amp; Challenges
                            </span>
                            <ul className="space-y-1 text-xs text-stone-700">
                              {house.possibleChallenges.map((c, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-rose-600 font-bold">•</span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 5: ALL 9 PLANETS DETAILED */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-5-planets" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    All 9 Planets (Navagrahas) Detailed Profiles
                  </h3>
                  <p className="text-xs text-stone-500">Every planet's house, sign, nakshatra, lordship, strength, and behavioral manifestation.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.planets.map((planet) => (
                <div key={planet.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-white hover:border-amber-300 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{planet.avatar}</span>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 font-vedic">
                          {planet.name} ({planet.sanskritName})
                        </h4>
                        <span className="text-[10px] text-stone-500">
                          {planet.signName} {planet.degrees}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950">
                      House {planet.house}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {planet.plainEnglishInterpretation}
                  </p>

                  <div className="text-[10px] text-stone-500 space-y-1 border-t border-stone-200/60 pt-2 font-mono">
                    <div><strong>Nakshatra:</strong> {planet.nakshatra} (Pada {planet.nakshatraPada})</div>
                    <div><strong>Dignity:</strong> {planet.dignity} ({planet.avastha})</div>
                    <div><strong>Rules Houses:</strong> {planet.housesRuled.join(', ') || 'None'}</div>
                    {planet.aspectsCastToHouses.length > 0 && (
                      <div><strong>Aspects Houses:</strong> {planet.aspectsCastToHouses.join(', ')}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 6: HOUSE LORDS MATRIX */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-6-lords" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  6
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    House Lords (Bhava Adhipati) Synthesis
                  </h3>
                  <p className="text-xs text-stone-500">How each life department links to other houses through its planetary ruler.</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-100 text-stone-700 uppercase font-semibold text-[10px]">
                    <th className="py-2.5 px-3">House</th>
                    <th className="py-2.5 px-3">Governing Lord</th>
                    <th className="py-2.5 px-3">Placed In</th>
                    <th className="py-2.5 px-3">Technical Formula</th>
                    <th className="py-2.5 px-3">Everyday Life Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {report.houseLordsMatrix.map((item) => (
                    <tr key={item.houseNumber} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-stone-900">
                        {item.houseNumber}th House
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-amber-950">
                        {item.lord}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-stone-800">
                        {item.placedInHouse}th House ({item.placedInSign})
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600">
                        {item.technicalCode}
                      </td>
                      <td className="py-2.5 px-3 text-stone-700 text-xs">
                        {item.normalLanguageSummary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 7: ASPECTS (DRISHTI) */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-7-aspects" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  7
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    Planetary Aspects (Vedic Drishti)
                  </h3>
                  <p className="text-xs text-stone-500">Planets radiating their energy across the chart into other houses and grahas.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {report.aspectsBreakdown.map((asp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-900 text-xs font-vedic border-b border-stone-200 pb-1">
                    {asp.planet}
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1">
                    {asp.aspectsHouses.map((h, i) => (
                      <li key={i} className="flex justify-between">
                        <span>Aspects {h.house}th ({h.houseName})</span>
                        <span className="text-[10px] text-stone-500">{h.type}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-stone-600 border-t border-stone-200/60 pt-1">
                    {asp.practicalImpact}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 8: YOGAS */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-8-yogas" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  8
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    Auspicious Yogas &amp; Special Combinations
                  </h3>
                  <p className="text-xs text-stone-500">Classical planetary combinations that elevate success, intellect, or spiritual capacity.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.yogas.map((yoga, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-amber-950 font-vedic">
                      {yoga.name} ({yoga.sanskritName})
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                      {yoga.type}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {yoga.description}
                  </p>
                  <p className="text-xs font-semibold text-amber-900 border-t border-amber-200/60 pt-1">
                    {yoga.realLifeImpact}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 9: DASHA ANALYSIS */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-9-dasha" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  9
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    Vimshottari Dasha Operating Cycle
                  </h3>
                  <p className="text-xs text-stone-500">Your current planetary era and time-based karmic unfoldment.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-stone-900">Active Planetary Period:</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-900 text-amber-50 font-bold">
                  {report.dashaAnalysis.currentMahadasha} Mahadasha
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 font-bold">
                  {report.dashaAnalysis.currentAntardasha} Antardasha
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-800 font-medium">
                  Pratyantar: {report.dashaAnalysis.currentPratyantardasha}
                </span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed pt-1">
                {report.dashaAnalysis.dashaNarrative}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {report.dashaAnalysis.upcomingMilestones.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1 text-center">
                  <span className="text-[10px] font-bold text-stone-500">{m.period}</span>
                  <div className="text-xs font-bold text-amber-950 font-vedic">{m.planetCombo}</div>
                  <p className="text-[10px] text-stone-600 line-clamp-2">{m.theme}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 10: MULTI-YEAR PREDICTION (1/2/3/5 YEARS) */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-10-forecast" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  10
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                    <span>Multi-Year Prediction &amp; Timeline Forecast</span>
                    <span className="text-xs font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-sans">
                      {forecastYears}-Year Scope
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500">Possibility-based forecast combining Dasha activations with Jupiter, Saturn, and Rahu/Ketu transits.</p>
                </div>
              </div>

              {/* Forecast selector buttons */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs self-start sm:self-auto">
                {([1, 2, 3, 5] as const).map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setForecastYears(yr)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      forecastYears === yr
                        ? 'bg-amber-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {yr} {yr === 1 ? 'Year' : 'Years'}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
              <strong>Vedic Astrological Principle:</strong> {report.multiYearForecast.introOverview} All predictions are phrased using constructive, possibility-based language (e.g. <em>"may", "could indicate", "potential for"</em>) to empower free will and proactive preparedness.
            </p>

            {/* Forecast Periods Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
              {report.multiYearForecast.periods.map((period, idx) => (
                <button
                  key={period.periodId}
                  onClick={() => setSelectedForecastIndex(idx)}
                  className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer text-xs ${
                    selectedForecastIndex === idx
                      ? 'bg-amber-950 text-amber-100 shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {period.label.split('•')[0]}
                </button>
              ))}
            </div>

            {/* Active Period Card */}
            {report.multiYearForecast.periods[selectedForecastIndex] && (
              <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-amber-950 font-vedic">
                      {report.multiYearForecast.periods[selectedForecastIndex].label}
                    </h4>
                    <span className="text-xs text-stone-500">
                      Timeline: {report.multiYearForecast.periods[selectedForecastIndex].startDate} to {report.multiYearForecast.periods[selectedForecastIndex].endDate} • {report.multiYearForecast.periods[selectedForecastIndex].activePlanetaryThemes}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-200/70 text-amber-950 self-start md:self-auto">
                    {report.multiYearForecast.periods[selectedForecastIndex].overallPeriodTheme.split('.')[0]}
                  </span>
                </div>

                {/* 8 Life Domains for this Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.entries(report.multiYearForecast.periods[selectedForecastIndex].domains) as [string, DomainForecastItem][]).map(([key, domainItem]) => (
                    <div key={key} className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5 font-vedic">
                          <span>{domainItem.domain}</span>
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                          {domainItem.intensity}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-amber-900">
                        {domainItem.theme}
                      </div>
                      <ul className="space-y-1 text-xs text-stone-700">
                        {domainItem.possibleManifestations.map((man, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{man}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-100 flex justify-between">
                        <span><strong>Timing:</strong> {domainItem.timingWindow}</span>
                        <span className="truncate max-w-[160px]" title={domainItem.whyAstrologicalBasis}><strong>Basis:</strong> {domainItem.whyAstrologicalBasis}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTIONS 11 - 17: LIFE DOMAIN SYNTHESES */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 11. Career */}
            <section id="sec-11-career" className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <Briefcase className="w-4 h-4 text-amber-700" />
                <h3 className="text-base font-bold text-stone-900 font-vedic">11. Career &amp; Professional Path</h3>
              </div>
              <div className="text-xs font-bold text-amber-950">{report.lifeDomains.career.headline}</div>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {report.lifeDomains.career.possiblePaths.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-600 pt-1 border-t border-stone-100">{report.lifeDomains.career.longTermOutlook}</p>
            </section>

            {/* 12. Money */}
            <section id="sec-12-money" className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <DollarSign className="w-4 h-4 text-amber-700" />
                <h3 className="text-base font-bold text-stone-900 font-vedic">12. Money &amp; Wealth Potential</h3>
              </div>
              <div className="text-xs font-bold text-amber-950">{report.lifeDomains.money.headline}</div>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {report.lifeDomains.money.accumulationPatterns.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-600 pt-1 border-t border-stone-100">{report.lifeDomains.money.financialWisdom}</p>
            </section>

            {/* 13. Education */}
            <section id="sec-13-education" className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <GraduationCap className="w-4 h-4 text-amber-700" />
                <h3 className="text-base font-bold text-stone-900 font-vedic">13. Education &amp; Skills</h3>
              </div>
              <div className="text-xs font-bold text-amber-950">{report.lifeDomains.education.headline}</div>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {report.lifeDomains.education.intellectualStrengths.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-600 pt-1 border-t border-stone-100">{report.lifeDomains.education.higherLearningOutlook}</p>
            </section>

            {/* 14. Relationships */}
            <section id="sec-14-relationships" className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <h3 className="text-base font-bold text-stone-900 font-vedic">14. Relationships &amp; Marriage</h3>
              </div>
              <div className="text-xs font-bold text-amber-950">{report.lifeDomains.relationships.headline}</div>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {report.lifeDomains.relationships.partnershipStyle.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-600 pt-1 border-t border-stone-100">{report.lifeDomains.relationships.relationshipAdvice}</p>
            </section>

            {/* 15. Family */}
            <section id="sec-15-family" className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <Users className="w-4 h-4 text-amber-700" />
                <h3 className="text-base font-bold text-stone-900 font-vedic">15. Family &amp; Domestic Sphere</h3>
              </div>
              <div className="text-xs font-bold text-amber-950">{report.lifeDomains.family.headline}</div>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {report.lifeDomains.family.domesticHarmony.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-600 pt-1 border-t border-stone-100">{report.lifeDomains.family.ancestralDynamics}</p>
            </section>

            {/* 16. Health */}
            <section id="sec-16-health" className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <Activity className="w-4 h-4 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900 font-vedic">16. Health &amp; Energy Management</h3>
              </div>
              <div className="text-xs font-bold text-amber-950">{report.lifeDomains.health.headline}</div>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {report.lifeDomains.health.vitalityPointers.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-600 pt-1 border-t border-stone-100">{report.lifeDomains.health.mindBodyCare}</p>
            </section>
          </div>

          {/* 17. Travel */}
          <section id="sec-17-travel" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
              <Plane className="w-4 h-4 text-sky-700" />
              <h3 className="text-base font-bold text-stone-900 font-vedic">17. Travel &amp; Foreign Horizons</h3>
            </div>
            <div className="text-xs font-bold text-amber-950">{report.lifeDomains.travel.headline}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-1.5 text-xs text-stone-700">
                {report.lifeDomains.travel.travelIndications.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-600 p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                {report.lifeDomains.travel.foreignSettlementPotential}
              </p>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 18: STRENGTHS & CHALLENGES */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-18-strengths" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  18
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    Strengths &amp; Karmic Growth Challenges
                  </h3>
                  <p className="text-xs text-stone-500">Inherent superpowers and shadow patterns to balance.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5 font-vedic">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Innate Talents &amp; Core Strengths</span>
                </h4>
                <div className="space-y-2">
                  {report.strengthsAndChallenges.innateStrengths.map((s, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <strong className="text-stone-900">{s.title}:</strong>
                      <span className="text-stone-700 ml-1">{s.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-950 flex items-center gap-1.5 font-vedic">
                  <AlertCircle className="w-4 h-4 text-rose-700" />
                  <span>Karmic Challenges &amp; Growth Edges</span>
                </h4>
                <div className="space-y-2">
                  {report.strengthsAndChallenges.karmicChallenges.map((c, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <strong className="text-stone-900">{c.title}:</strong>
                      <span className="text-stone-700 ml-1">{c.guidance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 19: POSSIBLE LIFE MANIFESTATIONS (SCENARIOS) */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-19-manifestations" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                  19
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic">
                    Possible Life Manifestations &amp; Milestones
                  </h3>
                  <p className="text-xs text-stone-500">Concrete real-life situations you may encounter and how to navigate them effectively.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.lifeManifestations.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">{item.category}</span>
                    <span className="text-[10px] font-semibold text-stone-400">Scenario {idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 font-vedic">{item.scenarioTitle}</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{item.whatMayHappen}</p>
                  <div className="text-[11px] text-amber-900 pt-1.5 border-t border-stone-200">
                    <strong>Optimal Approach:</strong> {item.howToPrepare}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 20: TECHNICAL DETAILS (COLLAPSIBLE BY DEFAULT) */}
          {/* ------------------------------------------------------------- */}
          <section id="sec-20-technical" className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div 
              onClick={() => setExpandedTechnical(!expandedTechnical)}
              className="flex items-center justify-between cursor-pointer border-b border-stone-100 pb-3"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-sm">
                  20
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                    <span>Technical Calculations &amp; Ephemeris Matrix</span>
                    <span className="text-xs font-normal text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                      Collapsed by Default
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500">Astronomical coordinates, Ayanamsha, Karakas, and Sarvashtakavarga scores.</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-stone-500 transition-transform ${expandedTechnical ? 'rotate-180' : ''}`} />
            </div>

            {expandedTechnical && (
              <div className="space-y-4 pt-2 text-xs font-mono text-stone-700 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <strong>Ayanamsha:</strong> {report.technicalDetails.ayanamsha}
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <strong>Tithi:</strong> {report.technicalDetails.tithiDetails}
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <strong>Atmakaraka:</strong> {report.technicalDetails.atmakaraka}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-900 block">Sarvashtakavarga Points (SAV) per Sign:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[11px]">
                    {report.technicalDetails.sarvashtakavargaPoints.map((s, i) => (
                      <div key={i} className="p-1.5 rounded bg-white border border-stone-200">
                        <div className="font-bold">{s.sign.split(' ')[0]}</div>
                        <div className="text-amber-800 font-extrabold">{s.bindus} bindus</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900 block">D9 Navamsha Highlights:</span>
                    <ul className="space-y-1 text-[11px]">
                      {report.technicalDetails.d9NavamshaHighlights.map((h, i) => (
                        <li key={i}>• {h}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900 block">D10 Dasamsha Highlights:</span>
                    <ul className="space-y-1 text-[11px]">
                      {report.technicalDetails.d10DasamshaHighlights.map((h, i) => (
                        <li key={i}>• {h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Bottom Footer Disclaimer */}
          <div className="text-center text-xs text-stone-500 py-6 border-t border-stone-200 space-y-1">
            <p>Astronava Vedic Astrology • Authenticated Classical Calculation Engine</p>
            <p className="text-[11px] text-stone-400">Astrology is a guiding mirror of cosmic tendencies. Your conscious choices, ethics (Dharma), and constructive actions remain your greatest creative power.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

// Sub-component icon placeholder
function UserCheckIcon(props: any) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
