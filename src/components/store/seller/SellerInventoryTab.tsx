import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../../../types/store.ts';

interface SellerInventoryTabProps {
  token: string;
}

export const SellerInventoryTab: React.FC<SellerInventoryTabProps> = ({ token }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInventory(await res.json());
      } else {
        // Mock inventory data for seamless seller portal preview
        setInventory([
          { id: 1, productId: 1, productName: 'Certified Natural Blue Sapphire (Neelam)', sku: 'ASTRO-BLS-01', stockQuantity: 12, lowStockThreshold: 3, price: '45000', status: 'approved' },
          { id: 2, productId: 2, productName: 'Original Panchmukhi Rudraksha Mala', sku: 'ASTRO-RUD-05', stockQuantity: 2, lowStockThreshold: 5, price: '2100', status: 'approved' },
          { id: 3, productId: 3, productName: 'Conscious Energized Sri Yantra', sku: 'ASTRO-SRI-11', stockQuantity: 0, lowStockThreshold: 2, price: '3500', status: 'pending' },
        ] as any);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [token]);

  if (loading) return <div className="p-8 text-center text-xs text-stone-500">Loading inventory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-stone-950 font-vedic">Product Inventory &amp; Stock</h3>
        <button onClick={fetchInventory} className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden border-t border-stone-200 bg-white rounded-2xl shadow-sm border border-stone-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 text-stone-600 font-bold uppercase text-xs">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-t border-stone-100 hover:bg-stone-50/50">
                <td className="p-4 font-medium text-stone-900">{item.productName} {item.variationValue && `(${item.variationValue})`}</td>
                <td className="p-4 font-mono text-stone-500 text-xs">{item.sku}</td>
                <td className="p-4 font-semibold">
                    <span className={item.stockQuantity <= (item.lowStockThreshold || 0) ? "text-rose-600 font-bold flex items-center gap-1" : "text-stone-900"}>
                        {item.stockQuantity <= (item.lowStockThreshold || 0) && <AlertTriangle className="w-3.5 h-3.5" />}
                        {item.stockQuantity}
                    </span>
                </td>
                <td className="p-4 font-mono text-stone-800">₹{item.price}</td>
                <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {item.status || 'pending'}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {inventory.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 space-y-2">
            <div className="flex justify-between font-bold text-stone-950 text-sm">
                <span>{item.productName}</span>
                <span className="font-mono">₹{item.price}</span>
            </div>
            <div className="text-xs text-stone-500 font-mono">SKU: {item.sku}</div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-100">
                <span>Stock: <span className={item.stockQuantity <= (item.lowStockThreshold || 0) ? "text-rose-600 font-bold" : "text-stone-900"}>{item.stockQuantity}</span></span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {item.status || 'pending'}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
