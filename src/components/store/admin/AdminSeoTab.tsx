import React, { useState } from 'react';
import { Globe, Search, Edit3, Check, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

interface RouteSeoConfig {
  route: string;
  tabKey: string;
  title: string;
  description: string;
  targetCtrKeyword: string;
}

export const AdminSeoTab: React.FC<{ token: string }> = ({ token }) => {
  const [routes, setRoutes] = useState<RouteSeoConfig[]>([
    {
      route: '/',
      tabKey: 'home',
      title: 'Astronava – Authentic Vedic Astrology & Kundli Software',
      description: 'Explore precise Vedic calculations, Kundli generation, gemstone recommendations, and celestial matchmaking powered by ancient wisdom.',
      targetCtrKeyword: 'Vedic Astrology, Kundli Software',
    },
    {
      route: '/horoscope',
      tabKey: 'horoscope',
      title: 'Daily Personalized Horoscope & Vedic Planetary Transits',
      description: 'Get tailored daily transits, house predictions, and Vedic remedial guidance based on your janma lagna and moon sign.',
      targetCtrKeyword: 'Daily Horoscope, Vedic Transits',
    },
    {
      route: '/generator',
      tabKey: 'generator',
      title: 'Advanced Kundli Maker & Janam Patrika Generator',
      description: 'Generate detailed South & North Indian style Kundli charts, Vimshottari Dasha planetary periods, and Bhava house reports instantly.',
      targetCtrKeyword: 'Kundli Maker, Janam Patrika',
    },
    {
      route: '/match',
      tabKey: 'match',
      title: 'Match Finder – 36 Guna Kundli Milan & Manglik Analysis',
      description: 'Compute Ashtakoota Guna Milan compatibility score, Mangal Dosha severity, and life dimension harmony for marriage.',
      targetCtrKeyword: 'Kundli Milan, Match Finder',
    },
    {
      route: '/gemstones',
      tabKey: 'gemstones',
      title: 'Find Gemstones You Need – Vedic Ratna & Rashi Calculator',
      description: 'Discover your auspicious healing gemstones based on birth chart planetary strengths, carat weights, and metal settings.',
      targetCtrKeyword: 'Vedic Gemstones, Ratna Calculator',
    },
    {
      route: '/store',
      tabKey: 'store',
      title: 'Astronava Vedic Store – Certified Gemstones & Rudraksha',
      description: 'Shop lab-certified natural gemstones, consecrated rudraksha malas, energized yantras, and sacred spiritual artifacts.',
      targetCtrKeyword: 'Buy Gemstones, Rudraksha Online',
    },
  ]);

  const [editingRoute, setEditingRoute] = useState<RouteSeoConfig | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editKeyword, setEditKeyword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSaveSeo = () => {
    if (!editingRoute) return;
    setRoutes(prev => prev.map(r => r.tabKey === editingRoute.tabKey ? {
      ...r,
      title: editTitle,
      description: editDesc,
      targetCtrKeyword: editKeyword
    } : r));
    setEditingRoute(null);
    setSuccessMsg('SEO Meta tags updated successfully for route!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-stone-950 font-vedic">SEO Meta Tags &amp; CTR Optimization Monitor</h3>
          <p className="text-xs text-stone-500 mt-0.5">Manage and audit route-level titles (30-60 chars) and meta descriptions (120-160 chars) for maximum CTR.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SEO Compliance Active</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Routes SEO Table */}
      <div className="overflow-hidden border border-stone-200 rounded-3xl bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 text-stone-600 font-bold uppercase text-xs border-b border-stone-200">
            <tr>
              <th className="p-4">Route / Path</th>
              <th className="p-4">Page Title &amp; Length Check</th>
              <th className="p-4">Meta Description &amp; Length Check</th>
              <th className="p-4">Target Keyword</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(r => {
              const titleLen = r.title.length;
              const descLen = r.description.length;
              const isTitleValid = titleLen >= 30 && titleLen <= 60;
              const isDescValid = descLen >= 120 && descLen <= 160;

              return (
                <tr key={r.tabKey} className="border-t border-stone-100 hover:bg-stone-50/50">
                  <td className="p-4 font-mono font-bold text-stone-900 text-xs">{r.route}</td>
                  <td className="p-4 space-y-1 max-w-xs">
                    <p className="font-semibold text-stone-900 text-xs line-clamp-1">{r.title}</p>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className={`font-bold px-2 py-0.5 rounded-md ${isTitleValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {titleLen} chars {isTitleValid ? '✓ Optimal' : '(Aim: 30-60)'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 space-y-1 max-w-sm">
                    <p className="text-stone-600 text-xs line-clamp-2">{r.description}</p>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className={`font-bold px-2 py-0.5 rounded-md ${isDescValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {descLen} chars {isDescValid ? '✓ Optimal' : '(Aim: 120-160)'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-amber-900 font-semibold">{r.targetCtrKeyword}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setEditingRoute(r);
                        setEditTitle(r.title);
                        setEditDesc(r.description);
                        setEditKeyword(r.targetCtrKeyword);
                      }}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit SEO
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit SEO Modal */}
      {editingRoute && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-950 font-vedic">Edit SEO Metadata ({editingRoute.route})</h3>
                <p className="text-xs text-stone-500">Optimize meta title and description for higher CTR in search engine results.</p>
              </div>
              <button onClick={() => setEditingRoute(null)} className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase text-stone-700">Meta Title (<span className="text-amber-800">30 - 60 chars</span>)</label>
                  <span className={`text-[11px] font-bold ${editTitle.length >= 30 && editTitle.length <= 60 ? 'text-emerald-700' : 'text-amber-700'}`}>{editTitle.length} chars</span>
                </div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase text-stone-700">Meta Description (<span className="text-amber-800">120 - 160 chars</span>)</label>
                  <span className={`text-[11px] font-bold ${editDesc.length >= 120 && editDesc.length <= 160 ? 'text-emerald-700' : 'text-amber-700'}`}>{editDesc.length} chars</span>
                </div>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Target CTR Keyword</label>
                <input
                  type="text"
                  value={editKeyword}
                  onChange={e => setEditKeyword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                onClick={() => setEditingRoute(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSeo}
                className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5" /> Save SEO Meta Tags
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
