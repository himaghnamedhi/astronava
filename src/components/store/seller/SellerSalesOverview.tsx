import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Package, Sparkles, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const salesData = [
  { month: 'Jan', sales: 32000, orders: 8 },
  { month: 'Feb', sales: 45000, orders: 12 },
  { month: 'Mar', sales: 38000, orders: 10 },
  { month: 'Apr', sales: 62000, orders: 16 },
  { month: 'May', sales: 78000, orders: 21 },
  { month: 'Jun', sales: 95000, orders: 28 },
  { month: 'Jul', sales: 110000, orders: 32 },
  { month: 'Aug', sales: 125000, orders: 35 },
  { month: 'Sep', sales: 148250, orders: 38 },
];

export const SellerSalesOverview: React.FC = () => {
  const totalLifetimeEarnings = 734500;
  const currentMonthEarnings = 148250;

  return (
    <div className="space-y-6">
      {/* Revenue Summary Distinct Highlight Widget */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1917] via-[#291E18] to-[#1C1917] rounded-3xl p-8 text-amber-50 shadow-xl border border-amber-500/30">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Merchant Earnings &amp; Payouts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-vedic tracking-tight text-white">
              ₹{totalLifetimeEarnings.toLocaleString()}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Total aggregated lifetime earnings across all gemstone and spiritual artifact orders. Payouts are transferred automatically every Monday.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="space-y-1 pr-4 border-r border-white/10">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">This Month</span>
              <div className="text-lg font-bold font-mono text-white">₹{currentMonthEarnings.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +18.4% vs last month
              </span>
            </div>
            <div className="space-y-1 pl-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Next Payout</span>
              <div className="text-lg font-bold font-mono text-white">Monday</div>
              <span className="text-[10px] text-stone-300 font-medium">Fully Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Monthly Revenue</span>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-vedic">Monthly Sales Performance</h3>
            <p className="text-xs text-stone-500">Revenue growth across Astronava seeker prescriptions over time.</p>
          </div>
          <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
            FY 2026-2027
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis dataKey="month" stroke="#78716C" fontSize={12} tickLine={false} />
              <YAxis stroke="#78716C" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1C1917', borderRadius: '12px', color: '#F5F5F4', border: 'none', fontSize: '12px' }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Sales Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#78350F" 
                strokeWidth={3} 
                dot={{ fill: '#78350F', r: 4 }} 
                activeDot={{ r: 7, fill: '#D97706' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
