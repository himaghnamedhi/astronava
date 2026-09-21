import React, { useState } from 'react';
import {
  X,
  Mail,
  Smartphone,
  MessageSquare,
  CheckCircle2,
  Send,
  Sparkles,
  Clock,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { DailyHoroscopeResult, HoroscopeUserProfile } from '../../types/horoscope';

interface HoroscopeDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  horoscope: DailyHoroscopeResult;
  userProfile: HoroscopeUserProfile;
}

export const HoroscopeDeliveryModal: React.FC<HoroscopeDeliveryModalProps> = ({
  isOpen,
  onClose,
  horoscope,
  userProfile,
}) => {
  const [activeChannel, setActiveChannel] = useState<'email' | 'push' | 'whatsapp'>('email');
  const [isSending, setIsSending] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<{
    success: boolean;
    timestamp: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSendNotification = async () => {
    setIsSending(true);
    setDeliveryResult(null);

    try {
      const response = await fetch('/api/horoscope/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          horoscope,
          channel: activeChannel,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setDeliveryResult({
          success: true,
          timestamp: new Date().toLocaleTimeString(),
          message: data.message || 'Notification successfully sent!',
        });
      } else {
        throw new Error(data.error || 'Failed to dispatch notification');
      }
    } catch (err: any) {
      setDeliveryResult({
        success: false,
        timestamp: new Date().toLocaleTimeString(),
        message: err.message || 'Error communicating with notification dispatch service.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold font-vedic">
                Automated Notification Engine
              </div>
              <h3 className="text-lg font-bold text-white">Daily Horoscope Dispatch</h3>
            </div>
          </div>
          <p className="text-xs text-stone-300 mt-2">
            Delivering personalized daily cosmic guidance to <strong>{userProfile.name}</strong> ({userProfile.email}).
          </p>
        </div>

        {/* Channel Selector Tabs */}
        <div className="flex items-center border-b border-stone-200 bg-stone-50 px-6 pt-3 gap-2">
          {[
            { id: 'email', label: 'Email Digest', icon: Mail },
            { id: 'push', label: 'Push Notification', icon: Smartphone },
            { id: 'whatsapp', label: 'WhatsApp / SMS', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeChannel === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveChannel(tab.id as any);
                  setDeliveryResult(null);
                }}
                className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-amber-700 text-amber-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Channel Preview Body */}
        <div className="p-6 space-y-4">
          
          {/* EMAIL PREVIEW */}
          {activeChannel === 'email' && (
            <div className="rounded-2xl border border-stone-300 overflow-hidden shadow-xs">
              <div className="bg-stone-100 p-3 border-b border-stone-200 text-xs space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span><strong>To:</strong> {userProfile.name} &lt;{userProfile.email}&gt;</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono">07:00 AM Daily</span>
                </div>
                <div><strong>Subject:</strong> 🌟 Astronava Horoscope for {horoscope.date}: Alignment {horoscope.overallScore}/100</div>
              </div>

              <div className="p-4 bg-white text-xs text-stone-800 space-y-3 font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="font-vedic font-bold text-amber-950 text-sm">ASTRONAVA DAILY JYOTISH</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                    Score: {horoscope.overallScore}/100
                  </span>
                </div>

                <p className="text-stone-700 leading-relaxed italic">
                  "Namaste {userProfile.name}, today's cosmic currents favor your {horoscope.birthDetails.lagnaSign} Lagna through {horoscope.strongestPlanet.name}'s auspicious radiance."
                </p>

                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] space-y-1">
                  <div><strong>🎯 Prime Opportunity:</strong> {horoscope.biggestOpportunity.domain}</div>
                  <div><strong>⚠️ Gentle Caution:</strong> {horoscope.biggestChallenge.domain}</div>
                  <div><strong>✨ Auspicious Window:</strong> {horoscope.luckyTime.window}</div>
                  <div><strong>🕉️ Today's Mantra:</strong> {horoscope.mantra.phonetic} ({horoscope.mantra.repetitions}x)</div>
                </div>

                <div className="text-center pt-2">
                  <span className="inline-block px-4 py-2 bg-amber-900 text-white rounded-xl font-semibold text-xs shadow-xs">
                    View Full 20 Category Breakdown on Astronava →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* PUSH PREVIEW */}
          {activeChannel === 'push' && (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-stone-900 text-white shadow-lg space-y-2 border border-stone-800">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-amber-500 flex items-center justify-center text-[9px] text-black font-bold">✦</div>
                  <span className="font-semibold text-stone-200">ASTRONAVA</span>
                </div>
                <span>Just now</span>
              </div>
              <div className="text-xs font-bold text-amber-300">
                🌟 Today's Cosmic Alignment: {horoscope.overallScore}/100
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {userProfile.name}, {horoscope.strongestPlanet.name} activates your chart! Prime focus is {horoscope.biggestOpportunity.domain}. Auspicious Muhurat: {horoscope.luckyTime.window}.
              </p>
            </div>
          )}

          {/* WHATSAPP / SMS PREVIEW */}
          {activeChannel === 'whatsapp' && (
            <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-stone-300 space-y-2">
              <div className="max-w-sm ml-auto bg-[#DCF8C6] p-3 rounded-2xl rounded-tr-xs shadow-xs text-xs text-stone-900 space-y-2 font-sans">
                <div className="font-bold text-amber-950">
                  ✨ Astronava Daily Horoscope ({horoscope.date})
                </div>
                <p>
                  Namaste <strong>{userProfile.name}</strong>! Your Vedic alignment score for today is <strong>{horoscope.overallScore}/100</strong>.
                </p>
                <div className="text-[11px] space-y-1">
                  <div>• <strong>Top Energy:</strong> {horoscope.biggestOpportunity.domain}</div>
                  <div>• <strong>Lucky Time:</strong> {horoscope.luckyTime.window}</div>
                  <div>• <strong>Lucky Color:</strong> {horoscope.luckyColor.name}</div>
                  <div>• <strong>Mantra:</strong> {horoscope.mantra.phonetic}</div>
                </div>
                <div className="text-[10px] text-stone-500 pt-1 flex items-center justify-between">
                  <span>Open: https://astronava.com/horoscope</span>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</span>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Result Status Banner */}
          {deliveryResult && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                deliveryResult.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border border-rose-200 text-rose-900'
              }`}
            >
              {deliveryResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-bold">{deliveryResult.message}</p>
                <p className="text-[10px] text-stone-500">Dispatched at {deliveryResult.timestamp}</p>
              </div>
            </div>
          )}

          {/* Delivery Trigger Controls */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified consent active</span>
            </div>

            <button
              type="button"
              id="btn-dispatch-notification-now"
              onClick={handleSendNotification}
              disabled={isSending}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Dispatching...' : `Send Test ${activeChannel.toUpperCase()} Now`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
