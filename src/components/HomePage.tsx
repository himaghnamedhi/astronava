import React from 'react';
import {
  Sparkles,
  Gem,
  Heart,
  Hash,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  Sun,
} from 'lucide-react';
import { AppTabType } from '../utils/sitemap';

interface HomePageProps {
  onSelectTab: (tab: AppTabType) => void;
}

interface FeatureModule {
  id: AppTabType;
  sanskritTitle: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  accentGradient: string;
  borderAccent: string;
  highlights: string[];
  ctaLabel: string;
  popularQuery: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTab }) => {
  const modules: FeatureModule[] = [
    {
      id: 'horoscope',
      sanskritTitle: 'दैनिक राशिफल',
      title: 'Personalized Daily Horoscope',
      tagline: 'Real Ephemeris Transits, 20 Life Domains & AI Interpretation',
      description:
        'Daily astrological predictions computed specifically for your birth chart using real Lahiri Gochar transits, active Vimshottari Dasha, Sarvashtakavarga scores, and full Vedic Panchang. Features 20 life categories, Choghadiya timing windows, and personalized remedial mantras.',
      icon: Sun,
      badge: 'Real Astronomical Transits',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      accentGradient: 'from-amber-600 to-amber-900',
      borderAccent: 'border-amber-200/80 hover:border-amber-400',
      highlights: [
        'Verified Gochar & Dasha Synergy',
        '20 Distinct Life Category Scores',
        '8 Choghadiya Muhurat Windows',
        'Daily Beej Mantra & Lucky Matrix',
      ],
      ctaLabel: 'View Today’s Horoscope',
      popularQuery: 'daily horoscope today rashi gochar panchang predictions',
    },
    {
      id: 'generator',
      sanskritTitle: 'जन्म कुण्डली',
      title: 'Kundli Maker & Janam Patrika',
      tagline: 'Authentic Vedic Horoscopes & Divisional Charts',
      description:
        'Generate high-precision Vedic Janam Kundli charts based on classical Parashari Jyotish and Chitrapaksha Lahiri Ayanamsha. Includes Lagna, Navamsha, 7 Divisional Vargas (D1–D12), Vimshottari Mahadasha timeline, and 337-point Sarvashtakavarga tables.',
      icon: Sparkles,
      badge: 'Most Popular',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      accentGradient: 'from-amber-700 to-amber-900',
      borderAccent: 'border-amber-200/80 hover:border-amber-400',
      highlights: [
        'Lahiri Ayanamsha (Chitrapaksha)',
        '7 Divisional Charts (D1 to D12)',
        'Vimshottari Dasha with Dates',
        'Sarvashtakavarga 337 Bindus',
      ],
      ctaLabel: 'Generate Janam Kundli',
      popularQuery: 'kundli birth chart lagna dasha patrika',
    },
    {
      id: 'gemstones',
      sanskritTitle: 'रत्न विचार',
      title: 'Gemstone Recommender (Gemstore)',
      tagline: 'Body-Weight Calibrated Vedic Ratna Remedies',
      description:
        'Discover your auspicious Life Stone (Jeevan Ratna), Lucky Stone (Bhagya Ratna), and Career Karaka derived from your Lagna and Trikona lords. Features automated body-weight calibrated Ratti dosages, wearing finger, metals, and Vedic energizing mantras.',
      icon: Gem,
      badge: 'Remedies Calculator',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      accentGradient: 'from-emerald-700 to-teal-900',
      borderAccent: 'border-emerald-200/80 hover:border-emerald-400',
      highlights: [
        'Lagna & Trikona Lord Analysis',
        'Exact Ratti Dosage by Body Weight',
        'Auspicious Metals & Wearing Finger',
        'Vedic Beej Mantras & Rituals',
      ],
      ctaLabel: 'Find My Gemstone',
      popularQuery: 'gemstone ratna pukhraj neelam ruby emerald',
    },
    {
      id: 'match',
      sanskritTitle: '36 गुण मिलान',
      title: 'Match Finder (Kundli Milan)',
      tagline: 'Sacred Ashta Kuta & Compatibility Analysis',
      description:
        'Evaluate marriage and relationship harmony across the 8 sacred Ashta Kuta dimensions totaling 36 Gunas (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi). Includes automated Kuja / Manglik Dosha diagnostics and cancellation analysis.',
      icon: Heart,
      badge: 'Relationship Harmony',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      accentGradient: 'from-rose-700 to-rose-950',
      borderAccent: 'border-rose-200/80 hover:border-rose-400',
      highlights: [
        '36 Gunas Ashta Kuta System',
        'Manglik (Kuja) Dosha Detection',
        'Nadi & Bhakoot Longevity Checks',
        'Detailed Compatibility Verdict',
      ],
      ctaLabel: 'Check Compatibility',
      popularQuery: 'kundli milan marriage match 36 gunas manglik',
    },
    {
      id: 'numerology',
      sanskritTitle: 'अंक शास्त्र',
      title: 'Numerology Calculator',
      tagline: 'Mulank, Bhagyank & Cosmic Vibrations',
      description:
        'Uncover your vibrational numbers through Vedic and Cheiro Sankhya Shastra. Calculates your Psychic Root Driver (Mulank), Life Path Destiny Number (Bhagyank), and Name Vibration (Namank), detailing ruling planets, fortunate dates, colors, and life cycles.',
      icon: Hash,
      badge: 'Vibrational Science',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      accentGradient: 'from-amber-800 to-stone-900',
      borderAccent: 'border-amber-200/80 hover:border-amber-400',
      highlights: [
        'Mulank (Psychic Driver) & Ruler',
        'Bhagyank (Life Path Destiny)',
        'Namank (Name Vibration)',
        'Auspicious Dates, Days & Colors',
      ],
      ctaLabel: 'Calculate My Numbers',
      popularQuery: 'numerology mulank bhagyank namank lucky numbers',
    },
    {
      id: 'store',
      sanskritTitle: 'वैदिक भण्डार',
      title: 'Sacred Vedic Store',
      tagline: 'Lab-Certified Gemstones, Rudraksha & Crystals',
      description:
        'Acquire energized and authenticated Vedic remedies delivered securely across India. Explore natural untreated gemstones (Yellow Sapphire, Blue Sapphire, Ruby, Emerald), genuine Nepali Rudraksha beads (1 to 14 Mukhi), and energizing sacred crystals.',
      icon: ShoppingBag,
      badge: 'Certified & Consecrated',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-400',
      accentGradient: 'from-amber-900 to-stone-950',
      borderAccent: 'border-amber-300/90 hover:border-amber-500',
      highlights: [
        '100% Natural Certified Gemstones',
        'Authentic Nepali Rudraksha Beads',
        'Complimentary Prana Pratishtha',
        'Wishlist, Orders & Secure Checkout',
      ],
      ctaLabel: 'Explore Sacred Store',
      popularQuery: 'store shop buy gemstones rudraksha crystals',
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-14 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 via-[#1c120c] to-stone-950 text-stone-100 p-6 sm:p-10 lg:p-14 border border-amber-500/20 shadow-xl">
        {/* Subtle Background Vedic Mandala Glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Sacred Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Astronava • Authentic Vedic Jyotish &amp; Sacred Remedies</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-vedic tracking-tight text-white leading-tight sm:leading-tight">
            Sacred Cosmic Wisdom &amp; Precision Astrological Diagnostics
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Welcome to Astronava. Explore classical Parashari horoscopes, certified gemstone remedies, 36 Guna marriage compatibility, vibrational numerology, and authentic consecrated spiritual items in one unified portal.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              id="hero-btn-kundli"
              onClick={() => onSelectTab('generator')}
              className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-semibold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Make Free Janam Kundli</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-btn-store"
              onClick={() => onSelectTab('store')}
              className="px-5 sm:px-6 py-3 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-amber-200 font-semibold text-sm border border-amber-500/30 shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Browse Sacred Store</span>
            </button>

            <button
              id="hero-btn-match"
              onClick={() => onSelectTab('match')}
              className="px-5 sm:px-6 py-3 rounded-xl bg-stone-800/50 hover:bg-stone-800 text-stone-200 font-medium text-sm border border-stone-700 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>36 Guna Milan</span>
            </button>
          </div>

          {/* Trust Pillars Strip */}
          <div className="pt-6 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-800/40 border border-stone-700/50">
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-semibold text-stone-200 block">Lahiri Ayanamsha</span>
                <span className="text-stone-400">Govt. of India Standard</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-800/40 border border-stone-700/50">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-semibold text-stone-200 block">100% Free Calculators</span>
                <span className="text-stone-400">No Paywalls on Kundli</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-800/40 border border-stone-700/50">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-semibold text-stone-200 block">Certified Gemstones</span>
                <span className="text-stone-400">Lab Authentic &amp; Consecrated</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-800/40 border border-stone-700/50">
              <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-semibold text-stone-200 block">Parashari Principles</span>
                <span className="text-stone-400">Brihat Parashara Hora</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary 5 Modules Showcase Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {modules.map((item) => {
          const Icon = item.icon;
          const isFeaturedStore = item.id === 'store';

          return (
            <div
              key={item.id}
              id={`module-card-${item.id}`}
              className={`group relative rounded-3xl bg-white p-6 sm:p-8 border transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between ${item.borderAccent} ${
                isFeaturedStore && modules.length % 2 !== 0 ? 'lg:col-span-2' : ''
              }`}
            >
              {/* Card Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.accentGradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest font-vedic">
                        {item.sanskritTitle}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-vedic text-stone-900 leading-tight">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>

                <div className="text-xs font-semibold text-amber-900/90 tracking-wide">
                  {item.tagline}
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Key Highlights Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {item.highlights.map((hl) => (
                    <div
                      key={hl}
                      className="flex items-center gap-2 text-xs text-stone-700 bg-stone-50 border border-stone-200/80 px-2.5 py-1.5 rounded-xl"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer / Primary CTA */}
              <div className="pt-6 mt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  id={`btn-open-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r ${item.accentGradient} hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all group-hover:translate-x-0.5 cursor-pointer active:scale-95`}
                >
                  <span>{item.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                {item.id === 'generator' && (
                  <button
                    onClick={() => onSelectTab('builder')}
                    className="text-xs font-semibold text-amber-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Custom House Visualizer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {item.id === 'store' && (
                  <span className="text-[11px] text-stone-500 font-medium">
                    Free Pan-India Delivery &amp; Certified Authenticity
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Classical Foundations Banner */}
      <section className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Pure Vedic Jyotish Ephemeris</span>
          </div>
          <h3 className="text-xl font-bold font-vedic text-stone-900">
            Rooted in Brihat Parashara Hora Shastra &amp; Surya Siddhanta
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            All calculations in Astronava adhere strictly to Chitrapaksha Lahiri Ayanamsha (23°51'11"), the standard adopted by the Indian Astronomical Ephemeris. We do not use commercial approximations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            id="btn-home-make-kundli-now"
            onClick={() => onSelectTab('generator')}
            className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Launch Kundli Maker</span>
          </button>
          <button
            id="btn-home-open-store-now"
            onClick={() => onSelectTab('store')}
            className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold border border-stone-300 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-amber-800" />
            <span>Visit Sacred Store</span>
          </button>
        </div>
      </section>
    </div>
  );
};
