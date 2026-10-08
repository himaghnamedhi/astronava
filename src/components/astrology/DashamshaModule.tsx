import React from 'react';
import { Briefcase, Sparkles, Compass, ShieldCheck, Award, Layers } from 'lucide-react';
import { HouseNumber, PlanetId } from '../../types/astrology';
import { PLANETS_DATA } from '../../data/planetsData';

interface DashamshaModuleProps {
  placements: Record<PlanetId, HouseNumber>;
}

const RASHI_NAMES = [
  'Aries (Mesha)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)', 'Cancer (Karka)',
  'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrischika)',
  'Sagittarius (Dhanu)', 'Capricorn (Makara)', 'Aquarius (Kumbha)', 'Pisces (Meena)'
];

export const DashamshaModule: React.FC<DashamshaModuleProps> = ({ placements }) => {
  // Approximate D10 sign calculation from house placement for interactive builder
  const getSimulatedD10Sign = (pId: PlanetId, house: HouseNumber): number => {
    const offsetMap: Record<PlanetId, number> = {
      sun: 2, moon: 5, mars: 8, mercury: 3, jupiter: 10,
      venus: 6, saturn: 11, rahu: 4, ketu: 9
    };
    const sign = ((house - 1 + (offsetMap[pId] || 0)) % 12) + 1;
    return sign;
  };

  const getD1Sign = (house: HouseNumber) => ((house - 1) % 12) + 1;

  const planetsWithD10 = (Object.keys(PLANETS_DATA) as PlanetId[]).map((pId) => {
    const d1House = placements[pId] || 1;
    const d1Sign = getD1Sign(d1House);
    const d10Sign = getSimulatedD10Sign(pId, d1House);
    const isVargottama = d1Sign === d10Sign;

    return {
      pId,
      name: PLANETS_DATA[pId].name,
      avatar: PLANETS_DATA[pId].avatar,
      d1House,
      d1Sign: RASHI_NAMES[d1Sign - 1],
      d10Sign: RASHI_NAMES[d10Sign - 1],
      isVargottama,
    };
  });

  const vargottamaCount = planetsWithD10.filter(p => p.isVargottama).length;

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-amber-900/20 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base sm:text-lg font-bold text-amber-950 font-vedic flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-700" />
              <span>D10 Dashamsha Chart &amp; Career Success Module (दशमांश चक्र)</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {vargottamaCount} Career Anchors Active
            </span>
          </div>
          <p className="text-xs text-stone-600">
            Dashamsha (D10) is the divisional chart dedicated to career, professional standing, leadership authority, and public achievements.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl shrink-0">
          <p className="text-[10px] font-bold text-amber-900 uppercase">Career Potential Score</p>
          <p className="text-sm font-black font-vedic text-amber-950">
            {vargottamaCount >= 3 ? 'Executive (91/100)' : vargottamaCount >= 1 ? 'Professional (80/100)' : 'Steady Growth (72/100)'}
          </p>
        </div>
      </div>

      {/* Planetary Dignity & D10 Placement Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-700" />
          <span>Professional Dignity &amp; Dashamsha Placement (D1 vs D10)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {planetsWithD10.map((item) => (
            <div
              key={item.pId}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                item.isVargottama
                  ? 'bg-amber-50/70 border-amber-400 shadow-xs'
                  : 'bg-stone-50/70 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.avatar}</span>
                  <span className="font-bold text-stone-900 text-xs font-vedic">{item.name}</span>
                </div>
                {item.isVargottama && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold tracking-wide shadow-2xs">
                    Strong 🌟
                  </span>
                )}
              </div>

              <div className="space-y-1 text-[11px] text-stone-600">
                <p><strong>D1 House:</strong> {item.d1House} ({item.d1Sign})</p>
                <p className="text-amber-950 font-medium"><strong>D10 Sign:</strong> {item.d10Sign}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career & 10th House Insights */}
      <div className="bg-gradient-to-r from-stone-950 to-amber-950 text-amber-50 p-5 sm:p-6 rounded-2xl border border-amber-800/40 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h4 className="font-bold font-vedic text-sm text-amber-100">
            Karma Bhava (10th House in Dashamsha) &amp; Executive Authority
          </h4>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed">
          In Dashamsha (D10), the 10th house and the condition of Sun (authority) and Saturn (persistence) reveal your aptitude for executive leadership, business entrepreneurship, or specialized consultancy. Your active placement alignments indicate robust capacity for career advancement and public recognition.
        </p>
      </div>
    </div>
  );
};
