import React, { useState } from 'react';
import { GrahaSpashta, CompleteKundliData } from '../../data/vedicEphemeris';
import { PLANETS_DATA } from '../../data/planetsData';
import { PlanetId } from '../../types/astrology';
import {
  Sparkles,
  Info,
  Flame,
  RotateCw,
  Compass,
  Award,
  Gem,
  Volume2,
} from 'lucide-react';

interface GrahaSpashtaTableProps {
  kundliData: CompleteKundliData;
}

export const GrahaSpashtaTable: React.FC<GrahaSpashtaTableProps> = ({ kundliData }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetId | null>('sun');

  const retroCount = kundliData.grahasList.filter((g) => g.isRetrograde).length;
  const combustCount = kundliData.grahasList.filter((g) => g.isCombust).length;
  const exaltedCount = kundliData.grahasList.filter((g) => g.dignity.includes('Exalted')).length;
  const debilitatedCount = kundliData.grahasList.filter((g) => g.dignity.includes('Debilitated')).length;

  const activePlanetInfo = selectedPlanet ? PLANETS_DATA[selectedPlanet] : null;
  const activeGrahaSpashta = selectedPlanet ? kundliData.grahas[selectedPlanet] : null;

  return (
    <div className="space-y-4">
      {/* Overview Metric Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-950 flex items-center gap-1.5 font-vedic text-sm">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>ग्रह स्पष्ट (Planetary Longitudes & Dignities)</span>
          </span>
          <span className="text-[11px] text-stone-500 font-mono">
            Ayanamsha: {kundliData.formattedAyanamsha} (Lahiri)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 font-semibold text-[11px]">
            9 Classical Grahas
          </span>
          {retroCount > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-100 border border-rose-200 text-rose-800 font-semibold text-[11px] flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-rose-600" />
              <span>{retroCount} Vakri (Retrograde)</span>
            </span>
          )}
          {combustCount > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-orange-100 border border-orange-200 text-orange-800 font-semibold text-[11px] flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-600" />
              <span>{combustCount} Combust (अस्त)</span>
            </span>
          )}
          {exaltedCount > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-[11px] flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-600" />
              <span>{exaltedCount} Exalted (उच्च)</span>
            </span>
          )}
          {debilitatedCount > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-100 border border-rose-200 text-rose-800 font-semibold text-[11px]">
              {debilitatedCount} Debilitated (नीच)
            </span>
          )}
        </div>
      </div>

      {/* Full Graha Spashta Table */}
      <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200 text-[11px]">
              <tr>
                <th className="p-2.5 border-r border-stone-200">ग्रह (Planet)</th>
                <th className="p-2.5 border-r border-stone-200">राशि (Sign)</th>
                <th className="p-2.5 border-r border-stone-200 font-mono">अंश (Degrees)</th>
                <th className="p-2.5 border-r border-stone-200">नक्षत्र व चरण (Nakshatra)</th>
                <th className="p-2.5 border-r border-stone-200 text-center">भाव (House)</th>
                <th className="p-2.5 border-r border-stone-200">स्थिति (Dignity)</th>
                <th className="p-2.5 border-r border-stone-200">अवस्था (Avastha)</th>
                <th className="p-2.5 border-r border-stone-200">कारक (Karaka)</th>
                <th className="p-2.5 text-center">गति (Motion)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {kundliData.grahasList.map((g: GrahaSpashta) => {
                const isSelected = selectedPlanet === g.id;
                return (
                  <tr
                    key={g.id}
                    onClick={() => setSelectedPlanet(g.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-100/70 font-semibold'
                        : 'hover:bg-amber-50/50'
                    }`}
                  >
                    <td className="p-2.5 font-bold text-stone-900 whitespace-nowrap border-r border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{g.avatar}</span>
                        <div>
                          <div className="flex items-center gap-1">
                            <span>{g.name}</span>
                            <span className="text-[10px] text-stone-500 font-normal">
                              ({g.sanskritName})
                            </span>
                          </div>
                          {PLANETS_DATA[g.id]?.devanagari && (
                            <span className="text-[10px] text-amber-900 font-vedic">
                              {PLANETS_DATA[g.id].devanagari}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-2.5 text-stone-800 whitespace-nowrap border-r border-stone-100">
                      <span className="font-semibold">{g.rashiName.split(' ')[0]}</span>
                      <span className="text-[10px] text-stone-500 block">
                        Lord: {g.rashiLord}
                      </span>
                    </td>

                    <td className="p-2.5 font-mono text-stone-700 whitespace-nowrap border-r border-stone-100">
                      <span className="font-bold">{g.formattedDegree}</span>
                      <span className="text-[10px] text-stone-500 block">
                        {g.degreesInRashi.toFixed(2)}° in sign
                      </span>
                    </td>

                    <td className="p-2.5 text-stone-800 whitespace-nowrap border-r border-stone-100">
                      <div className="font-semibold">{g.nakshatraName}</div>
                      <div className="text-[10px] text-stone-500 flex items-center gap-1">
                        <span className="px-1 bg-stone-100 rounded text-stone-700 font-mono">
                          Pada {g.nakshatraPada}
                        </span>
                        <span>Lord: {g.nakshatraLord}</span>
                      </div>
                    </td>

                    <td className="p-2.5 text-center font-bold text-amber-900 whitespace-nowrap border-r border-stone-100">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 font-mono">
                        {g.house}H
                      </span>
                    </td>

                    <td className="p-2.5 whitespace-nowrap border-r border-stone-100">
                      <span
                        className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          g.dignity.includes('Exalted')
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : g.dignity.includes('Debilitated')
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : g.dignity.includes('Own') || g.dignity.includes('Moolatrikona')
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : g.dignity.includes('Friend')
                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {g.dignity}
                      </span>
                    </td>

                    <td className="p-2.5 whitespace-nowrap text-stone-700 text-[10.5px] border-r border-stone-100">
                      <span className="font-medium">{g.avastha || 'Yuva (100%)'}</span>
                    </td>

                    <td className="p-2.5 whitespace-nowrap text-stone-700 text-[10.5px] border-r border-stone-100 font-medium">
                      {g.karaka ? (
                        <span className="text-amber-900 font-semibold">{g.karaka.split(' ')[0]}</span>
                      ) : (
                        <span className="text-stone-400">-</span>
                      )}
                    </td>

                    <td className="p-2.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {g.isRetrograde && (
                          <span className="text-rose-700 font-bold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded text-[10px]">
                            [व] Vakri
                          </span>
                        )}
                        {g.isCombust && (
                          <span className="text-orange-700 font-bold bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-[10px]">
                            [अस्त]
                          </span>
                        )}
                        {!g.isRetrograde && !g.isCombust && (
                          <span className="text-stone-500 text-[10.5px]">Direct</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Planet Deep Astrological Profile Inspector */}
      {activePlanetInfo && activeGrahaSpashta && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 to-stone-50 border border-amber-200 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-white rounded-xl shadow-2xs border border-amber-200">
                {activePlanetInfo.avatar}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-black font-vedic text-amber-950">
                    {activePlanetInfo.name} ({activePlanetInfo.sanskritName}) - {activePlanetInfo.devanagari}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold">
                    Placed in House {activeGrahaSpashta.house}
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  {activePlanetInfo.centralDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 font-semibold text-stone-800">
                {activePlanetInfo.nature}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700">
                {activePlanetInfo.element} Element
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-500 font-bold uppercase block">Rulership & Dignity</span>
              <div><strong>Ruling Signs:</strong> {activePlanetInfo.rulingSigns.join(', ')}</div>
              <div><strong>Exaltation:</strong> {activePlanetInfo.exaltation}</div>
              <div><strong>Debilitation:</strong> {activePlanetInfo.debilitation}</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-500 font-bold uppercase block">Gemstone & Metal</span>
              <div className="flex items-center gap-1 text-amber-900 font-bold">
                <Gem className="w-3.5 h-3.5" />
                <span>{activePlanetInfo.gemstone}</span>
              </div>
              <div><strong>Metal:</strong> {activePlanetInfo.metal}</div>
              <div><strong>Auspicious Color:</strong> {activePlanetInfo.color}</div>
              <div><strong>Day of Week:</strong> {activePlanetInfo.dayOfWeek}</div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-stone-500 font-bold uppercase block">Beej Mantra</span>
              <div className="font-vedic text-amber-950 font-bold text-xs">
                {activePlanetInfo.beejMantra}
              </div>
              <div className="text-[10.5px] text-stone-600 font-mono italic">
                {activePlanetInfo.beejMantraTransliteration}
              </div>
            </div>
          </div>

          {/* House Placement Summary for this person */}
          {activePlanetInfo.effects[activeGrahaSpashta.house] && (
            <div className="p-3 bg-amber-100/50 rounded-xl border border-amber-200/80 text-xs space-y-1">
              <span className="font-bold text-amber-950 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>Meaning of {activePlanetInfo.name} in House {activeGrahaSpashta.house}:</span>
              </span>
              <p className="text-stone-700 leading-relaxed">
                {activePlanetInfo.effects[activeGrahaSpashta.house].summary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
