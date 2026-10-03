import React, { useState } from 'react';
import { Package, Plus, CheckCircle2, AlertTriangle, Sparkles, X, Image as ImageIcon } from 'lucide-react';

interface ProductListing {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock: number;
  category: string;
  planet: string;
  certification: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const SellerProductsTab: React.FC<{ token: string }> = ({ token }) => {
  const [products, setProducts] = useState<ProductListing[]>([
    { id: 1, name: 'Certified Natural Blue Sapphire (Neelam)', sku: 'ASTRO-BLS-01', price: '45000', stock: 12, category: 'Gemstones', planet: 'Saturn (Shani)', certification: 'Lab Certified', status: 'approved' },
    { id: 2, name: 'Original Panchmukhi Rudraksha Mala', sku: 'ASTRO-RUD-05', price: '2100', stock: 2, category: 'Rudraksha', planet: 'Jupiter (Guru)', certification: 'Vedic Blessed', status: 'approved' },
    { id: 3, name: 'Conscious Energized Sri Yantra', sku: 'ASTRO-SRI-11', price: '3500', stock: 5, category: 'Yantras & Idols', planet: 'Venus (Shukra)', certification: 'Energized', status: 'pending' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '10',
    category: 'Gemstones',
    planet: 'Sun (Surya)',
    certification: 'Lab Certified',
    description: '',
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.sku) return;

    const created: ProductListing = {
      id: Date.now(),
      name: newProduct.name,
      sku: newProduct.sku,
      price: newProduct.price,
      stock: parseInt(newProduct.stock, 10) || 1,
      category: newProduct.category,
      planet: newProduct.planet,
      certification: newProduct.certification,
      status: 'pending',
    };

    setProducts([created, ...products]);
    setIsAdding(false);
    setNewProduct({
      name: '',
      sku: '',
      price: '',
      stock: '10',
      category: 'Gemstones',
      planet: 'Sun (Surya)',
      certification: 'Lab Certified',
      description: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-stone-950 font-vedic">Merchant Product Catalog &amp; Listings</h3>
          <p className="text-xs text-stone-500 mt-0.5">List new gemstones, rudraksha, or spiritual artifacts. All listings undergo admin verification before going live.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-3 rounded-2xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>List New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden border border-stone-200 rounded-3xl bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 text-stone-600 font-bold uppercase text-xs border-b border-stone-200">
            <tr>
              <th className="p-4">Product Name</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-stone-100 hover:bg-stone-50/50">
                <td className="p-4 font-bold text-stone-900">{p.name}</td>
                <td className="p-4 font-mono text-stone-500 text-xs">{p.sku}</td>
                <td className="p-4 text-stone-700 text-xs font-semibold">{p.category}</td>
                <td className="p-4 font-mono text-stone-900 font-semibold">₹{p.price}</td>
                <td className="p-4 font-mono">{p.stock}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    p.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-950 font-vedic">List a New Spiritual Product</h3>
                <p className="text-xs text-stone-500">Provide complete astrological and pricing details for admin review.</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Certified Natural Yellow Sapphire (Pukhraj)"
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={newProduct.sku}
                    onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="e.g. ASTRO-YS-09"
                    className="w-full p-3 rounded-xl border border-stone-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="e.g. 25000"
                    className="w-full p-3 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                  >
                    <option value="Gemstones">Gemstones</option>
                    <option value="Rudraksha">Rudraksha</option>
                    <option value="Yantras & Idols">Yantras &amp; Idols</option>
                    <option value="Malas & Bracelets">Malas &amp; Bracelets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Planet</label>
                  <select
                    value={newProduct.planet}
                    onChange={e => setNewProduct({ ...newProduct, planet: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                  >
                    <option value="Sun (Surya)">Sun (Surya)</option>
                    <option value="Moon (Chandra)">Moon (Chandra)</option>
                    <option value="Mars (Mangal)">Mars (Mangal)</option>
                    <option value="Mercury (Budh)">Mercury (Budh)</option>
                    <option value="Jupiter (Guru)">Jupiter (Guru)</option>
                    <option value="Venus (Shukra)">Venus (Shukra)</option>
                    <option value="Saturn (Shani)">Saturn (Shani)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Full Description &amp; Benefits</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe astrological benefits, origin, carat weight, and purification details..."
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Submit Listing for Admin Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
