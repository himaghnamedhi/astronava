import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lock, 
  Unlock, 
  UserCheck, 
  Bookmark, 
  Copy, 
  Printer, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown, 
  Award, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  Check, 
  Compass, 
  Flame, 
  Star,
  Layers,
  ArrowUpRight,
  ExternalLink,
  History,
  Trash2,
  Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CompleteKundliData } from '../../data/vedicEphemeris';
import { saveAiSummary, getUserAiSummaries, deleteAiSummary, StoredAiSummary } from '../../lib/firebase';
import { AiSummarySectionPayload } from '../../server/geminiAstrology';

interface AiKundliSummaryViewProps {
  kundliData: CompleteKundliData;
}

export const AiKundliSummaryView: React.FC<AiKundliSummaryViewProps> = ({ kundliData }) => {
  const { user, openAuthModal } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<AiSummarySectionPayload | null>(null);
  const [focusArea, setFocusArea] = useState<string>('holistic');
  const [depth, setDepth] = useState<string>('detailed');
  const [activeSection, setActiveSection] = useState<'all' | 'grahas' | 'lords' | 'yogas' | 'dasha' | 'remedies'>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Saved summaries drawer / history
  const [savedSummaries, setSavedSummaries] = useState<StoredAiSummary[]>([]);
  const [showSavedList, setShowSavedList] = useState<boolean>(false);

  // Load saved summaries if user is authenticated
  useEffect(() => {
    if (user) {
      getUserAiSummaries(user.uid).then(setSavedSummaries).catch(() => {});
    } else {
      setSavedSummaries([]);
    }
  }, [user]);

  const handleGenerateSummary = async () => {
    if (!user) {
      openAuthModal('Please sign up or log in to unlock the full AI Astrological Summary.');
      return;
    }

    setLoading(true);
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/ai/summarize-kundli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kundliData,
          focus: focusArea,
          depth: depth,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: AiSummarySectionPayload = await response.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch AI summary:', err);
      // Fallback locally if network route fails
      import('../../server/geminiAstrology').then(({ generateAlgorithmicVedicSummary }) => {
        const fallback = generateAlgorithmicVedicSummary(kundliData);
        setSummary(fallback);
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToProfile = async () => {
    if (!user || !summary) return;
    setSaving(true);
    try {
      const summaryId = 'sum_' + Date.now().toString(36);
      await saveAiSummary({
        id: summaryId,
        userId: user.uid,
        nativeName: kundliData.birthDetails?.name || 'Native',
        lagnaSign: kundliData.lagnaSignName,
        summaryData: summary,
      });
      setSavedSuccess(true);
      // Refresh list
      const updated = await getUserAiSummaries(user.uid);
      setSavedSummaries(updated);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving summary:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    const text = `ASTRONAVA AI ASTROLOGICAL SYNTHESIS\n` +
      `Native: ${kundliData.birthDetails?.name || 'Native'}\n` +
      `Lagna: ${kundliData.lagnaSignName} | Moon Sign: ${kundliData.moonSignName}\n\n` +
      `EXECUTIVE OVERVIEW:\n${summary.overview}\n\n` +
      `LAGNA ANALYSIS:\n${summary.lagnaInsight.interpretation}\n\n` +
      `PLANETS IN HOUSES (GRAHA BHAVA STHITI):\n` +
      summary.grahaBhavaSthiti.map(g => `- ${g.planet} in House ${g.house} (${g.sign}): ${g.effect}`).join('\n') +
      `\n\nHOUSE LORDS (BHAVA ADHIPATI):\n` +
      summary.bhavaAdhipati.map(b => `- House ${b.houseNumber} Lord (${b.lordPlanet}) in House ${b.placedInHouse}: ${b.classicalEffect}`).join('\n') +
      `\n\nACTIVE DASHA:\n${summary.dashaActivation.timingEffect}\n\n` +
      `VEDIC REMEDIES:\n` +
      summary.vedicRemedies.map(r => `- [${r.category}] ${r.remedy} (${r.purpose})`).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If user is NOT logged in: Show Gating Screen
  if (!user) {
    return (
      <div className="bg-stone-900 rounded-3xl border border-amber-500/30 overflow-hidden text-amber-50 shadow-2xl relative">
        {/* Decorative Background Accents */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-700/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-10 space-y-8">
          {/* Header Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI ASTROLOGICAL SYNTHESIS</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-200/70 font-medium bg-white/5 px-3 py-1 rounded-lg border border-white/10">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Member Exclusive</span>
            </div>
          </div>

          {/* Core Title */}
          <div className="max-w-2xl space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-vedic text-white leading-tight">
              Unlock Deep Planetary &amp; House Lord Synthesis
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              Experience an erudite Vedic astrological synthesis combining classical Parashari principles with cutting-edge AI. Understand exactly how your planetary positions and 12 house lord alignments shape your karma, career, wealth, and relationships.
            </p>
          </div>

          {/* Interactive Feature Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                🪐
              </div>
              <h4 className="text-sm font-bold text-white">Graha Bhava Sthiti</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Detailed analysis of why each planet in its specific house (e.g. Sun in 10th, Moon in 4th) triggers distinct outcomes.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                👑
              </div>
              <h4 className="text-sm font-bold text-white">Bhava Adhipati (House Lords)</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Connect the dots: e.g. 1st Lord in 10th House, 2nd Lord in 11th House, 7th Lord in 1st House, and what their placements activate.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                ⏳
              </div>
              <h4 className="text-sm font-bold text-white">Active Dasha Activation</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Real-time insights on your current Mahadasha and Antardasha periods and which house themes are active right now.
              </p>
            </div>
          </div>

          {/* Preview Snapshot Sample */}
          <div className="bg-stone-950/60 rounded-2xl border border-amber-500/20 p-4 sm:p-5 relative overflow-hidden">
            <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>✦ Sample Preview: {kundliData.lagnaSignName} Lagna &bull; {kundliData.moonSignName} Moon</span>
            </div>
            <p className="text-xs text-stone-300 italic line-clamp-2">
              "Lagna lord {kundliData.lagna?.lord || 'ruler'} occupies House {kundliData.bhavaSummaries?.[0]?.lordHouse || 10}, forming an auspicious karmic channel that emphasizes self-directed achievement and civic honor..."
            </p>
            {/* Gradient Mask */}
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-stone-950/95 to-transparent flex items-end justify-center pb-2">
              <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Sign up to read complete 6-section report</span>
              </span>
            </div>
          </div>

          {/* Sign Up Call To Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              id="btn-unlock-ai-summary"
              onClick={() => openAuthModal('Sign up to unlock the complete AI Astrological Summary with planetary house and lord interpretations.')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-stone-950" />
              <span>Sign Up to Unlock AI Summary</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openAuthModal('Sign in to access your AI Astrological Summary.')}
              className="text-xs text-amber-200/80 hover:text-white font-medium underline underline-offset-4 transition-colors cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user IS logged in: Render the Generator & Result View
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner with Membership Status & Controls */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 rounded-2xl p-4 sm:p-5 text-amber-50 border border-amber-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-vedic text-white">
                AI Astrological Summary
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                Unlocked
              </span>
            </div>
            <p className="text-xs text-amber-200/80">
              Welcome, <span className="font-semibold text-white">{user.displayName || user.email}</span>. Synthesizing chart for <span className="font-semibold text-amber-300">{kundliData.birthDetails?.name || 'Native'}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {savedSummaries.length > 0 && (
            <button
              onClick={() => setShowSavedList(!showSavedList)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Saved ({savedSummaries.length})</span>
            </button>
          )}

          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-stone-950" />
                <span>{summary ? 'Regenerate Synthesis' : 'Generate AI Summary'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Saved Summaries Drawer if toggled */}
      {showSavedList && savedSummaries.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-amber-700" />
              <span>Your Previously Saved AI Summaries</span>
            </h4>
            <button
              onClick={() => setShowSavedList(false)}
              className="text-xs text-stone-400 hover:text-stone-700"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {savedSummaries.map((s) => (
              <div 
                key={s.id}
                className="p-3 rounded-xl border border-stone-200 hover:border-amber-400/60 bg-stone-50/50 hover:bg-amber-50/30 transition-all flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900">{s.nativeName}</span>
                    <span className="text-[10px] text-stone-500">{s.lagnaSign}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2 mt-1">
                    {s.summaryData?.overview || 'Vedic chart summary'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                  <button
                    onClick={() => {
                      setSummary(s.summaryData);
                      setShowSavedList(false);
                    }}
                    className="text-xs font-semibold text-amber-900 hover:underline flex items-center gap-1"
                  >
                    <span>Load Report</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={async () => {
                      if (user) {
                        await deleteAiSummary(user.uid, s.id);
                        const updated = await getUserAiSummaries(user.uid);
                        setSavedSummaries(updated);
                      }
                    }}
                    title="Delete saved summary"
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Synthesis Settings Card (if not yet generated or collapsed) */}
      {!summary && !loading && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="max-w-xl space-y-1">
            <h4 className="text-base font-bold text-stone-900 font-vedic">
              Configure Your Synthesis Focus
            </h4>
            <p className="text-xs text-stone-600">
              Customize how the AI models your chart's planetary houses and house lord dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Focus Domain */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                Primary Life Domain
              </label>
              <select
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="holistic">Holistic Overview (All 12 Houses &amp; Grahas)</option>
                <option value="career">Career, Status &amp; Wealth (1st, 2nd, 10th, 11th Lords)</option>
                <option value="relationships">Marriage &amp; Compatibility (5th, 7th, 8th Lords)</option>
                <option value="spirituality">Spiritual Evolution &amp; Health (1st, 6th, 9th, 12th Lords)</option>
              </select>
            </div>

            {/* Depth */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                Analysis Depth
              </label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="detailed">Comprehensive Synthesis (Deep Parashari commentary)</option>
                <option value="concise">Concise Action Dossier (High-level essentials)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>What this synthesis will cover for you:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] list-disc list-inside">
              <li>Lagna &amp; Lagna Lord position (e.g. {kundliData.lagna?.lord || 'Mars'} in House {kundliData.bhavaSummaries?.[0]?.lordHouse || 10})</li>
              <li>Every planet's house placement (Graha Bhava Sthiti)</li>
              <li>All 12 house lords and their destination houses</li>
              <li>Active Vimshottari Dasha timing influences</li>
              <li>Prescribed Vedic lifestyle &amp; remedial gems</li>
            </ul>
          </div>

          <button
            onClick={handleGenerateSummary}
            className="w-full py-3.5 bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Full AI Summary</span>
          </button>
        </div>
      )}

      {/* Loading Indicator with Vedic steps */}
      {loading && (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-stone-900 font-vedic">
              Synthesizing Planetary &amp; House Dynamics...
            </h4>
            <p className="text-xs text-stone-500 animate-pulse">
              Correlating 9 Graha placements with 12 Bhava Adhipati positions and classical Parashari aphorisms...
            </p>
          </div>
        </div>
      )}

      {/* Render Generated AI Summary */}
      {summary && !loading && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs">
            {/* Filter Sub-Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0 text-xs font-semibold">
              {[
                { id: 'all', label: 'Complete Dossier' },
                { id: 'grahas', label: 'Planets in Houses' },
                { id: 'lords', label: 'House Lords (भावाधिपति)' },
                { id: 'yogas', label: 'Yogas' },
                { id: 'dasha', label: 'Dasha Timing' },
                { id: 'remedies', label: 'Remedies' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    activeSection === tab.id
                      ? 'bg-amber-900 text-white font-bold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Utilities */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleSaveToProfile}
                disabled={saving}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  savedSuccess
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'Saved to Profile' : saving ? 'Saving...' : 'Save to Profile'}</span>
              </button>
            </div>
          </div>

          {/* SECTION 1: EXECUTIVE ESSENCE & LAGNA INSIGHT */}
          {(activeSection === 'all' || activeSection === 'grahas' || activeSection === 'lords') && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Executive Astrological Essence</span>
              </div>
              <p className="text-sm text-stone-800 leading-relaxed font-serif">
                {summary.overview}
              </p>

              {/* Lagna Highlight Card */}
              <div className="bg-[#FAF8F5] border border-amber-900/10 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 font-vedic">
                    Lagna &amp; Ascendant Ruler (लग्नेश स्थिति)
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 font-semibold">
                    {summary.lagnaInsight.sign} &bull; House {summary.lagnaInsight.lordHouse}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {summary.lagnaInsight.interpretation}
                </p>
              </div>
            </div>
          )}

          {/* SECTION 2: PLANETS IN HOUSES (GRAHA BHAVA STHITI) */}
          {(activeSection === 'all' || activeSection === 'grahas') && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-800" />
                  <h4 className="text-sm font-bold text-stone-900 font-vedic uppercase tracking-wider">
                    Graha Bhava Sthiti (Planets in Houses)
                  </h4>
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  {summary.grahaBhavaSthiti.length} Grahas Analyzed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {summary.grahaBhavaSthiti.map((g, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/40 hover:bg-amber-50/30 hover:border-amber-300 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">{g.planet}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700">
                          House {g.house}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-full">
                        {g.sign} &bull; {g.dignity}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed">
                      {g.effect}
                    </p>

                    <div className="pt-2 border-t border-stone-200/60 flex items-start gap-1.5 text-[11px] text-stone-600">
                      <span className="font-bold text-amber-800 shrink-0">Guidance:</span>
                      <span>{g.practicalGuidance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: HOUSE LORDS (BHAVA ADHIPATI) */}
          {(activeSection === 'all' || activeSection === 'lords') && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-800" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 font-vedic uppercase tracking-wider">
                      Bhava Adhipati (12 House Lords &amp; Placements)
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Classical interpretations of each house lord residing in their designated bhava.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {summary.bhavaAdhipati.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-400/80 shadow-2xs space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950">
                        {b.houseName}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-900 text-amber-50">
                        Lord {b.lordPlanet} &rarr; House {b.placedInHouse}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed font-serif">
                      {b.classicalEffect}
                    </p>

                    <div className="pt-1.5 text-[11px] text-stone-500 flex items-center gap-1">
                      <span className="font-semibold text-stone-700">Real-life focus:</span>
                      <span>{b.realLifeManifestation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: YOGAS & COMBINATIONS */}
          {(activeSection === 'all' || activeSection === 'yogas') && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
                <Award className="w-4 h-4 text-amber-800" />
                <h4 className="text-sm font-bold text-stone-900 font-vedic uppercase tracking-wider">
                  Notable Astrological Yogas &amp; Fortunes
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {summary.yogasAndCombinations.map((y, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-[#FAF8F5] space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <h5 className="text-xs font-bold text-stone-900">{y.name}</h5>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {y.description}
                    </p>
                    <p className="text-[11px] text-amber-900 font-medium">
                      Outcome: {y.manifestation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: DASHA ACTIVATION & TIMING */}
          {(activeSection === 'all' || activeSection === 'dasha') && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
                <Clock className="w-4 h-4 text-amber-800" />
                <h4 className="text-sm font-bold text-stone-900 font-vedic uppercase tracking-wider">
                  Vimshottari Dasha Activation &amp; Timing
                </h4>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">
                    Active Cycle: {summary.dashaActivation.mahadasha} Mahadasha &bull; {summary.dashaActivation.antardasha} Antardasha
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Current Period
                  </span>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed">
                  {summary.dashaActivation.timingEffect}
                </p>

                <div className="pt-2 border-t border-amber-200/60 space-y-1.5">
                  <span className="text-xs font-bold text-amber-900 block">
                    Strategic Focus for this Phase:
                  </span>
                  <ul className="space-y-1 text-xs text-stone-700">
                    {summary.dashaActivation.keyActionAreas.map((area, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: VEDIC REMEDIES & LIFESTYLE ALIGNMENT */}
          {(activeSection === 'all' || activeSection === 'remedies') && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <h4 className="text-sm font-bold text-stone-900 font-vedic uppercase tracking-wider">
                  Prescribed Vedic Remedies &amp; Alignments
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {summary.vedicRemedies.map((rem, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                      {rem.category}
                    </span>
                    <p className="text-xs font-medium text-stone-800">
                      {rem.remedy}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Purpose: {rem.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
