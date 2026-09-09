import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Hash,
  Compass,
  Calendar,
  User,
  Shield,
  Gem,
  Award,
  BookOpen,
  HelpCircle,
  Smartphone,
  Car,
  RotateCcw,
  Printer,
  Copy,
  Check,
  ChevronRight,
  Flame,
  Sun,
  Moon,
  Zap,
  Heart,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import {
  calculateMulank,
  calculateBhagyank,
  evaluateDriverConductor,
  calculateNameNumerology,
  generateNameTuningSuggestions,
  buildLoShuGrid,
  calculatePersonalYear,
  evaluateVehicleOrMobile,
} from '../utils/numerologyCalculator';
import {
  MULANK_DETAILS,
  BHAGYANK_DETAILS,
  COMPOUND_NUMBER_MEANINGS,
} from '../data/numerologyData';
import { NumerologySystem } from '../types/numerology';

interface NumerologyCalculatorProps {
  initialName?: string;
  initialDob?: { day: number; month: number; year: number };
}

export const NumerologyCalculator: React.FC<NumerologyCalculatorProps> = ({
  initialName = '',
  initialDob = { day: 17, month: 9, year: 1950 },
}) => {
  // User Input States
  const [name, setName] = useState(initialName);
  const [day, setDay] = useState<number>(initialDob.day);
  const [month, setMonth] = useState<number>(initialDob.month);
  const [year, setYear] = useState<number>(initialDob.year || 1950);

  // Sync state if initialDob changes from parent (e.g. Kundli profile loaded)
  useEffect(() => {
    if (initialDob) {
      if (initialDob.day) setDay(initialDob.day);
      if (initialDob.month) setMonth(initialDob.month);
      if (initialDob.year) setYear(initialDob.year);
    }
  }, [initialDob.day, initialDob.month, initialDob.year]);

  const [system, setSystem] = useState<NumerologySystem>('chaldean');
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear());

  // Dynamic days in selected month & year (e.g. Sept has 30 days, Feb has 28/29)
  const daysInCurrentMonth = useMemo(() => {
    return new Date(year, month, 0).getDate();
  }, [year, month]);

  // Adjust day if month length is less than current day selection
  useEffect(() => {
    if (day > daysInCurrentMonth) {
      setDay(daysInCurrentMonth);
    }
  }, [daysInCurrentMonth, day]);

  // Comprehensive Year Options for dropdown (descending from 2030 down to 1870)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const maxYear = Math.max(currentYear + 4, year);
    const minYear = Math.min(1870, year);
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [year]);

  // Sub-Navigation Tabs
  const [activeSection, setActiveSection] = useState<
    'overview' | 'name' | 'loshu' | 'year' | 'tools'
  >('overview');

  // Name Spelling Sandbox State
  const [sandboxSpelling, setSandboxSpelling] = useState(name);

  // Phone / Vehicle Analyzer State
  const [testMobile, setTestMobile] = useState('9876543210');
  const [testVehicle, setTestVehicle] = useState('DL01AB1234');

  const [copied, setCopied] = useState(false);

  // Sync sandbox with name when name changes
  const handleNameChange = (val: string) => {
    setName(val);
    setSandboxSpelling(val);
  };

  // Preset Famous Profiles for 1-Click Exploration (Curated, balanced)
  const PRESET_PROFILES = [
    { label: 'APJ Abdul Kalam', name: 'APJ Abdul Kalam', day: 15, month: 10, year: 1931 },
    { label: 'Steve Jobs', name: 'Steve Jobs', day: 24, month: 2, year: 1955 },
    { label: 'Albert Einstein', name: 'Albert Einstein', day: 14, month: 3, year: 1879 },
    { label: 'Narendra Modi', name: 'Narendra Modi', day: 17, month: 9, year: 1950 },
  ];

  const applyPreset = (p: typeof PRESET_PROFILES[0]) => {
    setName(p.name);
    setSandboxSpelling(p.name);
    setDay(p.day);
    setMonth(p.month);
    setYear(p.year);
  };

  // Calculations
  const mulank = useMemo(() => calculateMulank(day), [day]);
  const bhagyank = useMemo(() => calculateBhagyank(day, month, year), [day, month, year]);
  const driverConductor = useMemo(
    () => evaluateDriverConductor(mulank, bhagyank),
    [mulank, bhagyank]
  );

  const mulankData = useMemo(() => MULANK_DETAILS[mulank] || MULANK_DETAILS[1], [mulank]);
  const bhagyankData = useMemo(() => BHAGYANK_DETAILS[bhagyank] || BHAGYANK_DETAILS[1], [bhagyank]);

  const nameAnalysis = useMemo(
    () => calculateNameNumerology(name, system, mulank, bhagyank),
    [name, system, mulank, bhagyank]
  );

  const nameTuningSuggestions = useMemo(
    () => generateNameTuningSuggestions(name, system, mulank, bhagyank),
    [name, system, mulank, bhagyank]
  );

  const sandboxAnalysis = useMemo(
    () => calculateNameNumerology(sandboxSpelling, system, mulank, bhagyank),
    [sandboxSpelling, system, mulank, bhagyank]
  );

  const loShuData = useMemo(
    () => buildLoShuGrid({ day, month, year }, mulank, bhagyank),
    [day, month, year, mulank, bhagyank]
  );

  const personalYearData = useMemo(
    () => calculatePersonalYear(day, month, targetYear),
    [day, month, targetYear]
  );

  const mobileAnalysis = useMemo(
    () => evaluateVehicleOrMobile(testMobile, 'mobile', mulank, bhagyank),
    [testMobile, mulank, bhagyank]
  );

  const vehicleAnalysis = useMemo(
    () => evaluateVehicleOrMobile(testVehicle, 'vehicle', mulank, bhagyank),
    [testVehicle, mulank, bhagyank]
  );

  const handleCopySummary = () => {
    const text = `ASTRONAVA VEDIC NUMEROLOGY REPORT
Native: ${name}
Date of Birth: ${day}/${month}/${year}
Mulank (Driver Number): ${mulank} (${mulankData.sanskritPlanet})
Bhagyank (Conductor Number): ${bhagyank} (${bhagyankData.sanskritPlanet})
Synergy: ${driverConductor.relationshipLabel} (${driverConductor.compatibilityScore}%)
Name Number (${system.toUpperCase()}): Compound ${nameAnalysis.compoundNumber} -> Root ${nameAnalysis.rootNumber}
Name Verdict: ${nameAnalysis.overallNameVerdict}
Personal Year ${targetYear}: ${personalYearData.personalYearNumber} (${personalYearData.theme})
Calculated via Astronava (astronava.vercel.app)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* 1. Unified Numerology Command & Input Card */}
      <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs space-y-4 sm:space-y-5 print:p-4 print:border-amber-900/40">
        {/* Header Row: Title, Subtitle, Quick Actions & Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                Ank Jyotish
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-vedic text-stone-900 tracking-tight mt-1">
              Numerology Calculator
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2 print:hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {PRESET_PROFILES.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="px-2 sm:px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100/70 hover:text-amber-950 text-stone-700 text-xs font-medium border border-stone-200/80 transition-colors shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopySummary}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 border border-stone-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Full Name */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-800" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter full name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 text-sm font-medium text-stone-900 transition-colors"
            />
          </div>

          {/* Date of Birth Picker */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-800" />
                <span>Date of Birth</span>
              </span>
              <span className="text-[10px] text-stone-400 font-mono font-normal">Date / Month / Year</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Date */}
              <select
                id="select-birth-date"
                aria-label="Birth Date"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-2.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/40 text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
              >
                {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* Month */}
              <select
                id="select-birth-month"
                aria-label="Birth Month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-2.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/40 text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
              >
                {[
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                ].map((mStr, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {mStr}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                id="select-birth-year"
                aria-label="Birth Year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-2.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/40 text-sm font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer font-mono"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* System Toggle */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
              <span>Cipher System</span>
              <span className="text-[10px] text-amber-700 font-bold uppercase">
                {system === 'chaldean' ? 'Vedic' : 'Modern'}
              </span>
            </label>
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSystem('chaldean')}
                className={`py-2 rounded-lg transition-all text-center ${
                  system === 'chaldean'
                    ? 'bg-amber-900 text-amber-50 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Chaldean
              </button>
              <button
                type="button"
                onClick={() => setSystem('pythagorean')}
                className={`py-2 rounded-lg transition-all text-center ${
                  system === 'pythagorean'
                    ? 'bg-amber-900 text-amber-50 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Pythagorean
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-stone-100/80 rounded-2xl border border-stone-200 no-scrollbar print:hidden">
        {[
          { id: 'overview', label: 'Core Mulank & Bhagyank', icon: Sun },
          { id: 'name', label: 'Name Numerology & Correction', icon: User },
          { id: 'loshu', label: 'Lo Shu Grid & Remedies', icon: Hash },
          { id: 'year', label: 'Personal Year Predictions', icon: Calendar },
          { id: 'tools', label: 'Mobile & Vehicle Harmonizer', icon: Smartphone },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-amber-900 text-amber-50 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CORE OVERVIEW (MULANK & BHAGYANK & SYNERGY)                     */}
      {/* ========================================================================= */}
      {(activeSection === 'overview' || typeof window === 'undefined') && (
        <div className="space-y-5 sm:space-y-8">
          {/* 17 September Easter Egg Card */}
          {day === 17 && month === 9 && (
            <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-100/90 via-amber-50 to-stone-50 border border-amber-300 shadow-2xs flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-900 text-amber-100 flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide text-amber-900">
                    Easter Egg: 17 September
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-bold">
                    Mulank 8 (Saturn)
                  </span>
                </div>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  Coincides with <strong>Vishwakarma Jayanti</strong> &amp; the birth date of Narendra Modi (Mulank 8, Saturn) — archetype of monumental perseverance, karmic discipline, and builder vibration.
                </p>
              </div>
            </div>
          )}

          {/* Top 2 Primary Cards: Mulank & Bhagyank */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Card A: Mulank (Driver Number) */}
            <div className="bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-amber-200 shadow-xs space-y-4 sm:space-y-5 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300/60 inline-block">
                    Driver / Root • मूलांक
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold font-vedic text-stone-900 mt-1.5 truncate">
                    {mulankData.title}
                  </h2>
                  <p className="text-xs text-amber-900 font-medium mt-0.5">
                    Ruled by <strong>{mulankData.sanskritPlanet}</strong> ({mulankData.planet})
                  </p>
                </div>

                {/* Big Number Visual */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-radial from-amber-400 to-amber-600 flex flex-col items-center justify-center text-amber-950 font-vedic shadow-md ring-2 sm:ring-4 ring-amber-300/40 shrink-0">
                  <span className="text-2xl sm:text-4xl font-extrabold leading-none">{mulank}</span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider mt-0.5">Mulank</span>
                </div>
              </div>

              {/* Mathematical Formula Pill */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-amber-100/60 border border-amber-300/50 text-xs text-stone-800 flex flex-wrap items-center justify-between gap-1">
                <span>
                  Calculation: Day of Birth <strong>{day}</strong>
                </span>
                <span className="font-mono font-bold text-amber-950">
                  {day > 9 ? `${Math.floor(day / 10)} + ${day % 10} = ${mulank}` : `${day}`}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {mulankData.description}
              </p>

              {/* Key Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/90 border border-emerald-200/80 text-xs space-y-1">
                  <span className="font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Key Strengths
                  </span>
                  <ul className="text-stone-600 space-y-0.5 pl-4 list-disc">
                    {mulankData.strengths.slice(0, 3).map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-white/90 border border-rose-200/80 text-xs space-y-1">
                  <span className="font-bold text-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    Karmic Caution
                  </span>
                  <ul className="text-stone-600 space-y-0.5 pl-4 list-disc">
                    {mulankData.weaknesses.slice(0, 3).map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sacred Beej Mantra */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-amber-950 text-amber-100 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  Sacred Vedic Beej Mantra
                </span>
                <p className="font-serif italic font-semibold text-amber-50">
                  {mulankData.mantra}
                </p>
              </div>
            </div>

            {/* Card B: Bhagyank (Conductor Number) */}
            <div className="bg-gradient-to-br from-orange-50/90 via-white to-amber-50/50 p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-orange-200 shadow-xs space-y-4 sm:space-y-5 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-orange-800 bg-orange-100/80 px-2 py-0.5 rounded-md border border-orange-300/60 inline-block">
                    Conductor / Destiny • भाग्यांक
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold font-vedic text-stone-900 mt-1.5 truncate">
                    {bhagyankData.destinyRole}
                  </h2>
                  <p className="text-xs text-orange-900 font-medium mt-0.5">
                    Ruled by <strong>{bhagyankData.sanskritPlanet}</strong> ({bhagyankData.planet})
                  </p>
                </div>

                {/* Big Number Visual */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-radial from-orange-500 to-amber-700 flex flex-col items-center justify-center text-orange-50 font-vedic shadow-md ring-2 sm:ring-4 ring-orange-300/40 shrink-0">
                  <span className="text-2xl sm:text-4xl font-extrabold leading-none">{bhagyank}</span>
                  <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider mt-0.5">Bhagyank</span>
                </div>
              </div>

              {/* Mathematical Formula Pill */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-orange-100/60 border border-orange-300/50 text-xs text-stone-800 flex flex-wrap items-center justify-between gap-1">
                <span>
                  Calculation: ({day} + {month} + {year})
                </span>
                <span className="font-mono font-bold text-orange-950">
                  Digital Root = {bhagyank}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {bhagyankData.lifePathDescription}
              </p>

              {/* Karmic Lessons */}
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-white/90 border border-amber-200/80 text-xs space-y-1">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  Karmic Evolution Lessons
                </span>
                <ul className="text-stone-600 space-y-0.5 pl-4 list-disc">
                  {bhagyankData.karmicLessons.map((lesson, idx) => (
                    <li key={idx}>{lesson}</li>
                  ))}
                </ul>
              </div>

              {/* Mature Fruit & Spiritual Advice */}
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-900 text-stone-200 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  Maturity Cycle &amp; Spiritual Counsel
                </span>
                <p className="text-stone-300 leading-relaxed">
                  {bhagyankData.matureYears} {bhagyankData.spiritualAdvice}
                </p>
              </div>
            </div>
          </div>

          {/* Driver-Conductor Synergy Section */}
          <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-stone-100">
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                  Driver-Conductor Harmony
                </span>
                <h3 className="text-base sm:text-lg font-bold font-vedic text-stone-900 truncate">
                  {driverConductor.relationshipLabel} ({driverConductor.sanskritTerm})
                </h3>
              </div>

              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-amber-50 border border-amber-300/80 flex flex-col items-center justify-center font-bold text-amber-900 shadow-2xs shrink-0">
                <span className="text-base sm:text-lg font-extrabold leading-none">{driverConductor.compatibilityScore}%</span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-amber-800/80 mt-0.5">Synergy</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {driverConductor.analysis}
            </p>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-1">
              <strong className="font-bold flex items-center gap-1.5 text-amber-900">
                <Compass className="w-4 h-4 text-amber-700 shrink-0" />
                Vedic Synthesis &amp; Action Plan
              </strong>
              <p className="leading-relaxed text-stone-700">{driverConductor.guidance}</p>
            </div>
          </div>

          {/* Auspicious Vedic Factors Table */}
          <div className="bg-white p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-xs space-y-4 sm:space-y-5">
            <h3 className="text-sm sm:text-base font-bold font-vedic text-stone-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Auspicious Vedic Correspondences</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 text-xs">
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-0.5 sm:space-y-1">
                <span className="text-[11px] text-stone-500 font-medium block">Lucky Days</span>
                <span className="font-bold text-stone-900 block truncate">
                  {mulankData.luckyDays.join(', ')}
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-0.5 sm:space-y-1">
                <span className="text-[11px] text-stone-500 font-medium block">Lucky Dates</span>
                <span className="font-bold text-amber-900 block truncate">
                  {mulankData.luckyDates.join(', ')}
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-0.5 sm:space-y-1">
                <span className="text-[11px] text-stone-500 font-medium block">Auspicious Colors</span>
                <span className="font-bold text-stone-900 block truncate">
                  {mulankData.luckyColors.slice(0, 2).join(', ')}
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-0.5 sm:space-y-1">
                <span className="text-[11px] text-stone-500 font-medium block">Prescribed Gem</span>
                <span className="font-bold text-amber-950 block truncate">
                  {mulankData.luckyGems[0]}
                </span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-0.5 sm:space-y-1">
                <span className="text-[11px] text-stone-500 font-medium block">Deity / Force</span>
                <span className="font-bold text-stone-900 block truncate">{mulankData.deity}</span>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-0.5 sm:space-y-1">
                <span className="text-[11px] text-stone-500 font-medium block">Direction</span>
                <span className="font-bold text-stone-900 block truncate">
                  {mulankData.luckyDirection}
                </span>
              </div>
            </div>

            {/* Friendship Matrix Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 text-xs">
              <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1 text-emerald-900">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Friendly (Mitra)
                </span>
                <p className="font-mono font-bold text-base text-emerald-800">
                  {mulankData.friendlyNumbers.join(', ')}
                </p>
                <p className="text-[11px] text-emerald-700 leading-tight">Best for business partners, spouses, key ventures.</p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-stone-100/70 border border-stone-200 text-stone-800 space-y-1">
                <span className="font-bold text-stone-900">Neutral (Sama)</span>
                <p className="font-mono font-bold text-base text-stone-700">
                  {mulankData.neutralNumbers.join(', ')}
                </p>
                <p className="text-[11px] text-stone-500 leading-tight">Steady, transactional relationships without friction.</p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 space-y-1">
                <span className="font-bold flex items-center gap-1 text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  Enemy (Shatru)
                </span>
                <p className="font-mono font-bold text-base text-rose-800">
                  {mulankData.enemyNumbers.join(', ')}
                </p>
                <p className="text-[11px] text-rose-700 leading-tight">Avoid setting major contracts or deals on these dates.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: NAME NUMEROLOGY & CORRECTION SANDBOX                            */}
      {/* ========================================================================= */}
      {activeSection === 'name' && (
        <div className="space-y-8">
          {/* Main Name Result Overview */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                  {system.toUpperCase()} Name Analysis
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-vedic text-stone-900 mt-1">
                  {nameAnalysis.rawName || 'Name Analysis'}
                </h2>
                <p className="text-xs text-stone-500">
                  Evaluated using {system === 'chaldean' ? 'Ancient Chaldean' : 'Modern Pythagorean'} vibration cipher
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 ${
                  nameAnalysis.overallNameVerdict === 'Highly Auspicious'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : nameAnalysis.overallNameVerdict === 'Challenging / Needs Tuning'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-stone-100 text-stone-800 border border-stone-300'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{nameAnalysis.overallNameVerdict}</span>
              </div>
            </div>

            {/* Three Pillar Numbers: Compound & Root, Soul Urge, Personality */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Box 1: Compound & Root */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Total Name Vibration
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-vedic text-stone-900">
                    {nameAnalysis.compoundNumber}
                  </span>
                  <span className="text-sm font-semibold text-amber-800">
                    &rarr; Root {nameAnalysis.rootNumber}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {nameAnalysis.compoundMeaning}
                </p>
              </div>

              {/* Box 2: Soul Urge (Vowels) */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Soul Urge / Atmakaraka (Vowels)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-vedic text-stone-900">
                    {nameAnalysis.soulUrgeCompound}
                  </span>
                  <span className="text-sm font-semibold text-stone-600">
                    &rarr; Root {nameAnalysis.soulUrgeRoot}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {nameAnalysis.soulUrgeDescription}
                </p>
              </div>

              {/* Box 3: Personality (Consonants) */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Personality / Outer Mask (Consonants)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-vedic text-stone-900">
                    {nameAnalysis.personalityCompound}
                  </span>
                  <span className="text-sm font-semibold text-stone-600">
                    &rarr; Root {nameAnalysis.personalityRoot}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {nameAnalysis.personalityDescription}
                </p>
              </div>
            </div>

            {/* Letter-by-Letter Breakdown Table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Letter-by-Letter Calculation Matrix ({system.toUpperCase()})
              </h4>
              <div className="flex flex-wrap gap-4">
                {nameAnalysis.words.map((w, wIdx) => (
                  <div
                    key={wIdx}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-stone-200/70 gap-4">
                      <span className="font-bold text-stone-900 font-vedic text-sm">
                        {w.word}
                      </span>
                      <span className="font-mono text-amber-900 font-bold">
                        Compound: {w.compound} &rarr; Root {w.root}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {w.letters.map((l, lIdx) => (
                        <div
                          key={lIdx}
                          className={`w-8 h-10 rounded-lg flex flex-col items-center justify-center border text-xs ${
                            l.isVowel
                              ? 'bg-amber-100/70 border-amber-300 text-amber-950 font-bold'
                              : 'bg-white border-stone-200 text-stone-800 font-medium'
                          }`}
                        >
                          <span className="text-[11px] leading-tight">{l.letter}</span>
                          <span className="text-[10px] font-mono text-stone-500">
                            {l.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-stone-500 italic">
                * Highlighted golden tiles represent vowels contributing to the Soul Urge number.
              </p>
            </div>

            {/* Name Harmony Synthesis & Remedial Advice */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-700" />
                Vedic Name Resonance with Mulank &amp; Bhagyank
              </span>
              <p className="text-stone-700 leading-relaxed">{nameAnalysis.nameAdvice}</p>
            </div>
          </div>

          {/* Targeted Name Tuning Suggestions */}
          {name.trim() && (
            <div className="bg-gradient-to-br from-amber-50/90 via-amber-100/30 to-stone-50 p-6 sm:p-7 rounded-3xl border-2 border-amber-300 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-amber-200 text-amber-900">
                      <Lightbulb className="w-4 h-4 text-amber-800" />
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                      Vedic Name Tuning Suggestions
                    </span>
                    {nameAnalysis.overallNameVerdict === 'Challenging / Needs Tuning' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                        Tuning Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-vedic text-stone-900">
                    {nameAnalysis.overallNameVerdict === 'Challenging / Needs Tuning'
                      ? 'Recommended Spelling Adjustments to Neutralize Friction'
                      : 'Harmonious Royal Spelling Variations'}
                  </h3>
                </div>
                <div className="text-xs text-stone-600 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200 shrink-0">
                  Current: <strong className="text-stone-900">Compound {nameAnalysis.compoundNumber}</strong> &rarr; Root {nameAnalysis.rootNumber}
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">
                {nameAnalysis.overallNameVerdict === 'Challenging / Needs Tuning'
                  ? `Your current spelling creates an inimical (Shatru) compound vibration (${nameAnalysis.compoundNumber} -> Root ${nameAnalysis.rootNumber}), creating avoidable friction with your Mulank ${mulank} or Bhagyank ${bhagyank}. In Vedic and Chaldean numerology, subtle letter alterations (adding a soft vowel, consonant, or middle initial) shift the total compound to an auspicious Royal frequency without altering your legal persona:`
                  : `Enhance your name vibration to an ultra-auspicious royal compound (e.g. 14, 15, 19, 21, 23, 24, 32, 33, 37, 41, 42) that resonates positively with both your Driver (${mulank}) and Conductor (${bhagyank}):`}
              </p>

              {nameTuningSuggestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {nameTuningSuggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-2xs hover:border-amber-400 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-extrabold font-vedic text-stone-900">
                              {sug.suggestedName}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                              {sug.verdict}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-amber-800 flex items-center gap-1 mt-0.5">
                            <ArrowRight className="w-3 h-3 text-amber-600" />
                            {sug.adjustmentDescription} ({sug.letterAdded})
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Comp: {sug.compoundNumber} &rarr; {sug.rootNumber}
                          </span>
                          <p className="text-[10px] text-stone-500 mt-0.5">{sug.rulingPlanet}</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-600 leading-relaxed border-t border-stone-100 pt-2">
                        {sug.compoundMeaning}
                      </p>

                      <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => setSandboxSpelling(sug.suggestedName)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <Sliders className="w-3 h-3 text-stone-500" />
                          <span>Try in Sandbox</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setName(sug.suggestedName);
                            setSandboxSpelling(sug.suggestedName);
                          }}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3 h-3 text-amber-200" />
                          <span>Apply Spelling</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs text-stone-600">
                  Your current spelling already produces an auspicious frequency! Use the Sandbox below if you wish to experiment with brand names or nicknames.
                </div>
              )}

              <div className="p-3 rounded-xl bg-amber-100/60 border border-amber-200/80 text-[11px] text-stone-700 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <p>
                  <strong>Practical Vedic Protocol:</strong> You do not need to legally change official passports or land deeds. Numerological activation is triggered by active daily usage: signatures, business cards, email sign-offs, and social profiles.
                </p>
              </div>
            </div>
          )}

          {/* Interactive Name Spelling Tuning / Correction Sandbox */}
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-stone-50 p-6 sm:p-7 rounded-3xl border border-amber-300 shadow-xs space-y-5">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                Interactive Name Spelling Correction Tool
              </span>
              <h3 className="text-lg font-bold font-vedic text-stone-900">
                Tune Your Name Spelling for Maximum Fortune
              </h3>
              <p className="text-xs text-stone-600">
                In classical Chaldean numerology, adding an extra vowel or consonant (e.g. adding{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200">A</code> or{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200">I</code>) adjusts the compound number to an auspicious royal vibration (like 14, 15, 19, 23, 24, 32, 33, 37, 41, 42). Test spellings in real time below:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-8">
                <input
                  type="text"
                  value={sandboxSpelling}
                  onChange={(e) => setSandboxSpelling(e.target.value)}
                  placeholder="Try alternative spelling..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-amber-400 bg-white focus:outline-none focus:ring-4 focus:ring-amber-400/30 text-base font-bold text-stone-900 shadow-inner"
                />
              </div>
              <div className="sm:col-span-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSandboxSpelling(name)}
                  className="px-3.5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={() => setName(sandboxSpelling)}
                  className="px-4 py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 text-xs font-semibold flex items-center gap-1 transition-all shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Adopt Spelling</span>
                </button>
              </div>
            </div>

            {/* Sandbox Live Evaluation */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-stone-500 font-medium">Evaluated Vibration:</span>
                <p className="text-sm font-bold text-stone-900">
                  Compound <strong>{sandboxAnalysis.compoundNumber}</strong> &rarr; Root{' '}
                  <strong>{sandboxAnalysis.rootNumber}</strong> ({MULANK_DETAILS[sandboxAnalysis.rootNumber]?.planet})
                </p>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  {COMPOUND_NUMBER_MEANINGS[sandboxAnalysis.compoundNumber]?.title || 'Compound'} •{' '}
                  {COMPOUND_NUMBER_MEANINGS[sandboxAnalysis.compoundNumber]?.meaning}
                </p>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 self-start sm:self-center ${
                  sandboxAnalysis.overallNameVerdict === 'Highly Auspicious'
                    ? 'bg-emerald-100 text-emerald-900'
                    : sandboxAnalysis.overallNameVerdict === 'Challenging / Needs Tuning'
                    ? 'bg-rose-100 text-rose-900'
                    : 'bg-stone-100 text-stone-800'
                }`}
              >
                {sandboxAnalysis.overallNameVerdict}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: LO SHU GRID (3x3 MAGIC SQUARE) & REMEDIES                      */}
      {/* ========================================================================= */}
      {activeSection === 'loshu' && (
        <div className="space-y-8">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                Classical Lo Shu 3x3 Magic Square
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-vedic text-stone-900 mt-1">
                Your Birth Date Lo Shu Grid &amp; Elemental Planes
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed mt-1">
                In Vedic and ancient Chinese numerology, the 3x3 magic square reveals the distribution of planetary elements (Fire, Water, Wood, Metal, Earth) across your consciousness. Every row, column, and diagonal constitutes a specialized plane of destiny.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: The 3x3 Lo Shu Visual Grid */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-[320px] aspect-square p-2 rounded-3xl bg-amber-950/95 shadow-xl border-4 border-amber-500/60 grid grid-cols-3 grid-rows-3 gap-2">
                  {[
                    // Row 1: 4, 9, 2 (Mental Plane)
                    { num: 4, label: 'Rahu (4)' },
                    { num: 9, label: 'Mars (9)' },
                    { num: 2, label: 'Moon (2)' },
                    // Row 2: 3, 5, 7 (Emotional Plane)
                    { num: 3, label: 'Jupiter (3)' },
                    { num: 5, label: 'Mercury (5)' },
                    { num: 7, label: 'Ketu (7)' },
                    // Row 3: 8, 1, 6 (Practical Plane)
                    { num: 8, label: 'Saturn (8)' },
                    { num: 1, label: 'Sun (1)' },
                    { num: 6, label: 'Venus (6)' },
                  ].map((cell) => {
                    const count = loShuData.grid[cell.num] || 0;
                    const isPresent = count > 0;
                    return (
                      <div
                        key={cell.num}
                        className={`rounded-2xl flex flex-col items-center justify-center p-2 transition-all border ${
                          isPresent
                            ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-stone-950 font-bold border-amber-300 shadow-md ring-2 ring-amber-200/40 scale-[1.02]'
                            : 'bg-stone-900/90 text-stone-500 border-stone-800'
                        }`}
                      >
                        <span className="text-xl sm:text-2xl font-extrabold font-vedic leading-none">
                          {isPresent ? cell.num.toString().repeat(count) : '-'}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-1">
                          {cell.label}
                        </span>
                        <span className="text-[8px] opacity-70">
                          {isPresent ? `${count}x present` : 'Missing'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 text-center text-xs text-stone-500 space-y-1">
                  <p className="font-semibold text-stone-700">Grid includes Date of Birth digits + Mulank ({mulank}) + Bhagyank ({bhagyank})</p>
                  <p className="text-[11px]">Golden tiles indicate energized planetary powers.</p>
                </div>
              </div>

              {/* Right Column: 8 Planes Analysis */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-sm font-bold font-vedic text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  The 8 Arrows of Strength &amp; Planes Analysis
                </h3>

                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {loShuData.completedPlanes.map((plane, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-950 font-vedic text-sm">
                          {plane.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-bold text-[10px] uppercase">
                          Complete Plane
                        </span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">{plane.significance}</p>
                    </div>
                  ))}

                  {loShuData.incompletePlanes.map((plane, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1 opacity-80"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-800 text-xs">
                          {plane.title}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {plane.presentCount}/{plane.numbers.length} Active
                        </span>
                      </div>
                      <p className="text-stone-500 text-[11px] leading-relaxed">
                        {plane.significance}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Repetition Insights */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Digit Repetition Nuances (Frequency Insights)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {loShuData.repetitionAnalysis.map((item) => (
                  <div
                    key={item.number}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1"
                  >
                    <span className="font-bold text-amber-900 font-vedic">
                      Digit {item.number} ({item.count}x time{item.count > 1 ? 's' : ''})
                    </span>
                    <p className="text-stone-600 text-[11px] leading-relaxed">{item.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Numbers & Vedic Remedies Table */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-5">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                Karmic Balancing
              </span>
              <h3 className="text-lg font-bold font-vedic text-stone-900">
                Missing Numbers Analysis &amp; Authentic Vedic Remedies
              </h3>
              <p className="text-xs text-stone-600">
                Missing numbers in the Lo Shu grid highlight areas where consciousness and planetary frequencies are deficient. Classical Vedic remedies (Arghya, Gemstones, Rudraksha, Mantras, and behavioral practices) neutralize these imbalances.
              </p>
            </div>

            {loShuData.missingNumbers.length === 0 ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-900 font-medium text-xs">
                All 9 planetary digits are active in your grid! You possess a naturally balanced elemental blueprint.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {loShuData.missingNumbers.map((rem) => (
                  <div
                    key={rem.number}
                    className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <div>
                        <span className="font-bold text-amber-950 font-vedic text-sm">
                          Missing Digit {rem.number} • {rem.sanskritName} ({rem.planet})
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px] uppercase">
                        Deficient Element
                      </span>
                    </div>

                    <p className="text-stone-600 leading-relaxed">
                      <strong>Imbalance:</strong> {rem.defectSignificance}
                    </p>

                    <div className="space-y-1.5 text-[11px]">
                      <p className="text-stone-800">
                        <strong className="text-amber-900">Vedic Ritual Remedy:</strong> {rem.vedicRemedy}
                      </p>
                      <p className="text-stone-800">
                        <strong className="text-amber-900">Gemstone / Crystal:</strong> {rem.gemstone}
                      </p>
                      <p className="text-stone-800">
                        <strong className="text-amber-900">Rudraksha:</strong> {rem.rudraksha}
                      </p>
                      <p className="text-stone-800">
                        <strong className="text-amber-900">Color Healing:</strong> {rem.colorRemedy}
                      </p>
                      <p className="text-stone-800 font-mono italic text-[10.5px]">
                        <strong className="text-amber-900 font-sans not-italic">Mantra:</strong> {rem.mantra}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: PERSONAL YEAR (VARSHEESH) PREDICTIONS                           */}
      {/* ========================================================================= */}
      {activeSection === 'year' && (
        <div className="space-y-8">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                  Varsheesh Cycle (वर्षेश)
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-vedic text-stone-900 mt-1">
                  Personal Year {targetYear} Predictions
                </h2>
                <p className="text-xs text-stone-500">
                  Calculation: Day ({day}) + Month ({month}) + Calendar Year ({targetYear}) &rarr; Personal Year {personalYearData.personalYearNumber}
                </p>
              </div>

              {/* Year Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-stone-600">Select Year:</label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Year Headline Banner */}
            <div className="p-6 rounded-3xl bg-radial from-amber-500 to-amber-700 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
              <div className="space-y-1 text-stone-950">
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-900/80">
                  Ruling Planet: {personalYearData.rulingPlanet}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-vedic text-stone-950">
                  {personalYearData.theme}
                </h3>
                <p className="text-xs sm:text-sm text-stone-900 max-w-xl leading-relaxed mt-1">
                  {personalYearData.summary}
                </p>
              </div>

              <div className="w-20 h-20 rounded-2xl bg-amber-950 text-amber-100 flex flex-col items-center justify-center font-vedic shadow-lg shrink-0">
                <span className="text-4xl font-extrabold leading-none">
                  {personalYearData.personalYearNumber}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">Year</span>
              </div>
            </div>

            {/* Do's and Don'ts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm font-vedic">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Opportunities to Pursue
                </span>
                <ul className="space-y-1.5 pl-4 list-disc text-stone-700">
                  {personalYearData.keyOpportunities.map((opp, idx) => (
                    <li key={idx}>{opp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
                <span className="font-bold text-rose-900 flex items-center gap-1.5 text-sm font-vedic">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Key Precautions to Observe
                </span>
                <ul className="space-y-1.5 pl-4 list-disc text-stone-700">
                  {personalYearData.precautions.map((prec, idx) => (
                    <li key={idx}>{prec}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 12 Months Progression Matrix */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                12-Month Progression for Year {targetYear}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {personalYearData.months.map((m) => (
                  <div
                    key={m.monthNumber}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{m.monthName}</span>
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold font-mono text-[11px] flex items-center justify-center">
                        {m.personalMonthNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-snug">{m.theme}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: MOBILE & VEHICLE NUMBER HARMONIZER                              */}
      {/* ========================================================================= */}
      {activeSection === 'tools' && (
        <div className="space-y-8">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                Everyday Astro-Numerology
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-vedic text-stone-900 mt-1">
                Mobile &amp; Vehicle Registration Number Harmonizer
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed mt-1">
                Your mobile phone and vehicle are constant energetic companions. In Vedic numerology, when their digital vibration shares a friendly (Mitra) relationship with your Mulank and Bhagyank, they attract serendipitous phone calls, prosperous negotiations, and safe journeys.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tool 1: Mobile Number Tester */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-amber-700" />
                    <span>Test Mobile Phone Number</span>
                  </label>
                  <input
                    type="text"
                    value={testMobile}
                    onChange={(e) => setTestMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-mono text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-stone-500 block">Total Compound</span>
                      <span className="text-lg font-bold font-mono text-stone-900">
                        {mobileAnalysis.compoundSum} &rarr; Root {mobileAnalysis.rootNumber} ({mobileAnalysis.rulingPlanet})
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg font-bold text-xs ${
                        mobileAnalysis.verdict.includes('Auspicious')
                          ? 'bg-emerald-100 text-emerald-900'
                          : mobileAnalysis.verdict.includes('Conflicting')
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {mobileAnalysis.verdict}
                    </span>
                  </div>

                  <p className="text-stone-600 leading-relaxed pt-1 border-t border-stone-100">
                    {mobileAnalysis.recommendation}
                  </p>
                </div>
              </div>

              {/* Tool 2: Vehicle Registration Tester */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-amber-700" />
                    <span>Test Vehicle License Plate</span>
                  </label>
                  <input
                    type="text"
                    value={testVehicle}
                    onChange={(e) => setTestVehicle(e.target.value.toUpperCase())}
                    placeholder="e.g. DL01AB1234"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-mono text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                  />
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-stone-500 block">Total Compound</span>
                      <span className="text-lg font-bold font-mono text-stone-900">
                        {vehicleAnalysis.compoundSum} &rarr; Root {vehicleAnalysis.rootNumber} ({vehicleAnalysis.rulingPlanet})
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg font-bold text-xs ${
                        vehicleAnalysis.verdict.includes('Auspicious')
                          ? 'bg-emerald-100 text-emerald-900'
                          : vehicleAnalysis.verdict.includes('Conflicting')
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {vehicleAnalysis.verdict}
                    </span>
                  </div>

                  <p className="text-stone-600 leading-relaxed pt-1 border-t border-stone-100">
                    {vehicleAnalysis.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PRINTABLE A4 DOSSIER LAYOUT (Visible in Print Mode)                    */}
      {/* ========================================================================= */}
      <div className="hidden print:block space-y-4 text-xs text-stone-900 border-t border-stone-300 pt-6">
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
          <div className="flex items-center gap-2">
            <img src="/icons/app_logo.svg" alt="Astronava" className="w-7 h-7" />
            <span className="text-xl font-bold font-vedic text-amber-950 tracking-wider">
              ASTRONAVA • VEDIC NUMEROLOGY DOSSIER
            </span>
          </div>
          <span className="text-[10px] text-stone-500 font-mono">
            Generated on {new Date().toLocaleDateString()} • astronava.vercel.app
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-300">
          <div>
            <p><strong>Native Name:</strong> {name}</p>
            <p><strong>Date of Birth:</strong> {day}/{month}/{year}</p>
            <p><strong>Mulank (Driver):</strong> {mulank} ({mulankData.sanskritPlanet})</p>
            <p><strong>Bhagyank (Conductor):</strong> {bhagyank} ({bhagyankData.sanskritPlanet})</p>
          </div>
          <div>
            <p><strong>Driver-Conductor Harmony:</strong> {driverConductor.relationshipLabel} ({driverConductor.compatibilityScore}%)</p>
            <p><strong>Name Compound:</strong> {nameAnalysis.compoundNumber} &rarr; Root {nameAnalysis.rootNumber}</p>
            <p><strong>Name Verdict:</strong> {nameAnalysis.overallNameVerdict}</p>
            <p><strong>Personal Year ({targetYear}):</strong> {personalYearData.personalYearNumber} ({personalYearData.theme})</p>
          </div>
        </div>

        <div className="p-3 border border-stone-300 rounded-lg space-y-1">
          <h4 className="font-bold text-amber-950 font-vedic">Key Astrological Prescriptions</h4>
          <p>Lucky Days: {mulankData.luckyDays.join(', ')} • Lucky Dates: {mulankData.luckyDates.join(', ')}</p>
          <p>Lucky Gemstone: {mulankData.luckyGems.join(', ')} • Lucky Colors: {mulankData.luckyColors.join(', ')}</p>
          <p className="font-serif italic">Mantra: {mulankData.mantra}</p>
        </div>

        <div className="text-center text-[10px] text-stone-500 pt-3 border-t border-stone-200">
          © {new Date().getFullYear()} Astronava. Certified Vedic Numerology Calculations. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};
