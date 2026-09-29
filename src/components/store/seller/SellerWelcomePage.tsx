import React from 'react';
import { Store, ShieldCheck, TrendingUp, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

interface SellerWelcomePageProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export const SellerWelcomePage: React.FC<SellerWelcomePageProps> = ({ onSignIn, onCreateAccount }) => {
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

      {/* Footer */}
      <footer className="w-full border-t border-stone-200 bg-white/60 py-6 px-6 text-center text-xs text-stone-500">
        &copy; {new Date().getFullYear()} Astronava. All rights reserved. Official Vedic Merchant Network.
      </footer>
    </div>
  );
};
