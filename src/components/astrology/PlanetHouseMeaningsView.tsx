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
} from 'lucide-react';

interface PlanetHouseMeaningsViewProps {
  kundliData: CompleteKundliData;
}

export const PlanetHouseMeaningsView: React.FC<PlanetHouseMeaningsViewProps> = ({
  kundliData,
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

              {/* Card Body: What it Means */}
              <div className="p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
                {/* Summary Narrative */}
                <div className="space-y-1.5">
                  <h5 className="font-bold text-amber-950 font-vedic flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>What This Placement Means in Your Life (अर्थ एवं प्रभाव)</span>
                  </h5>
                  <p className="text-stone-800 leading-relaxed bg-amber-50/40 p-3.5 rounded-xl border border-amber-100 text-xs sm:text-sm">
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
                          className="flex items-start gap-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200/80 text-xs text-stone-700"
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
