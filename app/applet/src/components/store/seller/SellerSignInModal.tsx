import React, { useState } from 'react';
import { Store, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface SellerSignInModalProps {
  onSuccess: (sellerEmail: string) => void;
  onBack: () => void;
}

export const SellerSignInModal: React.FC<SellerSignInModalProps> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('merchant@astronavaseeds.com');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (!email.includes('@')) {
        setError('Please enter a valid merchant email address.');
        return;
      }
      onSuccess(email);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center px-6 py-12 font-sans selection:bg-amber-500 selection:text-stone-950">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl space-y-8 relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black mx-auto shadow-lg">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white font-vedic">Seller Portal Sign In</h2>
          <p className="text-xs text-stone-400">Access your merchant dashboard, products, and sales analytics.</p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wider font-vedic">Merchant Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 pl-10 text-xs text-stone-100 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="merchant@domain.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wider font-vedic">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 pl-10 text-xs text-stone-100 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Seller Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={onBack}
            className="text-xs text-stone-400 hover:text-white transition-colors cursor-pointer underline"
          >
            &larr; Return to Seller Welcome
          </button>
        </div>
      </div>
    </div>
  );
};
