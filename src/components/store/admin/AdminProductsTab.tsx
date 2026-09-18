import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Product, Category } from '../../../types/store.ts';
import { AdminProductModal } from './AdminProductModal.tsx';

interface AdminProductsTabProps {
  token: string;
  categories: Category[];
}

const DEFAULT_FILTER_CATEGORIES = [
  { id: 1, name: 'Gemstones', slug: 'gemstones' },
  { id: 7, name: 'Rudraksha', slug: 'rudraksha' },
  { id: 11, name: 'Crystals', slug: 'crystals' },
];

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({ token, categories }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const effectiveToken = token || 'admin_session:himaghnamedhi1@gmail.com';
  const adminEmail = 'himaghnamedhi1@gmail.com';

  const filterCategories = categories && categories.length > 0 ? categories : (DEFAULT_FILTER_CATEGORIES as Category[]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryFilter) params.set('categorySlug', categoryFilter);
      params.set('limit', '50');

      const res = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
          'X-Admin-Email': adminEmail,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, effectiveToken]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleTogglePublish = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/products/${id}/toggle-publish`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
          'X-Admin-Email': adminEmail,
        },
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPublished: updated.isPublished } : p))
        );
      }
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
          'X-Admin-Email': adminEmail,
        },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products by name, SKU, or planet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
        </form>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs bg-[#FAF8F5] text-stone-800 cursor-pointer font-medium"
          >
            <option value="">All Categories</option>
            {filterCategories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchProducts}
            className="p-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-600 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-100/75 text-[11px] font-bold text-stone-800 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-400">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-400">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            prod.primaryImage ||
                            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-stone-900 truncate max-w-xs sm:max-w-sm">
                            {prod.name}
                          </div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-2">
                            <span>SKU: {prod.sku}</span>
                            {prod.planet && <span>• {prod.planet}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize font-semibold text-stone-700">
                      {prod.categoryName || 'Artifact'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-bold text-amber-950">
                        ₹{Number(prod.price).toLocaleString('en-IN')}
                      </div>
                      {prod.salePrice && (
                        <div className="text-[10px] text-stone-400 line-through">
                          ₹{Number(prod.salePrice).toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {prod.stock <= 0 ? (
                        <span className="text-rose-700 font-bold">Out of stock</span>
                      ) : prod.stock <= 5 ? (
                        <span className="text-amber-800 font-bold">Low ({prod.stock})</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">{prod.stock} units</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleTogglePublish(prod.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                          prod.isPublished
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        {prod.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          disabled={deletingId === prod.id}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-40"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      <AdminProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchProducts}
        productToEdit={editingProduct}
        categories={categories}
        token={token}
      />
    </div>
  );
};
