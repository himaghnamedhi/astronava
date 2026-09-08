import React from 'react';
import { CompleteKundliData, DivisionalChartType } from '../../data/vedicEphemeris';
import { TraditionalVedicChartSvg } from '../TraditionalVedicChartSvg';
import { VedicOrnamentalBorder } from './VedicOrnamentalBorder';
import { RASHI_NAMES } from '../../data/vedicAstrologyCalculator';

interface PatrikaDivisionalChartsPageProps {
  kundliData: CompleteKundliData;
  brandName?: string;
  websiteAddress?: string;
  servicesLine?: string;
  contactLine?: string;
  pageNumber?: number | string;
}

export const PatrikaDivisionalChartsPage: React.FC<PatrikaDivisionalChartsPageProps> = ({
  kundliData,
  brandName = 'Astronava',
  websiteAddress = 'www.astronava.vercel.app',
  servicesLine = 'Astrology | Numerology | Palmistry | Occult | Courses | Tarot Card | Gemsstone | Vastu',
  contactLine = 'www.astronava.vercel.app',
  pageNumber = 3,
}) => {
  const vargasToShow: DivisionalChartType[] = ['D1', 'D9', 'D10', 'D7', 'D2', 'D3', 'D4', 'D12'];

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
            ग्रह स्पष्ट एवं षोडशवर्ग चक्र
          </span>
          <span>॥ शुभम् भवतु ॥</span>
        </div>
        <h2 className="text-lg font-black font-vedic text-amber-950 tracking-tight">
          GRAHA SPASHTA &amp; DIVISIONAL CHARTS (VARGAS)
        </h2>
        <div className="flex items-center justify-center gap-3 text-[10px] text-stone-600 mt-0.5">
          <span>Native: <strong className="text-amber-950">{kundliData.birthDetails.name || 'Native'}</strong></span>
          <span>•</span>
          <span>DOB: <strong>{kundliData.birthDetails.dob}</strong> {kundliData.birthDetails.tob}</span>
          <span>•</span>
          <span>POB: <strong>{kundliData.birthDetails.city}</strong></span>
          <span>•</span>
          <span>Ayanamsha: <strong>{kundliData.formattedAyanamsha} (Lahiri)</strong></span>
        </div>
      </div>

      {/* SECTION 1: GRAHA SPASHTA TABLE */}
      <div className="space-y-1 z-10">
        <div className="flex items-center justify-between text-[10px] font-bold text-amber-950 font-vedic uppercase">
          <span>ग्रह स्पष्ट तालिका (Complete Planetary Longitudes &amp; Dignities)</span>
          <span className="text-[9px] text-stone-500 font-normal">Nirayana Sidereal System</span>
        </div>
        <div className="border border-stone-300 rounded-lg overflow-hidden bg-white text-[9.5px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200 text-[9px]">
              <tr>
                <th className="p-1 border-r border-stone-200">ग्रह (Planet)</th>
                <th className="p-1 border-r border-stone-200">राशि (Sign)</th>
                <th className="p-1 border-r border-stone-200 font-mono">अंश (Degrees)</th>
                <th className="p-1 border-r border-stone-200">नक्षत्र व चरण</th>
                <th className="p-1 border-r border-stone-200 text-center">भाव</th>
                <th className="p-1 border-r border-stone-200">स्थिति (Dignity)</th>
                <th className="p-1 border-r border-stone-200">अवस्था</th>
                <th className="p-1 border-r border-stone-200">कारक (Karaka)</th>
                <th className="p-1 text-center">गति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-[9px]">
              {kundliData.grahasList.map((g) => (
                <tr key={g.id} className="hover:bg-amber-50/40">
                  <td className="p-1 font-bold text-stone-900 border-r border-stone-200 whitespace-nowrap">
                    {g.name} ({g.sanskritName})
                  </td>
                  <td className="p-1 border-r border-stone-200 whitespace-nowrap">
                    {g.rashiName.split(' ')[0]} ({g.rashiLord})
                  </td>
                  <td className="p-1 font-mono font-bold text-stone-800 border-r border-stone-200 whitespace-nowrap">
                    {g.formattedDegree}
                  </td>
                  <td className="p-1 border-r border-stone-200 whitespace-nowrap">
                    {g.nakshatraName} (P{g.nakshatraPada}) • {g.nakshatraLord}
                  </td>
                  <td className="p-1 text-center font-bold text-amber-950 border-r border-stone-200 whitespace-nowrap">
                    {g.house}H
                  </td>
                  <td className="p-1 border-r border-stone-200 whitespace-nowrap font-medium">
                    {g.dignity}
                  </td>
                  <td className="p-1 border-r border-stone-200 whitespace-nowrap text-stone-600">
                    {g.avastha?.split(' ')[0] || 'Yuva'}
                  </td>
                  <td className="p-1 border-r border-stone-200 whitespace-nowrap text-stone-700">
                    {g.karaka?.split(' ')[0] || '-'}
                  </td>
                  <td className="p-1 text-center whitespace-nowrap">
                    {g.isRetrograde ? (
                      <span className="font-bold text-rose-700">[व] Vakri</span>
                    ) : g.isCombust ? (
                      <span className="font-bold text-orange-700">[अस्त]</span>
                    ) : (
                      'Direct'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: DIVISIONAL CHARTS GRID (8 VARGAS) */}
      <div className="space-y-1 z-10 flex-1 flex flex-col justify-around my-1">
        <div className="text-[10px] font-bold text-amber-950 font-vedic uppercase tracking-wider">
          षोडशवर्ग प्रमुख चक्र (Core Shodashavarga Charts Grid)
        </div>
        <div className="grid grid-cols-4 gap-2">
          {vargasToShow.map((vType) => {
            const vInfo = kundliData.divisionalCharts[vType];
            if (!vInfo) return null;

            // Generate planet distribution mapping for the traditional chart svg
            const chartPlanets = Object.entries(vInfo.planetPlacements).map(([pId, house]) => ({
              id: pId as any,
              name: pId.slice(0, 2).toUpperCase(),
              hindi: pId === 'sun' ? 'सू' : pId === 'moon' ? 'चं' : pId === 'mars' ? 'मं' : pId === 'mercury' ? 'बु' : pId === 'jupiter' ? 'गु' : pId === 'venus' ? 'शु' : pId === 'saturn' ? 'श' : pId === 'rahu' ? 'रा' : 'के',
              house: house as any,
              dms: '',
              isRetrograde: kundliData.grahas[pId as any]?.isRetrograde || false,
            }));

            return (
              <div
                key={vType}
                className="bg-white rounded border border-stone-300 p-1.5 shadow-2xs flex flex-col justify-between"
              >
                <div className="text-center border-b border-stone-200 pb-0.5 mb-1">
                  <span className="font-bold text-[9.5px] text-amber-950 block">
                    {vType}: {(vInfo?.name || vType).split(' ')[0]} ({(vInfo?.sanskritName || '').split(' ')[0]})
                  </span>
                  <span className="text-[8px] text-stone-500 block leading-tight truncate">
                    Lagna: {vInfo?.lagnaSign ? (RASHI_NAMES[vInfo.lagnaSign - 1] || 'Aries').split(' ')[0] : 'Aries'}
                  </span>
                </div>

                <div className="w-[140px] h-[140px] mx-auto">
                  <TraditionalVedicChartSvg
                    chartData={vInfo}
                    grahas={kundliData.grahas}
                  />
                </div>

                <div className="text-[7.5px] text-stone-500 text-center mt-1 leading-tight line-clamp-1">
                  {vInfo.significance}
                </div>
              </div>
            );
          })}
        </div>
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
