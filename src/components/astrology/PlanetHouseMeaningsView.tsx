import React, { useState } from 'react';
import { CompleteKundliData, GrahaSpashta } from '../../data/vedicEphemeris';
import { PLANETS_DATA } from '../../data/planetsData';
import { HOUSES_DATA } from '../../data/housesData';
import { PlanetId, HouseNumber } from '../../types/astrology';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  ShieldCheck,
  Compass,
  Flame,
  RotateCw,
  Search,
  BookOpen,
  ArrowUpRight,
  ChevronDown,
  Layers,
  FileText
} from 'lucide-react';

interface PlanetHouseMeaningsViewProps {
  kundliData: CompleteKundliData;
  onOpenFullReport?: (initialSection?: string) => void;
}

// Crisp, high-impact 3-keyword tags and concise plain-language summary
function getPlanetHouseConciseSummary(grahaId: PlanetId, house: HouseNumber, grahaName: string): {
  keywords: string;
  conciseSummary: string;
} {
  const specificMap: Record<string, { keywords: string; conciseSummary: string }> = {
    rahu_6: {
      keywords: 'Competition • Work • Problem Solving',
      conciseSummary: 'Rahu in the 6th house can emphasize competition, difficult work, problem-solving and overcoming obstacles.',
    },
    rahu_10: {
      keywords: 'Ambition • Global Scale • Non-Traditional Authority',
      conciseSummary: 'Rahu in the 10th house can emphasize high career drive, unorthodox career pivots, media influence and rapid professional breakthroughs.',
    },
    sun_1: {
      keywords: 'Vitality • Charisma • Executive Leadership',
      conciseSummary: 'Sun in the 1st house can emphasize physical presence, decisive self-confidence, natural authority and independent leadership.',
    },
    sun_10: {
      keywords: 'Career Authority • State Honor • High Prestige',
      conciseSummary: 'Sun in the 10th house can emphasize high executive authority, governmental recognition, organizational command and lasting reputation.',
    },
    moon_1: {
      keywords: 'Emotional Intuition • Adaptability • Magnetic Persona',
      conciseSummary: 'Moon in the 1st house can emphasize empathetic perception, creative mood alignment, natural public rapport and intuitive intelligence.',
    },
    moon_4: {
      keywords: 'Domestic Sanctuary • Maternal Bliss • Mental Peace',
      conciseSummary: 'Moon in the 4th house can emphasize inner emotional contentment, maternal bonding, comfortable home living and domestic stability.',
    },
    mars_1: {
      keywords: 'Courage • Pioneering Drive • Physical Stamina',
      conciseSummary: 'Mars in the 1st house can emphasize bold initiative, physical vigor, competitive determination and athletic stamina.',
    },
    mars_10: {
      keywords: 'Career Ambition • Digbala Strength • Milestone Victory',
      conciseSummary: 'Mars in the 10th house can emphasize directional strength, strategic mastery, relentless professional drive and senior leadership.',
    },
    mercury_2: {
      keywords: 'Persuasive Speech • Commercial Acumen • Wealth Growth',
      conciseSummary: 'Mercury in the 2nd house can emphasize articulate speaking, commercial negotiation, financial management and intellectual wealth.',
    },
    mercury_5: {
      keywords: 'Sharp Intellect • Analytical Strategy • Creative Output',
      conciseSummary: 'Mercury in the 5th house can emphasize mental agility, speculative intelligence, creative writing and educational excellence.',
    },
    jupiter_1: {
      keywords: 'Wisdom • Ethical Dignity • Expansive Grace',
      conciseSummary: 'Jupiter in the 1st house can emphasize philosophical maturity, optimistic demeanor, moral uprightness and cosmic protection.',
    },
    jupiter_9: {
      keywords: 'Divine Fortune • Higher Learning • Spiritual Ethics',
      conciseSummary: 'Jupiter in the 9th house can emphasize auspicious fortune (Bhagya), high ethics, spiritual mentorship and fortunate long journeys.',
    },
    venus_4: {
      keywords: 'Aesthetic Living • Luxury Vehicles • Family Warmth',
      conciseSummary: 'Venus in the 4th house can emphasize beautiful living spaces, artistic domestic comfort, vehicle conveyances and maternal affection.',
    },
    venus_7: {
      keywords: 'Partnership Harmony • Romance • Collaborative Growth',
      conciseSummary: 'Venus in the 7th house can emphasize mutual affection, elegant public relations, committed relationships and flourishing business collaborations.',
    },
    saturn_10: {
      keywords: 'Disciplined Duty • Long-Term Stature • Enduring Legacy',
      conciseSummary: 'Saturn in the 10th house can emphasize structured perseverance, professional integrity, gradual career ascension and lasting social legacy.',
    },
    saturn_11: {
      keywords: 'Compounding Wealth • Senior Alliances • Goal Attainment',
      conciseSummary: 'Saturn in the 11th house can emphasize disciplined financial accumulation, mature friendships and steady realization of long-term ambitions.',
    },
    ketu_12: {
      keywords: 'Spiritual Liberation • Meditation • Inner Solitude',
      conciseSummary: 'Ketu in the 12th house can emphasize introspective solitude, meditative breakthroughs, dream intuition and philanthropic detachment.',
    },
  };

  const key = `${grahaId}_${house}`;
  if (specificMap[key]) {
    return specificMap[key];
  }

  // Algorithmic synthesis for other placements
  const hData = HOUSES_DATA[house] || HOUSES_DATA[1];
  const pData = PLANETS_DATA[grahaId];
  const kw = (hData.lifeThemes || []).slice(0, 3).join(' • ') || 'Growth • Alignment • Purpose';
  const summaryPart = pData?.effects?.[house]?.summary;
  const concise = summaryPart 
    ? summaryPart 
    : `${grahaName} in the ${house}${house === 1 ? 'st' : house === 2 ? 'nd' : house === 3 ? 'rd' : 'th'} house can emphasize ${(hData.lifeThemes || []).slice(0, 3).join(', ').toLowerCase()} and purposeful personal development.`;

  return {
    keywords: kw,
    conciseSummary: concise,
  };
}

export const PlanetHouseMeaningsView: React.FC<PlanetHouseMeaningsViewProps> = ({
  kundliData,
  onOpenFullReport,
}) => {
  const [selectedPlanetFilter, setSelectedPlanetFilter] = useState<string>('all');
  const [activePlanetModal, setActivePlanetModal] = useState<PlanetId | null>(null);

  // Group planets by nature or dignity
  const planetsList = kundliData.grahasList;

  const filteredPlanets = planetsList.filter((g) => {
    if (selectedPlanetFilter === 'all') return true;
    if (selectedPlanetFilter === 'kendras') return [1, 4, 7, 10].includes(g.house);
    if (selectedPlanetFilter === 'trikonas') return [1, 5, 9].includes(g.house);
    if (selectedPlanetFilter === 'dusthanas') return [6, 8, 12].includes(g.house);
    if (selectedPlanetFilter === 'upachayas') return [3, 6, 10, 11].includes(g.house);
    if (selectedPlanetFilter === 'vakri') return g.isRetrograde;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Intro Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-black font-vedic text-amber-100">
            ग्रह भाव फल (Planetary Placements & Their Meanings in Houses)
          </h3>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed max-w-4xl">
          Detailed classical Vedic interpretations of each planet’s presence in its designated house in the natal chart of{' '}
          <strong className="text-amber-300">{kundliData.birthDetails.name || 'the Native'}</strong>.
          Discover what each planetary position means for life karma, strengths, vulnerabilities, and actionable remedies.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          { id: 'all', label: `All 9 Planets (${planetsList.length})` },
          { id: 'kendras', label: 'Kendra Houses (1st, 4th, 7th, 10th)' },
          { id: 'trikonas', label: 'Trikona Houses (1st, 5th, 9th - Fortune)' },
          { id: 'upachayas', label: 'Upachaya Growth Houses (3rd, 6th, 10th, 11th)' },
          { id: 'dusthanas', label: 'Transformation Houses (6th, 8th, 12th)' },
          { id: 'vakri', label: 'Vakri / Retrograde Planets' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedPlanetFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all cursor-pointer ${
              selectedPlanetFilter === f.id
                ? 'bg-amber-950 text-amber-100 shadow-2xs font-bold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Planets in Houses Cards List */}
      <div className="space-y-4">
        {filteredPlanets.map((graha: GrahaSpashta) => {
          const pInfo = PLANETS_DATA[graha.id];
          const effectDetail = pInfo?.effects?.[graha.house];
          const houseInfo = HOUSES_DATA[graha.house] || HOUSES_DATA[1];
          const concise = getPlanetHouseConciseSummary(graha.id, graha.house, graha.name);
          const isQuickExpanded = activePlanetModal === graha.id;

          const suffix = graha.house === 1 ? 'st' : graha.house === 2 ? 'nd' : graha.house === 3 ? 'rd' : 'th';

          return (
            <div
              key={graha.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-white rounded-xl shadow-2xs border border-stone-200">
                    {graha.avatar}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-black font-vedic text-stone-900">
                        {graha.name} in House {graha.house}
                      </h4>
                      <span className="text-xs font-serif text-amber-900 font-bold">
                        ({graha.sanskritName} - {pInfo?.devanagari})
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold border border-amber-200">
                        {houseInfo.sanskritName.split(' ')[0]} ({houseInfo.name})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-600 mt-1 flex-wrap">
                      <span>Sign: <strong className="text-stone-900">{graha.rashiName}</strong></span>
                      <span>•</span>
                      <span>Longitude: <strong className="font-mono text-stone-900">{graha.formattedDegree}</strong></span>
                      <span>•</span>
                      <span>Nakshatra: <strong className="text-stone-900">{graha.nakshatraName} (Pada {graha.nakshatraPada})</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      graha.dignity.includes('Exalted')
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : graha.dignity.includes('Debilitated')
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : graha.dignity.includes('Own') || graha.dignity.includes('Moolatrikona')
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    {graha.dignity}
                  </span>

                  {graha.isRetrograde && (
                    <span className="px-2 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1">
                      <RotateCw className="w-3 h-3 text-rose-600" />
                      <span>Vakri [व]</span>
                    </span>
                  )}

                  {graha.isCombust && (
                    <span className="px-2 py-1 rounded-lg bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-600" />
                      <span>Astangata [अस्त]</span>
                    </span>
                  )}

                  <span className="px-2 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-medium">
                    {graha.avastha || 'Yuva (100%)'}
                  </span>
                </div>
              </div>

              {/* 1. Concise Website Summary (Example: Rahu in 6th House / Competition • Work • Problem Solving) */}
              <div className="p-4 sm:p-5 bg-amber-50/40 border-b border-amber-900/10 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-vedic text-stone-900">
                      {graha.name} in {graha.house}{suffix} House
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-amber-900 tracking-wide mt-0.5">
                      {concise.keywords}
                    </p>
                  </div>

                  {onOpenFullReport && (
                    <button
                      type="button"
                      onClick={() => onOpenFullReport('sec-4-houses')}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-800 via-amber-900 to-amber-950 hover:from-amber-700 hover:to-amber-900 text-amber-50 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer group shrink-0 active:scale-95"
                      title="Open comprehensive 20-section report"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-300" />
                      <span>Read Full Analysis</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pt-1">
                  {concise.conciseSummary}
                </p>

                {/* Quick Toggle for Inline Details */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActivePlanetModal(isQuickExpanded ? null : graha.id)}
                    className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{isQuickExpanded ? 'Hide Quick Details' : 'Show Quick Details & Remedies'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isQuickExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <span className="text-[11px] text-stone-500 font-mono">
                    Bhava {graha.house} • {graha.rashiName}
                  </span>
                </div>
              </div>

              {/* 2. Optional Quick Expandable Body */}
              {isQuickExpanded && (
                <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm bg-stone-50/30 animate-fadeIn">
                  {/* Summary Narrative */}
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-amber-950 font-vedic flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Detailed Planetary Influence (अर्थ एवं प्रभाव)</span>
                    </h5>
                    <p className="text-stone-800 leading-relaxed bg-white p-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm">
                      {effectDetail?.summary ||
                        `${graha.name} placed in the ${graha.house}th house influences ${(houseInfo.keySignifications || []).slice(0, 3).join(', ')} with its characteristic qualities.`}
                    </p>
                  </div>

                  {/* Bullet Points */}
                  {effectDetail?.bulletPoints && effectDetail.bulletPoints.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider">
                        Key Manifestations &amp; Real-Life Outcomes:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {effectDetail.bulletPoints.map((pt, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 p-2.5 bg-white rounded-lg border border-stone-200/80 text-xs text-stone-700"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Cautions Two-Column Bento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Strengths */}
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>Endowed Strengths &amp; Blessings</span>
                      </span>
                      <ul className="space-y-1 text-xs text-emerald-900">
                        {(effectDetail?.strengths || ['Natural resilience', 'Creative focus']).map((s, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cautions */}
                    <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/80 space-y-1.5">
                      <span className="font-bold text-rose-950 flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-700" />
                        <span>Vulnerabilities &amp; Precautions</span>
                      </span>
                      <ul className="space-y-1 text-xs text-rose-900">
                        {(effectDetail?.cautions || ['Avoid haste or undue friction']).map((c, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actionable Vedic Remedy */}
                  {effectDetail?.remedy && (
                    <div className="p-3.5 bg-gradient-to-r from-amber-100/70 to-orange-50 rounded-xl border border-amber-300/80 space-y-1 text-xs">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                        <HeartHandshake className="w-4 h-4 text-amber-800" />
                        <span>Certified Vedic Remedy (वैदिक उपाय) for {graha.name} in {graha.house}H:</span>
                      </span>
                      <p className="text-stone-800 font-medium leading-relaxed">
                        {effectDetail.remedy}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
