import React, { useState } from 'react';
import { CompleteKundliData, DivisionalChartType, DivisionalChartInfo } from '../../data/vedicEphemeris';
import { VedicChartSvg } from '../VedicChartSvg';
import { ChartStyle, HouseNumber } from '../../types/astrology';
import { HOUSES_DATA } from '../../data/housesData';
import { RASHI_NAMES } from '../../data/vedicAstrologyCalculator';
import {
  Compass,
  Grid,
  Maximize2,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

interface AllDivisionalChartsGridProps {
  kundliData: CompleteKundliData;
}

type VargaCategory = 'all' | 'primary' | 'wealth' | 'family' | 'higher';

export const AllDivisionalChartsGrid: React.FC<AllDivisionalChartsGridProps> = ({
  kundliData,
}) => {
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north');
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('grid');
  const [activeCategory, setActiveCategory] = useState<VargaCategory>('all');
  const [focusedChartId, setFocusedChartId] = useState<DivisionalChartType>('D1');
  const [selectedHouse, setSelectedHouse] = useState<HouseNumber | null>(1);

  const availableVargas: DivisionalChartType[] = Object.keys(
    kundliData.divisionalCharts
  ) as DivisionalChartType[];

  const categoryMap: Record<VargaCategory, DivisionalChartType[]> = {
    all: availableVargas,
    primary: (['D1', 'D9', 'D10'] as DivisionalChartType[]).filter((v) => availableVargas.includes(v)),
    wealth: (['D2', 'D4', 'D16'] as DivisionalChartType[]).filter((v) => availableVargas.includes(v)),
    family: (['D3', 'D7', 'D12'] as DivisionalChartType[]).filter((v) => availableVargas.includes(v)),
    higher: (['D20', 'D24', 'D27', 'D30', 'D60'] as DivisionalChartType[]).filter((v) => availableVargas.includes(v)),
  };

  const displayedVargas = categoryMap[activeCategory] || availableVargas;
  const currentFocusedChart: DivisionalChartInfo =
    kundliData.divisionalCharts[focusedChartId] || kundliData.divisionalCharts['D1'];

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-950 flex items-center gap-1.5 font-vedic text-sm">
            <Layers className="w-4 h-4 text-amber-700" />
            <span>षोडशवर्ग कुण्डलियाँ (All Divisional Varga Charts)</span>
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-bold font-mono">
            {availableVargas.length} Vargas
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-white rounded-lg border border-stone-200 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 font-semibold ${
                viewMode === 'grid'
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 font-semibold ${
                viewMode === 'single'
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Single Chart Focus</span>
            </button>
          </div>

          {/* Chart Style Toggle: North vs South */}
          <div className="flex items-center p-1 bg-white rounded-lg border border-stone-200 shadow-2xs">
            <button
              onClick={() => setChartStyle('north')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                chartStyle === 'north'
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              North
            </button>
            <button
              onClick={() => setChartStyle('south')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                chartStyle === 'south'
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              South
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          { id: 'all', label: `All Charts (${availableVargas.length})` },
          { id: 'primary', label: 'Core Trio (D1, D9, D10)' },
          { id: 'wealth', label: 'Wealth & Property (D2, D4, D16)' },
          { id: 'family', label: 'Progeny & Heritage (D3, D7, D12)' },
          { id: 'higher', label: 'Karma & Wisdom (D20, D24, D27, D30, D60)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as VargaCategory)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-amber-950 text-amber-100 shadow-2xs font-bold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* VIEW MODE 1: MULTI-CHART GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedVargas.map((vType) => {
            const vInfo = kundliData.divisionalCharts[vType];
            if (!vInfo) return null;
            return (
              <div
                key={vType}
                className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-amber-950 font-mono">
                        {vType}
                      </span>
                      <strong className="text-xs font-bold text-stone-900 font-vedic">
                        {vInfo?.name || vType}
                      </strong>
                    </div>
                    <span className="text-[10px] text-amber-900 font-medium block">
                      {vInfo?.sanskritName || ''}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setFocusedChartId(vType);
                      setViewMode('single');
                    }}
                    className="p-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-900 transition-colors text-[10px] font-semibold flex items-center gap-1 px-2"
                    title="Focus on this chart in full view"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Focus</span>
                  </button>
                </div>

                <p className="text-[10.5px] text-stone-500 leading-snug line-clamp-2">
                  {vInfo.significance}
                </p>

                {/* Compact SVG Vector Chart */}
                <div className="my-1 max-w-[280px] mx-auto w-full">
                  <VedicChartSvg
                    chartData={vInfo}
                    grahas={kundliData.grahas}
                    chartStyle={chartStyle}
                    showDegrees={false}
                  />
                </div>

                <div className="text-[10px] text-stone-500 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                  <span>Lagna: <strong>{RASHI_NAMES[vInfo.lagnaSign - 1].split(' ')[0]}</strong></span>
                  <span className="font-mono text-stone-400">Sign #{vInfo.lagnaSign}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: SINGLE CHART FOCUS */}
      {viewMode === 'single' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
          {/* Chart Switcher Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 border-b border-stone-100">
            {availableVargas.map((vType) => {
              const isSelected = focusedChartId === vType;
              const vInfo = kundliData.divisionalCharts[vType];
              return (
                <button
                  key={vType}
                  onClick={() => setFocusedChartId(vType)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-950 text-amber-100 shadow-2xs font-bold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {vType} • {(vInfo?.name || vType).split(' ')[0]}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Vector Chart */}
            <div className="lg:col-span-6 space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-black text-stone-900 font-vedic">
                  {currentFocusedChart?.name || 'Divisional Chart'} ({currentFocusedChart?.id})
                </h3>
                <span className="text-xs text-amber-900 font-semibold block">
                  {currentFocusedChart?.sanskritName}
                </span>
                <p className="text-xs text-stone-600 mt-1">
                  {currentFocusedChart?.significance}
                </p>
              </div>

              <div className="max-w-[380px] mx-auto">
                <VedicChartSvg
                  chartData={currentFocusedChart}
                  grahas={kundliData.grahas}
                  chartStyle={chartStyle}
                  selectedHouse={selectedHouse || undefined}
                  onHouseClick={(h) => setSelectedHouse(h)}
                  showDegrees={true}
                />
              </div>

              <p className="text-[11px] text-stone-400 text-center italic">
                Click any house on the chart to inspect its planetary occupants and significations
              </p>
            </div>

            {/* Right: Selected House Breakdown & Planet Distribution */}
            <div className="lg:col-span-6 space-y-3">
              {selectedHouse && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-amber-950 font-vedic text-sm">
                      {selectedHouse}th House: {HOUSES_DATA[selectedHouse]?.sanskritName} ({HOUSES_DATA[selectedHouse]?.name})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-semibold text-[10.5px]">
                      Sign: {currentFocusedChart?.lagnaHouseSign?.[selectedHouse] ? RASHI_NAMES[currentFocusedChart.lagnaHouseSign[selectedHouse] - 1] : 'Aries'}
                    </span>
                  </div>

                  <p className="text-stone-700 leading-relaxed text-[11.5px]">
                    {HOUSES_DATA[selectedHouse]?.description}
                  </p>

                  <div className="pt-2 border-t border-amber-200/60">
                    <span className="font-bold text-amber-950 block mb-1">
                      Planets in this House in {currentFocusedChart?.id}:
                    </span>
                    {(() => {
                      const occupants = Object.entries(currentFocusedChart?.planetPlacements || {})
                        .filter(([_, house]) => house === selectedHouse)
                        .map(([pId]) => pId);

                      if (occupants.length === 0) {
                        return (
                          <span className="text-stone-500 italic text-xs">
                            No planets placed in this house in {currentFocusedChart?.name || 'this chart'}.
                          </span>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2 flex-wrap">
                          {occupants.map((pId) => {
                            const g = kundliData.grahas[pId as any];
                            return (
                              <span
                                key={pId}
                                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-bold text-amber-950 flex items-center gap-1 shadow-2xs text-xs"
                              >
                                <span>{g.avatar}</span>
                                <span>{g.name} ({g.sanskritName})</span>
                              </span>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="pt-2 border-t border-amber-200/60 text-[10.5px] text-stone-600">
                    <strong>Key Themes:</strong> {HOUSES_DATA[selectedHouse].keySignifications.join(', ')}
                  </div>
                </div>
              )}

              {/* Complete 12 House Matrix for this Varga */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-white text-xs">
                <div className="p-2.5 bg-stone-100 font-bold text-stone-800 border-b border-stone-200 flex items-center justify-between">
                  <span>12 Bhavas Layout in {currentFocusedChart.id}</span>
                  <span className="text-[10.5px] text-stone-500 font-normal">
                    Lagna Sign: {RASHI_NAMES[currentFocusedChart.lagnaSign - 1].split(' ')[0]}
                  </span>
                </div>
                <div className="max-h-[260px] overflow-y-auto divide-y divide-stone-100">
                  {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as HouseNumber[]).map((h) => {
                    const signNum = currentFocusedChart?.lagnaHouseSign?.[h] || h;
                    const occupants = Object.entries(currentFocusedChart?.planetPlacements || {})
                      .filter(([_, house]) => house === h)
                      .map(([pId]) => pId);
                    const isSelected = selectedHouse === h;

                    return (
                      <div
                        key={h}
                        onClick={() => setSelectedHouse(h)}
                        className={`p-2 px-3 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? 'bg-amber-100/60 font-semibold' : 'hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-700 text-[10px]">
                            {h}
                          </span>
                          <span className="text-stone-800">
                            {HOUSES_DATA[h].sanskritName.split(' ')[0]}
                          </span>
                          <span className="text-stone-500 text-[10.5px]">
                            ({RASHI_NAMES[signNum - 1].split(' ')[0]})
                          </span>
                        </div>

                        <div>
                          {occupants.length > 0 ? (
                            <div className="flex items-center gap-1">
                              {occupants.map((pId) => (
                                <span
                                  key={pId}
                                  className="text-[11px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                                >
                                  {kundliData.grahas[pId as any]?.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-stone-400 text-[10px] italic">Empty</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
