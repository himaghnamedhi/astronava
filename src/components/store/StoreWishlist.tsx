import React from 'react';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  CloudCheck,
  Package,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { StoreProductMedia } from './StoreProductMedia.tsx';

export const StoreWishlist: React.FC = () => {
  const {
    wishlist,
    wishlistCount,
    removeFromWishlist,
    moveToCartFromWishlist,
    navigateToShop,
    navigateToProduct,
    navigateToHome,
  } = useStore();

  const { user, openAuthModal } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1.5">
            <button
              onClick={navigateToHome}
              className="hover:text-amber-900 transition-colors cursor-pointer"
            >
              Store
            </button>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <button
              onClick={() => navigateToShop()}
              className="hover:text-amber-900 transition-colors cursor-pointer"
            >
              Catalog
            </button>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-amber-900 font-bold">My Wishlist</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-vedic tracking-tight">
                Consecrated Wishlist
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                {wishlistCount === 0
                  ? 'Your saved Vedic treasures and sacred artifacts will appear here'
                  : `You have ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'} bookmarked for later purchase`}
              </p>
            </div>
          </div>
        </div>

        {/* Sync & Explore Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {user ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Synced with Firebase Cloud</span>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('Sign in to sync your wishlist across all your devices')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Sign In to Sync</span>
            </button>
          )}

          <button
            onClick={() => navigateToShop()}
            className="px-4 py-2 rounded-xl bg-amber-950 hover:bg-stone-900 text-amber-100 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Wishlist Empty State */}
      {wishlist.length === 0 ? (
        <div className="max-w-xl mx-auto py-16 text-center space-y-6 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-2xs">
          <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 mx-auto shadow-inner">
            <Heart className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-stone-900 font-vedic">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Explore our consecrated Vedic gemstones, certified Nepali rudraksha beads, and natural crystals. Tap the heart bookmark on any item to save it here for later.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateToShop('gemstones')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              View Certified Gemstones
            </button>
            <button
              onClick={() => navigateToShop('rudraksha')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Browse Nepali Rudraksha
            </button>
          </div>
        </div>
      ) : (
        /* Wishlist Items Grid */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const hasDiscount = item.salePrice && item.salePrice < item.price;
              const currentPrice = item.salePrice || item.price;
              const discountPercent = hasDiscount
                ? Math.round(((item.price - (item.salePrice || 0)) / item.price) * 100)
                : null;

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 hover:border-amber-700/40 shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Remove Button on Top Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.productId);
                    }}
                    title="Remove from wishlist"
                    className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200/80 backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Discount Badge */}
                  {discountPercent && (
                    <div className="absolute top-2.5 left-2.5 z-20">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-700 text-rose-50 shadow-xs">
                        {discountPercent}% OFF
                      </span>
                    </div>
                  )}

                  {/* Product Media */}
                  <div
                    onClick={() => navigateToProduct(item.productSlug)}
                    className="relative aspect-square w-full bg-stone-900 overflow-hidden cursor-pointer"
                  >
                    <StoreProductMedia
                      name={item.name}
                      categorySlug={item.categoryName?.toLowerCase()}
                      primaryImage={item.imageUrl}
                      altText={item.name}
                      aspectRatio="aspect-square"
                    />

                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 pointer-events-none">
                      <span className="w-full py-2 rounded-xl bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-bold text-center shadow-md flex items-center justify-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                        <span>View Product</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Item Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Category */}
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                        {item.categoryName || 'Vedic Artifact'}
                      </span>

                      {/* Title */}
                      <h3
                        onClick={() => navigateToProduct(item.productSlug)}
                        className="text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-900 transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h3>
                    </div>

                    {/* Price & Cart CTA */}
                    <div className="pt-3 border-t border-stone-100 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-extrabold text-amber-950">
                            ₹{currentPrice.toLocaleString('en-IN')}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-stone-400 line-through">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            item.inStock !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.inStock !== false ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Move to Cart CTA */}
                      <button
                        onClick={() => moveToCartFromWishlist(item)}
                        disabled={item.inStock === false}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-900 hover:bg-amber-800 active:scale-98 text-amber-50 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Vedic Guarantee Banner */}
          <div className="rounded-2xl bg-amber-950/5 border border-amber-900/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-800 shrink-0" />
              <div className="text-xs text-stone-600">
                <span className="font-bold text-stone-900">Price & Sanctity Promise: </span>
                Items in your wishlist retain certified authenticity and are energized individually upon order placement.
              </div>
            </div>

            <button
              onClick={() => navigateToShop()}
              className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:border-amber-800 text-stone-800 text-xs font-bold transition-colors shrink-0 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
