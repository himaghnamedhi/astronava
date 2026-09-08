import React, { useState } from 'react';
import { CompleteKundliData, GrahaSpashta } from '../../data/vedicEphemeris';
import { PLANETS_DATA } from '../../data/planetsData';
import { PlanetId } from '../../types/astrology';
import {
  Gem,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Volume2,
  Gift,
  Sun,
  Moon,
  Calendar,
  CheckCircle,
  HelpCircle,
  Flame,
} from 'lucide-react';

interface VedicRemediesDossierProps {
  kundliData: CompleteKundliData;
}

const RASHI_LORD_PLANET: Record<number, PlanetId> = {
  1: 'mars',
  2: 'venus',
  3: 'mercury',
  4: 'moon',
  5: 'sun',
  6: 'mercury',
  7: 'venus',
  8: 'mars',
  9: 'jupiter',
  10: 'saturn',
  11: 'saturn',
  12: 'jupiter',
};

const GEMSTONE_SPECS: Record<
  PlanetId,
  {
    gemstoneName: string;
    hindiName: string;
    substitutes: string[];
    metal: string;
    finger: string;
    day: string;
    time: string;
    mantra: string;
    cautions: string;
  }
> = {
  sun: {
    gemstoneName: 'Ruby (Manikya)',
    hindiName: 'माणिक्य',
    substitutes: ['Red Garnet', 'Spinel', 'Star Ruby'],
    metal: 'Gold or Copper',
    finger: 'Ring Finger (Anamika) of right hand',
    day: 'Sunday (Ravivar)',
    time: 'Within 1 hour of sunrise in Shukla Paksha',
    mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (108 times)',
    cautions: 'Never wear with Blue Sapphire, Diamond, or Gomed.',
  },
  moon: {
    gemstoneName: 'Natural Pearl (Moti)',
    hindiName: 'सच्चा मोती',
    substitutes: ['Moonstone (Chandrakant)', 'White Coral'],
    metal: 'Pure Silver',
    finger: 'Little Finger (Kanishtha) of right hand',
    day: 'Monday (Somvar)',
    time: 'Evening during waxing moon or Monday morning',
    mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः (108 times)',
    cautions: 'Avoid pairing with Blue Sapphire, Hessonite (Gomed), or Cat’s Eye.',
  },
  mars: {
    gemstoneName: 'Red Coral (Moonga)',
    hindiName: 'मूँगा',
    substitutes: ['Carnelian', 'Red Agate'],
    metal: 'Copper or Gold / Panchdhatu',
    finger: 'Ring Finger (Anamika) of right hand',
    day: 'Tuesday (Mangalvar)',
    time: 'Morning between 6:00 AM - 8:00 AM',
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः (108 times)',
    cautions: 'Do not wear simultaneously with Emerald, Diamond, or Blue Sapphire.',
  },
  mercury: {
    gemstoneName: 'Emerald (Panna)',
    hindiName: 'पन्ना',
    substitutes: ['Green Tourmaline', 'Peridot', 'Green Onyx'],
    metal: 'Gold or Bronze / Panchdhatu',
    finger: 'Little Finger (Kanishtha) of right hand',
    day: 'Wednesday (Budhavar)',
    time: 'Morning 2 hours after sunrise',
    mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः (108 times)',
    cautions: 'Do not combine with Red Coral or Natural Pearl without expert guidance.',
  },
  jupiter: {
    gemstoneName: 'Yellow Sapphire (Pukhraj)',
    hindiName: 'पुखराज',
    substitutes: ['Yellow Topaz', 'Citrine (Sunela)'],
    metal: 'Pure Gold or Brass',
    finger: 'Index Finger (Tarjani) of right hand',
    day: 'Thursday (Guruvar)',
    time: 'Early morning during Shukla Paksha',
    mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः (108 times)',
    cautions: 'Harmonious with Ruby and Red Coral; avoid Blue Sapphire or Diamond pairings.',
  },
  venus: {
    gemstoneName: 'Diamond (Heera)',
    hindiName: 'हीरा / ओपल',
    substitutes: ['White Zircon', 'Natural Opal', 'White Sapphire'],
    metal: 'Platinum, White Gold, or Silver',
    finger: 'Middle Finger or Little Finger of right hand',
    day: 'Friday (Shukravar)',
    time: 'Morning at sunrise or evening dusk',
    mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः (108 times)',
    cautions: 'Strictly avoid wearing alongside Ruby, Pearl, or Yellow Sapphire.',
  },
  saturn: {
    gemstoneName: 'Blue Sapphire (Neelam)',
    hindiName: 'नीलम',
    substitutes: ['Amethyst (Jamuniya)', 'Blue Topaz', 'Iolite (Neeli)'],
    metal: 'Silver, White Gold, or Iron/Ashtadhatu',
    finger: 'Middle Finger (Madhyama) of right hand',
    day: 'Saturday (Shanivar)',
    time: 'Saturday evening after sunset',
    mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः (108 times)',
    cautions: 'Trial test for 3 days before permanent setting. Strictly avoid with Ruby, Pearl, or Coral.',
  },
  rahu: {
    gemstoneName: 'Hessonite Garnet (Gomed)',
    hindiName: 'गोमेद',
    substitutes: ['Spessartite Garnet', 'Honey Zircon'],
    metal: 'Silver or Ashtadhatu',
    finger: 'Middle Finger of right hand',
    day: 'Saturday (Shanivar)',
    time: 'Night after 8:00 PM',
    mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः (108 times)',
    cautions: 'Prescribed only under specific dasha/bhukti conditions. Avoid with Ruby or Pearl.',
  },
  ketu: {
    gemstoneName: 'Cat’s Eye (Lehsuniya)',
    hindiName: 'लहसुनिया',
    substitutes: ['Cat’s Eye Chrysoberyl', 'Tiger Eye'],
    metal: 'Silver or Panchdhatu',
    finger: 'Little Finger or Ring Finger',
    day: 'Tuesday or Thursday night',
    time: 'Late evening in Krishna Paksha',
    mantra: 'ॐ स्त्रां स्त्रीं स्त्रौं सः केतवे नमः (108 times)',
    cautions: 'Wear only after personal astrological validation to avoid sudden agitation.',
  },
};

const RUDRAKSHA_GUIDE: Record<
  PlanetId,
  { mukhi: string; deity: string; benefits: string }
> = {
  sun: { mukhi: '1-Mukhi (Ek Mukhi) or 12-Mukhi', deity: 'Surya Dev / Shiva', benefits: 'Leadership, self-confidence, heart health, removes administrative obstacles.' },
  moon: { mukhi: '2-Mukhi (Do Mukhi)', deity: 'Ardhanarishvara', benefits: 'Emotional peace, harmony in partnerships, overcomes anxiety and mood swings.' },
  mars: { mukhi: '3-Mukhi (Teen Mukhi)', deity: 'Agni Dev', benefits: 'Releases past guilt, boosts willpower, ignites energy and blood circulation.' },
  mercury: { mukhi: '4-Mukhi (Chaar Mukhi)', deity: 'Lord Brahma', benefits: 'Intellectual sharpness, communication eloquence, vocal fluency, analytical memory.' },
  jupiter: { mukhi: '5-Mukhi (Panch Mukhi)', deity: 'Kalagni Rudra', benefits: 'Wisdom, spiritual growth, liver/metabolic health, brings all-round auspiciousness.' },
  venus: { mukhi: '6-Mukhi (Chhah Mukhi)', deity: 'Lord Kartikeya', benefits: 'Artistic talent, marital charisma, reproductive vitality, personal magnetism.' },
  saturn: { mukhi: '7-Mukhi (Saat Mukhi) or 14-Mukhi', deity: 'Goddess Mahalakshmi', benefits: 'Shields from Shani Sade Sati, overcomes financial stagnancy, long-term stability.' },
  rahu: { mukhi: '8-Mukhi (Aath Mukhi)', deity: 'Lord Ganesha', benefits: 'Removes sudden roadblocks, dispels illusion, safeguards against unforeseen deceit.' },
  ketu: { mukhi: '9-Mukhi (Nau Mukhi)', deity: 'Goddess Durga (Nau Durga)', benefits: 'Fearlessness, intuitive psychic shielding, liberates karmic bindings.' },
};

export const VedicRemediesDossier: React.FC<VedicRemediesDossierProps> = ({
  kundliData,
}) => {
  const [activeTab, setActiveTab] = useState<'gems' | 'rudraksha' | 'mantra' | 'daana' | 'dosha'>('gems');

  // Identify native's key benefic lords
  const lagnaSign = kundliData.lagnaSign;
  const lagneshId = RASHI_LORD_PLANET[lagnaSign];
  const bhagyaSign = (((lagnaSign - 1 + 8) % 12) + 1); // 9th sign
  const bhagyeshId = RASHI_LORD_PLANET[bhagyaSign];
  const purvaSign = (((lagnaSign - 1 + 4) % 12) + 1); // 5th sign
  const poshakId = RASHI_LORD_PLANET[purvaSign];

  const lifeGem = GEMSTONE_SPECS[lagneshId];
  const luckyGem = GEMSTONE_SPECS[bhagyeshId];
  const poshakGem = GEMSTONE_SPECS[poshakId];

  // Afflicted / challenging planets
  const afflictedPlanets = kundliData.grahasList.filter(
    (g) => g.dignity.includes('Debilitated') || g.isCombust || g.house === 6 || g.house === 8 || g.house === 12
  );

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-black font-vedic text-amber-100">
            वैदिक उपाय एवं रत्न चिकित्सा (Personalized Vedic Remedies &amp; Astro-Therapy)
          </h3>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed max-w-4xl">
          Carefully calculated remedies harmonized specifically for{' '}
          <strong className="text-amber-300">{kundliData?.birthDetails?.name || 'the Native'}</strong> based on their
          Lagna Lord ({(kundliData?.lagna?.signName || kundliData?.lagnaSignName || 'Aries').split(' ')[0]} / {PLANETS_DATA[lagneshId]?.name || 'Lagnesh'}), 9th House Fortune Lord ({PLANETS_DATA[bhagyeshId]?.name || 'Bhagyesh'}),
          and Vimshottari Mahadasha ({kundliData?.vimshottariDasha?.currentMahadasha?.lordName || 'Current Mahadasha'}).
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          { id: 'gems', label: 'Gemstone Therapy (रत्न परामर्श)', icon: Gem },
          { id: 'rudraksha', label: 'Rudraksha Prescription (रुद्राक्ष)', icon: ShieldCheck },
          { id: 'mantra', label: 'Beej Mantra Japa (मंत्र साधना)', icon: Volume2 },
          { id: 'daana', label: 'Charity & Daana (ग्रह दान)', icon: Gift },
          { id: 'dosha', label: 'Dosha Remedies (दोष निवारण)', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-amber-950 text-amber-100 shadow-2xs font-bold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GEMSTONE THERAPY */}
      {activeTab === 'gems' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. Life Stone (Lagnesh) */}
            <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                    Primary Life Stone (जीवन रत्न)
                  </span>
                  <h4 className="text-base font-black font-vedic text-stone-900 mt-1">
                    {lifeGem.gemstoneName}
                  </h4>
                  <span className="text-xs text-amber-950 font-bold">
                    For Lagna Lord: {PLANETS_DATA[lagneshId]?.name} ({PLANETS_DATA[lagneshId]?.devanagari})
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-800">
                  <Gem className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div><strong>Suitable Metal:</strong> {lifeGem.metal}</div>
                <div><strong>Wearing Finger:</strong> {lifeGem.finger}</div>
                <div><strong>Auspicious Day:</strong> {lifeGem.day}</div>
                <div><strong>Auspicious Time:</strong> {lifeGem.time}</div>
                <div><strong>Substitutes:</strong> {lifeGem.substitutes.join(', ')}</div>
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10.5px] text-stone-500 font-bold block mb-0.5">Energizing Beej Mantra:</span>
                  <p className="font-vedic text-amber-950 font-bold text-xs bg-amber-50 p-2 rounded-lg border border-amber-200">
                    {lifeGem.mantra}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900">
                <strong>Warning:</strong> {lifeGem.cautions}
              </div>
            </div>

            {/* 2. Lucky Stone (Bhagyesh) */}
            <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Fortune Stone (भाग्य रत्न)
                  </span>
                  <h4 className="text-base font-black font-vedic text-stone-900 mt-1">
                    {luckyGem.gemstoneName}
                  </h4>
                  <span className="text-xs text-amber-950 font-bold">
                    For 9th Lord: {PLANETS_DATA[bhagyeshId]?.name} ({PLANETS_DATA[bhagyeshId]?.devanagari})
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-800">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div><strong>Suitable Metal:</strong> {luckyGem.metal}</div>
                <div><strong>Wearing Finger:</strong> {luckyGem.finger}</div>
                <div><strong>Auspicious Day:</strong> {luckyGem.day}</div>
                <div><strong>Auspicious Time:</strong> {luckyGem.time}</div>
                <div><strong>Substitutes:</strong> {luckyGem.substitutes.join(', ')}</div>
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10.5px] text-stone-500 font-bold block mb-0.5">Energizing Beej Mantra:</span>
                  <p className="font-vedic text-amber-950 font-bold text-xs bg-amber-50 p-2 rounded-lg border border-amber-200">
                    {luckyGem.mantra}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900">
                <strong>Warning:</strong> {luckyGem.cautions}
              </div>
            </div>

            {/* 3. Benefic Stone (Poshak Ratna) */}
            <div className="bg-white rounded-2xl border-2 border-amber-300 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                    Intellect &amp; Karma Stone (कारक रत्न)
                  </span>
                  <h4 className="text-base font-black font-vedic text-stone-900 mt-1">
                    {poshakGem.gemstoneName}
                  </h4>
                  <span className="text-xs text-amber-950 font-bold">
                    For 5th Lord: {PLANETS_DATA[poshakId]?.name} ({PLANETS_DATA[poshakId]?.devanagari})
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-800">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div><strong>Suitable Metal:</strong> {poshakGem.metal}</div>
                <div><strong>Wearing Finger:</strong> {poshakGem.finger}</div>
                <div><strong>Auspicious Day:</strong> {poshakGem.day}</div>
                <div><strong>Auspicious Time:</strong> {poshakGem.time}</div>
                <div><strong>Substitutes:</strong> {poshakGem.substitutes.join(', ')}</div>
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10.5px] text-stone-500 font-bold block mb-0.5">Energizing Beej Mantra:</span>
                  <p className="font-vedic text-amber-950 font-bold text-xs bg-amber-50 p-2 rounded-lg border border-amber-200">
                    {poshakGem.mantra}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900">
                <strong>Warning:</strong> {poshakGem.cautions}
              </div>
            </div>
          </div>

          {/* Critical Rules for Wearing Gemstones */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2 text-xs">
            <h5 className="font-bold text-amber-950 flex items-center gap-1.5 font-vedic text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Classical Vedic Rules for Gemstone Purification (प्राण प्रतिष्ठा विधि)</span>
            </h5>
            <p className="text-stone-700 leading-relaxed">
              Dip the gemstone ring in raw cow milk, honey, Ganga Jal, and Tulsi leaves for at least 30 minutes before wearing. Light pure ghee incense and chant the designated planetary Beej Mantra 108 times using a crystal or rudraksha mala facing East. Ensure the base of the ring allows the gemstone to gently touch the epidermis of your finger.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: RUDRAKSHA PRESCRIPTION */}
      {activeTab === 'rudraksha' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kundliData.grahasList.map((g) => {
              const rGuide = RUDRAKSHA_GUIDE[g.id];
              const isLagnesh = g.id === lagneshId;
              const isCurrentMahadasha = g.id === kundliData.vimshottariDasha.currentMahadasha.planet;

              return (
                <div
                  key={g.id}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs space-y-2 text-xs ${
                    isLagnesh
                      ? 'border-amber-400 bg-amber-50/20 ring-1 ring-amber-300'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{g.avatar}</span>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm font-vedic">
                          {rGuide.mukhi}
                        </h4>
                        <span className="text-[11px] text-stone-500">
                          For {g.name} ({g.sanskritName}) • Deity: <strong>{rGuide.deity}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {isLagnesh && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px]">
                          Lagna Raksha
                        </span>
                      )}
                      {isCurrentMahadasha && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          Current Dasha
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-stone-700 leading-relaxed">
                    <strong>Spiritual &amp; Mental Benefits:</strong> {rGuide.benefits}
                  </p>

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
                    <span>String in: <strong>Red / Yellow Silk Thread or Silver</strong></span>
                    <span>Chant: <strong>ॐ नमः शिवाय (108 times)</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BEEJ MANTRA JAPA SADHANA */}
      {activeTab === 'mantra' && (
        <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="p-3 bg-amber-50 border-b border-stone-200 flex items-center justify-between text-xs">
            <span className="font-bold text-amber-950 font-vedic">
              नवग्रह बीज मंत्र साधना (Navagraha Beej Mantras &amp; Japa Counts)
            </span>
            <span className="text-stone-500">Best chanting time: Brahma Muhurta or Sunset</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200 text-[11px]">
                <tr>
                  <th className="p-2.5 border-r border-stone-200">ग्रह (Graha)</th>
                  <th className="p-2.5 border-r border-stone-200">बीज मंत्र (Devanagari)</th>
                  <th className="p-2.5 border-r border-stone-200">Transliteration</th>
                  <th className="p-2.5 border-r border-stone-200 text-center">कुल जप संख्या (Target)</th>
                  <th className="p-2.5">माला (Mala)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  { id: 'sun', count: '7,000', mala: 'Rudraksha / Red Sandalwood' },
                  { id: 'moon', count: '11,000', mala: 'Sphatik / Pearl' },
                  { id: 'mars', count: '10,000', mala: 'Red Sandalwood / Coral' },
                  { id: 'mercury', count: '9,000', mala: 'Rudraksha / Tulsi' },
                  { id: 'jupiter', count: '19,000', mala: 'Yellow Sandalwood / Turmeric' },
                  { id: 'venus', count: '16,000', mala: 'Sphatik / Lotus Seed (Kamalgatta)' },
                  { id: 'saturn', count: '23,000', mala: 'Rudraksha / Black Agate' },
                  { id: 'rahu', count: '18,000', mala: 'Rudraksha / Black Agate' },
                  { id: 'ketu', count: '17,000', mala: 'Rudraksha / Cat’s Eye beads' },
                ].map((item) => {
                  const p = PLANETS_DATA[item.id as PlanetId];
                  const g = kundliData.grahas[item.id as PlanetId];
                  const isCurrent = item.id === kundliData.vimshottariDasha.currentMahadasha.planet;

                  return (
                    <tr
                      key={item.id}
                      className={isCurrent ? 'bg-amber-100/60 font-bold' : 'hover:bg-stone-50'}
                    >
                      <td className="p-2.5 whitespace-nowrap border-r border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <span>{p.avatar}</span>
                          <div>
                            <span>{p.name}</span>
                            {isCurrent && (
                              <span className="text-[9.5px] ml-1 text-amber-900 bg-amber-200 px-1 py-0.5 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-2.5 font-vedic text-amber-950 font-bold whitespace-nowrap border-r border-stone-100 text-sm">
                        {p.beejMantra}
                      </td>

                      <td className="p-2.5 font-mono text-stone-600 whitespace-nowrap border-r border-stone-100 text-[11px] italic">
                        {p.beejMantraTransliteration}
                      </td>

                      <td className="p-2.5 text-center font-mono font-bold text-stone-800 whitespace-nowrap border-r border-stone-100">
                        {item.count}
                      </td>

                      <td className="p-2.5 text-stone-700 whitespace-nowrap text-[11px]">
                        {item.mala}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CHARITY & DAANA */}
      {activeTab === 'daana' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              {
                planet: 'Sun (Surya)',
                avatar: '☀️',
                items: 'Wheat, Jaggery (Gud), Copper utensils, Red flowers, Saffron fabric',
                day: 'Sunday noon',
                beneficiary: 'Needy elders, temple priests, cows',
              },
              {
                planet: 'Moon (Chandra)',
                avatar: '🌙',
                items: 'Rice, Milk, Sugar, White camphor, Silver coins, White clothes',
                day: 'Monday evening',
                beneficiary: 'Mothers, elderly women, ascetic sadhus',
              },
              {
                planet: 'Mars (Mangal)',
                avatar: '🔥',
                items: 'Red lentils (Masoor Dal), Jaggery, Red cloth, Copper, Sweet batasha',
                day: 'Tuesday morning',
                beneficiary: 'Soldiers, laborers, youth workers, Hanuman temple',
              },
              {
                planet: 'Mercury (Budha)',
                avatar: '🌿',
                items: 'Green Moong beans, Fresh green spinach/fodder for cows, Books, Bronze',
                day: 'Wednesday morning',
                beneficiary: 'Needy students, orphans, Gaushala (cows)',
              },
              {
                planet: 'Jupiter (Brihaspati)',
                avatar: '📿',
                items: 'Chana Dal, Turmeric (Haldi), Yellow cloth, Besan sweets, Religious scriptures',
                day: 'Thursday morning',
                beneficiary: 'Teachers, scholars, ashrams, Brahmins',
              },
              {
                planet: 'Venus (Shukra)',
                avatar: '💎',
                items: 'White flour, Ghee, Sugar candy (Mishri), White silk clothing, Perfumes',
                day: 'Friday sunrise',
                beneficiary: 'Underprivileged girls, artists, women in need',
              },
              {
                planet: 'Saturn (Shani)',
                avatar: '⚖️',
                items: 'Black sesame (Til), Mustard oil (Sarson Tel), Iron utensils, Black umbrella, Blankets',
                day: 'Saturday sunset',
                beneficiary: 'Disabled persons, sweepers, poor workers, crows',
              },
              {
                planet: 'Rahu',
                avatar: '🌪️',
                items: 'Seven grains (Satnaja), Coconut, Mustard seeds, Blue/Dark gray blanket',
                day: 'Saturday night',
                beneficiary: 'Lepers, street cleaners, immerse raw coconut in flowing water',
              },
              {
                planet: 'Ketu',
                avatar: '🚩',
                items: 'Black and white dual-tone blanket, Sesame seeds, Feeding street dogs',
                day: 'Tuesday/Thursday night',
                beneficiary: 'Fray street dogs (roti with mustard oil), spiritual seekers',
              },
            ].map((d, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                    <span className="text-2xl">{d.avatar}</span>
                    <strong className="font-vedic text-stone-900 text-sm">{d.planet} Daana</strong>
                  </div>
                  <div className="mt-2 space-y-1 text-stone-700">
                    <div><strong>Items to Donate:</strong> {d.items}</div>
                    <div><strong>Ideal Time:</strong> {d.day}</div>
                    <div><strong>Beneficiary:</strong> {d.beneficiary}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DOSHA NEUTRALIZATION */}
      {activeTab === 'dosha' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manglik Dosha Neutralization */}
            <div className="bg-white rounded-2xl border border-rose-200 p-4 sm:p-5 shadow-2xs space-y-2.5 text-xs">
              <div className="flex items-center gap-2 border-b border-rose-100 pb-2">
                <Flame className="w-5 h-5 text-rose-600" />
                <h4 className="font-bold text-stone-900 font-vedic text-sm">
                  Manglik Dosha Remedial Protocols (भौम दोष शांति)
                </h4>
              </div>
              <p className="text-stone-700 leading-relaxed">
                If Mars sits in houses 1, 4, 7, 8, or 12 in the natal chart or Navamsha, the following classical mitigations establish peace and harmony:
              </p>
              <ul className="space-y-1.5 text-stone-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Recite Hanuman Chalisa daily and Sunderkand on Tuesdays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Kumbh Vivah or Vishnu Pratima Vivah ritual prior to marriage if strongly afflicted.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Feed sweet rotis / jaggery to birds and stray cows on Tuesdays.</span>
                </li>
              </ul>
            </div>

            {/* Shani Sade Sati / Kantaka Shani */}
            <div className="bg-white rounded-2xl border border-stone-300 p-4 sm:p-5 shadow-2xs space-y-2.5 text-xs">
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                <ShieldCheck className="w-5 h-5 text-stone-700" />
                <h4 className="font-bold text-stone-900 font-vedic text-sm">
                  Shani Sade Sati &amp; Dhaiya Mitigations (शनि शांति)
                </h4>
              </div>
              <p className="text-stone-700 leading-relaxed">
                For balancing Saturnian karma, delays, or physical fatigue:
              </p>
              <ul className="space-y-1.5 text-stone-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                  <span>Light a mustard oil lamp under a Peepal tree every Saturday evening.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                  <span>Chant Dasharatha Shani Stotram or Maha Mrityunjaya Mantra (108 times).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                  <span>Donate black umbrella, leather shoes, or iron tawa to needy labor workers.</span>
                </li>
              </ul>
            </div>

            {/* Kaal Sarp Dosha */}
            <div className="bg-white rounded-2xl border border-amber-200 p-4 sm:p-5 shadow-2xs space-y-2.5 text-xs">
              <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-stone-900 font-vedic text-sm">
                  Kaal Sarp Yoga Balancing (कालसर्प दोष निवारण)
                </h4>
              </div>
              <p className="text-stone-700 leading-relaxed">
                When all physical planets are hemmed between Rahu and Ketu:
              </p>
              <ul className="space-y-1.5 text-stone-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>Perform Rudrabhishek with Panchamrit on Mondays or Nag Panchami.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>Release a pair of silver snakes (Nag-Nagin joda) in a sacred flowing river.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>Chant Maha Mrityunjaya Mantra and Rahu-Ketu Stotras regularly.</span>
                </li>
              </ul>
            </div>

            {/* General Auspicious Daily Routine (Dinacharya) */}
            <div className="bg-white rounded-2xl border border-emerald-200 p-4 sm:p-5 shadow-2xs space-y-2.5 text-xs">
              <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                <Sun className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-stone-900 font-vedic text-sm">
                  Vedic Dinacharya &amp; Daily Aura Fortification (दैनिक सुरक्षा)
                </h4>
              </div>
              <p className="text-stone-700 leading-relaxed">
                Universal daily practices aligned with ancient sage Parashara’s recommendations:
              </p>
              <ul className="space-y-1.5 text-stone-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Offer Arghya (clean water in copper vessel) to the rising morning Sun.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Touch the feet of parents and respected mentors to awaken Bhagya Sthana (9th House).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Keep a Tulsi plant in North-East / East direction and water it daily.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
