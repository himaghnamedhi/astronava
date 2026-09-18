import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  RefreshCw,
  Search,
  Save,
  SlidersHorizontal,
} from 'lucide-react';
import { InventoryItem } from '../../../types/store.ts';

interface AdminInventoryTabProps {
  token: string;
}

export const AdminInventoryTab: React.FC<AdminInventoryTabProps> = ({ token }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);
  const [saveSuccessId, setSaveSuccessId] = useState<number | null>(null);

  // Local editable state map: id -> { stockQuantity, lowStockThreshold }
  const [stockEdits, setStockEdits] = useState<
    Record<number, { stockQuantity: number; lowStockThreshold: number }>
  >({});

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inventory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: InventoryItem[] = await res.json();
        setInventory(data);
        const initialEdits: Record<number, { stockQuantity: number; lowStockThreshold: number }> = {};
        data.forEach((item) => {
          initialEdits[item.id] = {
            stockQuantity: item.stockQuantity,
            lowStockThreshold: item.lowStockThreshold,
          };
        });
        setStockEdits(initialEdits);
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

  const handleStockChange = (id: number, field: 'stockQuantity' | 'lowStockThreshold', val: number) => {
    setStockEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: Math.max(0, val),
      },
    }));
  };

  const handleSaveItem = async (item: InventoryItem) => {
    const edit = stockEdits[item.id];
    if (!edit) return;

    try {
      setSavingId(item.id);
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: item.productId,
          variationId: item.variationId || null,
          stockQuantity: edit.stockQuantity,
          lowStockThreshold: edit.lowStockThreshold,
        }),
      });

      if (res.ok) {
        setSaveSuccessId(item.id);
        setTimeout(() => setSaveSuccessId(null), 2000);
      }
    } catch (err) {
      console.error('Failed to update inventory item:', err);
    } finally {
      setSavingId(null);
    }
  };

  const filtered = inventory.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.productName.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      (item.variationValue && item.variationValue.toLowerCase().includes(q))
    );
  });

  const lowStockCount = inventory.filter(
    (item) => item.stockQuantity > 0 && item.stockQuantity <= item.lowStockThreshold
  ).length;

  const outOfStockCount = inventory.filter((item) => item.stockQuantity <= 0).length;

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900">{inventory.length}</div>
            <div className="text-xs text-stone-500">Tracked SKU Variations</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-900">{lowStockCount}</div>
            <div className="text-xs text-stone-500">Low Stock Warnings (≤ Threshold)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-rose-900">{outOfStockCount}</div>
            <div className="text-xs text-stone-500">Completely Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by Product Name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <button
          onClick={fetchInventory}
          className="p-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer self-start sm:self-auto"
          title="Refresh Inventory"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-100/75 text-[11px] font-bold text-stone-800 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Product & Variant</th>
                <th className="px-5 py-3.5">SKU</th>
                <th className="px-5 py-3.5">Current Stock</th>
                <th className="px-5 py-3.5">Low Stock Threshold</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-400">
                    Loading inventory tracking...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-400">
                    No inventory records match.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const edit = stockEdits[item.id] || {
                    stockQuantity: item.stockQuantity,
                    lowStockThreshold: item.lowStockThreshold,
                  };
                  const isLow = edit.stockQuantity > 0 && edit.stockQuantity <= edit.lowStockThreshold;
                  const isOut = edit.stockQuantity <= 0;

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-bold text-stone-900">{item.productName}</div>
                        {item.variationValue && (
                          <span className="inline-block text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5">
                            Variant: {item.variationValue}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 font-mono font-bold text-stone-700">{item.sku}</td>
                      <td className="px-5 py-3">
                        <input
                          type="number"
                          min={0}
                          value={edit.stockQuantity}
                          onChange={(e) =>
                            handleStockChange(item.id, 'stockQuantity', Number(e.target.value))
                          }
                          className="w-20 p-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-900 bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="number"
                          min={1}
                          value={edit.lowStockThreshold}
                          onChange={(e) =>
                            handleStockChange(item.id, 'lowStockThreshold', Number(e.target.value))
                          }
                          className="w-16 p-1.5 rounded-lg border border-stone-300 text-xs text-stone-700 bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-5 py-3">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock ({edit.stockQuantity})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Optimal Stock</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleSaveItem(item)}
                          disabled={savingId === item.id}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 ${
                            saveSuccessId === item.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-900 hover:bg-amber-800 text-amber-50'
                          }`}
                        >
                          {savingId === item.id ? (
                            <span>Saving...</span>
                          ) : saveSuccessId === item.id ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Saved!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Update</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
