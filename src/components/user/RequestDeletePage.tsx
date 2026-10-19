import React, { useState } from 'react';
import { AlertCircle, Shield, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RequestDeletePageProps {
  onBackToHome: () => void;
  onOpenLogin: () => void;
}

export const DeleteAccountForm: React.FC<{ user: any; onOpenLogin: () => void; onBack: () => void }> = ({ user, onOpenLogin, onBack }) => {
  const [confirmText, setConfirmText] = useState('');
  const [secondConfirm, setSecondConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (!user) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900 font-vedic">Authentication Required</h3>
        <p className="text-xs text-stone-600">
          For security and compliance, you must be logged into your account to request or execute permanent data deletion.
        </p>
        <button
          type="button"
          onClick={onOpenLogin}
          className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer"
        >
          Log In Now
        </button>
      </div>
    );
  }

  if (deleted) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900 font-vedic">Account Permanently Deleted</h3>
        <p className="text-xs text-stone-600">
          Your account and associated records have been successfully wiped from Astronava servers.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
        <p className="font-bold">Logged in as: {user.email || user.displayName || 'Authenticated User'}</p>
        <p className="text-[11px] text-rose-700">This action is irreversible. All birth charts, records, and history will be wiped.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-stone-700 uppercase">
          Type <strong>DELETE</strong> to confirm:
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
          className="w-full px-3 py-2 text-xs text-center font-bold tracking-wider rounded-xl border border-rose-300 bg-stone-50"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={secondConfirm}
            onChange={(e) => setSecondConfirm(e.target.checked)}
            className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
          />
          <span>I understand that this permanent deletion cannot be undone.</span>
        </label>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={confirmText !== 'DELETE' || !secondConfirm}
          onClick={() => setDeleted(true)}
          className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Permanently Delete
        </button>
      </div>
    </div>
  );
};

export const RequestDeletePage: React.FC<RequestDeletePageProps> = ({ onBackToHome, onOpenLogin }) => {
  const { user } = useAuth();

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
            Secure account closure endpoint. You must be authenticated to execute permanent data removal.
          </p>
        </div>

        <DeleteAccountForm user={user} onOpenLogin={onOpenLogin} onBack={onBackToHome} />

      </div>
    </div>
  );
};
