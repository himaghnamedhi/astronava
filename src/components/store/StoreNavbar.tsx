import React from 'react';
import { ShoppingBag, Sparkles, Gem, Heart, Compass, Package, Layers } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const StoreNavbar: React.FC = () => {
  const {
    activeStoreView,
    cartCount,
    openCart,
    navigateToHome,
    navigateToShop,
    navigateToWishlist,
    navigateToProfile,
    wishlistCount,
    shopFilters,
    categories,
    loadingCategories,
  } = useStore();

  const activeCategory = shopFilters.categorySlug || 'all';

  // Dynamic top-level categories from database, sorted by displayOrder
  const topLevelCategories = React.useMemo(() => {
    return (categories || [])
      .filter((c) => !c.parentId)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [categories]);

  return (
    <div className="border-b border-amber-900/10 bg-[#FAF8F5]/90 backdrop-blur-md sticky top-18 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 gap-2 sm:gap-4">
          {/* Dynamic Category Tabs from Database */}
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

            {/* All Products */}
            <button
              onClick={() => navigateToShop(undefined)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeStoreView === 'shop' && activeCategory === 'all'
                  ? 'bg-amber-900 text-amber-50 shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Catalog</span>
            </button>

            {/* Dynamic categories loaded directly from database */}
            {topLevelCategories.map((cat) => {
              const isActive = activeStoreView === 'shop' && activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigateToShop(cat.slug)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-900 text-amber-50 shadow-2xs'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {cat.slug.includes('gem') ? (
                    <Gem className="w-3.5 h-3.5 text-amber-700" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions (Wishlist, Orders & Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Wishlist Button */}
            <button
              onClick={navigateToWishlist}
              title="View Wishlist"
              className={`relative h-9 px-2.5 sm:px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeStoreView === 'wishlist'
                  ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-2xs'
                  : 'bg-white border-stone-200/90 text-stone-700 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50/50'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
                }`}
              />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Orders & Profile Button */}
            <button
              onClick={navigateToProfile}
              title="Track Orders & Profile"
              className={`relative h-9 px-2.5 sm:px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeStoreView === 'profile'
                  ? 'bg-amber-900 border-amber-950 text-amber-50 shadow-2xs'
                  : 'bg-white border-stone-200/90 text-stone-700 hover:text-amber-900 hover:border-amber-200 hover:bg-amber-50/50'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Orders</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative h-9 px-3.5 rounded-xl bg-amber-950 hover:bg-stone-900 text-amber-100 flex items-center gap-2 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
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
