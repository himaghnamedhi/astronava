import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Building, MapPin, RefreshCw } from 'lucide-react';
import { getSellersFromFirestore, updateSellerStatusInFirestore, FirebaseSellerApplication } from '../../../lib/firebase';

interface AdminSellersTabProps {
  token: string;
}

export const AdminSellersTab: React.FC<AdminSellersTabProps> = ({ token }) => {
  const [sellers, setSellers] = useState<FirebaseSellerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await getSellersFromFirestore();
      if (data && data.length > 0) {
        setSellers(data);
      } else {
        // Fallback mock pending seller applications
        setSellers([
          {
            id: 'seller_1',
            legalBusinessName: 'Vedic Gems & Ratna Emporium Pvt Ltd',
            contactPerson: 'Rajesh Sharma',
            gstin: '22AAAAA0000A1Z5',
            email: 'rajesh@vedicgems.com',
            phone: '+91 98765 43210',
            addressLine1: 'Jewellery Market, MG Road',
            state: 'Rajasthan',
            status: 'pending',
            createdAt: new Date(),
          },
          {
            id: 'seller_2',
            legalBusinessName: 'Himalayan Rudraksha & Spiritual Artifacts',
            contactPerson: 'Ananya Goswami',
            gstin: '18BBBBB1111B2Z6',
            email: 'ananya@himalayanrudraksha.org',
            phone: '+91 91234 56789',
            addressLine1: 'Temple Road, Kamakhya',
            state: 'Assam',
            status: 'pending',
            createdAt: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load sellers from Firestore:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [token]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateSellerStatusInFirestore(id, status);
      setSellers(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch (err) {
      console.error('Failed to update seller status in Firestore:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-stone-500">Loading seller applications from Firestore...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-stone-950 font-vedic">Seller Applications &amp; Verification (Firestore)</h3>
          <p className="text-xs text-stone-500 mt-0.5">Review merchant business credentials from Firestore and approve or reject portal access.</p>
        </div>
        <button onClick={fetchSellers} className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl cursor-pointer transition-colors" title="Refresh Applications">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-4">
        {sellers.map(s => (
          <div key={s.id} className="bg-white border border-stone-200 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-800" />
                <h4 className="font-bold text-base text-stone-950 font-vedic">{s.legalBusinessName}</h4>
              </div>
              <p className="text-xs text-stone-600 flex items-center gap-3">
                <span><strong className="text-stone-900">Contact:</strong> {s.contactPerson}</span>
                <span>•</span>
                <span><strong className="text-stone-900">GSTIN:</strong> <span className="font-mono">{s.gstin}</span></span>
              </p>
              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{s.addressLine1}, {s.state}</span>
                <span className="text-stone-300">|</span>
                <span>{s.email} ({s.phone})</span>
              </p>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                s.status === 'approved' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : s.status === 'rejected' 
                  ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                  {s.status.toUpperCase()}
              </span>

              {s.status === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatus(s.id, 'approved')} 
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                      title="Approve Seller Account"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={() => updateStatus(s.id, 'rejected')} 
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      title="Reject Application"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
