import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

interface PendingProduct {
  product: {
    id: number;
    name: string;
    price: string;
    sku: string;
    stock: number;
    status: string;
  };
  seller: {
    legalBusinessName: string;
    contactPerson: string;
  };
}

interface AdminPendingProductsTabProps {
  token: string;
}

export const AdminPendingProductsTab: React.FC<AdminPendingProductsTabProps> = ({ token }) => {
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: PendingProduct[] = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load pending products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await fetch(`/api/admin/products/${id}/status`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status }),
      });
      fetchProducts();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Product Approval Requests</h3>
        <button onClick={fetchProducts} className="p-2 text-stone-400 hover:text-white"><RefreshCw className="w-5 h-5" /></button>
      </div>
      <div className="grid gap-4">
        {products.map(({ product, seller }) => (
          <div key={product.id} className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-lg text-white">{product.name}</h4>
              <p className="text-stone-400 text-sm">Seller: {seller?.legalBusinessName || 'N/A'}</p>
              <p className="text-stone-400 text-sm">Price: ₹{product.price} | SKU: {product.sku} | Stock: {product.stock}</p>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => updateStatus(product.id, 'approved')} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-full"><CheckCircle2 className="w-6 h-6" /></button>
                <button onClick={() => updateStatus(product.id, 'rejected')} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><XCircle className="w-6 h-6" /></button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-stone-500 text-center py-10">No pending products found.</p>}
      </div>
    </div>
  );
};
