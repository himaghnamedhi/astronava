import React, { useState } from 'react';
import { HouseNumber, PlanetId } from '../types/astrology';
import { CompleteKundliData } from '../data/vedicEphemeris';
import { BHAVA_EFFECTS_DATA } from '../data/bhavaEffectsData';
import { TITHIS_DATA, calculateTithiFromDegrees, TithiDetails } from '../data/tithiData';
import { PLANETS_DATA } from '../data/planetsData';
import { RASHI_NAMES } from '../data/vedicAstrologyCalculator';
import {
  Compass,
  Moon,
  Sparkles,
  Award,
  ShieldCheck,
  Heart,
  Briefcase,
  DollarSign,
  Activity,
  Layers,
  ChevronRight,
  Flame,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface AstroEffectsExplorerProps {
  kundliData?: CompleteKundliData | null;
  onSelectHouse?: (house: HouseNumber) => void;
  onSelectPlanet?: (planetId: PlanetId) => void;
}

export const AstroEffectsExplorer: React.FC<AstroEffectsExplorerProps> = ({
  kundliData,
  onSelectHouse,
  onSelectPlanet,
}) => {
  // Main sub-tabs: 'bhavas' | 'tithi' | 'planets'
  const [activeSection, setActiveSection] = useState<'bhavas' | 'tithi' | 'planets'>('bhavas');
  
  // Bhava selection state
  const [selectedBhavaNum, setSelectedBhavaNum] = useState<HouseNumber>(1);
  const [bhavaFilter, setBhavaFilter] = useState<'all' | 'kendra' | 'trikona' | 'upachaya' | 'dusthana'>('all');

  // Tithi selection state (default to kundliData's tithi if available, else 1)
  const initialTithiIndex = kundliData?.tithi?.tithiIndex || 1;
  const [selectedTithiIndex, setSelectedTithiIndex] = useState<number>(initialTithiIndex);
  const [tithiPakshaFilter, setTithiPakshaFilter] = useState<'all' | 'shukla' | 'krishna'>('all');

  // Planet selection state
  const [selectedPlanetId, setSelectedPlanetId] = useState<PlanetId>('sun');
  const [selectedPlanetHouse, setSelectedPlanetHouse] = useState<HouseNumber>(
    kundliData?.grahas?.sun?.house || 1
  );

  // Sync selected planet's house if kundliData changes or planet changes
  React.useEffect(() => {
    if (kundliData?.grahas?.[selectedPlanetId]) {
      setSelectedPlanetHouse(kundliData.grahas[selectedPlanetId].house);
    }
  }, [selectedPlanetId, kundliData]);

  // Sync tithi if kundliData is provided
  React.useEffect(() => {
    if (kundliData?.tithi?.tithiIndex) {
      setSelectedTithiIndex(kundliData.tithi.tithiIndex);
    }
  }, [kundliData]);

  const activeBhava = BHAVA_EFFECTS_DATA[selectedBhavaNum];
  const activeTithi: TithiDetails = TITHIS_DATA[selectedTithiIndex] || TITHIS_DATA[1];
  const activePlanet = PLANETS_DATA[selectedPlanetId];
  const activePlanetEffect = activePlanet.effects[selectedPlanetHouse];

  // Helper for ordinals
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Find native chart details for selected Bhava if chart loaded
  const nativeBhavaSummary = kundliData?.bhavaSummaries?.find((b) => b.houseNumber === selectedBhavaNum);

  return (
    <div className="space-y-6">
      {/* Feature Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full font-vedic">
                Classical Vedic Phalit Jyotish
              </span>
              {kundliData && (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Customized for {kundliData.birthDetails?.name || 'Native'}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-vedic flex items-center gap-2">
              <span>Bhavas, Tithi &amp; Planetary Effects Analysis</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
              Explore exhaustive classical explanations of how each of the <strong>12 Bhavas (Houses)</strong>, your birth <strong>Tithi (Lunar Day)</strong>, and <strong>Planetary Positions</strong> shape personality, career, wealth, health, relationships, and destiny.
            </p>
          </div>

          {/* Primary View Switcher */}
          <div className="flex items-center bg-stone-100 p-1.5 rounded-xl border border-stone-200 text-xs font-semibold shrink-0">
            <button
              id="btn-effects-tab-bhavas"
              type="button"
              onClick={() => setActiveSection('bhavas')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSection === 'bhavas'
                  ? 'bg-amber-900 text-amber-50 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>12 Bhavas (Houses)</span>
            </button>

            <button
              id="btn-effects-tab-tithi"
              type="button"
              onClick={() => setActiveSection('tithi')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSection === 'tithi'
                  ? 'bg-amber-900 text-amber-50 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Birth Tithi</span>
            </button>

            <button
              id="btn-effects-tab-planets"
              type="button"
              onClick={() => setActiveSection('planets')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSection === 'planets'
                  ? 'bg-amber-900 text-amber-50 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Planets (Grahas)</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SECTION 1: 12 BHAVAS (HOUSES) EXPLANATION & LIFE IMPACT */}
      {/* =================================================================== */}
      {activeSection === 'bhavas' && (
        <div className="space-y-6">
          {/* House Selector Ribbon */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-800" />
                <h3 className="font-bold text-stone-900 text-sm font-vedic">Select Any Bhava (1 - 12) to Examine Effects:</h3>
              </div>

              {/* Classification Filter Tabs */}
              <div className="flex items-center gap-1 text-[11px]">
                {[
                  { id: 'all', label: 'All 12' },
                  { id: 'kendra', label: 'Kendras (1, 4, 7, 10)' },
                  { id: 'trikona', label: 'Trikonas (1, 5, 9)' },
                  { id: 'upachaya', label: 'Upachayas (3, 6, 10, 11)' },
                  { id: 'dusthana', label: 'Dusthanas (6, 8, 12)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setBhavaFilter(f.id as any)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      bhavaFilter === f.id
                        ? 'bg-amber-800 text-amber-50 font-bold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 12 House Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as HouseNumber[]).map((hNum) => {
                const b = BHAVA_EFFECTS_DATA[hNum];
                const isSelected = selectedBhavaNum === hNum;
                
                // Check filter match
                let isMatch = true;
                if (bhavaFilter === 'kendra') isMatch = [1, 4, 7, 10].includes(hNum);
                if (bhavaFilter === 'trikona') isMatch = [1, 5, 9].includes(hNum);
                if (bhavaFilter === 'upachaya') isMatch = [3, 6, 10, 11].includes(hNum);
                if (bhavaFilter === 'dusthana') isMatch = [6, 8, 12].includes(hNum);

                // Check native occupancy
                const hasOccupants = nativeBhavaSummary && nativeBhavaSummary.occupants.length > 0;

                return (
                  <button
                    key={hNum}
                    id={`btn-bhava-card-${hNum}`}
                    type="button"
                    onClick={() => {
                      setSelectedBhavaNum(hNum);
                      if (onSelectHouse) onSelectHouse(hNum);
                    }}
                    className={`p-2.5 rounded-xl border transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950 text-amber-50 border-amber-950 shadow-xs ring-2 ring-amber-400/40 font-bold'
                        : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-200 hover:border-amber-200'
                    } ${!isMatch ? 'opacity-40' : ''}`}
                  >
                    <span className="text-xs font-bold font-vedic">{getOrdinal(hNum)} Bhava</span>
                    <span className="text-[10px] opacity-80 mt-0.5 truncate max-w-[90px]">
                      {b.sanskritName.split(' ')[0]}
                    </span>
                    {hasOccupants && kundliData?.bhavaSummaries?.find(s => s.houseNumber === hNum)?.occupants.length ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1" title="Has planet occupants in your chart" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Bhava Comprehensive Dossier */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-7 shadow-2xs space-y-6">
            
            {/* Header with Title and Classification Badges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-5 gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold text-xs border border-amber-300">
                    {getOrdinal(activeBhava.houseNumber)} Bhava of Horoscope
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs">
                    Natural Sign: {activeBhava.naturalSign}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-semibold text-xs border border-amber-200/60">
                    Natural Lord: {activeBhava.naturalLord}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono text-xs">
                    Karakas: {activeBhava.karakas.join(', ')}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-vedic">
                  {activeBhava.sanskritName} — {activeBhava.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                  Governs: {activeBhava.domainName}
                </p>
              </div>

              {/* Native Personalization Pill (if Kundli loaded) */}
              {nativeBhavaSummary && (
                <div className="bg-amber-50/90 border border-amber-200 p-3 rounded-xl text-xs space-y-1 md:text-right shrink-0">
                  <span className="text-[10px] text-amber-800 uppercase font-bold block">In Your Horoscope</span>
                  <strong className="text-stone-900 font-bold block text-sm">
                    {nativeBhavaSummary.signName} (Lord: {nativeBhavaSummary.lord})
                  </strong>
                  <span className="text-stone-600 text-[11px] block">
                    Lord sits in: <strong>{nativeBhavaSummary.lordHouse}th House</strong>
                  </span>
                  <span className="text-stone-600 text-[11px] block">
                    Occupants: {nativeBhavaSummary.occupants.length > 0 ? (
                      <strong className="text-amber-900">
                        {nativeBhavaSummary.occupants.map(p => PLANETS_DATA[p]?.name).filter(Boolean).join(', ')}
                      </strong>
                    ) : (
                      <span className="italic">Empty (Influenced by aspects)</span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Core Domain Overview */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm leading-relaxed text-stone-700">
              <strong className="text-amber-950 font-bold block mb-1 font-vedic text-sm">
                Fundamental Vedic Principle:
              </strong>
              <p>{activeBhava.howItAffectsLife.coreDomain}</p>
            </div>

            {/* 5 Distinct Life Domains: How this Bhava Affects You */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-vedic flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-700" />
                <span>How the {getOrdinal(activeBhava.houseNumber)} Bhava Directly Affects Your Daily Life &amp; Destiny:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* 1. Mind & Personality */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 hover:border-amber-300 transition-colors shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Mindset &amp; Psychology</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeBhava.howItAffectsLife.personalityAndMindset}
                  </p>
                </div>

                {/* 2. Career & Ambition */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 hover:border-indigo-300 transition-colors shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                    <Briefcase className="w-4 h-4 text-indigo-700 shrink-0" />
                    <span>Career &amp; Social Status</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeBhava.howItAffectsLife.careerAndAmbition}
                  </p>
                </div>

                {/* 3. Finances & Prosperity */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 hover:border-emerald-300 transition-colors shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <DollarSign className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Wealth &amp; Material Assets</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeBhava.howItAffectsLife.financesAndProsperity}
                  </p>
                </div>

                {/* 4. Relationships & Family */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 hover:border-rose-300 transition-colors shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-950">
                    <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Relationships &amp; Domestic Bonds</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeBhava.howItAffectsLife.relationshipsAndFamily}
                  </p>
                </div>

                {/* 5. Health & Vitality */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 hover:border-amber-300 transition-colors shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <Activity className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Health &amp; Bodily Organs</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeBhava.howItAffectsLife.healthAndVitality}
                  </p>
                  <span className="text-[10px] text-stone-500 block pt-1 border-t border-stone-100">
                    <strong>Ruled Body Parts:</strong> {activeBhava.bodyParts.join(', ')}
                  </span>
                </div>

                {/* 6. Lord Dynamics Summary */}
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                    <Compass className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>Bhava Lord Placement Dynamics</span>
                  </div>
                  <div className="text-[11px] text-stone-700 space-y-1">
                    <p><strong>Lord in Kendra:</strong> {activeBhava.lordInKendraEffect}</p>
                    <p><strong>Lord in Trikona:</strong> {activeBhava.lordInTrikonaEffect}</p>
                    <p><strong>Lord in Dusthana:</strong> {activeBhava.lordInDusthanaEffect}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefic vs Malefic Planetary Presence in this Bhava */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>When Benefic Planets (Jupiter, Venus, Mercury, Moon) Grace This House:</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {activeBhava.beneficInfluence}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                  <Flame className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>When Malefic Planets (Saturn, Mars, Rahu, Ketu, Sun) Occupy This House:</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {activeBhava.maleficInfluence}
                </p>
              </div>
            </div>

            {/* Strengths, Watch-outs & Vedic Upaya / Remedy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5 text-xs">
                <strong className="text-emerald-900 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Key Life Strengths:
                </strong>
                <ul className="space-y-1 text-stone-600 list-disc list-inside">
                  {activeBhava.keyStrengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5 text-xs">
                <strong className="text-amber-900 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Vulnerabilities to Watch:
                </strong>
                <ul className="space-y-1 text-stone-600 list-disc list-inside">
                  {activeBhava.vulnerabilitiesToWatch.map((v, idx) => (
                    <li key={idx}>{v}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5 text-xs">
                <strong className="text-amber-950 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Harmonization &amp; Vedic Upaya:
                </strong>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  {activeBhava.vedicRemedy}
                </p>
                <p className="text-stone-500 text-[10px] pt-1 border-t border-amber-200/60">
                  <strong>Practical Tip:</strong> {activeBhava.practicalGuidance}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SECTION 2: TITHI (LUNAR DAY OF BIRTH) EXPLANATION & PSYCHOLOGY */}
      {/* =================================================================== */}
      {activeSection === 'tithi' && (
        <div className="space-y-6">
          {/* Tithi Quick Selector & Fortnight Toggle */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-stone-900 text-sm font-vedic">Select Any of the 30 Vedic Tithis to Read Detailed Effects:</h3>
              </div>

              {/* Fortnight Filter */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setTithiPakshaFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    tithiPakshaFilter === 'all'
                      ? 'bg-amber-800 text-amber-50 font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All 30
                </button>
                <button
                  type="button"
                  onClick={() => setTithiPakshaFilter('shukla')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    tithiPakshaFilter === 'shukla'
                      ? 'bg-amber-800 text-amber-50 font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Shukla Paksha (Waxing 1-15)
                </button>
                <button
                  type="button"
                  onClick={() => setTithiPakshaFilter('krishna')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    tithiPakshaFilter === 'krishna'
                      ? 'bg-amber-800 text-amber-50 font-bold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Krishna Paksha (Waning 16-30)
                </button>
              </div>
            </div>

            {/* Tithi Index Pills 1-30 */}
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {Object.values(TITHIS_DATA).map((t) => {
                const isSelected = selectedTithiIndex === t.index;
                const isNativeBirthTithi = kundliData?.tithi?.tithiIndex === t.index;
                const isShukla = t.index <= 15;

                // Check filter
                if (tithiPakshaFilter === 'shukla' && !isShukla) return null;
                if (tithiPakshaFilter === 'krishna' && isShukla) return null;

                return (
                  <button
                    key={t.index}
                    id={`btn-tithi-select-${t.index}`}
                    type="button"
                    onClick={() => setSelectedTithiIndex(t.index)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-950 text-amber-50 border-amber-950 shadow-2xs ring-2 ring-amber-400/40'
                        : isShukla
                        ? 'bg-amber-50/60 hover:bg-amber-100/70 border-amber-200/70 text-stone-800'
                        : 'bg-stone-100 hover:bg-stone-200/80 border-stone-300 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono">#{t.index}</span>
                      {isNativeBirthTithi && (
                        <span className="text-[9px] font-bold bg-emerald-600 text-white px-1 rounded">
                          Birth
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold truncate mt-0.5" title={t.name}>
                      {t.name.split(' ')[1] || t.name}
                    </span>
                    <span className="text-[9px] opacity-75 truncate">{isShukla ? 'Shukla' : 'Krishna'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tithi Deep Dive Profile */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-7 shadow-2xs space-y-6">
            
            {/* Header with Badges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-5 gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-950 font-bold text-xs border border-indigo-200">
                    Tithi #{activeTithi.index} of 30 Lunar Phases
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold text-xs">
                    {activeTithi.paksha}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs">
                    Group: {activeTithi.group}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 font-semibold text-xs border border-blue-200/60">
                    Element: {activeTithi.element}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-vedic">
                  {activeTithi.name} ({activeTithi.sanskritName})
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  Ruling Deity: <strong>{activeTithi.rulingDeity}</strong> • Ruling Planet: <strong>{activeTithi.rulingPlanet}</strong>
                </p>
              </div>

              {/* Natal Match Banner (if this is the user's birth Tithi) */}
              {kundliData?.tithi && kundliData.tithi.tithiIndex === activeTithi.index && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1 shrink-0">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Your Calculated Janma Tithi</span>
                  </span>
                  <strong className="text-stone-900 font-bold text-sm block">
                    {kundliData.birthDetails?.name || 'Native'}'s Lunar Phase
                  </strong>
                  <span className="text-stone-600 text-[11px] block">
                    Moon-Sun Separation: {kundliData.tithi.formattedElongation}
                  </span>
                  <span className="text-stone-500 text-[10px] block">
                    Completed: {kundliData.tithi.percentageElapsed}% of tithi
                  </span>
                </div>
              )}
            </div>

            {/* Classical Significance & Auspicious Nature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm leading-relaxed space-y-1">
                <strong className="text-stone-900 font-bold block font-vedic text-xs uppercase tracking-wider">
                  Cosmic Significance:
                </strong>
                <p className="text-stone-700">{activeTithi.summary}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm leading-relaxed space-y-1">
                <strong className="text-amber-950 font-bold block font-vedic text-xs uppercase tracking-wider">
                  Auspicious Nature &amp; Undertakings:
                </strong>
                <p className="text-stone-700">{activeTithi.auspiciousNature}</p>
              </div>
            </div>

            {/* Deep Explanation: How This Tithi Affects The Person */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-vedic flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>How Being Born on {activeTithi.name} Affects The Native:</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Core Personality */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
                  <strong className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Innate Personality &amp; Life Drive</span>
                  </strong>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeTithi.howItAffectsPerson.corePersonality}
                  </p>
                </div>

                {/* 2. Emotional Nature */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
                  <strong className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Emotional Temperament &amp; Inner Mind</span>
                  </strong>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeTithi.howItAffectsPerson.emotionalNature}
                  </p>
                </div>

                {/* 3. Career & Wealth */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
                  <strong className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>Career Destiny &amp; Wealth Propensity</span>
                  </strong>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeTithi.howItAffectsPerson.careerAndWealth}
                  </p>
                </div>

                {/* 4. Relationship Style */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
                  <strong className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <span>Relationship Tendencies &amp; Love</span>
                  </strong>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeTithi.howItAffectsPerson.relationshipTendencies}
                  </p>
                </div>
              </div>
            </div>

            {/* Strengths, Challenges & Vedic Remedy for this Tithi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5 text-xs">
                <strong className="text-emerald-900 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Tithi Boons &amp; Strengths:
                </strong>
                <ul className="space-y-1 text-stone-600 list-disc list-inside">
                  {activeTithi.howItAffectsPerson.lifeStrengths.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5 text-xs">
                <strong className="text-amber-900 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Vulnerabilities to Balance:
                </strong>
                <ul className="space-y-1 text-stone-600 list-disc list-inside">
                  {activeTithi.howItAffectsPerson.potentialChallenges.map((ch, i) => (
                    <li key={i}>{ch}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1.5 text-xs">
                <strong className="text-indigo-950 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                  Prescribed Tithi Remedy:
                </strong>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  {activeTithi.howItAffectsPerson.recommendedRemedy}
                </p>
                <p className="text-stone-500 text-[10px] pt-1 border-t border-indigo-200/60">
                  <strong>Spiritual Focus:</strong> {activeTithi.howItAffectsPerson.spiritualFocus}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SECTION 3: PLANETARY POSITIONS (GRAHAS) EXPLANATION & LIFE EFFECTS */}
      {/* =================================================================== */}
      {activeSection === 'planets' && (
        <div className="space-y-6">
          {/* Planet Selection Ribbon */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-800" />
                <h3 className="font-bold text-stone-900 text-sm font-vedic">Select Any of the 9 Navagrahas to Analyze Effects:</h3>
              </div>
              {kundliData && (
                <span className="text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Auto-populated with {kundliData.birthDetails?.name || 'Native'}'s chart placements
                </span>
              )}
            </div>

            {/* 9 Planets Selector Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {(Object.keys(PLANETS_DATA) as PlanetId[]).map((pId) => {
                const p = PLANETS_DATA[pId];
                const isSelected = selectedPlanetId === pId;
                const nativeGraha = kundliData?.grahas?.[pId];

                return (
                  <button
                    key={pId}
                    id={`btn-planet-tab-${pId}`}
                    type="button"
                    onClick={() => {
                      setSelectedPlanetId(pId);
                      if (nativeGraha) {
                        setSelectedPlanetHouse(nativeGraha.house);
                      }
                      if (onSelectPlanet) onSelectPlanet(pId);
                    }}
                    className={`p-2.5 rounded-xl border transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950 text-amber-50 border-amber-950 shadow-xs ring-2 ring-amber-400/40 font-bold'
                        : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border-stone-200 hover:border-amber-200'
                    }`}
                  >
                    <span className="text-xl mb-0.5">{p.avatar}</span>
                    <span className="text-xs font-bold font-vedic">{p.name}</span>
                    <span className="text-[10px] opacity-75">{p.sanskritName}</span>
                    {nativeGraha && (
                      <span className="text-[9px] font-bold mt-1 px-1 rounded bg-amber-100 text-amber-900">
                        {nativeGraha.house}H • {nativeGraha.rashiName.split(' ')[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Planet Deep-Dive Dossier */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-7 shadow-2xs space-y-6">
            
            {/* Header with Planetary Badges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-5 gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold text-xs border border-amber-300">
                    {activePlanet.avatar} {activePlanet.name} ({activePlanet.sanskritName})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs">
                    Nature: {activePlanet.nature}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold text-xs">
                    Element: {activePlanet.element}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-semibold text-xs">
                    Gemstone: {activePlanet.gemstone}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-vedic">
                  {activePlanet.name} Placed in the {getOrdinal(selectedPlanetHouse)} House
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  {activePlanet.centralDescription}
                </p>
              </div>

              {/* House Placement Selector for this Planet */}
              <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                <span className="text-[11px] font-semibold text-stone-500">Switch House Position:</span>
                <div className="flex flex-wrap gap-1">
                  {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as HouseNumber[]).map((h) => {
                    const isHouseSelected = selectedPlanetHouse === h;
                    const isNativeHouse = kundliData?.grahas?.[selectedPlanetId]?.house === h;

                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setSelectedPlanetHouse(h)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          isHouseSelected
                            ? 'bg-amber-900 text-amber-50 shadow-2xs font-bold'
                            : isNativeHouse
                            ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                        title={isNativeHouse ? `${activePlanet.name} is in House ${h} in your chart` : `House ${h}`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Native Chart Context if Available */}
            {kundliData?.grahas?.[selectedPlanetId] && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{activePlanet.avatar}</span>
                  <div>
                    <strong className="text-amber-950 font-bold">
                      {kundliData.birthDetails?.name || 'Native'}'s Natal {activePlanet.name} Placement:
                    </strong>
                    <p className="text-stone-600 text-[11px]">
                      {kundliData.grahas[selectedPlanetId].rashiName} at {kundliData.grahas[selectedPlanetId].formattedDegree} • {kundliData.grahas[selectedPlanetId].nakshatraName} (Pada {kundliData.grahas[selectedPlanetId].nakshatraPada}) • In {kundliData.grahas[selectedPlanetId].house}th House
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white border border-amber-200 font-bold text-amber-900">
                    {kundliData.grahas[selectedPlanetId].dignity}
                  </span>
                  {kundliData.grahas[selectedPlanetId].isRetrograde && (
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold text-[10px]">
                      [Vakri / Retrograde]
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Summary Overview of this House Placement */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm leading-relaxed space-y-1">
              <strong className="text-stone-900 font-bold block font-vedic text-xs uppercase tracking-wider">
                Classical Synthesis of {activePlanet.name} in {getOrdinal(selectedPlanetHouse)} House:
              </strong>
              <p className="text-stone-700">{activePlanetEffect.summary}</p>
            </div>

            {/* Core Influence Bullet Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-vedic flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-700" />
                <span>Primary Life Manifestations &amp; Behavioral Patterns:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activePlanetEffect.bulletPoints.map((bp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-start gap-2 text-xs">
                    <span className="text-amber-800 font-bold shrink-0 mt-0.5">•</span>
                    <span className="text-stone-700 font-medium">{bp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths, Cautions & Prescribed Upayas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5 text-xs">
                <strong className="text-emerald-900 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Key Planetary Boons:
                </strong>
                <ul className="space-y-1 text-stone-600 list-disc list-inside">
                  {activePlanetEffect.strengths.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5 text-xs">
                <strong className="text-amber-900 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Cautions &amp; Blindspots:
                </strong>
                <ul className="space-y-1 text-stone-600 list-disc list-inside">
                  {activePlanetEffect.cautions.map((ca, i) => (
                    <li key={i}>{ca}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5 text-xs">
                <strong className="text-amber-950 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Classical Vedic Upaya (Remedy):
                </strong>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  {activePlanetEffect.remedy}
                </p>
                <div className="pt-1.5 border-t border-amber-200/60 space-y-1 text-[10px] text-stone-600">
                  <p><strong>Beej Mantra:</strong> {activePlanet.beejMantra}</p>
                  <p className="font-mono text-stone-500">{activePlanet.beejMantraTransliteration}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
