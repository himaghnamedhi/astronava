import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, User, Building, MapPin, Mail, Phone, RefreshCw } from 'lucide-react';

interface Seller {
  id: number;
  legalBusinessName: string;
  contactPerson: string;
  gstin: string;
  email: string;
  phone: string;
  addressLine1: string;
  state: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AdminSellersTabProps {
  token: string;
}

export const AdminSellersTab: React.FC<AdminSellersTabProps> = ({ token }) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sellers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: Seller[] = await res.json();
        setSellers(data);
      }
    } catch (err) {
      console.error('Failed to load sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await fetch(`/api/admin/sellers/${id}`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status }),
      });
      fetchSellers();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Seller Applications</h3>
        <button onClick={fetchSellers} className="p-2 text-stone-400 hover:text-white"><RefreshCw className="w-5 h-5" /></button>
      </div>
      <div className="grid gap-4">
        {sellers.map(s => (
          <div key={s.id} className="bg-stone-900 border border-stone-800 p-6 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-lg text-white">{s.legalBusinessName}</h4>
              <p className="text-stone-400 text-sm">Contact: {s.contactPerson} | GST: {s.gstin}</p>
              <p className="text-stone-400 text-sm">Location: {s.addressLine1}, {s.state}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' : s.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                  {s.status.toUpperCase()}
              </span>
              {s.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(s.id, 'approved')} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-full"><CheckCircle2 className="w-5 h-5" /></button>
                    <button onClick={() => updateStatus(s.id, 'rejected')} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><XCircle className="w-5 h-5" /></button>
                  </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
