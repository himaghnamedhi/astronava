import React from 'react';
import { Store, ShieldCheck, TrendingUp, Sparkles, ArrowRight, UserCheck, ArrowUp, Shield, FileText, AlertCircle, Compass } from 'lucide-react';

interface SellerWelcomePageProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export const SellerWelcomePage: React.FC<SellerWelcomePageProps> = ({ onSignIn, onCreateAccount }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between selection:bg-amber-200 selection:text-amber-950">
      {/* Top Header */}
      <header className="w-full border-b border-stone-200/80 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl shadow-md ring-2 ring-amber-500/40 overflow-hidden bg-[#2a0e05] flex items-center justify-center text-amber-400 font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-wider text-amber-950 font-vedic">
              ASTRONAVA <span className="text-amber-700 font-normal text-sm">Seller Portal</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSignIn}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onCreateAccount}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-900 text-amber-50 hover:bg-amber-800 transition-all cursor-pointer shadow-sm"
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Vedic Artisan &amp; Merchant Network</span>
        </div>

        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-black font-vedic text-stone-950 tracking-tight leading-tight">
            Connect Your Sacred Offerings With Seekers Worldwide
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Join Astronava as a verified merchant. List authenticated gemstones, consecrated rudraksha, energized yantras, and Vedic spiritual artifacts on our high-intent marketplace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center pt-2">
          <button
            onClick={onCreateAccount}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-950 hover:bg-amber-900 text-amber-50 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Register as a Seller</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onSignIn}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-stone-300 hover:border-amber-400 text-stone-800 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Seller Sign In</span>
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12">
          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 font-vedic text-lg">Verified Trust &amp; Purity</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every merchant undergoes rigorous GST and business verification to maintain absolute authenticity for seekers.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 font-vedic text-lg">Targeted Audience</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Present your items directly inside personalized astrological gemstone and remedy prescriptions.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 font-vedic text-lg">Dedicated Controls</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Manage inventory, bulk CSV imports, fulfillment status, and sales analytics effortlessly through your portal.
            </p>
          </div>
        </div>
      </main>

      {/* Unified Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-12 sm:mt-16 pt-8 sm:pt-12 pb-6 sm:pb-8 w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 box-border">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Col 1: About */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={scrollToTop}>
                <img
                  src="/icons/app_logo.svg"
                  alt="Astronava Logo"
                  className="w-6 h-6 rounded-md ring-1 ring-amber-400/30 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xl font-bold font-vedic text-white tracking-wider">ASTRONAVA</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                A modern Vedic astrology platform built on open-source technologies, using classical Vedic astrology principles and structured calculations to generate Kundli analysis, gemstone recommendations, and compatibility reports.
              </p>
            </div>

            {/* Col 2: Tools */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">Astrological Tools</h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button
                    onClick={() => { window.location.href = '/?tab=horoscope'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">1.</span>
                    <span>Personalized Daily Horoscope</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { window.location.href = '/?tab=generator'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">2.</span>
                    <span>Kundli Maker &amp; Janam Patrika</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { window.location.href = '/?tab=builder'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">3.</span>
                    <span>Kundli Builder &amp; Visualizer</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { window.location.href = '/?tab=gemstones'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">4.</span>
                    <span>Find Gemstone You Need</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { window.location.href = '/?tab=match'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">5.</span>
                    <span>Match Finder (Kundli Milan)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { window.location.href = '/?tab=numerology'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">6.</span>
                    <span>Numerology Calculator</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { window.location.href = '/?tab=name-correction'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">7.</span>
                    <span>Vedic Name Correction</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { window.location.href = '/?tab=store'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">8.</span>
                    <span>Store</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Policies */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">Legal &amp; Policies</h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <a
                    href="/?privacy=true"
                    onClick={(e) => { e.preventDefault(); window.location.href = '/?privacy=true'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/?terms=true"
                    onClick={(e) => { e.preventDefault(); window.location.href = '/?terms=true'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Terms &amp; Conditions</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/?disclaimer=true"
                    onClick={(e) => { e.preventDefault(); window.location.href = '/?disclaimer=true'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Disclaimer</span>
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => { window.location.href = '/?sitemap=true'; }}
                    className="text-stone-300 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer text-left"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Sitemap &amp; Index</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact Us */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-vedic">
                <a
                  href="/?contact=true"
                  onClick={(e) => { e.preventDefault(); window.location.href = '/?contact=true'; }}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </a>
              </h4>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-6 sm:pt-8 border-t border-stone-800 flex flex-col items-center justify-center text-xs text-stone-400 gap-4 sm:gap-6 relative">
            <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs text-stone-400">
              <a href="/?privacy=true" className="hover:text-amber-400 transition-colors cursor-pointer">Privacy Policy</a>
              <span>&bull;</span>
              <a href="/?terms=true" className="hover:text-amber-400 transition-colors cursor-pointer">Terms &amp; Conditions</a>
              <span>&bull;</span>
              <a href="/?disclaimer=true" className="hover:text-amber-400 transition-colors cursor-pointer">Disclaimer</a>
              <span>&bull;</span>
              <a href="/?contact=true" className="hover:text-amber-400 transition-colors cursor-pointer">Contact Us</a>
              <span>&bull;</span>
              <a href="/?tab=store" className="hover:text-amber-400 transition-colors cursor-pointer">Store</a>
              <span>&bull;</span>
              <a href="/?sitemap=true" className="hover:text-amber-400 transition-colors cursor-pointer font-medium">Sitemap</a>
            </div>

            <p className="text-center w-full max-w-sm sm:max-w-none">
              © {new Date().getFullYear()} <strong className="text-stone-200">Astronava</strong>. Developed by{' '}
              <a
                href="https://x.com/himaghnamedhi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors"
              >
                Himaghna Medhi
              </a>
            </p>

            <div className="mt-2 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 flex justify-center group">
              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full bg-stone-800 hover:bg-amber-900/80 text-amber-400 hover:text-amber-300 flex items-center justify-center border border-stone-700 hover:border-amber-500/50 shadow-md hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                title="Back to Top"
              >
                <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
              </button>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};
