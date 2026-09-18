import React from 'react';
import { ShoppingBag, Search, Sparkles, Gem, Heart, Compass } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const StoreNavbar: React.FC = () => {
  const {
    activeStoreView,
    cartCount,
    openCart,
    navigateToHome,
    navigateToShop,
    shopFilters,
  } = useStore();

  const activeCategory = shopFilters.categorySlug || 'all';

  return (
    <div className="border-b border-amber-900/10 bg-[#FAF8F5]/90 backdrop-blur-md sticky top-18 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 gap-2 sm:gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1 text-xs font-semibold">
            <button
              onClick={() => {
                if (activeStoreView === 'home') {
                  navigateToShop();
                } else {
                  navigateToHome();
                }
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStoreView === 'home'
                  ? 'bg-amber-950 text-amber-100 shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Store Home</span>
            </button>

            <button
              onClick={() => navigateToShop('gemstones')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStoreView === 'shop' && activeCategory === 'gemstones'
                  ? 'bg-amber-900 text-amber-50 shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Gem className="w-3.5 h-3.5 text-amber-700" />
              <span>Gemstones</span>
            </button>

            <button
              onClick={() => navigateToShop('rudraksha')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStoreView === 'shop' && activeCategory === 'rudraksha'
                  ? 'bg-amber-900 text-amber-50 shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Rudraksha</span>
            </button>

            <button
              onClick={() => navigateToShop('crystals')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStoreView === 'shop' && activeCategory === 'crystals'
                  ? 'bg-amber-900 text-amber-50 shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>Crystals</span>
            </button>

            <button
              onClick={() => navigateToShop(undefined)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStoreView === 'shop' && activeCategory === 'all'
                  ? 'bg-amber-900 text-amber-50 shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <span>All Catalog</span>
            </button>
          </div>

          {/* Quick Actions (Cart Drawer Trigger & Authenticity note) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openCart}
              className="relative h-9 px-3.5 rounded-xl bg-amber-950 hover:bg-stone-900 text-amber-100 flex items-center gap-2 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-amber-950 text-[11px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
