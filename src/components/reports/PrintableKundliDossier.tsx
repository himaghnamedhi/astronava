import React from 'react';
import { CompleteKundliData, DivisionalChartType } from '../../data/vedicEphemeris';
import { TraditionalPatrikaPage } from './TraditionalPatrikaPage';
import { TraditionalVedicChartSvg } from '../TraditionalVedicChartSvg';
import { VedicOrnamentalBorder } from './VedicOrnamentalBorder';
import { RASHI_NAMES } from '../../data/vedicAstrologyCalculator';

interface PrintableKundliDossierProps {
  kundliData: CompleteKundliData;
  brandName?: string;
  websiteAddress?: string;
  servicesLine?: string;
  contactLine?: string;
}

export const PrintableKundliDossier: React.FC<PrintableKundliDossierProps> = ({
  kundliData,
  brandName = 'Astronava',
  websiteAddress = 'www.astronava.com',
  servicesLine = 'Astrology | Numerology | Palmistry | Occult | Courses | Tarot Card | Gemstone | Vastu',
  contactLine = 'www.astronava.com',
}) => {
  // Key divisional charts confirmed: D1, D9, D7, D10
  const vargaCharts: { id: DivisionalChartType; hindiTitle: string; englishTitle: string; focus: string }[] = [
    {
      id: 'D1',
      hindiTitle: 'लग्न कुंडली',
      englishTitle: 'D1 Rashi Chart',
      focus: 'Physical Vitality, Self & General Life',
    },
    {
      id: 'D9',
      hindiTitle: 'नवमांश कुंडली',
      englishTitle: 'D9 Navamsha Chart',
      focus: 'Dharma, Destiny, Spouse & Higher Calling',
    },
    {
      id: 'D7',
      hindiTitle: 'सप्तांश कुंडली',
      englishTitle: 'D7 Saptamsha Chart',
      focus: 'Progeny, Children & Creative Lineage',
    },
    {
      id: 'D10',
      hindiTitle: 'दशमांश कुंडली',
      englishTitle: 'D10 Dashamsha Chart',
      focus: 'Career, Profession, Karma & Public Status',
    },
  ];

  const nativeName = kundliData.birthDetails.name || 'Native';
  const cleanDocId = `AN-VEDIC-${(nativeName.length * 31415 + (kundliData.birthDetails.dob ? parseInt(kundliData.birthDetails.dob.replace(/-/g, '').slice(-4), 10) : 108)).toString(16).toUpperCase()}`;

  return (
    <div id="printable-kundli-dossier" className="hidden print:block text-stone-900 bg-white">
      {/* ============================================================= */}
      {/* PAGE 1: TRADITIONAL JANAM PATRIKA (KP CUSPS, PANCHANG, LAGNA & CHALIT) */}
      {/* ============================================================= */}
      <TraditionalPatrikaPage
        kundliData={kundliData}
        brandName={brandName}
        websiteAddress={websiteAddress}
        servicesLine={servicesLine}
        contactLine={contactLine}
        pageNumber="Page 1 of 3"
      />

      {/* ============================================================= */}
      {/* PAGE 2: DIVISIONAL VARGA GRID (D1, D9, D7, D10) & GRAHA SPASHTA */}
      {/* ============================================================= */}
      <div
        className="print-page-a4 pdf-report-page bg-[#FCFBF9] text-stone-900 mx-auto relative box-border overflow-hidden w-[794px] h-[1123px] max-h-[1123px] flex"
        style={{
          pageBreakAfter: 'always',
          pageBreakInside: 'avoid',
          breakAfter: 'page',
          breakInside: 'avoid',
        }}
      >
        {/* Left Ornamental Golden Border */}
        <div className="w-10 sm:w-11 shrink-0 h-full bg-gradient-to-r from-amber-50/50 to-transparent flex items-center justify-center">
          <VedicOrnamentalBorder side="left" />
        </div>

        {/* Center Content Canvas */}
        <div className="flex-1 h-full flex flex-col justify-between py-5 px-3 sm:px-4 box-border">
          {/* Header */}
          <div className="text-center border-b-2 border-amber-900/40 pb-1.5 shrink-0">
            <div className="flex justify-between text-[11px] font-serif text-amber-950 px-1 mb-0.5">
              <span>॥ श्री गणेशाय नमः ॥</span>
              <span className="font-bold uppercase tracking-widest text-[10px] font-vedic text-amber-900">
                ग्रह स्पष्ट एवं प्रमुख षोडशवर्ग चक्र
              </span>
              <span>॥ शुभम् भवतु ॥</span>
            </div>
            <h2 className="text-lg font-black font-vedic text-amber-950 tracking-tight">
              GRAHA SPASHTA &amp; DIVISIONAL CHARTS (D1, D9, D7, D10)
            </h2>
            <div className="flex items-center justify-center gap-2.5 text-[9.5px] text-stone-600 mt-0.5">
              <span>Native: <strong className="text-amber-950">{nativeName}</strong></span>
              <span>•</span>
              <span>DOB: <strong>{kundliData.birthDetails.dob}</strong> {kundliData.birthDetails.tob}</span>
              <span>•</span>
              <span>POB: <strong>{kundliData.birthDetails.city}</strong></span>
              <span>•</span>
              <span>Ayanamsha: <strong>{kundliData.formattedAyanamsha} (Lahiri)</strong></span>
            </div>
          </div>

          {/* Section 1: Complete Graha Spashta Table */}
          <div className="space-y-0.5 shrink-0 mt-1">
            <div className="flex items-center justify-between text-[9.5px] font-bold text-amber-950 font-vedic uppercase">
              <span>ग्रह स्पष्ट तालिका (Complete Planetary Longitudes &amp; Dignities)</span>
              <span className="text-[8.5px] text-stone-500 font-normal">Nirayana Sidereal System (Chitrapaksha Lahiri)</span>
            </div>
            <div className="border border-stone-300 rounded overflow-hidden bg-white text-[9px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200 text-[8.5px]">
                  <tr>
                    <th className="p-1 border-r border-stone-200">ग्रह (Planet)</th>
                    <th className="p-1 border-r border-stone-200">राशि (Sign)</th>
                    <th className="p-1 border-r border-stone-200 font-mono">अंश (Degrees)</th>
                    <th className="p-1 border-r border-stone-200">नक्षत्र व चरण</th>
                    <th className="p-1 border-r border-stone-200 text-center">भाव</th>
                    <th className="p-1 border-r border-stone-200">स्थिति (Dignity)</th>
                    <th className="p-1 border-r border-stone-200">अवस्था</th>
                    <th className="p-1 border-r border-stone-200">कारक</th>
                    <th className="p-1 text-center">गति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-[8.5px]">
                  {kundliData.grahasList.map((g) => (
                    <tr key={g.id} className="hover:bg-amber-50/40">
                      <td className="p-0.5 px-1 font-bold text-stone-900 border-r border-stone-200 whitespace-nowrap">
                        {g.name} ({g.sanskritName})
                      </td>
                      <td className="p-0.5 px-1 border-r border-stone-200 whitespace-nowrap">
                        {g.rashiName.split(' ')[0]} ({g.rashiLord})
                      </td>
                      <td className="p-0.5 px-1 font-mono font-bold text-stone-800 border-r border-stone-200 whitespace-nowrap">
                        {g.formattedDegree}
                      </td>
                      <td className="p-0.5 px-1 border-r border-stone-200 whitespace-nowrap">
                        {g.nakshatraName} (P{g.nakshatraPada}) • {g.nakshatraLord}
                      </td>
                      <td className="p-0.5 px-1 text-center font-bold text-amber-950 border-r border-stone-200 whitespace-nowrap">
                        {g.house}H
                      </td>
                      <td className="p-0.5 px-1 border-r border-stone-200 whitespace-nowrap font-medium">
                        {g.dignity}
                      </td>
                      <td className="p-0.5 px-1 border-r border-stone-200 whitespace-nowrap text-stone-600">
                        {g.avastha?.split(' ')[0] || 'Yuva'}
                      </td>
                      <td className="p-0.5 px-1 border-r border-stone-200 whitespace-nowrap text-stone-700">
                        {g.karaka?.split(' ')[0] || '-'}
                      </td>
                      <td className="p-0.5 px-1 text-center whitespace-nowrap">
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

          {/* Section 2: Core Divisional Vargas (2x2 Grid: D1, D9, D7, D10) */}
          <div className="space-y-1 flex-1 flex flex-col justify-around my-1.5">
            <div className="text-[9.5px] font-bold text-amber-950 font-vedic uppercase tracking-wider flex items-center justify-between">
              <span>प्रमुख वर्ग चक्र ग्रिड (Core Divisional Vargas: D1 Rashi, D9 Navamsha, D7 Saptamsha, D10 Dashamsha)</span>
              <span className="text-[8px] text-stone-500 font-normal">North Indian Diamond Format</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {vargaCharts.map((item) => {
                const chartInfo = kundliData.divisionalCharts[item.id];
                if (!chartInfo) return null;

                const lagnaSignName = chartInfo.lagnaSign
                  ? RASHI_NAMES[chartInfo.lagnaSign - 1] || 'Aries'
                  : 'Aries';

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded border border-stone-300 p-2 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between border-b border-stone-200 pb-1 mb-1">
                      <div>
                        <span className="font-bold text-[10px] text-amber-950">
                          {item.hindiTitle} ({item.englishTitle})
                        </span>
                        <span className="text-[8px] text-stone-500 block">
                          Lagna: <strong>{lagnaSignName.split(' ')[0]} ({chartInfo.lagnaSign})</strong>
                        </span>
                      </div>
                      <span className="text-[8.5px] font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 font-mono">
                        {item.id}
                      </span>
                    </div>

                    <div className="w-[160px] h-[160px] mx-auto my-0.5">
                      <TraditionalVedicChartSvg
                        chartData={chartInfo}
                        grahas={kundliData.grahas}
                        className="max-w-[160px] max-h-[160px]"
                      />
                    </div>

                    <div className="text-[8px] text-stone-600 text-center mt-1 pt-1 border-t border-stone-100 font-medium line-clamp-1">
                      {item.focus}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Page 2 Footer */}
          <div className="pt-2 border-t border-stone-300 shrink-0 text-center space-y-0.5">
            <div className="text-xs font-black text-stone-950 font-serif">{brandName}</div>
            <div className="text-[8.5px] text-stone-600">{servicesLine}</div>
            <div className="flex items-center justify-between text-[9px] text-stone-600 pt-0.5">
              <span>{contactLine}</span>
              <span className="font-bold text-[#c0262d] underline">{websiteAddress}</span>
              <span className="font-bold text-[#c0262d] text-xs font-mono print:hidden">Page 2 of 3</span>
            </div>
          </div>
        </div>

        {/* Right Ornamental Golden Border */}
        <div className="w-10 sm:w-11 shrink-0 h-full bg-gradient-to-l from-amber-50/50 to-transparent flex items-center justify-center">
          <VedicOrnamentalBorder side="right" />
        </div>
      </div>

      {/* ============================================================= */}
      {/* PAGE 3: VIMSHOTTARI DASHA, SARVASHTAKAVARGA & CLASSICAL YOGAS */}
      {/* (Remedies deliberately excluded to maintain compact 3-page layout) */}
      {/* ============================================================= */}
      <div
        className="print-page-a4 pdf-report-page bg-[#FCFBF9] text-stone-900 mx-auto relative box-border overflow-hidden w-[794px] h-[1123px] max-h-[1123px] flex"
        style={{
          pageBreakAfter: 'auto',
          pageBreakInside: 'avoid',
          breakAfter: 'auto',
          breakInside: 'avoid',
        }}
      >
        {/* Left Ornamental Golden Border */}
        <div className="w-10 sm:w-11 shrink-0 h-full bg-gradient-to-r from-amber-50/50 to-transparent flex items-center justify-center">
          <VedicOrnamentalBorder side="left" />
        </div>

        {/* Center Content Canvas */}
        <div className="flex-1 h-full flex flex-col justify-between py-5 px-3 sm:px-4 box-border">
          {/* Header */}
          <div className="text-center border-b-2 border-amber-900/40 pb-1.5 shrink-0">
            <div className="flex justify-between text-[11px] font-serif text-amber-950 px-1 mb-0.5">
              <span>॥ ॐ श्री महालक्ष्म्यै नमः ॥</span>
              <span className="font-bold uppercase tracking-widest text-[10px] font-vedic text-amber-900">
                विंशोत्तरी महादशा, सर्वाष्टकवर्ग एवं शास्त्रीय योग
              </span>
              <span>॥ शुभम् भवतु ॥</span>
            </div>
            <h2 className="text-lg font-black font-vedic text-amber-950 tracking-tight">
              VIMSHOTTARI DASHA TIMELINE &amp; ASHTAKAVARGA DOSSIER
            </h2>
            <div className="flex items-center justify-center gap-3 text-[9.5px] text-stone-600 mt-0.5">
              <span>Native: <strong className="text-amber-950">{nativeName}</strong></span>
              <span>•</span>
              <span>Lagna: <strong>{kundliData.lagna?.signName || kundliData.lagnaSignName || 'Aries'}</strong></span>
              <span>•</span>
              <span>Moon Sign: <strong>{kundliData.moonSignName || kundliData.grahas?.moon?.rashiName || 'Moon Sign'}</strong></span>
              <span>•</span>
              <span>Current Mahadasha: <strong className="text-amber-900">{kundliData.vimshottariDasha.currentMahadasha.lordName}</strong></span>
            </div>
          </div>

          {/* Section 1: Vimshottari Timeline Table */}
          <div className="space-y-1 shrink-0 mt-1">
            <div className="flex items-center justify-between text-[9.5px] font-bold text-amber-950 font-vedic uppercase">
              <span>विंशोत्तरी महादशा काल (Vimshottari 120-Year Mahadasha Timeline)</span>
              <span className="text-[8.5px] text-amber-800 font-semibold">
                Active Cycle: {kundliData.vimshottariDasha.currentMahadasha.lordName} ({kundliData.vimshottariDasha.currentMahadasha.sanskritName})
              </span>
            </div>
            <div className="border border-stone-300 rounded overflow-hidden bg-white text-[9px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-100 text-stone-900 font-bold border-b border-stone-200 text-[8.5px]">
                  <tr>
                    <th className="p-1 border-r border-stone-200">Lord (ग्रह अधिपति)</th>
                    <th className="p-1 border-r border-stone-200">Start Date</th>
                    <th className="p-1 border-r border-stone-200">End Date</th>
                    <th className="p-1 border-r border-stone-200">Duration</th>
                    <th className="p-1">Current State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-[8.5px]">
                  {kundliData.vimshottariDasha.fullTimeline.map((d, idx) => (
                    <tr
                      key={idx}
                      className={
                        d.isActive
                          ? 'bg-amber-100/90 font-bold text-amber-950'
                          : 'hover:bg-amber-50/30'
                      }
                    >
                      <td className="p-1 font-semibold border-r border-stone-200">
                        {d.lordName} ({d.sanskritName})
                      </td>
                      <td className="p-1 font-mono border-r border-stone-200">{d.startDate}</td>
                      <td className="p-1 font-mono border-r border-stone-200">{d.endDate}</td>
                      <td className="p-1 border-r border-stone-200">{d.durationYears} Years</td>
                      <td className="p-1">
                        {d.isActive ? (
                          <span className="font-bold text-amber-900">● ACTIVE NOW</span>
                        ) : new Date(d.endDate) < new Date() ? (
                          <span className="text-stone-500">Elapsed</span>
                        ) : (
                          <span className="text-stone-700">Upcoming</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Sarvashtakavarga 337-Bindu Distribution Matrix */}
          <div className="space-y-1 shrink-0 my-1">
            <div className="flex items-center justify-between text-[9.5px] font-bold text-amber-950 font-vedic uppercase">
              <span>सर्वाष्टकवर्ग सामर्थ्य चक्र (Sarvashtakavarga 337 Total Bindus Matrix)</span>
              <span className="text-[8.5px] text-stone-500 font-normal">Benefic Point Auspiciousness Rating</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5 text-center text-[9px]">
              {kundliData.sarvashtakavarga.signs.map((s) => (
                <div
                  key={s.signNumber}
                  className={`p-1.5 bg-white border rounded shadow-2xs ${
                    s.bindus >= 30
                      ? 'border-emerald-400/80 bg-emerald-50/20'
                      : s.bindus < 25
                      ? 'border-rose-300/80 bg-rose-50/20'
                      : 'border-stone-300'
                  }`}
                >
                  <span className="text-[8.5px] text-stone-600 block font-medium">
                    {s.signName.split(' ')[0]} ({s.signNumber})
                  </span>
                  <strong className="text-sm font-black text-amber-950 block my-0.5">
                    {s.bindus}
                  </strong>
                  <span
                    className={`text-[7.5px] font-bold block ${
                      s.bindus >= 30
                        ? 'text-emerald-700'
                        : s.bindus < 25
                        ? 'text-rose-700'
                        : 'text-amber-800'
                    }`}
                  >
                    {s.status.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Classical Parashari Yogas & Astrological Doshas Diagnostics */}
          <div className="space-y-1 shrink-0 my-1">
            <h3 className="text-[9.5px] font-bold text-amber-950 font-vedic uppercase tracking-wider">
              शास्त्रीय योग एवं दोष परीक्षण (Classical Parashari Yogas &amp; Astrological Diagnostics)
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              {kundliData.yogas.slice(0, 4).map((y, idx) => (
                <div
                  key={idx}
                  className="p-1.5 bg-white border border-amber-900/20 rounded shadow-2xs space-y-0.5"
                >
                  <strong className="text-amber-950 font-bold block text-[9.5px]">{y.name}</strong>
                  <p className="text-stone-600 leading-snug line-clamp-2 text-[8.5px]">{y.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-1.5 p-2 bg-amber-50/80 rounded border border-amber-200/80 text-[9px] space-y-1">
              <div className="flex items-start gap-1">
                <strong className="text-amber-950 whitespace-nowrap">Manglik Status:</strong>
                <span className="text-stone-700">{kundliData.doshas.mangalDosha.details}</span>
              </div>
              <div className="flex items-start gap-1">
                <strong className="text-amber-950 whitespace-nowrap">Kaal Sarp Diagnostic:</strong>
                <span className="text-stone-700">{kundliData.doshas.kaalSarpDosha.details}</span>
              </div>
              <div className="flex items-start gap-1">
                <strong className="text-amber-950 whitespace-nowrap">Shani Sade Sati:</strong>
                <span className="text-stone-700">{kundliData.doshas.sadeSati.details}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Authentic Vedic Certification & Security Checksum */}
          <div className="p-2 border border-stone-200 rounded bg-white text-[8.5px] text-stone-600 flex items-center justify-between shrink-0">
            <div>
              <div className="font-bold text-stone-800">
                Certified Sidereal Vedic Computation (Chitrapaksha Lahiri Ayanamsha)
              </div>
              <div className="text-[7.5px] text-stone-500">
                Calculated according to Brihat Parashara Hora Shastra principles. Verified Ephemeris Coordinates.
              </div>
            </div>
            <div className="text-right font-mono text-[8px] text-stone-500">
              <div>DOC ID: <strong className="text-stone-800">{cleanDocId}</strong></div>
              <div>AUTH HASH: {kundliData.birthDetails.latitude.toFixed(2)}N_{kundliData.birthDetails.longitude.toFixed(2)}E</div>
            </div>
          </div>

          {/* Page 3 Footer */}
          <div className="pt-2 border-t border-stone-300 shrink-0 text-center space-y-0.5">
            <div className="text-xs font-black text-stone-950 font-serif">{brandName}</div>
            <div className="text-[8.5px] text-stone-600">{servicesLine}</div>
            <div className="flex items-center justify-between text-[9px] text-stone-600 pt-0.5">
              <span>{contactLine}</span>
              <span className="font-bold text-[#c0262d] underline">{websiteAddress}</span>
              <span className="font-bold text-[#c0262d] text-xs font-mono print:hidden">Page 3 of 3</span>
            </div>
          </div>
        </div>

        {/* Right Ornamental Golden Border */}
        <div className="w-10 sm:w-11 shrink-0 h-full bg-gradient-to-l from-amber-50/50 to-transparent flex items-center justify-center">
          <VedicOrnamentalBorder side="right" />
        </div>
      </div>
    </div>
  );
};
