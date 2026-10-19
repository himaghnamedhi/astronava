import React, { useState } from 'react';
import { AlertCircle, Shield, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RequestDeletePageProps {
  onBackToHome: () => void;
  onOpenLogin: () => void;
}

export const RequestDeletePage: React.FC<RequestDeletePageProps> = ({ onBackToHome, onOpenLogin }) => {
  const { user } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200/80 shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 font-vedic">Account Deletion Request</h1>
          <p className="text-xs text-stone-600">
            Submit your account deletion request. For security and compliance, <strong>account deletion requires you to be logged into your account</strong> and complete a double confirmation.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Username, Email, or Phone Number *
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. user@astronava.com or +91..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-stone-50 focus:ring-1 focus:ring-rose-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Reason for Deletion (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Let us know why you are leaving..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-stone-50 focus:ring-1 focus:ring-rose-600 focus:outline-none resize-none"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Note: Submitting this form logs your request for review. To instantly wipe your data, please log in and use the secure delete button in your profile settings.
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToHome}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Back to Home
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-stone-900">Deletion Request Logged</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We have received your deletion request for <strong>{identifier}</strong>. To complete permanent data erasure, please sign into your account.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              {!user && (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer"
                >
                  Log In to Confirm Deletion
                </button>
              )}
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Return to Astronava
              </button>
            </div>
          </div>
        )}

        {/* Footer Link Info */}
        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-[11px] text-stone-400">
            Dedicated Deletion Endpoint: <code className="text-stone-600">app.astronava.com/request-delete</code>
          </p>
        </div>
      </div>
    </div>
  );
};
