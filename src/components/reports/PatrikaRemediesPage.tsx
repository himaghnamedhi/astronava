import React from 'react';
import { CompleteKundliData } from '../../data/vedicEphemeris';
import { PLANETS_DATA } from '../../data/planetsData';
import { PlanetId } from '../../types/astrology';
import { VedicOrnamentalBorder } from './VedicOrnamentalBorder';

interface PatrikaRemediesPageProps {
  kundliData: CompleteKundliData;
  brandName?: string;
  websiteAddress?: string;
  servicesLine?: string;
  contactLine?: string;
  pageNumber?: number | string;
}

const RASHI_LORD_PLANET: Record<number, PlanetId> = {
  1: 'mars', 2: 'venus', 3: 'mercury', 4: 'moon', 5: 'sun', 6: 'mercury',
  7: 'venus', 8: 'mars', 9: 'jupiter', 10: 'saturn', 11: 'saturn', 12: 'jupiter',
};

const GEM_DATA: Record<PlanetId, { gem: string; metal: string; finger: string; day: string; mantra: string; caution: string }> = {
  sun: { gem: 'Ruby (माणिक्य)', metal: 'Gold / Copper', finger: 'Ring Finger', day: 'Sunday morning', mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', caution: 'Do not wear with Blue Sapphire or Diamond.' },
  moon: { gem: 'Pearl (मोती)', metal: 'Pure Silver', finger: 'Little Finger', day: 'Monday morning', mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः', caution: 'Avoid pairing with Blue Sapphire or Gomed.' },
  mars: { gem: 'Red Coral (मूँगा)', metal: 'Copper / Gold', finger: 'Ring Finger', day: 'Tuesday morning', mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', caution: 'Do not wear simultaneously with Emerald or Diamond.' },
  mercury: { gem: 'Emerald (पन्ना)', metal: 'Gold / Bronze', finger: 'Little Finger', day: 'Wednesday morning', mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', caution: 'Do not combine with Red Coral or Pearl.' },
  jupiter: { gem: 'Yellow Sapphire (पुखराज)', metal: 'Pure Gold', finger: 'Index Finger', day: 'Thursday morning', mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', caution: 'Avoid wearing with Blue Sapphire or Diamond.' },
  venus: { gem: 'Diamond / Opal (हीरा/ओपल)', metal: 'Platinum / Silver', finger: 'Middle / Little Finger', day: 'Friday morning', mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', caution: 'Avoid pairing with Ruby or Red Coral.' },
  saturn: { gem: 'Blue Sapphire (नीलम)', metal: 'Silver / Iron', finger: 'Middle Finger', day: 'Saturday evening', mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', caution: 'Test for 3 days. Never wear with Ruby, Pearl, or Coral.' },
  rahu: { gem: 'Hessonite (गोमेद)', metal: 'Silver / Ashtadhatu', finger: 'Middle Finger', day: 'Saturday night', mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः', caution: 'Wear strictly under Rahu dasha guidance.' },
  ketu: { gem: 'Cat’s Eye (लहसुनिया)', metal: 'Silver / Panchdhatu', finger: 'Little / Ring Finger', day: 'Thursday night', mantra: 'ॐ स्त्रां स्त्रीं स्त्रौं सः केतवे नमः', caution: 'Only wear after personal planetary verification.' },
};

export const PatrikaRemediesPage: React.FC<PatrikaRemediesPageProps> = ({
  kundliData,
  brandName = 'Astronava',
  websiteAddress = 'www.astronava.vercel.app',
  servicesLine = 'Astrology | Numerology | Palmistry | Occult | Courses | Tarot Card | Gemsstone | Vastu',
  contactLine = 'www.astronava.vercel.app',
  pageNumber = 5,
}) => {
  const lagnaSign = kundliData.lagnaSign;
  const lagneshId = RASHI_LORD_PLANET[lagnaSign];
  const bhagyaSign = (((lagnaSign - 1 + 8) % 12) + 1);
  const bhagyeshId = RASHI_LORD_PLANET[bhagyaSign];
  const purvaSign = (((lagnaSign - 1 + 4) % 12) + 1);
  const poshakId = RASHI_LORD_PLANET[purvaSign];

  const lifeGem = GEM_DATA[lagneshId];
  const luckyGem = GEM_DATA[bhagyeshId];
  const poshakGem = GEM_DATA[poshakId];

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
            वैदिक उपाय एवं रत्न परामर्श
          </span>
          <span>॥ शुभम् भवतु ॥</span>
        </div>
        <h2 className="text-lg font-black font-vedic text-amber-950 tracking-tight">
          CERTIFIED VEDIC REMEDIES &amp; GEMSTONE THERAPY
        </h2>
        <div className="flex items-center justify-center gap-3 text-[10px] text-stone-600 mt-0.5">
          <span>Prescribed for: <strong className="text-amber-950">{kundliData.birthDetails.name || 'Native'}</strong></span>
          <span>•</span>
          <span>Current Mahadasha: <strong className="text-amber-950">{kundliData.vimshottariDasha.currentMahadasha.lordName}</strong></span>
          <span>•</span>
          <span>Lagnesh: <strong>{PLANETS_DATA[lagneshId]?.name}</strong></span>
          <span>•</span>
          <span>Bhagyesh: <strong>{PLANETS_DATA[bhagyeshId]?.name}</strong></span>
        </div>
      </div>

      {/* SECTION 1: 3 PRESCRIBED GEMSTONES */}
      <div className="space-y-1 z-10">
        <div className="text-[10px] font-bold text-amber-950 font-vedic uppercase tracking-wider">
          प्रमाणित रत्न परामर्श (Certified Gemstone Therapy)
        </div>
        <div className="grid grid-cols-3 gap-2 text-[9.5px]">
          {/* Life Stone */}
          <div className="bg-white rounded-lg border border-amber-300 p-2 shadow-2xs space-y-1">
            <span className="px-1.5 py-0.5 rounded bg-amber-100 font-bold text-amber-950 text-[8px] uppercase block">
              Life Stone (जीवन रत्न)
            </span>
            <strong className="text-amber-950 font-bold text-xs block">{lifeGem.gem}</strong>
            <div className="text-stone-700 space-y-0.5 text-[8.5px]">
              <div><strong>Metal:</strong> {lifeGem.metal}</div>
              <div><strong>Finger:</strong> {lifeGem.finger}</div>
              <div><strong>Day:</strong> {lifeGem.day}</div>
            </div>
            <div className="bg-amber-50 p-1 rounded font-vedic text-[8.5px] text-amber-950 font-bold border border-amber-200">
              {lifeGem.mantra}
            </div>
            <div className="text-[7.5px] text-rose-800 italic">
              <strong>Caution:</strong> {lifeGem.caution}
            </div>
          </div>

          {/* Lucky Stone */}
          <div className="bg-white rounded-lg border border-emerald-300 p-2 shadow-2xs space-y-1">
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 font-bold text-emerald-950 text-[8px] uppercase block">
              Lucky Stone (भाग्य रत्न)
            </span>
            <strong className="text-emerald-950 font-bold text-xs block">{luckyGem.gem}</strong>
            <div className="text-stone-700 space-y-0.5 text-[8.5px]">
              <div><strong>Metal:</strong> {luckyGem.metal}</div>
              <div><strong>Finger:</strong> {luckyGem.finger}</div>
              <div><strong>Day:</strong> {luckyGem.day}</div>
            </div>
            <div className="bg-emerald-50 p-1 rounded font-vedic text-[8.5px] text-emerald-950 font-bold border border-emerald-200">
              {luckyGem.mantra}
            </div>
            <div className="text-[7.5px] text-rose-800 italic">
              <strong>Caution:</strong> {luckyGem.caution}
            </div>
          </div>

          {/* Poshak Stone */}
          <div className="bg-white rounded-lg border border-blue-300 p-2 shadow-2xs space-y-1">
            <span className="px-1.5 py-0.5 rounded bg-blue-100 font-bold text-blue-950 text-[8px] uppercase block">
              Intellect Stone (कारक रत्न)
            </span>
            <strong className="text-blue-950 font-bold text-xs block">{poshakGem.gem}</strong>
            <div className="text-stone-700 space-y-0.5 text-[8.5px]">
              <div><strong>Metal:</strong> {poshakGem.metal}</div>
              <div><strong>Finger:</strong> {poshakGem.finger}</div>
              <div><strong>Day:</strong> {poshakGem.day}</div>
            </div>
            <div className="bg-blue-50 p-1 rounded font-vedic text-[8.5px] text-blue-950 font-bold border border-blue-200">
              {poshakGem.mantra}
            </div>
            <div className="text-[7.5px] text-rose-800 italic">
              <strong>Caution:</strong> {poshakGem.caution}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: RUDRAKSHA & BEEJ MANTRA TABLE */}
      <div className="space-y-1 z-10">
        <div className="text-[10px] font-bold text-amber-950 font-vedic uppercase tracking-wider">
          नवग्रह बीज मंत्र साधना एवं जप संख्या
        </div>
        <div className="border border-stone-300 rounded-lg overflow-hidden bg-white text-[9px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200">
              <tr>
                <th className="p-1 border-r border-stone-200">ग्रह</th>
                <th className="p-1 border-r border-stone-200">बीज मंत्र</th>
                <th className="p-1 border-r border-stone-200 text-center">जप संख्या</th>
                <th className="p-1 border-r border-stone-200">माला</th>
                <th className="p-1">अनुशंसित रुद्राक्ष</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {[
                { name: 'सूर्य (Sun)', mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', count: '7,000', mala: 'रुद्राक्ष / लाल चंदन', rudraksha: '1-मुखी / 12-मुखी' },
                { name: 'चन्द्र (Moon)', mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः', count: '11,000', mala: 'स्फटिक / मोती', rudraksha: '2-मुखी रुद्राक्ष' },
                { name: 'मङ्गल (Mars)', mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', count: '10,000', mala: 'लाल चंदन / मूँगा', rudraksha: '3-मुखी रुद्राक्ष' },
                { name: 'बुध (Mercury)', mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', count: '9,000', mala: 'रुद्राक्ष / तुलसी', rudraksha: '4-मुखी रुद्राक्ष' },
                { name: 'गुरु (Jupiter)', mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', count: '19,000', mala: 'पीला चंदन / हल्दी', rudraksha: '5-मुखी रुद्राक्ष' },
                { name: 'शुक्र (Venus)', mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', count: '16,000', mala: 'स्फटिक / कमलगट्टा', rudraksha: '6-मुखी रुद्राक्ष' },
                { name: 'शनि (Saturn)', mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', count: '23,000', mala: 'रुद्राक्ष', rudraksha: '7-मुखी / 14-मुखी' },
                { name: 'राहु (Rahu)', mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः', count: '18,000', mala: 'रुद्राक्ष', rudraksha: '8-मुखी रुद्राक्ष' },
                { name: 'केतु (Ketu)', mantra: 'ॐ स्त्रां स्त्रीं स्त्रौं सः केतवे नमः', count: '17,000', mala: 'रुद्राक्ष', rudraksha: '9-मुखी रुद्राक्ष' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/40">
                  <td className="p-1 font-bold border-r border-stone-200 whitespace-nowrap">{row.name}</td>
                  <td className="p-1 font-vedic text-amber-950 font-bold border-r border-stone-200">{row.mantra}</td>
                  <td className="p-1 text-center font-mono font-bold border-r border-stone-200">{row.count}</td>
                  <td className="p-1 border-r border-stone-200">{row.mala}</td>
                  <td className="p-1 font-semibold text-amber-900">{row.rudraksha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: CHARITY & DOSHA MITIGATION */}
      <div className="grid grid-cols-2 gap-2 text-[9px] z-10">
        {/* Charity / Daana */}
        <div className="bg-white rounded-lg border border-stone-300 p-2 space-y-1 shadow-2xs">
          <strong className="text-[10px] font-bold text-amber-950 font-vedic block border-b border-stone-200 pb-0.5">
            ग्रह दान एवं पुण्य कर्म (Benefic Charity)
          </strong>
          <div className="space-y-0.5 text-stone-700 text-[8.5px]">
            <div><strong>Sunday:</strong> Wheat, jaggery, copper vessel to temple priest.</div>
            <div><strong>Tuesday:</strong> Red lentils (Masoor Dal), jaggery to Hanuman temple.</div>
            <div><strong>Wednesday:</strong> Green Moong dal, fresh green fodder to cows (Gaushala).</div>
            <div><strong>Thursday:</strong> Chana dal, yellow sweets, books to needy students.</div>
            <div><strong>Saturday:</strong> Mustard oil lamp under Peepal tree, black sesame.</div>
          </div>
        </div>

        {/* Dosha Neutralization */}
        <div className="bg-white rounded-lg border border-stone-300 p-2 space-y-1 shadow-2xs">
          <strong className="text-[10px] font-bold text-amber-950 font-vedic block border-b border-stone-200 pb-0.5">
            दोष निवारण एवं नित्य दिनचर्या (Daily Mitigations)
          </strong>
          <div className="space-y-0.5 text-stone-700 text-[8.5px]">
            <div><strong>Manglik:</strong> Recite Hanuman Chalisa daily and Sunderkand on Tuesdays.</div>
            <div><strong>Shani Sade Sati:</strong> Light mustard oil deepak on Saturday evenings.</div>
            <div><strong>Kaal Sarp:</strong> Perform Jalabhishek to Lord Shiva with raw milk and water.</div>
            <div><strong>Surya Arghya:</strong> Offer clean water in copper vessel to morning rising Sun.</div>
            <div><strong>Parents Blessing:</strong> Touch parents feet daily to activate 9th Bhagyasthana.</div>
          </div>
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
