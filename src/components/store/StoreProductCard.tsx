import React from 'react';
import { ShoppingBag, Star, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Product } from '../../types/store.ts';
import { useStore } from '../../context/StoreContext.tsx';
import { StoreProductMedia } from './StoreProductMedia.tsx';

interface StoreProductCardProps {
  product: Product;
}

export const StoreProductCard: React.FC<StoreProductCardProps> = ({ product }) => {
  const { navigateToProduct, addToCart } = useStore();

  const priceNum = Number(product.price);
  const salePriceNum = product.salePrice ? Number(product.salePrice) : null;
  const discountPercent =
    salePriceNum && salePriceNum < priceNum
      ? Math.round(((priceNum - salePriceNum) / priceNum) * 100)
      : null;

  const currentPrice = salePriceNum || priceNum;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variations && product.variations.length > 0) {
      // If product has variations, open detail page so user picks the right variant
      navigateToProduct(product.slug);
      return;
    }

    addToCart({
      id: `${product.id}-base`,
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      sku: product.sku,
      price: currentPrice,
      originalPrice: salePriceNum ? priceNum : null,
      quantity: 1,
      imageUrl:
        product.primaryImage ||
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      stock: product.stock,
    });
  };

  return (
    <div
      onClick={() => navigateToProduct(product.slug)}
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/80 hover:border-amber-700/30 shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5 items-center">
        {product.isBestSeller && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-600 text-white shadow-xs">
            BEST SELLER
          </span>
        )}
        {product.isNewArrival && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-700 text-emerald-50 shadow-xs">
            NEW
          </span>
        )}
        {discountPercent && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-700 text-rose-50 shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Planetary Aura Tag */}
      {product.planet && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#FAF8F5]/90 backdrop-blur-md text-amber-950 border border-amber-900/10 shadow-2xs">
            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
            <span>{product.planet}</span>
          </span>
        </div>
      )}

      {/* Image Container with AI & Vedic Artifact Visual */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-900">
        <StoreProductMedia
          name={product.name}
          categorySlug={product.categorySlug}
          primaryImage={product.primaryImage}
          altText={product.name}
          planet={product.planet}
          aspectRatio="aspect-square"
        />

        {/* Hover quick view overlay */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 z-20 pointer-events-none">
          <span className="w-full py-2 rounded-xl bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-bold text-center shadow-md flex items-center justify-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform pointer-events-auto">
            <span>View Consecrated Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Certification */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-stone-500 mb-1.5">
            <span className="font-medium text-amber-900 uppercase tracking-wider text-[10px]">
              {product.categoryName || 'Vedic Artifact'}
            </span>
            {product.certification && (
              <span className="flex items-center gap-0.5 text-[10px] text-emerald-800 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span className="truncate max-w-[90px]">{product.certification}</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-900 transition-colors">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-stone-500 line-clamp-1 mt-1">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & CTA Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-amber-950">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {salePriceNum && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{priceNum.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="text-[10px] text-stone-400">
              {product.stock > 5 ? (
                <span className="text-emerald-700 font-medium">In Stock</span>
              ) : product.stock > 0 ? (
                <span className="text-amber-700 font-medium">Only {product.stock} left</span>
              ) : (
                <span className="text-rose-600 font-medium">Out of Stock</span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="h-8.5 px-3 rounded-xl bg-amber-900 hover:bg-amber-800 active:scale-95 text-amber-50 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title={product.variations && product.variations.length > 0 ? 'Select Options' : 'Add to Cart'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">
              {product.variations && product.variations.length > 0 ? 'Options' : 'Add'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
