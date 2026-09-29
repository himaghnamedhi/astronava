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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-stone-950">Product Inventory</h3>
      
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden border-t border-stone-100">
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
              <tr key={item.id} className="border-t border-stone-100">
                <td className="p-4 font-medium">{item.productName} {item.variationValue && `(${item.variationValue})`}</td>
                <td className="p-4 font-mono text-stone-500">{item.sku}</td>
                <td className="p-4">
                    <span className={item.stockQuantity <= (item.lowStockThreshold || 0) ? "text-rose-600 font-bold" : "text-stone-900"}>
                        {item.stockQuantity}
                    </span>
                </td>
                <td className="p-4">₹{item.price}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
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
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 space-y-2">
            <div className="flex justify-between font-bold text-stone-950">
                <span>{item.productName}</span>
                <span>₹{item.price}</span>
            </div>
            <div className="text-xs text-stone-500 font-mono">SKU: {item.sku}</div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-stone-100">
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
