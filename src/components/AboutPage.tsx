import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Compass,
  ShieldCheck,
  BookOpen,
  Award,
  Sun,
  Heart,
  Gem,
  Hash,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Lock,
  Scale,
  HelpCircle,
  ChevronDown,
  Mail,
  ExternalLink,
  Flame,
  Globe2,
} from 'lucide-react';
import { AppTabType } from '../utils/sitemap';

interface AboutPageProps {
  onNavigateTab: (tab: AppTabType) => void;
  onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateTab, onBack }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Is Astronava based on Vedic (Sidereal) or Western (Tropical) astrology?',
      a: 'Astronava is strictly and exclusively grounded in authentic Vedic (Sidereal) Jyotish. Unlike Western astrology which is linked to the tropical seasons, Vedic astrology measures the actual physical positions of the constellations against the background stars using the Chitrapaksha Lahiri Ayanamsha (the standard adopted by the Government of India Calendar Reform Committee).',
    },
    {
      q: 'Which Ayanamsha and calculation algorithms do you employ?',
      a: 'We use the Chitrapaksha Lahiri Ayanamsha, the gold standard in contemporary Vedic astrology. Our astronomical calculations utilize high-precision planetary ephemeris algorithms calibrated against NASA/JPL planetary coordinates, providing planetary positions down to the second of arc (arcseconds) for Bhavachalit cusps, Lagna ascendant, and divisional vargas (D1 to D12).',
    },
    {
      q: 'Are the gemstones in the Sacred Store genuine and energized?',
      a: 'Yes, 100%. Every gemstone offered through Astronava is natural, unheated, untreated, and independently tested by ISO-certified gemological testing laboratories with verifiable certification cards. Furthermore, each gemstone and sacred Rudraksha bead undergoes authentic Vedic Prana Pratishtha energization and Abhishek using traditional Vedic Beej mantras before dispatch.',
    },
    {
      q: 'What is your stance on destiny vs. free will (Karma vs. Purushartha)?',
      a: 'We hold the classical Vedic view that astrology reveals "Sanchita" and "Prarabdha" Karma (the atmospheric cosmic weather and predispositions), but you possess "Kriyamana" Karma — conscious right action (Purushartha). Astrology is not a fatalistic decree; it is a celestial navigational chart that empowers you to make wise, aligned decisions.',
    },
    {
      q: 'Do you sell or share my birth details with third-party advertisers?',
      a: 'Never. Your birth details (date, exact time, geographic latitude, and longitude) are treated with the sanctity of a sacred horoscope. We maintain a zero-data-monetization policy. Your astrological records are never sold, rented, or distributed to advertising networks or data brokers.',
    },
    {
      q: 'How can I contact the Astronava research and support team?',
      a: 'You can reach our Vedic research and customer support team directly at customer-support@astronava.com or by clicking the "Contact Us" link in our navigation and footer. We respond personally to all genuine inquiries.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-amber-200 selection:text-amber-950">
      {/* Top Banner & Breadcrumbs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-amber-800 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="text-stone-400">Astronava</span>
            <span>/</span>
            <span className="text-amber-900 font-bold">About Us</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="relative rounded-3xl bg-gradient-to-b from-stone-950 via-[#1c120c] to-stone-900 text-stone-100 p-6 sm:p-12 lg:p-16 border border-amber-500/30 shadow-2xl overflow-hidden">
          {/* Decorative sacred geometry glows */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            {/* Sanskrit Invocatory Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ज्योतिषां सूर्यं प्रपद्ये • The Science of Cosmic Light</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-vedic text-white tracking-tight leading-tight">
              Bridging Ancient Vedic Jyotish with Modern Planetary Precision
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-stone-300 leading-relaxed font-normal max-w-2xl mx-auto">
              Astronava was founded to restore Vedic astrology to its true dignity — an ancient mathematical and spiritual science designed to illuminate life’s highest possibilities, free from fear, superstitions, or commercial exploitation.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigateTab('generator')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Make Free Janam Kundli</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('store')}
                className="px-6 py-3 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-amber-200 font-semibold text-xs sm:text-sm border border-amber-500/30 shadow-sm flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Visit Sacred Store</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Pillars Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 -mt-6 sm:-mt-8 relative z-20 max-w-5xl mx-auto px-2">
          <div className="p-4 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-lg text-center space-y-1">
            <span className="text-xl sm:text-3xl font-extrabold font-vedic text-amber-900 block">3,000+ Yrs</span>
            <span className="text-xs font-semibold text-stone-900 block">Classical Heritage</span>
            <p className="text-[11px] text-stone-500 leading-tight">Rooted in Brihat Parashara &amp; Jaimini shastras</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-lg text-center space-y-1">
            <span className="text-xl sm:text-3xl font-extrabold font-vedic text-amber-900 block">0.001° Arc</span>
            <span className="text-xs font-semibold text-stone-900 block">Mathematical Precision</span>
            <p className="text-[11px] text-stone-500 leading-tight">Chitrapaksha Lahiri Ayanamsha ephemeris</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-lg text-center space-y-1">
            <span className="text-xl sm:text-3xl font-extrabold font-vedic text-amber-900 block">100% Certified</span>
            <span className="text-xs font-semibold text-stone-900 block">Sacred Store Sanctity</span>
            <p className="text-[11px] text-stone-500 leading-tight">Natural gemstones &amp; energized Rudraksha</p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-lg text-center space-y-1">
            <span className="text-xl sm:text-3xl font-extrabold font-vedic text-amber-900 block">Zero Sale</span>
            <span className="text-xs font-semibold text-stone-900 block">Birth Data Privacy</span>
            <p className="text-[11px] text-stone-500 leading-tight">Your data is protected with us</p>
          </div>
        </div>
      </section>

      {/* The Story & The Genesis */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-amber-800" />
              <span>Our Genesis &amp; Mission</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-vedic text-stone-950 leading-snug">
              Why We Built Astronava: Restoring Truth to Jyotish
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
              <p>
                In the Sanskrit language, the word for astrology is <strong className="text-stone-950 font-semibold">Jyotiṣa (ज्योतिष)</strong> — derived from <em>Jyoti</em> (light) and <em>Iṣa</em> (divine). It literally translates to <em>&ldquo;The Science of Light&rdquo;</em>, a celestial lamp meant to illuminate one&rsquo;s dharma, life patterns, karmic propensities, and timing of events.
              </p>
              <p>
                Yet across modern media and the internet, astrology has often been reduced to fear-mongering horoscopes, doom predictions around Sade Sati and Manglik Dosha, and predatory upselling of uncertified gemstones and counterfeit remedies.
              </p>
              <p>
                Astronava was built by a collaborative team of dedicated Vedic Jyotish researchers, Sanskrit scholars, and software engineers with a clear mission: <strong className="text-stone-950 font-semibold">to bring authenticity, astronomical transparency, and compassionate integrity back to Vedic astrology.</strong>
              </p>
              <p>
                Every calculation on Astronava — from your Ascendant Lagna degrees to the exact Vimshottari Mahadasha timeline, Sarvashtakavarga 337 bindus, and Ashtakoota 36 Guna Milan — is calculated using peer-reviewed astronomical mathematical models calibrated against the ancient treatises of Maharishi Parashara.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-base sm:text-lg font-bold font-vedic text-amber-950 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Scale className="w-5 h-5 text-amber-800 shrink-0" />
              <span>The Commercial Reality vs. The Astronava Way</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/60 space-y-1">
                <span className="font-bold text-rose-950 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] inline-flex items-center justify-center">✕</span>
                  <span>The Conventional Pitfall</span>
                </span>
                <p className="text-stone-600 leading-relaxed">
                  Superstitious doom predictions, fear-inducing dosha warnings, and pushing generic synthetic gemstones with zero proof of origin.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] inline-flex items-center justify-center">✓</span>
                  <span>The Astronava Standard</span>
                </span>
                <p className="text-stone-700 leading-relaxed">
                  Calculations grounded in Lahiri ephemeris, empowering advice honoring free will (Purushartha), body-weight calibrated gemstone remedies, and 100% lab-certified sacred items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Pillars */}
      <section className="bg-white border-y border-stone-200 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">Foundational Principles</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-vedic text-stone-950">
              The Five Sacred Pillars of Astronava
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Our code, methodologies, and offerings are guided by these non-negotiable principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5 text-amber-800 group-hover:rotate-45 transition-transform" />
              </div>
              <h3 className="text-base font-bold font-vedic text-stone-900">
                1. Astronomical Ephemeric Precision
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We calibrate all planetary coordinates using Chitrapaksha Lahiri Ayanamsha and exact mathematical planetary ephemeris. Houses, aspects (Drishti), combustion (Asta), and retrograde states are evaluated down to arcseconds.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 text-amber-800 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold font-vedic text-stone-900">
                2. Empowerment Over Fatalism
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                The Kundli chart is not a life sentence. It depicts the cosmic weather of your soul&rsquo;s journey. We firmly believe in Purushartha — conscious right action, mindfulness, and constructive remedies to navigate karmic cycles.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Gem className="w-5 h-5 text-amber-800 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold font-vedic text-stone-900">
                3. Authentic &amp; Calibrated Remedies
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Remedies must heal, not exploit. We prescribe body-weight calibrated Ratti dosages, specific wearing metals, favorable days and Nakshatra timings, accompanied by classical Vedic Beej mantras and philanthropic Daan.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-amber-800 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold font-vedic text-stone-900">
                4. Lab-Certified Consecrated Items
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every gemstone in our Sacred Store is 100% natural, tested by government-recognized gemological laboratories, and consecrated through authentic Vedic Prana Pratishtha rituals by practicing Brahmins.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5 text-amber-800 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold font-vedic text-stone-900">
                5. Sacred Privacy &amp; Zero Data Monetization
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your birth coordinates, dates, and family horoscopes are sacred personal information. We maintain a strict zero-telemetry policy and never sell or exchange your records with advertising brokers.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5 text-amber-800 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold font-vedic text-stone-900">
                6. Educational Transparency
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We demystify astrology by explaining the exact Sanskrit concepts: why a planet is exalted or debilitated, how Sarvashtakavarga points are computed, and how Dasha lords influence specific houses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Classical Treatises & Sanskrit Heritage */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">Codified Shastras</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-vedic text-stone-950">
            Rooted in Authentic Sanskrit Lineages
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Our computational engines translate classical Sanskrit treatises into modern algorithms without diluting traditional Parashari canons.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-2xs">
            <span className="text-xs font-mono font-bold text-amber-900 block">बृहत्पाराशर होराशास्त्रम्</span>
            <h4 className="text-sm font-bold text-stone-900 font-vedic">Brihat Parashara Hora Shastra</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Maharishi Parashara&rsquo;s foundational encyclopedia on Lagna, 12 Bhavas, planetary aspects (Drishti), Vimshottari Dasha, and the 16 divisional charts (Shodashvargas).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-2xs">
            <span className="text-xs font-mono font-bold text-amber-900 block">बृहज्जातकम्</span>
            <h4 className="text-sm font-bold text-stone-900 font-vedic">Brihat Jataka of Varahamihira</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              The seminal treatise on planetary strengths (Shadbala), character dispositions, yogas, and planetary friendship (Mitra-Shatru) matrix.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-2xs">
            <span className="text-xs font-mono font-bold text-amber-900 block">फलदीपिका</span>
            <h4 className="text-sm font-bold text-stone-900 font-vedic">Phaladeepika by Mantreswara</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Classical wisdom on transit (Gochar) effects from the Moon sign, Bhava results, Raja Yogas, and remedial countermeasures.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-2xs">
            <span className="text-xs font-mono font-bold text-amber-900 block">जैमिनि उपदेश सूत्राणि</span>
            <h4 className="text-sm font-bold text-stone-900 font-vedic">Jaimini Upadesha Sutras</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Rishi Jaimini&rsquo;s sutras governing Chara Karakas (Atmakaraka, Amatyakaraka), sign aspects (Rashi Drishti), and specialized soul-journey diagnostics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-2xs">
            <span className="text-xs font-mono font-bold text-amber-900 block">सारावली</span>
            <h4 className="text-sm font-bold text-stone-900 font-vedic">Saravali of Kalyana Varma</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              The royal compendium of planetary combinations across all 12 houses and Nakshatra padas, providing nuanced psychological portraits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2 shadow-2xs">
            <span className="text-xs font-mono font-bold text-amber-900 block">गरुड पुराणम् • रत्न परीक्षा</span>
            <h4 className="text-sm font-bold text-stone-900 font-vedic">Garuda Purana (Ratna Pariksha)</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              The ancient Vedic science of precious minerals, cosmic planetary radiation absorption, identification of flawed stones (Doshas), and consecration rites.
            </p>
          </div>
        </div>
      </section>

      {/* The Platform Ecosystem */}
      <section className="bg-stone-900 text-stone-100 py-12 sm:py-20 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Our Product Suite</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-vedic text-white">
              The Astronava Integrated Platform
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Each module is crafted as a precision instrument to support your life decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold font-vedic text-white">Janam Kundli &amp; 20-Section Report</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Complete birth chart generation with Lahiri Ayanamsha, 7 divisional Vargas (D1 to D12), Vimshottari Dasha timelines, and comprehensive 3-year life forecasts.
              </p>
              <button
                onClick={() => onNavigateTab('generator')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Launch Kundli Maker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold font-vedic text-white">Daily Gochar &amp; 20 Life Domains</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Real ephemeris daily planetary transits mapped against your natal Lagna, featuring 20 distinct life scores, Choghadiya Muhurat windows, and auspicious timings.
              </p>
              <button
                onClick={() => onNavigateTab('horoscope')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Check Daily Horoscope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Heart className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold font-vedic text-white">36 Guna Kundli Milan Match</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Authentic Ashtakoota marriage compatibility calculator with 8 sacred dimensions, Manglik (Kuja) dosha cancellations, Rajju longevity, and Nadi harmony checks.
              </p>
              <button
                onClick={() => onNavigateTab('match')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Find Match Compatibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Gem className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold font-vedic text-white">Vedic Gemstone Recommender</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Identify your Life Stone (Jeevan Ratna), Lucky Stone (Bhagya Ratna), and Career Karaka with body-weight calibrated Ratti dosages, metals, and consecration mantras.
              </p>
              <button
                onClick={() => onNavigateTab('gemstones')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Calculate Your Gemstone</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Hash className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold font-vedic text-white">Numerology &amp; Name Correction</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Vedic Sankhya Shastra analysis of your Psychic Root (Mulank), Destiny (Bhagyank), and Name Vibrations (Namank) with Chaldean &amp; Pythagorean spelling tuning.
              </p>
              <button
                onClick={() => onNavigateTab('numerology')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Explore Numerology</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-base font-bold font-vedic text-white">The Sacred Consecrated Store</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Acquire authentic, certified natural gemstones, energized Nepali Rudraksha beads (1 to 14 Mukhi), consecrated yantras, and spiritual healing bracelets with free shipping across India.
              </p>
              <button
                onClick={() => onNavigateTab('store')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Visit Sacred Store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">Clarity &amp; Transparency</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-vedic text-stone-950">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Everything you need to know about our philosophy, calculations, and practices.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white border border-stone-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  <span className="text-sm font-bold text-stone-900 font-vedic flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-amber-800' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-stone-700 leading-relaxed border-t border-stone-100 bg-stone-50/40">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Founder & Stewardship Pledge */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border border-amber-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-900 text-amber-50 flex items-center justify-center mx-auto shadow-md">
            <Flame className="w-6 h-6 text-amber-300" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold font-vedic text-amber-950">
            The Astronava Stewardship Pledge
          </h3>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-2xl mx-auto italic font-serif">
            &ldquo;We build software with the reverence of a temple and the rigor of an astronomical observatory. Our purpose is never to foster dependence or anxiety, but to hand you a clear celestial compass so that you may walk your path with wisdom, courage, and dignity.&rdquo;
          </p>

          <div className="pt-2 text-xs text-stone-500 font-medium">
            — The Astronava Vedic Research &amp; Engineering Collective
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-amber-900">
            <button
              onClick={() => onNavigateTab('legal')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Legal Policies</span>
            </button>
            <span>&bull;</span>
            <button
              onClick={() => onNavigateTab('sitemap')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Sitemap Directory</span>
            </button>
            <span>&bull;</span>
            <a
              href="mailto:customer-support@astronava.com"
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>customer-support@astronava.com</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
