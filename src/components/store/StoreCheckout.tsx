import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronLeft,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { saveUserOrderToFirestore } from '../../lib/firebase.ts';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi NCR',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other / Union Territory',
];

export const StoreCheckout: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    navigateToCart,
    navigateToShop,
    setOrderSuccess,
  } = useStore();
  const { user } = useAuth();

  const [customer, setCustomer] = useState(() => {
    let saved: any = {};
    try {
      const cached = localStorage.getItem('astronava_store_shipping_address');
      if (cached) saved = JSON.parse(cached);
    } catch {
      // ignore
    }

    return {
      name: saved.name || '',
      email: saved.email || '',
      phone: saved.phone || '',
      address: saved.address || '',
      city: saved.city || '',
      state: saved.state || 'Maharashtra',
      pinCode: saved.pinCode || '',
      notes: saved.notes || '',
    };
  });

  // Sync site auth details so user signed on the site doesn't have to re-enter or re-login
  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        name: prev.name || user.displayName || (user.email ? user.email.split('@')[0] : ''),
        email: prev.email || user.email || '',
        phone: prev.phone || user.phoneNumber || '',
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingCost = cartSubtotal >= 1999 || cartSubtotal === 0 ? 0 : 150;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="text-xs text-stone-500">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigateToShop()}
          className="px-5 py-2.5 rounded-xl bg-amber-900 text-amber-50 text-xs font-bold cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.pinCode) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      // Save address locally so returning seekers never have to re-type address
      try {
        localStorage.setItem('astronava_store_shipping_address', JSON.stringify(customer));
      } catch {
        // ignore
      }

      const orderPayload = {
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          pinCode: customer.pinCode,
        },
        items: cart.map((item) => ({
          productId: item.productId,
          variationId: item.variationId || null,
          quantity: item.quantity,
          price: item.price,
          name: item.productName,
          variantName: item.variantName || null,
          sku: item.sku,
          imageUrl: item.imageUrl,
        })),
        couponCode: appliedCoupon?.code || null,
        paymentMethod: paymentMethod === 'upi' ? 'Online UPI / Card (Demo)' : 'Cash on Delivery',
        notes: customer.notes || null,
      };

      const res = await fetch('/api/store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Order creation failed');
      }

      const createdOrder = await res.json();

      // Mirror order to Firestore if authenticated
      if (user?.uid) {
        try {
          await saveUserOrderToFirestore(user.uid, {
            id: createdOrder.id,
            orderNumber: createdOrder.orderNumber,
            totalAmount: Number(createdOrder.totalAmount),
            orderStatus: createdOrder.orderStatus || 'Confirmed',
            items: (createdOrder.items || []).map((it: any) => ({
              productId: it.productId,
              productName: it.productName,
              variantName: it.variantName,
              quantity: it.quantity,
              price: Number(it.price),
              imageUrl: it.imageUrl,
            })),
          });
        } catch (fbErr) {
          console.warn('Could not mirror order to Firestore:', fbErr);
        }
      }

      setOrderSuccess(createdOrder);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Something went wrong while placing your order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to Cart */}
      <div>
        <button
          onClick={navigateToCart}
          className="text-xs font-semibold text-stone-500 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Return to Cart</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-vedic mt-2">
          Secure Checkout
        </h1>
        <p className="text-xs text-stone-500">
          Provide your delivery details to complete your order.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Contact Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Status Banner */}
          {user ? (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-900 text-amber-100 flex items-center justify-center font-bold text-xs shrink-0">
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span>Signed in as {user.displayName || user.email}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-0.5">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>Linked</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Contact details are linked from your account. Only add your delivery address below to complete order.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-600">
              <span className="font-semibold text-stone-800">Direct Checkout:</span> Fill your delivery address below to proceed.
            </div>
          )}

          {/* Contact Details Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              1. Customer Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Ramesh Chandra Sharma"
                  value={customer.name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number (for Courier updates) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={customer.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address (for Digital Certificate & Order Receipt) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ramesh@example.com"
                  value={customer.email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              2. Delivery Address
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Street Address & House / Flat No. <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Flat 402, Shivam Residency, Near Temple Road"
                  value={customer.address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City / Town <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Varanasi / Mumbai"
                    value={customer.city}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State <span className="text-rose-600">*</span>
                  </label>
                  <select
                    name="state"
                    value={customer.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    PIN Code <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    required
                    maxLength={6}
                    placeholder="221001"
                    value={customer.pinCode}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Vedic Sankalpa Notes (Optional: Gotra, Birth Nakshatra, or Special Intentions for Panditji)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="e.g. Kashyap Gotra, wearing for career growth and Rahu dasha pacification"
                  value={customer.notes}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              3. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  paymentMethod === 'upi'
                    ? 'border-amber-700 bg-amber-50/50 shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-0.5 text-amber-800 focus:ring-amber-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Instant Online Payment (UPI / Cards)
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    GPay, PhonePe, Paytm, NetBanking & Cards. Immediate order confirmation.
                  </p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  paymentMethod === 'cod'
                    ? 'border-amber-700 bg-amber-50/50 shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5 text-amber-800 focus:ring-amber-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Cash on Delivery / Vedic Escrow
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Pay upon physical verification of parcel and lab certificate.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-6 sticky top-28">
            <h2 className="text-base font-bold text-stone-900 font-vedic border-b border-stone-100 pb-3">
              Order Items ({cart.length})
            </h2>

            {/* Mini Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 truncate">{item.productName}</h4>
                    <p className="text-[11px] text-stone-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-amber-950">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs border-t border-stone-100 pt-3 text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Vedic Prana Pratishtha</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>

              <div className="flex justify-between">
                <span>Insured Express Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="font-bold text-emerald-700">FREE</span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline text-base font-bold text-amber-950">
                <span>Total Due</span>
                <span className="text-xl text-amber-900">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 hover:from-amber-600 hover:to-amber-900 text-amber-50 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <span>Place Order (₹{grandTotal.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
