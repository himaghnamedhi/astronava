import React from 'react';
import { Heart, Sparkles, Compass, ShieldCheck, Award, Layers } from 'lucide-react';
import { HouseNumber, PlanetId } from '../../types/astrology';
import { PLANETS_DATA } from '../../data/planetsData';

interface NavamshaModuleProps {
  placements: Record<PlanetId, HouseNumber>;
}

// Rashi names in Sanskrit/English
const RASHI_NAMES = [
  'Aries (Mesha)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)', 'Cancer (Karka)',
  'Leo (Simha)', ' कन्या (Kanya)', 'Libra (Tula)', 'Scorpio (Vrischika)',
  'Sagittarius (Dhanu)', 'Capricorn (Makara)', 'Aquarius (Kumbha)', 'Pisces (Meena)'
];

export const NavamshaModule: React.FC<NavamshaModuleProps> = ({ placements }) => {
  // Approximate D9 sign calculation from house placement for interactive builder
  // In traditional Vedic astrology, D9 is calculated from exact degree. For builder mode, we map house number to a sign starting from Ascendant (House 1 = Aries sign approx).
  const getSimulatedD9Sign = (pId: PlanetId, house: HouseNumber): number => {
    // Offset based on planet id to distribute across navamshas for interactive testing
    const offsetMap: Record<PlanetId, number> = {
      sun: 0, moon: 3, mars: 6, mercury: 1, jupiter: 8,
      venus: 4, saturn: 10, rahu: 2, ketu: 8
    };
    const sign = ((house - 1 + (offsetMap[pId] || 0)) % 12) + 1;
    return sign;
  };

  // Identify Vargottama (same D1 and D9 sign roughly)
  const getD1Sign = (house: HouseNumber) => ((house - 1) % 12) + 1;

  const planetsWithD9 = (Object.keys(PLANETS_DATA) as PlanetId[]).map((pId) => {
    const d1House = placements[pId] || 1;
    const d1Sign = getD1Sign(d1House);
    const d9Sign = getSimulatedD9Sign(pId, d1House);
    const isVargottama = d1Sign === d9Sign;

    return {
      pId,
      name: PLANETS_DATA[pId].name,
      avatar: PLANETS_DATA[pId].avatar,
      d1House,
      d1Sign: RASHI_NAMES[d1Sign - 1],
      d9Sign: RASHI_NAMES[d9Sign - 1],
      isVargottama,
    };
  });

  const vargottamaCount = planetsWithD9.filter(p => p.isVargottama).length;

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-amber-900/20 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base sm:text-lg font-bold text-amber-950 font-vedic flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" />
              <span>D9 Navamsha Chart &amp; Marriage Harmony Module (नवांश चक्र)</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              {vargottamaCount} Vargottama Grahas
            </span>
          </div>
          <p className="text-xs text-stone-600">
            Navamsha (D9) is the chart of destiny, inner soul potential, and marriage compatibility (Kalatra Bhava). Planets in Vargottama gain immense strength.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl shrink-0">
          <p className="text-[10px] font-bold text-amber-900 uppercase">Marriage Potential Score</p>
          <p className="text-sm font-black font-vedic text-amber-950">
            {vargottamaCount >= 3 ? 'Excellent (88/100)' : vargottamaCount >= 1 ? 'Good (75/100)' : 'Balanced (68/100)'}
          </p>
        </div>
      </div>

      {/* Vargottama & Planet Strength Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-700" />
          <span>Planetary Dignity &amp; Navamsha Placement (D1 vs D9)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {planetsWithD9.map((item) => (
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
                    Vargottama 🌟
                  </span>
                )}
              </div>

              <div className="space-y-1 text-[11px] text-stone-600">
                <p><strong>D1 House:</strong> {item.d1House} ({item.d1Sign})</p>
                <p className="text-amber-950 font-medium"><strong>D9 Sign:</strong> {item.d9Sign}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marriage Compatibility & 7th House Insights */}
      <div className="bg-gradient-to-r from-amber-950 to-stone-900 text-amber-50 p-5 sm:p-6 rounded-2xl border border-amber-800/40 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <h4 className="font-bold font-vedic text-sm text-amber-100">
            Kalatra Bhava (7th House in Navamsha) &amp; Partnership Insights
          </h4>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed">
          In Navamsha (D9), the 7th house and the placement of Venus (Karaka of marriage) dictate the nature of your life partner, marital accord, and long-term emotional harmony. With {vargottamaCount} Vargottama planets active in your chart, your foundational strengths are reinforced after the age of 32, bringing stability and profound spiritual bond in partnership.
        </p>
      </div>
    </div>
  );
};
