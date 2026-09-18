import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Heart,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  ArrowRight,
  Info,
  Layers,
  ZoomIn,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Product, ProductVariation, ProductImage } from '../../types/store.ts';
import { StoreProductCard } from './StoreProductCard.tsx';

export const StoreProductDetail: React.FC = () => {
  const {
    selectedProductSlug,
    navigateToHome,
    navigateToShop,
    addToCart,
    navigateToCheckout,
    isWishlisted,
    toggleWishlist,
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'specs' | 'rituals' | 'guarantee'>('benefits');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!selectedProductSlug) return;
    let isCancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/store/products/${selectedProductSlug}`);
        if (res.ok) {
          const data: Product = await res.json();
          if (!isCancelled) {
            setProduct(data);
            setActiveImage(data.primaryImage || '');
            if (data.variations && data.variations.length > 0) {
              setSelectedVariation(data.variations[0]);
              // If variation has image, display that
              if (data.variations[0].imageUrl) {
                setActiveImage(data.variations[0].imageUrl);
              }
            } else {
              setSelectedVariation(null);
            }
            setQuantity(1);
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      isCancelled = true;
    };
  }, [selectedProductSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-stone-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-1/4" />
            <div className="h-24 bg-stone-200 rounded" />
            <div className="h-12 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-xs text-stone-500">The requested item may have been moved.</p>
        <button
          onClick={() => navigateToShop()}
          className="px-6 py-2.5 rounded-xl bg-amber-900 text-amber-50 text-xs font-bold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Calculate pricing based on selected variation or base
  const priceNum = selectedVariation?.price
    ? Number(selectedVariation.price)
    : Number(product.price);

  const salePriceNum = selectedVariation?.salePrice
    ? Number(selectedVariation.salePrice)
    : product.salePrice
    ? Number(product.salePrice)
    : null;

  const currentPrice = salePriceNum || priceNum;
  const currentStock = selectedVariation ? selectedVariation.stock : product.stock;
  const currentSku = selectedVariation ? selectedVariation.sku : product.sku;

  const discountPercent =
    salePriceNum && salePriceNum < priceNum
      ? Math.round(((priceNum - salePriceNum) / priceNum) * 100)
      : null;

  const handleVariationSelect = (v: ProductVariation) => {
    setSelectedVariation(v);
    if (v.imageUrl) {
      setActiveImage(v.imageUrl);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedVariation ? selectedVariation.id : 'base'}`,
      productId: product.id,
      variationId: selectedVariation ? selectedVariation.id : null,
      productName: product.name,
      variantName: selectedVariation
        ? `${selectedVariation.variationType}: ${selectedVariation.variationValue}`
        : null,
      slug: product.slug,
      sku: currentSku,
      price: currentPrice,
      originalPrice: salePriceNum ? priceNum : null,
      quantity,
      imageUrl: activeImage || product.primaryImage || '',
      stock: currentStock,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigateToCheckout();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={navigateToHome}
          className="hover:text-amber-900 transition-colors cursor-pointer"
        >
          Store Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <button
          onClick={() => navigateToShop(product.categorySlug)}
          className="hover:text-amber-900 transition-colors capitalize cursor-pointer"
        >
          {product.categoryName || 'Catalog'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Image Gallery */}
        <div className="space-y-4">
          {/* Main Zoomable Image */}
          <div
            className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-md cursor-crosshair group"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={!imageError ? (activeImage || product.primaryImage || '') : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80'}
              alt={product.name}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    }
                  : undefined
              }
              referrerPolicy="no-referrer"
            />

            {/* Hover Zoom Hint */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium flex items-center gap-1.5 opacity-80 group-hover:opacity-100 pointer-events-none">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Hover to inspect inclusions</span>
            </div>

            {/* Planet Tag */}
            {product.planet && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F5]/90 backdrop-blur-md text-amber-950 border border-amber-900/10 shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Resonates with {product.planet}</span>
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImage === img.url
                      ? 'border-amber-700 shadow-sm ring-2 ring-amber-500/20'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details, Variations, Add to Cart */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">
                {product.brand || 'Astronava Vedic Authentics'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!product) return;
                    await toggleWishlist({
                      id: product.id,
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      salePrice: product.salePrice,
                      primaryImage: product.primaryImage,
                      categoryName: product.categoryName,
                      stock: product.stock,
                    });
                  }}
                  className={`p-1.5 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    product && isWishlisted(product.id)
                      ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                      : 'border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-stone-50'
                  }`}
                  title={product && isWishlisted(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      product && isWishlisted(product.id) ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                  <span>{product && isWishlisted(product.id) ? 'Wishlisted' : 'Wishlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="text-stone-400 hover:text-stone-700 p-1.5 px-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                  title="Share link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-vedic leading-snug">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-stone-500">
              <span>SKU: <span className="font-mono text-stone-700">{currentSku}</span></span>
              {product.certification && (
                <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{product.certification}</span>
                </span>
              )}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-amber-950">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {salePriceNum && (
                  <span className="text-sm text-stone-400 line-through">
                    ₹{priceNum.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent && (
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-rose-700 text-rose-50">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Includes all Vedic Consecration ceremonies, Ganga Jal snan, and GST
              </p>
            </div>

            <div className="text-right">
              {currentStock > 5 ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>In Stock</span>
                </span>
              ) : currentStock > 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Only {currentStock} left</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-700">Currently Sold Out</span>
              )}
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Variations Selector (Color, Ratti, Mukhi, Setting) */}
          {product.variations && product.variations.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                <span className="capitalize">
                  Select {product.variations[0].variationType}:
                </span>
                {selectedVariation && (
                  <span className="text-amber-900 font-semibold">
                    {selectedVariation.variationValue}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.variations.map((v) => {
                  const isSelected = selectedVariation?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleVariationSelect(v)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-amber-950 text-amber-100 border-amber-950 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-amber-700'
                      }`}
                    >
                      <span>{v.variationValue}</span>
                      {v.price && (
                        <span className="ml-1 text-[10px] opacity-75">
                          (₹{Number(v.price).toLocaleString('en-IN')})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-stone-100 text-stone-600 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-stone-800 min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  disabled={quantity >= currentStock}
                  className="p-2.5 hover:bg-stone-100 text-stone-600 disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="flex-1 py-3 px-5 rounded-xl bg-amber-900 hover:bg-amber-800 active:scale-98 text-amber-50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={currentStock <= 0}
                className="py-3 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-98 text-stone-950 text-xs sm:text-sm font-extrabold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Buy Now
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={async () => {
                  if (!product) return;
                  await toggleWishlist({
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    salePrice: product.salePrice,
                    primaryImage: product.primaryImage,
                    categoryName: product.categoryName,
                    stock: product.stock,
                  });
                }}
                title={product && isWishlisted(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  product && isWishlisted(product.id)
                    ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                    : 'border-stone-300 hover:border-rose-300 hover:bg-rose-50/60 text-stone-600 hover:text-rose-600'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    product && isWishlisted(product.id) ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Guarantees Matrix */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-stone-100 text-center text-[11px] text-stone-600">
            <div className="p-3 rounded-xl bg-stone-100/60 border border-stone-200/60 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-stone-900">Lab Certified</span>
              <span className="text-[10px] text-stone-500">Government / IGI</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-100/60 border border-stone-200/60 flex flex-col items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span className="font-bold text-stone-900">Prana Pratishtha</span>
              <span className="text-[10px] text-stone-500">Vedic Energized</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-100/60 border border-stone-200/60 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-amber-900" />
              <span className="font-bold text-stone-900">Insured Shipping</span>
              <span className="text-[10px] text-stone-500">Free over ₹1,999</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Benefits, Specifications, Rituals, Guarantees */}
      <div className="pt-8 border-t border-stone-200 space-y-6">
        <div className="flex border-b border-stone-200 gap-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'benefits', label: 'Vedic Astrological Benefits' },
            { id: 'specs', label: 'Gemological Specifications' },
            { id: 'rituals', label: 'Consecration & Wearing Muhurat' },
            { id: 'guarantee', label: 'Certification & Purity Guarantee' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors relative cursor-pointer ${
                activeTab === tab.id
                  ? 'text-amber-900'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200/80 text-xs sm:text-sm text-stone-700 leading-relaxed shadow-2xs">
          {activeTab === 'benefits' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-vedic">
                Astrological Properties & Planetary Vibration
              </h3>
              <p>
                {product.benefits ||
                  'Calibrated for balancing bio-magnetic fields and aligning the subtle energy channels (Nadis) according to Parashari Jyotish principles.'}
              </p>
              {product.planet && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>Planetary Lord:</strong> {product.planet}. Recommended for enhancing willpower, spiritual clarity, and favorable planetary dasha transitions.
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-vedic">
                Mineralogical & Geological Authenticity
              </h3>
              <p>
                {product.specifications ||
                  '100% natural, unheated, and untreated mineral specimen sourced ethically from high-vibration geological deposits.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">SKU</span>
                  <span className="font-bold text-stone-800">{currentSku}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Laboratory</span>
                  <span className="font-bold text-stone-800">{product.certification || 'Govt. Accredited Lab'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Category</span>
                  <span className="font-bold text-stone-800 capitalize">{product.categoryName || 'Store Catalog'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rituals' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-vedic">
                Vedic Energization (Prana Pratishtha) Protocol
              </h3>
              <p>
                {product.careInstructions ||
                  'Immerse in raw milk and Gangajal on an auspicious Shukla Paksha weekday morning. Chant the planetary Beeja Mantra 108 times facing East before wearing.'}
              </p>
              <div className="p-3.5 rounded-xl bg-amber-900/5 border border-amber-900/15 text-stone-800 text-xs space-y-1">
                <p className="font-bold text-amber-950">Complimentary Astrological Service:</p>
                <p>
                  Every talisman shipped by Astronava includes a consecrated Yantra card and customized
                  wearing Muhurat calculated from your Lagna chart.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'guarantee' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-vedic">
                The Astronava Purity Guarantee
              </h3>
              <p>
                We maintain an uncompromising zero-tolerance policy against synthetic stones, heat treatments, glass fillings, and artificial irradiations. Every gemstone and rudraksha bead is individually tested and verified.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-stone-600">
                <li>100% Genuine, untreated natural gemstone guaranteed for life</li>
                <li>Verifiable certificate of authenticity included in the parcel</li>
                <li>10-day no-questions-asked return window if lab test indicates alteration</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-vedic">
              Complementary Astrological Talismans
            </h2>
            <button
              onClick={() => navigateToShop(product.categorySlug)}
              className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((p) => (
              <StoreProductCard key={p.id} product={p as Product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
