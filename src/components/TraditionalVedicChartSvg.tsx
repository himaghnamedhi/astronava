import React from 'react';
import { HouseNumber, PlanetId } from '../types/astrology';
import { GrahaSpashta, DivisionalChartInfo } from '../data/vedicEphemeris';

interface TraditionalVedicChartSvgProps {
  chartData?: DivisionalChartInfo;
  grahas?: Record<PlanetId, GrahaSpashta>;
  title?: string;
  className?: string;
  isBhavaChart?: boolean;
}

// Geometry for North Indian Diamond Chart (300x300)
const TRAD_CHART_HOUSE_CENTERS: Record<
  HouseNumber,
  {
    signX: number;
    signY: number;
    planetsX: number;
    planetsY: number;
  }
> = {
  1: { signX: 150, signY: 52, planetsX: 150, planetsY: 82 },
  2: { signX: 75, signY: 26, planetsX: 75, planetsY: 48 },
  3: { signX: 34, signY: 64, planetsX: 42, planetsY: 88 },
  4: { signX: 98, signY: 150, planetsX: 72, planetsY: 154 },
  5: { signX: 34, signY: 236, planetsX: 42, planetsY: 212 },
  6: { signX: 75, signY: 274, planetsX: 75, planetsY: 252 },
  7: { signX: 150, signY: 248, planetsX: 150, planetsY: 218 },
  8: { signX: 225, signY: 274, planetsX: 225, planetsY: 252 },
  9: { signX: 266, signY: 236, planetsX: 258, planetsY: 212 },
  10: { signX: 202, signY: 150, planetsX: 228, planetsY: 154 },
  11: { signX: 266, signY: 64, planetsX: 258, planetsY: 88 },
  12: { signX: 225, signY: 26, planetsX: 225, planetsY: 48 },
};

// Hindi Devanagari short symbols and colors as seen in the classical patrika
const TRAD_GRAHA_CONFIG: Record<PlanetId, { hindi: string; color: string }> = {
  sun: { hindi: 'सू', color: '#b91c1c' },
  moon: { hindi: 'चं', color: '#0284c7' },
  mars: { hindi: 'मं', color: '#dc2626' },
  mercury: { hindi: 'बु', color: '#059669' },
  jupiter: { hindi: 'गु', color: '#d97706' },
  venus: { hindi: 'शु', color: '#059669' },
  saturn: { hindi: 'श', color: '#334155' },
  rahu: { hindi: 'रा', color: '#1e293b' },
  ketu: { hindi: 'के', color: '#78350f' },
};

export const TraditionalVedicChartSvg: React.FC<TraditionalVedicChartSvgProps> = ({
  chartData,
  grahas,
  className = '',
}) => {
  // Defensive guard
  const planetPlacements = chartData?.planetPlacements || ({} as Record<PlanetId, HouseNumber>);
  const lagnaHouseSign = chartData?.lagnaHouseSign || ({} as Record<HouseNumber, number>);

  // Group planets by house (1-12)
  const occupantsByHouse: Record<HouseNumber, PlanetId[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [],
  };

  (Object.keys(planetPlacements) as PlanetId[]).forEach((pId) => {
    const h = planetPlacements[pId];
    if (h >= 1 && h <= 12) {
      occupantsByHouse[h].push(pId);
    }
  });

  return (
    <div className={`relative aspect-square select-none max-w-[280px] w-full mx-auto ${className}`}>
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full bg-[#FFFFFF]"
      >
        {/* Outer frame with double/triple red borders and decorative black rosettes at 4 corners */}
        <rect x="2" y="2" width="296" height="296" fill="#FFFFFF" stroke="#b91c1c" strokeWidth="2.5" />
        <rect x="5.5" y="5.5" width="289" height="289" fill="none" stroke="#b91c1c" strokeWidth="1" />
        <rect x="8" y="8" width="284" height="284" fill="none" stroke="#b91c1c" strokeWidth="1.5" />

        {/* 4 Corner Screws / Rosettes (matching classical Patrika style) */}
        {([
          { cx: 5.5, cy: 5.5 },
          { cx: 294.5, cy: 5.5 },
          { cx: 5.5, cy: 294.5 },
          { cx: 294.5, cy: 294.5 },
          // Midpoint rosettes on border
          { cx: 5.5, cy: 150 },
          { cx: 294.5, cy: 150 },
          { cx: 150, cy: 5.5 },
          { cx: 150, cy: 294.5 },
        ]).map((dot, idx) => (
          <g key={idx}>
            <circle cx={dot.cx} cy={dot.cy} r="3.2" fill="#1c1917" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx={dot.cx} cy={dot.cy} r="1.2" fill="#ffffff" />
          </g>
        ))}

        {/* Diagonals */}
        <line x1="8" y1="8" x2="292" y2="292" stroke="#b91c1c" strokeWidth="1.6" />
        <line x1="292" y1="8" x2="8" y2="292" stroke="#b91c1c" strokeWidth="1.6" />

        {/* Diamond connecting midpoints */}
        <line x1="150" y1="8" x2="8" y2="150" stroke="#b91c1c" strokeWidth="1.6" />
        <line x1="8" y1="150" x2="150" y2="292" stroke="#b91c1c" strokeWidth="1.6" />
        <line x1="150" y1="292" x2="292" y2="150" stroke="#b91c1c" strokeWidth="1.6" />
        <line x1="292" y1="150" x2="150" y2="8" stroke="#b91c1c" strokeWidth="1.6" />

        {/* Render 12 Houses */}
        {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as HouseNumber[]).map((hNum) => {
          const geo = TRAD_CHART_HOUSE_CENTERS[hNum];
          const signNum = lagnaHouseSign[hNum] || hNum;
          const occupants = occupantsByHouse[hNum];

          return (
            <g key={hNum}>
              {/* Zodiac Sign Number (Subtle red/amber corner digit) */}
              <text
                x={geo.signX}
                y={geo.signY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#b91c1c"
                fontSize="9.5"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
                className="select-none pointer-events-none"
              >
                {signNum}
              </text>

              {/* Planets with Devanagari Abbreviation & Exact Degree Subscript (e.g. मं₀₄, रा₂₆) */}
              {occupants.length > 0 && (
                <g>
                  {occupants.map((pId, idx) => {
                    const cfg = TRAD_GRAHA_CONFIG[pId] || { hindi: pId.substring(0, 2), color: '#334155' };
                    const gSpashta = grahas ? grahas[pId] : undefined;
                    const deg = gSpashta ? Math.floor(gSpashta.degreesInRashi) : null;
                    const degStr = deg !== null ? deg.toString().padStart(2, '0') : '';

                    // Stacking layout
                    const lineCount = occupants.length;
                    const spacing = lineCount <= 2 ? 14 : lineCount <= 3 ? 12 : 10.5;
                    const yOffset = (idx - (lineCount - 1) / 2) * spacing;

                    return (
                      <g key={pId} transform={`translate(${geo.planetsX}, ${geo.planetsY + yOffset})`}>
                        {/* Graha short Devanagari text */}
                        <text
                          x="-3"
                          y="0"
                          textAnchor="end"
                          dominantBaseline="central"
                          fill={cfg.color}
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="'Noto Sans Devanagari', 'Mangal', sans-serif"
                        >
                          {cfg.hindi}
                        </text>

                        {/* Degree in small subscript next to it */}
                        {degStr && (
                          <text
                            x="0"
                            y="2"
                            textAnchor="start"
                            dominantBaseline="central"
                            fill="#57534e"
                            fontSize="7.5"
                            fontWeight="600"
                            fontFamily="monospace"
                          >
                            {degStr}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
