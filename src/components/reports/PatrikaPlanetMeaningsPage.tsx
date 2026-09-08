import React from 'react';
import { CompleteKundliData } from '../../data/vedicEphemeris';
import { PLANETS_DATA } from '../../data/planetsData';
import { HOUSES_DATA } from '../../data/housesData';
import { VedicOrnamentalBorder } from './VedicOrnamentalBorder';

interface PatrikaPlanetMeaningsPageProps {
  kundliData: CompleteKundliData;
  brandName?: string;
  websiteAddress?: string;
  servicesLine?: string;
  contactLine?: string;
  pageNumber?: number | string;
}

export const PatrikaPlanetMeaningsPage: React.FC<PatrikaPlanetMeaningsPageProps> = ({
  kundliData,
  brandName = 'Astronava',
  websiteAddress = 'www.astronava.vercel.app',
  servicesLine = 'Astrology | Numerology | Palmistry | Occult | Courses | Tarot Card | Gemsstone | Vastu',
  contactLine = 'www.astronava.vercel.app',
  pageNumber = 4,
}) => {
  return (
    <div
      className="pdf-report-page bg-[#FCFBF9] text-stone-900 mx-auto relative box-border overflow-hidden shadow-xl border border-stone-300 w-[794px] h-[1123px] max-h-[1123px] flex flex-col justify-between p-6"
      style={{
        pageBreakAfter: 'always',
        pageBreakInside: 'avoid',
      }}
    >
      <VedicOrnamentalBorder />

      {/* TOP HEADER */}
      <div className="text-center border-b-2 border-amber-900/40 pb-2 z-10">
        <div className="flex justify-between text-[11px] font-serif text-amber-950 px-2 mb-0.5">
          <span>॥ ॐ श्री गणेशाय नमः ॥</span>
          <span className="font-bold uppercase tracking-widest text-[10.5px] font-vedic text-amber-900">
            ग्रह भाव फल व्याख्या
          </span>
          <span>॥ शुभम् भवतु ॥</span>
        </div>
        <h2 className="text-lg font-black font-vedic text-amber-950 tracking-tight">
          PLANETARY PLACEMENTS &amp; HOUSE INTERPRETATIONS
        </h2>
        <div className="flex items-center justify-center gap-3 text-[10px] text-stone-600 mt-0.5">
          <span>Native: <strong className="text-amber-950">{kundliData?.birthDetails?.name || 'Native'}</strong></span>
          <span>•</span>
          <span>Lagna: <strong>{kundliData?.lagna?.signName || kundliData?.lagnaSignName || 'Aries'} ({kundliData?.lagna?.lord || 'Mars'})</strong></span>
          <span>•</span>
          <span>Nakshatra: <strong>{kundliData?.nakshatra?.name || kundliData?.grahas?.moon?.nakshatraName || 'Janma Nakshatra'} (Pada {kundliData?.nakshatra?.pada || kundliData?.grahas?.moon?.nakshatraPada || 1})</strong></span>
        </div>
      </div>

      {/* 9 PLANETS DETAILED GRID */}
      <div className="grid grid-cols-3 gap-2.5 z-10 my-auto">
        {(kundliData?.grahasList || []).map((graha) => {
          const pInfo = PLANETS_DATA[graha.id];
          const effect = pInfo?.effects?.[graha.house];
          const house = HOUSES_DATA[graha.house] || HOUSES_DATA[1];

          return (
            <div
              key={graha.id}
              className="bg-white rounded-lg border border-stone-300 p-2 shadow-2xs flex flex-col justify-between text-[9px] space-y-1"
            >
              {/* Card Title Bar */}
              <div className="border-b border-stone-200 pb-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{graha.avatar}</span>
                  <div>
                    <strong className="text-[10px] font-bold text-stone-900 font-vedic block leading-tight">
                      {graha.name} in {graha.house}H
                    </strong>
                    <span className="text-[8px] text-amber-900 block leading-tight">
                      {graha.sanskritName} • {graha.rashiName.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-100 font-bold text-amber-950 block">
                    {graha.dignity.split(' ')[0]}
                  </span>
                  {graha.isRetrograde && (
                    <span className="text-[7.5px] text-rose-700 font-bold block">[व] Vakri</span>
                  )}
                </div>
              </div>

              {/* What it means */}
              <div className="space-y-0.5">
                <span className="text-[8px] font-bold text-stone-500 uppercase block">Significance &amp; Karma:</span>
                <p className="text-stone-800 leading-snug line-clamp-3 text-[8.5px]">
                  {effect?.summary || `${graha.name} in house ${graha.house} influences ${house.name}.`}
                </p>
              </div>

              {/* Key Blessings */}
              {effect?.strengths && (
                <div className="bg-emerald-50/70 p-1 rounded border border-emerald-200 text-[8px] text-emerald-950">
                  <strong>Strength:</strong> {effect.strengths.slice(0, 2).join(', ')}
                </div>
              )}

              {/* Actionable Remedy */}
              {effect?.remedy && (
                <div className="bg-amber-50/80 p-1 rounded border border-amber-200 text-[8px] text-amber-950">
                  <strong>Remedy:</strong> <span className="line-clamp-2">{effect.remedy}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="pt-2 border-t border-stone-300 text-center space-y-0.5 z-10">
        <div className="text-[10.5px] font-bold text-stone-900 font-serif">{brandName}</div>
        <div className="text-[8.5px] text-stone-600">{servicesLine}</div>
        <div className="flex items-center justify-between text-[9px] text-stone-500 pt-0.5">
          <span>{contactLine}</span>
          <span className="font-semibold text-amber-900 underline">{websiteAddress}</span>
          <span className="font-bold text-[#c0262d] text-xs font-mono">Page {pageNumber}</span>
        </div>
      </div>
    </div>
  );
};
