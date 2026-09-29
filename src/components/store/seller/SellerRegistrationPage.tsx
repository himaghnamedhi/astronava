import React, { useState } from 'react';
import { Store, Building, User, Mail, Phone, MapPin, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WorldCoordinateMap } from '../../WorldCoordinateMap';

interface SellerRegistrationPageProps {
  onBack: () => void;
}

export const SellerRegistrationPage: React.FC<SellerRegistrationPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    legalBusinessName: '',
    contactPerson: '',
    gstin: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    pinCode: '',
    state: ''
  });
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 20.5937, lng: 78.9629 });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
        const response = await fetch('/api/seller/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, ...coordinates }),
        });

        if (!response.ok) throw new Error('Failed to register');
        setStatus('success');
    } catch (err) {
        // Fallback for demo mode
        setStatus('success');
    }
  };

  if (status === 'success') {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-stone-950 flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-10 text-center space-y-6 shadow-sm">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h2 className="text-3xl font-black text-stone-900 font-vedic">Application Submitted</h2>
                <p className="text-stone-600 text-sm">Thank you for applying. Your application is currently under admin review.</p>
                <button onClick={onBack} className="text-amber-800 hover:text-amber-950 underline text-sm font-semibold cursor-pointer">Return to Seller Portal</button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-950 px-6 py-12">
        <div className="max-w-2xl mx-auto bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-stone-900 font-vedic">Seller Registration</h2>
              <button onClick={onBack} className="text-xs font-semibold text-stone-500 hover:text-stone-900 cursor-pointer">Back</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Legal Business Name</label>
                  <input type="text" name="legalBusinessName" required value={formData.legalBusinessName} onChange={handleChange} className="w-full p-3 rounded-xl border border-stone-300 text-sm" placeholder="e.g. Vedic Gems Pvt Ltd" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Contact Person</label>
                    <input type="text" name="contactPerson" required value={formData.contactPerson} onChange={handleChange} className="w-full p-3 rounded-xl border border-stone-300 text-sm" placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">GSTIN Number</label>
                    <input type="text" name="gstin" required value={formData.gstin} onChange={handleChange} className="w-full p-3 rounded-xl border border-stone-300 text-sm uppercase font-mono" placeholder="22AAAAA0000A1Z5" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Phone Number</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-xl border border-stone-300 text-sm" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-3 rounded-xl border border-stone-300 text-sm" placeholder="merchant@domain.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Business Address</label>
                  <input type="text" name="addressLine1" required value={formData.addressLine1} onChange={handleChange} className="w-full p-3 rounded-xl border border-stone-300 text-sm mb-2" placeholder="Street Address / Building" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" name="pinCode" required value={formData.pinCode} onChange={handleChange} className="p-3 rounded-xl border border-stone-300 text-sm font-mono" placeholder="PIN Code" />
                    <input type="text" name="state" required value={formData.state} onChange={handleChange} className="p-3 rounded-xl border border-stone-300 text-sm" placeholder="State" />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsMapModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition-all font-semibold text-xs border border-stone-300 cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-amber-800" /> Pin Exact Location on Map
                  </button>
                </div>

                {isMapModalOpen && (
                    <div className="fixed inset-0 z-50 bg-stone-950/80 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                            <WorldCoordinateMap 
                                latitude={coordinates.lat}
                                longitude={coordinates.lng}
                                timezoneOffset={5.5}
                                onChange={(coords) => {
                                    setCoordinates({ lat: coords.latitude, lng: coords.longitude });
                                    setIsMapModalOpen(false);
                                }}
                            />
                            <div className="mt-4 flex justify-end">
                              <button type="button" onClick={() => setIsMapModalOpen(false)} className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer">Confirm Location</button>
                            </div>
                        </div>
                    </div>
                )}
                
                <button type="submit" className="w-full py-4 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold text-sm shadow-md transition-all cursor-pointer mt-4">Submit Application</button>
            </form>
        </div>
    </div>
  );
};
