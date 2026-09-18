import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Printer,
  Compass,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export const StoreOrderSuccess: React.FC = () => {
  const { lastCompletedOrder, navigateToHome, navigateToShop, navigateToProfile } = useStore();

  if (!lastCompletedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">No Recent Order Found</h2>
        <button
          onClick={navigateToHome}
          className="px-5 py-2.5 rounded-xl bg-amber-900 text-amber-50 text-xs font-bold"
        >
          Return to Store Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Confirmation Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Vedic Consecration Initiated</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-vedic">
          Order Confirmed
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
          Thank you, <span className="font-bold text-stone-900">{lastCompletedOrder.customerName}</span>. Your order has been placed successfully. Our team is preparing your items with authentic Vedic energization rituals.
        </p>
      </div>

      {/* Order Summary Receipt Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
              Order Reference
            </span>
            <h2 className="text-lg font-bold text-amber-950 font-mono">
              {lastCompletedOrder.orderNumber}
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
              Status & Date
            </span>
            <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1 sm:justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>{lastCompletedOrder.orderStatus}</span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-600">
                {new Date(lastCompletedOrder.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
          <div>
            <h3 className="font-bold text-stone-900 mb-1">Customer Details</h3>
            <p>{lastCompletedOrder.customerName}</p>
            <p className="text-stone-500">{lastCompletedOrder.customerEmail}</p>
            <p className="text-stone-500">{lastCompletedOrder.customerPhone}</p>
          </div>
          <div>
            <h3 className="font-bold text-stone-900 mb-1">Shipping Destination</h3>
            <p>{lastCompletedOrder.shippingAddress}</p>
            <p>
              {lastCompletedOrder.city}, {lastCompletedOrder.state} - {lastCompletedOrder.pinCode}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Items in Blessed Parcel
          </h3>
          <div className="divide-y divide-stone-100">
            {lastCompletedOrder.items?.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-stone-900 truncate">{item.productName}</h4>
                    {item.variantName && (
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                        {item.variantName}
                      </span>
                    )}
                    <p className="text-[10px] text-stone-500">Qty: {item.quantity}</p>
                  </div>
                </div>

                <span className="font-bold text-amber-950 shrink-0">
                  ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="border-t border-stone-100 pt-4 space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{Number(lastCompletedOrder.subtotal).toLocaleString('en-IN')}</span>
          </div>

          {Number(lastCompletedOrder.discountAmount) > 0 && (
            <div className="flex justify-between text-emerald-800 font-semibold">
              <span>Coupon Discount ({lastCompletedOrder.couponCode})</span>
              <span>- ₹{Number(lastCompletedOrder.discountAmount).toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Vedic Prana Pratishtha</span>
            <span className="font-bold text-emerald-700">COMPLIMENTARY</span>
          </div>

          <div className="flex justify-between">
            <span>Insured Shipping</span>
            <span>
              {Number(lastCompletedOrder.shippingAmount) === 0
                ? 'FREE'
                : `₹${Number(lastCompletedOrder.shippingAmount)}`}
            </span>
          </div>

          <div className="flex justify-between items-baseline pt-2 border-t border-stone-100 text-sm font-bold text-amber-950">
            <span>Total Paid / Due</span>
            <span className="text-lg text-amber-900 font-black">
              ₹{Number(lastCompletedOrder.totalAmount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Vedic Blessing */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center space-y-1 text-xs text-amber-950">
          <p className="font-vedic font-bold text-sm">ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात्</p>
          <p className="text-[11px] text-stone-600">
            May this consecrated talisman bring peace, prosperity, and planetary balance into your life.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Receipt</span>
        </button>

        <button
          onClick={navigateToProfile}
          className="px-5 py-2.5 rounded-xl border border-amber-900/30 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <Package className="w-3.5 h-3.5 text-amber-800" />
          <span>Track in Order History</span>
        </button>

        <button
          onClick={navigateToHome}
          className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Return to Store Home</span>
        </button>
      </div>
    </div>
  );
};
