import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const StoreCart: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    navigateToShop,
    navigateToCheckout,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingCost = cartSubtotal >= 1999 || cartSubtotal === 0 ? 0 : 150;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    const result = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (!result.success) {
      setCouponError(result.error || 'Failed to apply coupon');
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10 opacity-70" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-vedic">
          Your Cart is Empty
        </h1>
        <p className="max-w-md mx-auto text-xs sm:text-sm text-stone-600">
          Discover hand-selected Vedic gemstones, authentic Nepali Rudraksha beads, and natural energizing crystals.
        </p>
        <button
          onClick={() => navigateToShop()}
          className="px-6 py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <button
            onClick={() => navigateToShop()}
            className="text-xs font-semibold text-stone-500 hover:text-amber-900 flex items-center gap-1 mb-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-vedic">
            Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Items</span>
        </button>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-amber-700/20 transition-all"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-sm font-bold text-stone-900 truncate">
                  {item.productName}
                </h3>
                {item.variantName && (
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                    {item.variantName}
                  </span>
                )}
                <p className="text-[11px] text-stone-500">SKU: {item.sku}</p>
                <div className="text-xs font-bold text-amber-950 sm:hidden pt-1">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-800 min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-1.5 hover:bg-stone-200 text-stone-600 transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="hidden sm:block text-right min-w-[90px]">
                  <span className="text-sm font-bold text-amber-950">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                  {item.originalPrice && (
                    <span className="block text-[11px] text-stone-400 line-through">
                      ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Trust Guarantee Note */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
            <span>
              Every gemstone and rudraksha bead is energized by certified Vedic Pandits with proper Beeja Mantra chanting and Ganga Jal purification prior to dispatch.
            </span>
          </div>
        </div>

        {/* Order Summary & Coupons */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-stone-900 font-vedic border-b border-stone-100 pb-3">
              Order Summary
            </h2>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon ({appliedCoupon.code})</span>
                  </span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Vedic Consecration (Prana Pratishtha)</span>
                <span className="font-bold text-emerald-700">COMPLIMENTARY</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="font-bold text-emerald-700">FREE</span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>

              {cartSubtotal < 1999 && (
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg">
                  Add items worth ₹{(1999 - cartSubtotal).toLocaleString('en-IN')} more to unlock FREE Express Shipping!
                </p>
              )}

              <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline text-sm font-bold text-amber-950">
                <span>Grand Total</span>
                <span className="text-lg text-amber-900">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-800" />
                <span>Have a Discount Coupon?</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} Applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter ASTRO10 or VEDIC500"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError(null);
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs uppercase font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-[#FAF8F5]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{couponError}</span>
                </p>
              )}

              <p className="text-[10px] text-stone-400">
                Tip: Try code <span className="font-bold text-amber-800">ASTRO10</span> for 10% off your entire order.
              </p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={navigateToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:from-amber-600 hover:to-amber-900 text-amber-50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
