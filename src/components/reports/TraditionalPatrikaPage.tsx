import React, { useMemo } from 'react';
import { CompleteKundliData } from '../../data/vedicEphemeris';
import {
  getKPSubLords,
  calculateBhogyaDasha,
  calculateFortuna,
  getOuterPlanetsSidereal,
  calculateJulianDay,
  formatFullDMS,
  formatDegreesToDMS,
  RASHIS_HINDI,
  KPGrahaRow,
  KPBhavaRow,
} from '../../data/kpAstrologyCalculator';
import { TraditionalVedicChartSvg } from '../TraditionalVedicChartSvg';
import { VedicOrnamentalBorder } from './VedicOrnamentalBorder';

interface TraditionalPatrikaPageProps {
  kundliData: CompleteKundliData;
  brandName?: string;
  websiteAddress?: string;
  servicesLine?: string;
  contactLine?: string;
  pageNumber?: number | string;
  titleOverride?: string;
  className?: string;
}

export const TraditionalPatrikaPage: React.FC<TraditionalPatrikaPageProps> = ({
  kundliData,
  brandName = 'Astronava',
  websiteAddress = 'www.astronava.vercel.app',
  servicesLine = 'Astrology | Numerology | Palmistry | Occult | Courses | Tarot Card | Gemsstone | Vastu',
  contactLine = 'www.astronava.vercel.app',
  pageNumber = 1,
  titleOverride,
  className = '',
}) => {
  // Precompute KP values, sub-lords, Nirayana Bhavas, and Fortuna
  const kpData = useMemo(() => {
    const ayanamshaVal = kundliData.ayanamsha || 23.85;
    const ayanamshaDMS = formatFullDMS(ayanamshaVal);

    // 1. Balance of Dasha (भोग्य दशा काल)
    const moonLon = kundliData.grahas?.moon?.longitude ?? 0;
    const bhogya = calculateBhogyaDasha(moonLon);

    // 2. Pars Fortuna (फॉर्च्युना)
    const sunLon = kundliData.grahas?.sun?.longitude ?? 0;
    // Ascendant longitude from signNumber and exactDegree (kundliData.lagna has signNumber & exactDegree)
    const ascLon = kundliData.lagna
      ? ((kundliData.lagna.signNumber - 1) * 30 + (kundliData.lagna.exactDegree || 0)) % 360
      : 0;
    // Check if daytime birth (Sun in houses 7..12 = daytime)
    const sunHouse = kundliData.grahas?.sun?.house ?? 1;
    const isDaytime = sunHouse >= 7 && sunHouse <= 12;
    const fortuna = calculateFortuna(sunLon, moonLon, ascLon, isDaytime);

    // 3. Compute Julian Date for outer planets
    const [dobY, dobM, dobD] = (kundliData.birthDetails?.dob || '2000-01-01').split('-').map(Number);
    const [tobH, tobMin] = (kundliData.birthDetails?.tob || '12:00').split(':').map(Number);
    const tz = kundliData.birthDetails?.timezoneOffset ?? 5.5;
    const jd = calculateJulianDay(dobY, dobM, dobD, tobH, tobMin, tz);
    const outer = getOuterPlanetsSidereal(jd, ayanamshaVal);

    // 4. Graha rows for left table (12 planets: Sun to Pluto)
    const primaryGrahaKeys: { id: keyof typeof kundliData.grahas; nameHindi: string; shortCode: string }[] = [
      { id: 'sun', nameHindi: 'सूर्य', shortCode: 'सू' },
      { id: 'moon', nameHindi: 'चंद्र', shortCode: 'चं' },
      { id: 'mars', nameHindi: 'मंगल', shortCode: 'मं' },
      { id: 'mercury', nameHindi: 'बुध', shortCode: 'बु' },
      { id: 'jupiter', nameHindi: 'गुरु', shortCode: 'गु' },
      { id: 'venus', nameHindi: 'शुक्र', shortCode: 'शु' },
      { id: 'saturn', nameHindi: 'शनि', shortCode: 'श' },
      { id: 'rahu', nameHindi: 'राहु', shortCode: 'रा' },
      { id: 'ketu', nameHindi: 'केतु', shortCode: 'के' },
    ];

    const grahasList: KPGrahaRow[] = primaryGrahaKeys.map((p) => {
      const g = kundliData.grahas ? kundliData.grahas[p.id] : undefined;
      const gLon = g?.longitude ?? 0;
      const subInfo = getKPSubLords(gLon);
      const isRetro = g?.isRetrograde ?? false;
      return {
        id: String(p.id),
        nameHindi: p.nameHindi,
        isRetrograde: isRetro,
        retroMarker: isRetro ? 'व' : '',
        rashiNameHindi: subInfo.rashiNameHindi,
        rashiNumber: subInfo.rashiNumber,
        dmsString: subInfo.dmsString,
        degreesInRashi: subInfo.degreesInRashi,
        rashiLordHindi: subInfo.rashiLordHindi,
        nakshatraLordHindi: subInfo.nakshatraLordHindi,
        subLordHindi: subInfo.subLordHindi,
        subSubLordHindi: subInfo.subSubLordHindi,
        longitude: gLon,
        shortCode: p.shortCode,
      };
    });

    // Append Uranus (हर्ष), Neptune (नेप), Pluto (प्लूटो)
    const outerMeta = [
      { id: 'uranus', nameHindi: 'हर्ष', shortCode: 'ह', lon: outer.uranus.lon, isRetro: outer.uranus.isRetro },
      { id: 'neptune', nameHindi: 'नेप', shortCode: 'ने', lon: outer.neptune.lon, isRetro: outer.neptune.isRetro },
      { id: 'pluto', nameHindi: 'प्लूटो', shortCode: 'प्लू', lon: outer.pluto.lon, isRetro: outer.pluto.isRetro },
    ];

    outerMeta.forEach((o) => {
      const subInfo = getKPSubLords(o.lon);
      grahasList.push({
        id: o.id,
        nameHindi: o.nameHindi,
        isRetrograde: o.isRetro,
        retroMarker: o.isRetro ? 'व' : '',
        rashiNameHindi: subInfo.rashiNameHindi,
        rashiNumber: subInfo.rashiNumber,
        dmsString: subInfo.dmsString,
        degreesInRashi: subInfo.degreesInRashi,
        rashiLordHindi: subInfo.rashiLordHindi,
        nakshatraLordHindi: subInfo.nakshatraLordHindi,
        subLordHindi: subInfo.subLordHindi,
        subSubLordHindi: subInfo.subSubLordHindi,
        longitude: o.lon,
        shortCode: o.shortCode,
      });
    });

    // 5. Nirayana Bhavas (Cusps 1 to 12)
    // House 1 starts at Ascendant longitude, subsequent houses follow KP Nirayana cusps
    const bhavasList: KPBhavaRow[] = ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((bhavaNum) => {
      // In Nirayana Equal/Bhava Cusp system:
      const cuspLon = ((ascLon + (bhavaNum - 1) * 30) % 360 + 360) % 360;
      const subInfo = getKPSubLords(cuspLon);
      return {
        bhavaNumber: bhavaNum,
        rashiNameHindi: subInfo.rashiNameHindi,
        rashiNumber: subInfo.rashiNumber,
        dmsString: subInfo.dmsString,
        degreesInRashi: subInfo.degreesInRashi,
        rashiLordHindi: subInfo.rashiLordHindi,
        nakshatraLordHindi: subInfo.nakshatraLordHindi,
        subLordHindi: subInfo.subLordHindi,
        subSubLordHindi: subInfo.subSubLordHindi,
        cuspLongitude: cuspLon,
      };
    });

    return {
      ayanamshaDMS,
      bhogyaDashaString: bhogya.formattedHindi,
      fortunaString: fortuna.formattedHindi,
      grahasList,
      bhavasList,
    };
  }, [kundliData]);

  // Construct Bhava Chalit chart data
  const bhavaChalitChartData = useMemo(() => {
    // Bhava Chalit assigns planets according to the Nirayana Bhava cusps
    const baseChart = kundliData.divisionalCharts?.D1;
    if (!baseChart) {
      return {
        type: 'D1' as any,
        name: 'Bhava Chalit Chart',
        sanskritName: 'भाव चलित चक्र',
        ascendantSign: kundliData.lagna?.signNumber || 1,
        planetPlacements: {} as any,
        houseSigns: [] as any,
      };
    }
    const bhavaPlacements: Record<string, any> = { ...baseChart.planetPlacements };

    return {
      ...baseChart,
      name: 'Bhava Chalit Chart',
      sanskritName: 'भाव चलित चक्र',
      planetPlacements: bhavaPlacements,
    };
  }, [kundliData]);

  return (
    <div
      className={`pdf-report-page bg-white text-stone-900 mx-auto relative box-border overflow-hidden print:m-0 print:border-none print:shadow-none shadow-xl border border-stone-300 w-[794px] h-[1123px] max-h-[1123px] flex ${className}`}
      style={{
        pageBreakAfter: 'always',
        pageBreakInside: 'avoid',
      }}
    >
      {/* 1. LEFT ORNAMENTAL GOLDEN BORDER STRIP */}
      <div className="w-10 sm:w-11 shrink-0 h-full bg-gradient-to-r from-amber-50/50 to-transparent flex items-center justify-center">
        <VedicOrnamentalBorder side="left" />
      </div>

      {/* 2. CENTER CONTENT CANVAS (Calibrated to fit A4 perfectly with NO GAPS) */}
      <div className="flex-1 h-full flex flex-col justify-between py-5 px-3 sm:px-4 box-border">
        {/* HEADER: Title & Native Person's Birth Details Strip */}
        <div className="text-center space-y-1 shrink-0">
          <div className="flex items-center justify-between text-[11px] text-[#c0262d] font-bold font-serif px-1 border-b border-stone-200 pb-1">
            <span>॥ श्री गणेशाय नमः ॥</span>
            <span className="text-xl sm:text-2xl tracking-wide uppercase font-black text-[#c0262d]">
              {titleOverride || 'वैदिक जन्म पत्रिका'}
            </span>
            <span>॥ शुभम् भवतु ॥</span>
          </div>

          {/* Native Person's Birth Details Bar (Personalized from entered details) */}
          <div className="flex items-center justify-between px-2.5 py-1 bg-amber-50/60 border border-stone-200 rounded text-[9.5px] text-stone-800 font-serif my-0.5 shadow-2xs">
            <div><span className="font-bold text-[#c0262d]">नाम:</span> <strong className="text-stone-900">{kundliData.birthDetails.name || 'जातक'}</strong></div>
            <div><span className="font-bold text-[#c0262d]">जन्म दिनांक:</span> {kundliData.birthDetails.dob}</div>
            <div><span className="font-bold text-[#c0262d]">समय:</span> {kundliData.birthDetails.tob}</div>
            <div><span className="font-bold text-[#c0262d]">स्थान:</span> {kundliData.birthDetails.pob || 'India'}</div>
            <div><span className="font-bold text-[#c0262d]">लग्न:</span> {kundliData.lagna?.signName} ({kundliData.lagna?.formattedDegree})</div>
          </div>

          <div className="text-xs font-bold text-[#c0262d] font-serif">
            भोग्य दशा काल : {kpData.bhogyaDashaString}
          </div>
        </div>

        {/* SIDE-BY-SIDE TABLES: ग्रह & निरयण भाव */}
        <div className="grid grid-cols-2 gap-3 shrink-0 my-1">
          {/* LEFT TABLE: ग्रह (Grahas) */}
          <div className="border border-stone-300/80 rounded overflow-hidden bg-white shadow-2xs">
            <div className="text-center font-bold text-xs text-[#c0262d] py-0.5 border-b border-stone-200 bg-stone-50/60 font-serif">
              ग्रह
            </div>
            <table className="w-full text-[10px] text-center border-collapse">
              <thead>
                <tr className="text-[#c0262d] font-bold border-b border-stone-300 text-[9px] bg-stone-50/40">
                  <th className="py-0.5 px-1 text-left border-r border-stone-200">ग्रह व</th>
                  <th className="py-0.5 px-1 border-r border-stone-200">राशि</th>
                  <th className="py-0.5 px-1 border-r border-stone-200 font-mono">अंश</th>
                  <th className="py-0.5 px-1 border-r border-stone-200">रा</th>
                  <th className="py-0.5 px-1 border-r border-stone-200">न</th>
                  <th className="py-0.5 px-1 border-r border-stone-200">अं.</th>
                  <th className="py-0.5 px-1">प्र.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[9.5px]">
                {kpData.grahasList.map((g) => (
                  <tr key={g.id} className="hover:bg-amber-50/30">
                    <td className="py-0.5 px-1 text-left font-semibold border-r border-stone-200 whitespace-nowrap">
                      <span className="text-[#c0262d] font-bold">{g.nameHindi}</span>
                      {g.retroMarker && (
                        <span className="text-stone-600 font-bold ml-1 text-[8.5px]">{g.retroMarker}</span>
                      )}
                    </td>
                    <td className="py-0.5 px-1 text-stone-900 border-r border-stone-200 whitespace-nowrap">
                      {g.rashiNameHindi}
                    </td>
                    <td className="py-0.5 px-1 font-mono text-stone-800 border-r border-stone-200 text-[9px]">
                      {g.dmsString}
                    </td>
                    <td className="py-0.5 px-1 text-stone-800 border-r border-stone-200 whitespace-nowrap">
                      {g.rashiLordHindi}
                    </td>
                    <td className="py-0.5 px-1 text-stone-800 border-r border-stone-200 whitespace-nowrap">
                      {g.nakshatraLordHindi}
                    </td>
                    <td className="py-0.5 px-1 text-stone-800 border-r border-stone-200 whitespace-nowrap">
                      {g.subLordHindi}
                    </td>
                    <td className="py-0.5 px-1 text-stone-800 whitespace-nowrap">{g.subSubLordHindi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT TABLE: निरयण भाव (Nirayana Bhavas) */}
          <div className="border border-stone-300/80 rounded overflow-hidden bg-white shadow-2xs">
            <div className="text-center font-bold text-xs text-[#c0262d] py-0.5 border-b border-stone-200 bg-stone-50/60 font-serif">
              निरयण भाव
            </div>
            <table className="w-full text-[10px] text-center border-collapse">
              <thead>
                <tr className="text-[#c0262d] font-bold border-b border-stone-300 text-[9px] bg-stone-50/40">
                  <th className="py-0.5 px-1 text-left border-r border-stone-200">भाव</th>
                  <th className="py-0.5 px-1 border-r border-stone-200">राशि</th>
                  <th className="py-0.5 px-1 border-r border-stone-200 font-mono">अंश</th>
                  <th className="py-0.5 px-1 border-r border-stone-200">रा</th>
                  <th className="py-0.5 px-1 border-r border-stone-200">न</th>
                  <th className="py-0.5 px-1 border-r border-stone-200">अं.</th>
                  <th className="py-0.5 px-1">प्र.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-[9.5px]">
                {kpData.bhavasList.map((b) => (
                  <tr key={b.bhavaNumber} className="hover:bg-amber-50/30">
                    <td className="py-0.5 px-1 text-left font-bold text-[#c0262d] border-r border-stone-200">
                      {b.bhavaNumber}
                    </td>
                    <td className="py-0.5 px-1 text-stone-900 border-r border-stone-200 whitespace-nowrap">
                      {b.rashiNameHindi}
                    </td>
                    <td className="py-0.5 px-1 font-mono text-stone-800 border-r border-stone-200 text-[9px]">
                      {b.dmsString}
                    </td>
                    <td className="py-0.5 px-1 text-stone-800 border-r border-stone-200 whitespace-nowrap">
                      {b.rashiLordHindi}
                    </td>
                    <td className="py-0.5 px-1 text-stone-800 border-r border-stone-200 whitespace-nowrap">
                      {b.nakshatraLordHindi}
                    </td>
                    <td className="py-0.5 px-1 text-stone-800 border-r border-stone-200 whitespace-nowrap">
                      {b.subLordHindi}
                    </td>
                    <td className="py-0.5 px-1 text-stone-800 whitespace-nowrap">{b.subSubLordHindi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MIDDLE HIGHLIGHTS: के.पी. अयनांश & फॉर्च्युना */}
        <div className="text-center space-y-0.5 py-1 text-xs shrink-0">
          <div className="font-bold text-[#c0262d] font-mono">
            के.पी. अयनांश : <span className="tracking-wider">{kpData.ayanamshaDMS}</span>
          </div>
          <div className="font-bold text-[#c0262d] font-mono">
            फॉर्च्युना : <span className="tracking-wider">{kpData.fortunaString}</span>
          </div>
        </div>

        {/* CHARTS: Side-by-Side लग्न कुंडली & भाव कुंडली */}
        <div className="grid grid-cols-2 gap-4 items-center shrink-0 my-1">
          {/* Left Chart: लग्न कुंडली */}
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold text-[#c0262d] font-serif">
              लग्न कुंडली
            </h3>
            <TraditionalVedicChartSvg
              chartData={kundliData.divisionalCharts.D1}
              grahas={kundliData.grahas}
              className="max-w-[290px]"
            />
          </div>

          {/* Right Chart: भाव कुंडली */}
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold text-[#c0262d] font-serif">
              भाव कुंडली
            </h3>
            <TraditionalVedicChartSvg
              chartData={bhavaChalitChartData}
              grahas={kundliData.grahas}
              isBhavaChart={true}
              className="max-w-[290px]"
            />
          </div>
        </div>

        {/* FOOTER: Brand, Services, Website Address & Page Number */}
        <div className="pt-2 border-t border-stone-300 shrink-0 text-center space-y-0.5">
          <div className="text-xs sm:text-[13px] font-black text-stone-950 font-serif">
            {brandName}
          </div>
          <div className="text-[9px] text-stone-600 font-medium tracking-tight">
            {servicesLine}
          </div>
          <div className="flex items-center justify-between text-[9px] text-stone-600 pt-0.5">
            <span>{contactLine}</span>
            <span className="font-bold text-[#c0262d] underline tracking-tight">{websiteAddress}</span>
            <span className="font-bold text-[#c0262d] text-xs font-mono">{pageNumber}</span>
          </div>
        </div>
      </div>

      {/* 3. RIGHT ORNAMENTAL GOLDEN BORDER STRIP */}
      <div className="w-10 sm:w-11 shrink-0 h-full bg-gradient-to-l from-amber-50/50 to-transparent flex items-center justify-center">
        <VedicOrnamentalBorder side="right" />
      </div>
    </div>
  );
};
