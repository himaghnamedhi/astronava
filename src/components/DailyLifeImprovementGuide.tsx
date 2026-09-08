import React, { useState } from 'react';
import { CompleteKundliData } from '../data/vedicEphemeris';
import {
  Sun,
  Moon,
  Compass,
  Heart,
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coffee,
  Bed,
  Flame,
  Droplets,
  Wind,
  Mountain,
  HelpCircle
} from 'lucide-react';

interface DailyLifeImprovementGuideProps {
  kundliData: CompleteKundliData;
}

export const DailyLifeImprovementGuide: React.FC<DailyLifeImprovementGuideProps> = ({
  kundliData,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'dinacharya' | 'mind' | 'career' | 'remedies'>('all');

  const lagnaSign = kundliData.lagna.signName;
  const lagnaNum = kundliData.lagna.signNumber;
  const moonRashi = kundliData.grahas.moon.rashiName;
  const moonNum = kundliData.grahas.moon.rashiNumber;
  const moonNakshatra = kundliData.grahas.moon.nakshatraName;
  const sunRashi = kundliData.grahas.sun.rashiName;
  const sunHouse = kundliData.grahas.sun.house;
  const mahadasha = kundliData.vimshottariDasha.currentMahadasha.lordName;
  const tithiName = kundliData.tithi?.name || kundliData.tithi?.tithi?.name || 'Vedic Tithi';
  const tithiPaksha = kundliData.tithi?.paksha || kundliData.tithi?.tithi?.paksha || '';

  // Determine Lagna Element: Fire (1,5,9), Earth (2,6,10), Air (3,7,11), Water (4,8,12)
  const getElement = (signNum: number): { type: 'fire' | 'earth' | 'air' | 'water'; title: string; icon: any; color: string; bg: string; border: string } => {
    if ([1, 5, 9].includes(signNum)) {
      return { type: 'fire', title: 'Agni (Fire)', icon: Flame, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    }
    if ([2, 6, 10].includes(signNum)) {
      return { type: 'earth', title: 'Prithvi (Earth)', icon: Mountain, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    }
    if ([3, 7, 11].includes(signNum)) {
      return { type: 'air', title: 'Vayu (Air)', icon: Wind, color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' };
    }
    return { type: 'water', title: 'Jala (Water)', icon: Droplets, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
  };

  const lagnaElement = getElement(lagnaNum);
  const moonElement = getElement(moonNum);

  // Personalized Dinacharya Advice
  const getDinacharyaDetails = () => {
    switch (lagnaElement.type) {
      case 'fire':
        return {
          wakeWindow: '5:00 AM – 5:45 AM (Brahma Muhurta)',
          vitalityRoutine: 'High metabolic fire (Pitta). Start with 15 minutes of vigorous movement or Surya Namaskar, followed by cool water hydration. Do not skip morning physical exertion, or excess heat turns into irritability.',
          breakfastAdvice: 'Cooling, nutrient-dense breakfast (fruits, oatmeal, soaked almonds). Avoid excessively spicy or pungent morning foods.',
          peakHours: '8:30 AM – 12:30 PM: Take bold initiatives, lead meetings, and tackle the hardest creative problems when solar energy peaks.',
          eveningWinddown: 'Cool shower in the evening, dim artificial lights after 8:30 PM, and disconnect from heated debates before sleep.',
        };
      case 'earth':
        return {
          wakeWindow: '5:30 AM – 6:15 AM (Pre-Sunrise)',
          vitalityRoutine: 'Grounding Kapha-Prithvi nature. Overcome early inertia with brisk walking in nature, warm ginger-lemon water, and deep breathing (Kapalabhati). Keep a clear written priority checklist.',
          breakfastAdvice: 'Warm, lightly spiced wholesome breakfast. Avoid heavy sweets or cold dairy in the morning to prevent sluggish digestion.',
          peakHours: '9:30 AM – 2:00 PM: Methodical execution, financial organization, technical architecture, and long-term project planning.',
          eveningWinddown: 'Gentle stretching, reviewing gratitude achievements, sleeping on a firm mattress with head towards South or East.',
        };
      case 'air':
        return {
          wakeWindow: '5:45 AM – 6:30 AM (Gentle Awakening)',
          vitalityRoutine: 'Active nervous system (Vata). Requires grounding rituals: 5 minutes of mindful Nadi Shodhana (alternate nostril breathing), warm sesame oil foot massage (Pada Abhyanga), and zero morning social media scrolling.',
          breakfastAdvice: 'Warm, grounding, cooked nourishing food (porridge, warm herbal tea, ghee). Never skip breakfast on busy work days.',
          peakHours: '10:00 AM – 1:00 PM & 4:00 PM – 6:30 PM: Brainstorming, negotiations, writing, strategic communication, and synthesized research.',
          eveningWinddown: 'Strict digital sunset 45 minutes before sleep. Write down pending thoughts in a notebook to empty mental loops.',
        };
      case 'water':
      default:
        return {
          wakeWindow: '5:15 AM – 6:00 AM (Quiet Dawn)',
          vitalityRoutine: 'Deeply intuitive, sensitive energetic field. Awakening near natural light or quiet water is deeply healing. Practice silent meditation or silent mantra chanting before speaking with others.',
          breakfastAdvice: 'Fresh, hydrating, easily digestible meals. Drink warm herbal infusions (tulsi, fennel) throughout the morning.',
          peakHours: '8:00 AM – 11:30 AM & 3:00 PM – 5:30 PM: Intuitive diagnostics, empathetic client handling, creative design, and counseling.',
          eveningWinddown: 'Wash feet with warm water, avoid absorbing emotionally heavy news or negative movies at night, sleep in peace.',
        };
    }
  };

  const dina = getDinacharyaDetails();

  // Moon Mind Advice
  const getMindAdvice = () => {
    switch (moonElement.type) {
      case 'fire':
        return {
          mindState: 'Dynamic & Passionate',
          challenge: 'Impatience, sudden outbursts when plans are delayed, or burning out from hyper-enthusiasm.',
          solution: 'Channel emotional surge into physical workouts or sports. When frustrated, take 10 slow conscious belly breaths before replying to any message.',
        };
      case 'earth':
        return {
          mindState: 'Pragmatic & Stable',
          challenge: 'Tendency to worry about financial or material stability, resisting necessary changes, holding onto old habits.',
          solution: 'Walk barefoot on grass (earthing) 2-3 times a week. Practice detachment by regularly donating items you no longer use.',
        };
      case 'air':
        return {
          mindState: 'Analytical & Rapid',
          challenge: 'Overthinking, analysis paralysis, anxiety over unpredictable futures, insomnia from active mental chatter.',
          solution: 'Practice daily grounding meditation. Limit caffeine intake after 1:00 PM. Keep your workspace uncluttered and clean.',
        };
      case 'water':
      default:
        return {
          mindState: 'Deeply Sensitive & Empathetic',
          challenge: 'Absorbing other people’s negative moods, emotional exhaustion from people-pleasing, mood swings with lunar phases.',
          solution: 'Set healthy energetic boundaries with colleagues and friends. On Ekadashi and Purnima, drink pure water from a silver cup.',
        };
    }
  };

  const mind = getMindAdvice();

  return (
    <div id="daily-improvement-section" className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full font-vedic">
              Ayur-Jyotish &amp; Dinacharya
            </span>
            <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
              Personalized for {kundliData?.birthDetails?.name || 'Native'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-700" />
            <span>Daily Life Improvements &amp; Vedic Guidance (दैनिक जीवन सुधार)</span>
          </h3>
          <p className="text-xs text-stone-600 mt-1 max-w-3xl">
            Practical lifestyle habits, peak productivity cycles, emotional grounding, and daily micro-remedies calculated from your 
            <strong> {lagnaSign} Lagna ({lagnaElement.title})</strong>, <strong>{moonRashi} Moon ({moonNakshatra})</strong>, and current <strong>{mahadasha} Mahadasha</strong>.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {[
            { id: 'all', label: 'All Guidance' },
            { id: 'dinacharya', label: 'Daily Routine' },
            { id: 'mind', label: 'Mind Balance' },
            { id: 'career', label: 'Work & Focus' },
            { id: 'remedies', label: 'Micro-Remedies' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-900 text-amber-50 shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Practical Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Dinacharya & Morning Awakening */}
        {(activeCategory === 'all' || activeCategory === 'dinacharya') && (
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-200/70 text-amber-900 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">1. Optimal Morning Routine</h4>
                <span className="text-[11px] text-amber-800 font-semibold font-mono">{dina.wakeWindow}</span>
              </div>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {dina.vitalityRoutine}
            </p>
            <div className="pt-2 border-t border-amber-200/60 text-[11px] text-stone-600 flex items-start gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span><strong>Breakfast Guidance:</strong> {dina.breakfastAdvice}</span>
            </div>
          </div>
        )}

        {/* Card 2: Mental Harmony & Emotional Grounding */}
        {(activeCategory === 'all' || activeCategory === 'mind') && (
          <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-200/70 text-sky-900 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wide">2. Emotional Regulation</h4>
                <span className="text-[11px] text-sky-800 font-semibold">{moonRashi} Moon • {moonNakshatra}</span>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-stone-700">
              <p>
                <strong className="text-sky-900">Natural Tendency:</strong> {mind.challenge}
              </p>
              <p>
                <strong className="text-sky-900">Daily Antidote:</strong> {mind.solution}
              </p>
            </div>
            <div className="pt-2 border-t border-sky-200/60 text-[11px] text-stone-600 flex items-start gap-1.5">
              <Bed className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
              <span><strong>Sleep Hygiene:</strong> Rest with head to East or South; practice 5 mins deep belly breathing in bed.</span>
            </div>
          </div>
        )}

        {/* Card 3: Career & Peak Focus Time */}
        {(activeCategory === 'all' || activeCategory === 'career') && (
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-200/70 text-emerald-900 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">3. Peak Productivity Hours</h4>
                <span className="text-[11px] text-emerald-800 font-semibold">Aligning Solar &amp; Lagna Rhythm</span>
              </div>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              <strong>Deep Work Window:</strong> {dina.peakHours}
            </p>
            <div className="space-y-1 text-xs text-stone-600 pt-1">
              <p>• <strong>Desk Orientation:</strong> Face <strong>East</strong> (for creative vitality) or <strong>North</strong> (for financial acumen and analytical focus).</p>
              <p>• <strong>Decision Strategy:</strong> Delay major impulsive decisions until you take a walk; review written points calmly.</p>
            </div>
          </div>
        )}

        {/* Card 4: Daily Speech & Relationships (Vani & Harmony) */}
        {(activeCategory === 'all' || activeCategory === 'career' || activeCategory === 'mind') && (
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-200/70 text-purple-900 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wide">4. Interpersonal &amp; Speech Harmony</h4>
                <span className="text-[11px] text-purple-800 font-semibold">2nd &amp; 7th Bhava Cultivation</span>
              </div>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Practice <strong>Sathya-Priya Vani</strong> (truthful yet pleasant speech). In tense conversations, consciously lower your vocal pitch by 10% and summarize the other person's view before stating your objection.
            </p>
            <div className="pt-2 border-t border-purple-200/60 text-[11px] text-stone-600">
              <span><strong>Key Relationship Habit:</strong> Never argue during meals. Food eaten in harmony directly pacifies digestive fire and lunar agitation.</span>
            </div>
          </div>
        )}

        {/* Card 5: Daily Micro-Remedies (Upayas) */}
        {(activeCategory === 'all' || activeCategory === 'remedies') && (
          <div className="p-4 rounded-2xl bg-amber-100/40 border border-amber-300/80 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-300/70 text-amber-900 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">5. Daily Vedic Micro-Remedies</h4>
                <span className="text-[11px] text-amber-800 font-semibold">{mahadasha} Dasha Harmonization</span>
              </div>
            </div>
            <ul className="text-xs text-stone-700 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Surya Arghya:</strong> Offer clean water in a copper vessel facing East at sunrise with Gayatri Mantra.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Micro-Charity (Dana):</strong> Feed birds or stray animals a small handful of grains or water each morning.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Janma Tithi Honor:</strong> Born on <strong>{tithiName} ({tithiPaksha.split(' ')[0]})</strong>; light a ghee lamp on your tithi day for ancestral grace.</span>
              </li>
            </ul>
          </div>
        )}

        {/* Card 6: Daily Habits to Avoid */}
        {(activeCategory === 'all' || activeCategory === 'remedies') && (
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-200/70 text-rose-900 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wide">6. Habits to Avoid Daily</h4>
                <span className="text-[11px] text-rose-800 font-semibold">Protection from Prana Leaks</span>
              </div>
            </div>
            <ul className="text-xs text-stone-700 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span>Avoid eating heavy meals late at night past 8:30 PM, which clouds dream clarity and morning vigor.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span>Avoid engaging in negative gossip or pessimistic complaints, which depletes Jupiter's protective aura.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-rose-600 font-bold">•</span>
                <span>Avoid cluttered clothes or unmade bed; cleanliness in the bedroom directly honors Venus and Moon.</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
