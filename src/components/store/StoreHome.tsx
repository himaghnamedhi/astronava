import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Gem,
  Heart,
  Compass,
  Star,
  Mail,
  Send,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Product } from '../../types/store.ts';
import { StoreProductCard } from './StoreProductCard.tsx';

export const StoreHome: React.FC = () => {
  const { navigateToShop, categories } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    async function loadHomeProducts() {
      try {
        setLoading(true);
        // Fetch featured, best seller, new arrival
        const [resFeatured, resBest, resNew] = await Promise.all([
          fetch('/api/store/products?isFeatured=true&limit=4'),
          fetch('/api/store/products?isBestSeller=true&limit=4'),
          fetch('/api/store/products?isNewArrival=true&limit=4'),
        ]);

        if (resFeatured.ok) {
          const data = await resFeatured.json();
          setFeaturedProducts(data.items || []);
          // Use some for recommendations
          setRecommendations(data.items.slice(0, 3));
        }
        if (resBest.ok) {
          const data = await resBest.json();
          setBestSellers(data.items || []);
        }
        if (resNew.ok) {
          const data = await resNew.json();
          setNewArrivals(data.items || []);
        }
      } catch (err) {
        console.error('Failed to load home products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeProducts();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Banner - Compact & Elegant */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2a0e05] via-[#43180a] to-[#1c0803] text-amber-50 rounded-2xl border border-amber-500/20 shadow-md mx-4 sm:mx-6 lg:mx-8 mt-3">
        {/* Sacred geometric subtle backdrop */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-rose-600/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-5 py-6 sm:py-8 text-center space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>100% Certified Vedic Authentic Store Collection</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-50 font-vedic tracking-tight leading-snug">
            Authentic Ratnas, Natural Rudraksha &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
              Healing Crystals
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-amber-200/80 font-normal leading-relaxed">
            Laboratory certified, unheated natural gemstones, genuine Himalayan Mukhi beads, and high-vibrational crystals energized with authentic Vedic rituals.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              onClick={() => navigateToShop('gemstones')}
              className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer"
            >
              <Gem className="w-3.5 h-3.5 text-stone-950" />
              <span>Explore Gemstones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigateToShop()}
              className="px-4.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-amber-400/30 text-amber-100 font-semibold text-xs backdrop-blur-xs transition-all active:scale-98 cursor-pointer"
            >
              Browse All Items
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-amber-500/20 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-amber-100">Lab Certified</h4>
                <p className="text-[10px] text-amber-200/70">IGI &amp; Govt. Reports</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-amber-100">Prana Pratishtha</h4>
                <p className="text-[10px] text-amber-200/70">Mantra energized</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-amber-100">Secured Express</h4>
                <p className="text-[10px] text-amber-200/70">Insured delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-amber-100">100% Genuine</h4>
                <p className="text-[10px] text-amber-200/70">Untreated natural</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category (MVP Categories: Gemstones, Rudraksha, Crystals) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">
              Featured Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-vedic">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigateToShop()}
            className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Category 1: Gemstones */}
          <div
            onClick={() => navigateToShop('gemstones')}
            className="group relative rounded-xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 bg-stone-900 cursor-pointer h-48 sm:h-52"
          >
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
              alt="Gemstones Category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 space-y-1">
              <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold">
                <Gem className="w-3.5 h-3.5" />
                <span>Navagraha Jyotish Ratnas</span>
              </div>
              <h3 className="text-lg font-bold text-white font-vedic">Gemstones</h3>
              <p className="text-[11px] text-stone-300 line-clamp-1">
                Planet-wise certified unheated ratnas, birthstones, gold &amp; silver rings.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Gemstones</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Category 2: Rudraksha */}
          <div
            onClick={() => navigateToShop('rudraksha')}
            className="group relative rounded-xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 bg-stone-900 cursor-pointer h-48 sm:h-52"
          >
            <img
              src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80"
              alt="Rudraksha Category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 space-y-1">
              <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nepal &amp; Himalayan Mukhi</span>
              </div>
              <h3 className="text-lg font-bold text-white font-vedic">Rudraksha</h3>
              <p className="text-[11px] text-stone-300 line-clamp-1">
                1 to 21 Mukhi collector beads, energizing malas &amp; bracelets.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Rudraksha</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Category 3: Crystals */}
          <div
            onClick={() => navigateToShop('crystals')}
            className="group relative rounded-xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 bg-stone-900 cursor-pointer h-48 sm:h-52"
          >
            <img
              src="https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&w=800&q=80"
              alt="Crystals Category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 space-y-1">
              <div className="flex items-center gap-1 text-rose-300 text-[11px] font-bold">
                <Heart className="w-3.5 h-3.5" />
                <span>Vibrational Minerals</span>
              </div>
              <h3 className="text-lg font-bold text-white font-vedic">Crystals</h3>
              <p className="text-[11px] text-stone-300 line-clamp-1">
                Clear Quartz towers, Rose Quartz, Golden Citrine &amp; Tourmaline.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-300 group-hover:translate-x-1 transition-transform">
                  <span>Explore Crystals</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">
              Hand-Selected Treasures
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-vedic">
              Featured Store Products
            </h2>
          </div>
          <button
            onClick={() => navigateToShop(undefined, { isFeatured: true })}
            className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <StoreProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. Promotional Banner - Compact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-amber-50 p-5 sm:p-7 border border-amber-600/30 shadow-md">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
              <Sparkles className="w-3 h-3" />
              <span>Auspicious Vedic Consecration Offer</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-extrabold font-vedic leading-snug">
              Complimentary Prana Pratishtha with Every Order
            </h3>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Every authentic ratna, rudraksha, or crystal is energized with authentic Vedic rituals. Use code{' '}
              <span className="font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/40 text-xs">
                ASTRO10
              </span>{' '}
              for 10% off your initial order.
            </p>
            <div className="pt-1">
              <button
                onClick={() => navigateToShop()}
                className="px-4.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Claim Offer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">
              Most Revered by Seekers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-vedic">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => navigateToShop(undefined, { isBestSeller: true })}
            className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((prod) => (
            <StoreProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. Recommended for You (Personalized Vedic Recommendations Architecture) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 border border-amber-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Personalized Astrological Synergy</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-vedic">
                Recommended for You
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Vedic gems tailored for planetary harmony, balanced chakras, and positive karma.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-300/80 text-[11px] font-semibold text-amber-900 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>AI Horoscope Engine Linked</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommendations.map((prod) => (
              <StoreProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200/80 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Freshly Consecrated
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-vedic">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => navigateToShop(undefined, { isNewArrival: true })}
              className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All New</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((prod) => (
              <StoreProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Newsletter Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-amber-900/15 shadow-md text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-vedic">
            Vedic Muhurat & Gemstone Insights
          </h3>
          <p className="max-w-md mx-auto text-xs sm:text-sm text-stone-600">
            Subscribe for monthly astrological transits, auspicious gemstone wearing muhurats, and exclusive member discounts on consecrated talismans.
          </p>

          {newsletterSubscribed ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You have joined the Astronava Vedic Circle. Welcome!</span>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs text-stone-800 bg-[#FAF8F5]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
          <p className="text-[11px] text-stone-400">
            No spam. We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};
