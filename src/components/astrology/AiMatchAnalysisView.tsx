import React, { useState } from 'react';
import { Sparkles, Heart, ShieldCheck, Flame, Award, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { VedAstroMatchReport } from '../../data/vedicMatchCalculator';
import { BirthDetails } from '../../data/vedicAstrologyCalculator';

interface AiMatchAnalysisViewProps {
  matchReport: VedAstroMatchReport;
  p1: BirthDetails;
  p2: BirthDetails;
}

interface MatchAiPayload {
  executiveSummary: string;
  synastryStrengths: {
    domain: string;
    description: string;
  }[];
  potentialChallenges: {
    domain: string;
    advice: string;
  }[];
  overallCompatibilityVerdict: string;
}

export const AiMatchAnalysisView: React.FC<AiMatchAnalysisViewProps> = ({ matchReport, p1, p2 }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MatchAiPayload | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateMatchAnalysis = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/match-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchReport, p1, p2 }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: MatchAiPayload = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error('Failed to generate AI match analysis:', err);
      setErrorMsg(err.message || 'Failed to generate AI synastry analysis. Please ensure Gemini API key is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-950 via-amber-950 to-stone-950 p-6 sm:p-8 rounded-3xl text-stone-100 shadow-xl border border-amber-800/40 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-800/40 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini Synastry &amp; Match Analysis</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-vedic text-amber-100">
            AI Relationship &amp; Compatibility Synthesis
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Compare the combined charts of {p1.name || 'Partner 1'} &amp; {p2.name || 'Partner 2'} with Guna Milan ({matchReport.totalScore}/36) for deep psychological and emotional insights.
          </p>
        </div>

        <button
          onClick={handleGenerateMatchAnalysis}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60 shrink-0"
        >
          {loading ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Analyzing Synastry...</span>
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 fill-stone-950 text-stone-950" />
              <span>{analysis ? 'Re-Analyze Match with AI' : 'Generate AI Match Insights'}</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <span>{errorMsg}</span>
        </div>
      )}

      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive Summary */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xs space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Executive Synastry Essence</span>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
              {analysis.executiveSummary}
            </p>
          </div>

          {/* Strengths & Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2 font-vedic">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Synastry Strengths</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-300">
                {analysis.synastryStrengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold mt-0.5">✦</span>
                    <div>
                      <strong className="text-emerald-200">{s.domain}:</strong> {s.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div className="bg-amber-950/30 border border-amber-500/30 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 font-vedic">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Potential Challenges &amp; Harmonization</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-300">
                {analysis.potentialChallenges.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold mt-0.5">✦</span>
                    <div>
                      <strong className="text-amber-200">{c.domain}:</strong> {c.advice}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Verdict */}
          <div className="bg-amber-500/10 border border-amber-400/30 p-4 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200 font-medium leading-relaxed">
              <strong>Compatibility Verdict:</strong> {analysis.overallCompatibilityVerdict}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
