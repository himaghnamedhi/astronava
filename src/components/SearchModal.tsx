import React, { useState, useMemo } from 'react';
import { X, Search, Sparkles, Compass, Sun, Layers, ArrowRight } from 'lucide-react';
import { HOUSES_DATA } from '../data/housesData';
import { PLANETS_DATA } from '../data/planetsData';
import { HouseNumber, PlanetId } from '../types/astrology';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
  onSelectHouse: (h: HouseNumber) => void;
  onSelectPlanet: (p: PlanetId) => void;
}

const COMMON_LIFE_QUERIES = [
  { label: '💼 Career & Promotion', house: 10 as HouseNumber, planet: 'sun' as PlanetId },
  { label: '💍 Marriage & Spouse', house: 7 as HouseNumber, planet: 'venus' as PlanetId },
  { label: '💰 Wealth & Bank Balance', house: 2 as HouseNumber, planet: 'jupiter' as PlanetId },
  { label: '📈 Stock Gains & Income', house: 11 as HouseNumber, planet: 'rahu' as PlanetId },
  { label: '✈️ Foreign Travel & Settlement', house: 12 as HouseNumber, planet: 'rahu' as PlanetId },
  { label: '🏠 Property, Vehicles & Real Estate', house: 4 as HouseNumber, planet: 'mars' as PlanetId },
  { label: '👶 Children & Education', house: 5 as HouseNumber, planet: 'jupiter' as PlanetId },
  { label: '🏥 Health, Enemies & Loans', house: 6 as HouseNumber, planet: 'mars' as PlanetId },
  { label: '🔮 Spirituality, Occult & Research', house: 8 as HouseNumber, planet: 'ketu' as PlanetId },
  { label: '🍀 Luck, Higher Wisdom & Father', house: 9 as HouseNumber, planet: 'jupiter' as PlanetId },
];

const CORE_SERVICES = [
  { id: 'generator', name: 'Kundli Maker (Janam Kundli)', description: 'Full birth chart, D1 Lagna, D9 Navamsha, Vimshottari Dasha & Ashtakavarga' },
  { id: 'horoscope', name: 'Daily Horoscope & Transits', description: 'Personalized daily astrology transits calibrated to your birth Lagna' },
  { id: 'match', name: 'Match Finder (Kundli Milan)', description: '36 Guna Ashtakoota Milan, Manglik dosha checking & synastry analysis' },
  { id: 'gemstones', name: 'Gemstone Recommendation', description: 'Vedic Ratna recommendations calibrated to Ratti dosage & metal settings' },
  { id: 'numerology', name: 'Numerology Calculator', description: 'Calculate Mulank (Birth), Bhagyank (Destiny), and Namank name vibration' },
  { id: 'name-correction', name: 'Name Correction & Tuning', description: 'Chaldean and Pythagorean spelling vibration tuning for prosperity' },
  { id: 'store', name: 'Astronava Sacred Store', description: 'Certified authentic gemstones, energized Rudraksha beads, and sacred Yantras' },
  { id: 'builder', name: 'Interactive Kundli Builder', description: 'Customize house placements and analyze planetary yogas interactively' },
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onSelectHouse,
  onSelectPlanet,
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();
    const results: {
      type: 'service' | 'house' | 'planet' | 'effect';
      title: string;
      subtitle: string;
      house?: HouseNumber;
      planet?: PlanetId;
      tab?: string;
    }[] = [];

    // 1. Search in Core Services & Tools
    CORE_SERVICES.forEach((s) => {
      if (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'service',
          title: s.name,
          subtitle: s.description,
          tab: s.id,
        });
      }
    });

    // 2. Search in Houses
    Object.values(HOUSES_DATA).forEach((h) => {
      if (
        h.name.toLowerCase().includes(q) ||
        h.sanskritName.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.keySignifications.some((k) => k.toLowerCase().includes(q))
      ) {
        results.push({
          type: 'house',
          title: `${h.number}th House: ${h.sanskritName}`,
          subtitle: h.keySignifications.slice(0, 3).join(', '),
          house: h.number,
        });
      }
    });

    // 3. Search in Planets
    Object.values(PLANETS_DATA).forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.sanskritName.toLowerCase().includes(q) ||
        p.gemstone.toLowerCase().includes(q) ||
        p.rulingSigns.some((r) => r.toLowerCase().includes(q))
      ) {
        results.push({
          type: 'planet',
          title: `${p.avatar} ${p.name} (${p.sanskritName})`,
          subtitle: `Ruler of ${p.rulingSigns.join(', ')} • Gemstone: ${p.gemstone}`,
          planet: p.id,
        });
      }

      // Search in specific house effects
      Object.entries(p.effects).forEach(([hNumStr, eff]) => {
        const hNum = Number(hNumStr) as HouseNumber;
        if (eff.bulletPoints.some((pt) => pt.toLowerCase().includes(q))) {
          results.push({
            type: 'effect',
            title: `${p.name} in ${hNum}th House`,
            subtitle: eff.bulletPoints[0],
            house: hNum,
            planet: p.id,
          });
        }
      });
    });

    return results.slice(0, 20);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 min-w-0 box-border">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-700 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search astrology services, topics (e.g. Kundli, marriage, wealth, Saturn)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Quick Life Topic Chips */}
          {!query && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Popular Life Topics &amp; Questions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_LIFE_QUERIES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectHouse(item.house);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 hover:border-amber-700 text-left border border-stone-200 text-xs font-medium text-stone-800 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="text-[11px] text-amber-800 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-semibold">
                      {item.house}th House &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Matching Results ({searchResults.length}):
              </span>

              {searchResults.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No matching astrological results found for "{query}". Try terms like "Kundli", "wealth", "career", "Saturn", or "Gemstones".
                </div>
              ) : (
                searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (res.tab && onNavigateToTab) {
                        onNavigateToTab(res.tab);
                      } else if (res.house) {
                        onSelectHouse(res.house);
                      } else if (res.planet) {
                        onSelectPlanet(res.planet);
                      }
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-stone-50 hover:bg-amber-50 hover:border-amber-700 border border-stone-200 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="pr-3 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-950 font-vedic truncate">{res.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase shrink-0 ${
                          res.type === 'service'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                            : 'bg-stone-200 text-stone-700'
                        }`}>
                          {res.type}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">{res.subtitle}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
