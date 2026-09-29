import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data - clearly isolated
const mockMonthlyData = [
  { month: 'Jan', revenue: 45000, orders: 120 },
  { month: 'Feb', revenue: 52000, orders: 145 },
  { month: 'Mar', revenue: 38000, orders: 98 },
  { month: 'Apr', revenue: 60000, orders: 180 },
  { month: 'May', revenue: 55000, orders: 160 },
];

const mockProductPerformance = [
  { name: 'Rudraksha Mala', units: 45, revenue: 22500, stock: 12 },
  { name: 'Ganesh Idol', units: 30, revenue: 15000, stock: 5 },
  { name: 'Crystal Bracelet', units: 80, revenue: 40000, stock: 25 },
];

export const SellerSalesOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <h3 className="text-lg font-black mb-6">Monthly Revenue (₹)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
            <h3 className="text-lg font-black mb-6">Order Count</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockMonthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#f59e0b" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
        <h3 className="text-lg font-black mb-6">Product Performance</h3>
        <table className="w-full text-left">
            <thead>
                <tr className="border-b border-stone-100">
                    <th className="pb-4">Product Name</th>
                    <th className="pb-4">Units Sold</th>
                    <th className="pb-4">Revenue</th>
                    <th className="pb-4">Stock</th>
                </tr>
            </thead>
            <tbody>
                {mockProductPerformance.map((p, i) => (
                    <tr key={i} className="border-b border-stone-50 last:border-0">
                        <td className="py-4 font-bold">{p.name}</td>
                        <td className="py-4">{p.units}</td>
                        <td className="py-4">₹{p.revenue.toLocaleString()}</td>
                        <td className="py-4">{p.stock}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
