import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp, Package, Users, Store } from 'lucide-react';

interface SellerWelcomePageProps {
  onOpenSignIn: () => void;
  onOpenRegister: () => void;
}

export const SellerWelcomePage: React.FC<SellerWelcomePageProps> = ({ onOpenSignIn, onOpenRegister }) => {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Bar / Header */}
      <header className="w-full border-b border-stone-800 bg-stone-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-lg">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-stone-100 font-vedic">Astronava</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 ml-2">Seller Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSignIn}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onOpenRegister}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>Register as Seller</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center text-center space-y-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Prime Marketplace for Vedic &amp; Spiritual Merchants</span>
        </div>

        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-vedic leading-tight">
            Scale Your Spiritual Business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Astronava</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-400 leading-relaxed max-w-2xl mx-auto">
            Connect directly with verified seekers of authentic gemstones, energized yantras, sacred rudraksha, and Vedic artifacts. Manage products, track monthly revenue, and fulfill orders with enterprise-grade tools.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <span>Create Seller Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSignIn}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-stone-200 font-bold hover:bg-stone-800 hover:text-white transition-all text-sm cursor-pointer"
          >
            Seller Sign In
          </button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12">
          <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-vedic">Reach Active Seekers</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Display your certified spiritual products to high-intent astrology enthusiasts and practitioners across India.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-vedic">Advanced Inventory</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Effortlessly manage SKUs, bulk inventory uploads, pricing tiers, and real-time stock alerts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-vedic">Transparent Analytics</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Track monthly revenue trends, top-performing product categories, and order fulfillment metrics instantly.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-900 py-6 px-6 text-center text-xs text-stone-500">
        &copy; {new Date().getFullYear()} Astronava Technologies. Seller Portal. Secure &amp; Verified Merchant Ecosystem.
      </footer>
    </div>
  );
};
