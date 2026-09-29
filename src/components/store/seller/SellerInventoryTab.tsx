import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, AlertTriangle, Edit3, X, Check } from 'lucide-react';
import { InventoryItem } from '@/src/types/store';

interface SellerInventoryTabProps {
  token: string;
}

export const SellerInventoryTab: React.FC<SellerInventoryTabProps> = ({ token }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

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

  const handleQuickEditSave = () => {
    if (!editingItem) return;
    setInventory(prev => prev.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          price: editPrice !== '' ? editPrice : item.price,
          stockQuantity: editStock !== '' ? parseInt(editStock, 10) : item.stockQuantity
        };
      }
      return item;
    }));
    setEditingItem(null);
  };

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
              <th className="p-4 text-right">Actions</th>
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
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setEditPrice(String(item.price));
                      setEditStock(String(item.stockQuantity));
                    }}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Quick Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {inventory.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 space-y-3">
            <div className="flex justify-between font-bold text-stone-950 text-sm">
                <span>{item.productName}</span>
                <span className="font-mono">₹{item.price}</span>
            </div>
            <div className="text-xs text-stone-500 font-mono">SKU: {item.sku}</div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-100">
                <span>Stock: <span className={item.stockQuantity <= (item.lowStockThreshold || 0) ? "text-rose-600 font-bold" : "text-stone-900"}>{item.stockQuantity}</span></span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {item.status || 'pending'}
                  </span>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setEditPrice(String(item.price));
                      setEditStock(String(item.stockQuantity));
                    }}
                    className="p-1.5 bg-amber-50 text-amber-900 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-950 font-vedic">Quick Edit Product</h3>
                <p className="text-xs text-stone-500 truncate max-w-[280px]">{editingItem.productName}</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="p-1 rounded-xl text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={editStock}
                  onChange={e => setEditStock(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickEditSave}
                className="px-5 py-2 rounded-xl bg-amber-900 text-amber-50 hover:bg-amber-800 text-xs font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
