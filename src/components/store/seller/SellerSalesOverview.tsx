import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Package } from 'lucide-react';

export const SellerSalesOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Revenue</span>
          <div className="text-2xl font-black text-stone-900 font-vedic">₹1,48,250</div>
          <span className="text-xs text-emerald-600 font-semibold">+18.4% this month</span>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Orders</span>
          <div className="text-2xl font-black text-stone-900 font-vedic">38</div>
          <span className="text-xs text-amber-700 font-semibold">12 pending fulfillment</span>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Listed Products</span>
          <div className="text-2xl font-black text-stone-900 font-vedic">14</div>
          <span className="text-xs text-emerald-600 font-semibold">12 approved &amp; live</span>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Customer Rating</span>
          <div className="text-2xl font-black text-stone-900 font-vedic">4.9 / 5.0</div>
          <span className="text-xs text-stone-500 font-semibold">Based on 94 reviews</span>
        </div>
      </div>

      <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-stone-900 font-vedic">Sales Performance Analytics</h3>
        <p className="text-xs text-stone-500">Real-time breakdown of your consecrated item sales across Astronava seeker prescriptions.</p>
        <div className="h-64 flex items-center justify-center border border-dashed border-stone-200 rounded-2xl bg-stone-50 text-stone-400 text-xs">
          [Interactive Sales Chart &amp; Fulfillment Metrics]
        </div>
      </div>
    </div>
  );
};
