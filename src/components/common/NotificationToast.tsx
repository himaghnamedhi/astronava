import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const [notification, setNotification] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  useEffect(() => {
    return notificationService.subscribe((notif) => {
      setNotification(notif);
      if (notif) {
        const timer = setTimeout(() => {
          setNotification(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    });
  }, []);

  if (!notification) return null;

  const isError = notification.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-fadeIn">
      <div className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 text-xs font-medium ${
        isError ? 'bg-rose-950 text-rose-100 border-rose-800' : 'bg-emerald-950 text-emerald-100 border-emerald-800'
      }`}>
        {isError ? (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 leading-relaxed">
          {notification.message}
        </div>
        <button
          onClick={() => setNotification(null)}
          className="text-stone-400 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
