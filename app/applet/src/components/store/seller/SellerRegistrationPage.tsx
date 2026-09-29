import React, { useState } from 'react';
import { Store, Building, User, Mail, Phone, MapPin, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { WorldCoordinateMap } from '../WorldCoordinateMap.tsx';

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
        setError('Failed to submit application. Please try again.');
        setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-10 text-center space-y-6">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h2 className="text-3xl font-black text-white font-vedic">Application Submitted</h2>
                <p className="text-stone-400">Thank you for applying. Your application is currently under admin review.</p>
                <button onClick={onBack} className="text-amber-500 hover:text-amber-400 underline">Return to Seller Portal</button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 px-6 py-12">
        <div className="max-w-2xl mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-white font-vedic mb-8">Seller Registration</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... existing form fields ... */}
                
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setIsMapModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-stone-800 hover:bg-stone-700 rounded-xl transition-all"
                  >
                    <MapPin className="w-5 h-5" /> Choose Location on Map
                  </button>
                </div>

                {isMapModalOpen && (
                    <div className="fixed inset-0 z-50 bg-stone-950/80 flex items-center justify-center p-4">
                        <div className="bg-stone-900 rounded-3xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <WorldCoordinateMap 
                                latitude={coordinates.lat}
                                longitude={coordinates.lng}
                                timezoneOffset={5.5}
                                onChange={(coords) => {
                                    setCoordinates({ lat: coords.latitude, lng: coords.longitude });
                                    setIsMapModalOpen(false);
                                }}
                            />
                            <button onClick={() => setIsMapModalOpen(false)} className="mt-4 text-stone-400 underline">Close</button>
                        </div>
                    </div>
                )}
                
                <button type="submit" className="w-full py-4 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-all">Submit Application</button>
            </form>
        </div>
    </div>
  );
};
