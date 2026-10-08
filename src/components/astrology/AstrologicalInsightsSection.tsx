import React, { useState } from 'react';
import { Sparkles, Compass, Flame, Award, ChevronRight } from 'lucide-react';
import { HouseNumber, PlanetId } from '../../types/astrology';
import { PLANETS_DATA } from '../../data/planetsData';
import { HOUSES_DATA } from '../../data/housesData';

interface AstrologicalInsightsSectionProps {
  placements: Record<PlanetId, HouseNumber>;
}

export const AstrologicalInsightsSection: React.FC<AstrologicalInsightsSectionProps> = ({ placements }) => {
  const [targetType, setTargetType] = useState<'planet' | 'house'>('planet');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetId>('sun');
  const [selectedHouse, setSelectedHouse] = useState<HouseNumber>(1);
  const [loading, setLoading] = useState(false);
  const [insightData, setInsightData] = useState<{
    title: string;
    subtitle: string;
    bulletPoints: string[];
    remedy: string;
  } | null>(null);

  const handleGenerateInsight = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/planet-house-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId: targetType === 'planet' ? selectedPlanet : selectedHouse,
          placements,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsightData(data);
      } else {
        // Fallback context
        generateLocalInsight();
      }
    } catch (err) {
      console.warn('AI insight fetch failed, using local context:', err);
      generateLocalInsight();
    } finally {
      setLoading(false);
    }
  };

  const generateLocalInsight = () => {
    if (targetType === 'planet') {
      const p = PLANETS_DATA[selectedPlanet];
      const house = placements[selectedPlanet];
      setInsightData({
        title: `${p.name} (${p.sanskritName}) in House ${house}`,
        subtitle: `Classical Parashari Dignity & Behavioral Manifestation`,
        bulletPoints: [
          `Directs strong planetary currents into the affairs of the ${house}th house.`,
          `Activates karmic lessons associated with ${p.name}'s natural karakatwas.`,
          `Fosters professional and personal growth when aligned with ethical action.`,
        ],
        remedy: `Chant the Beej mantra of ${p.name} 108 times daily and honor its natural significations.`,
      });
    } else {
      const h = HOUSES_DATA[selectedHouse];
      const occupants = (Object.keys(placements) as PlanetId[]).filter(p => placements[p] === selectedHouse);
      setInsightData({
        title: `House ${selectedHouse}: ${h.sanskritName}`,
        subtitle: `Natural Sign: ${h.naturalSign} | Lord: ${h.naturalLord}`,
        bulletPoints: [
          `Occupied by: ${occupants.length > 0 ? occupants.map(p => PLANETS_DATA[p].name).join(', ') : 'None (Influenced by Lord)'}`,
          `Governs core life areas including ${h.significance.toLowerCase()}.`,
          `Yields profound results during planetary dasha transits affecting this house.`,
        ],
        remedy: `Strengthen the lord of House ${selectedHouse} (${h.naturalLord}) through charity and purposeful diligence.`,
      });
    }
  };

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-amber-900/20 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base sm:text-lg font-bold text-amber-950 font-vedic flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <span>Real-Time Gemini Astrological Insights (एआई ज्योतिषीय अंतर्दृष्टि)</span>
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Gemini Powered
            </span>
          </div>
          <p className="text-xs text-stone-600">
            Select any planet or house from your chart builder to instantly generate contextual, real-time AI bullet points and guidance.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Target Type</label>
          <select
            value={targetType}
            onChange={(e) => setTargetType(e.target.value as 'planet' | 'house')}
            className="w-full p-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 bg-white cursor-pointer"
          >
            <option value="planet">Planet (Graha)</option>
            <option value="house">House (Bhava)</option>
          </select>
        </div>

        {targetType === 'planet' ? (
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Select Planet</label>
            <select
              value={selectedPlanet}
              onChange={(e) => setSelectedPlanet(e.target.value as PlanetId)}
              className="w-full p-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 bg-white cursor-pointer"
            >
              {(Object.keys(PLANETS_DATA) as PlanetId[]).map((pId) => (
                <option key={pId} value={pId}>
                  {PLANETS_DATA[pId].avatar} {PLANETS_DATA[pId].name} ({PLANETS_DATA[pId].sanskritName})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Select House</label>
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(Number(e.target.value) as HouseNumber)}
              className="w-full p-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 bg-white cursor-pointer"
            >
              {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as HouseNumber[]).map((num) => (
                <option key={num} value={num}>
                  {num}th House ({HOUSES_DATA[num].sanskritName})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-end">
          <button
            onClick={handleGenerateInsight}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing with AI...' : 'Generate AI Insight'}</span>
          </button>
        </div>
      </div>

      {/* Insight Display Box */}
      {insightData && (
        <div 
          key={insightData.title}
          className="bg-gradient-to-br from-stone-950 via-amber-950 to-stone-950 p-6 sm:p-7 rounded-2xl text-stone-100 shadow-md border border-amber-800/40 space-y-4 transition-all duration-300 ease-in-out transform animate-fadeIn"
        >
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Contextual Gemini Analysis</span>
            <h4 className="text-xl font-bold font-vedic text-amber-100">{insightData.title}</h4>
            <p className="text-xs text-stone-300 mt-0.5">{insightData.subtitle}</p>
          </div>

          <ul className="space-y-2 text-xs text-stone-200">
            {insightData.bulletPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold mt-0.5">✦</span>
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-amber-800/40 flex items-center gap-2 text-xs text-amber-300">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Vedic Upaya / Remedy:</strong> {insightData.remedy}</span>
          </div>
        </div>
      )}
    </div>
  );
};
