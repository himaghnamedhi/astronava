export type NumerologySystem = 'chaldean' | 'pythagorean';

export type HarmonyVerdict = 'mitra' | 'sama' | 'shatru';

export interface MulankInfo {
  number: number;
  planet: string;
  sanskritPlanet: string;
  element: string;
  deity: string;
  title: string;
  tagline: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careerSuggestions: string[];
  luckyDays: string[];
  luckyColors: string[];
  luckyDates: number[];
  luckyGems: string[];
  luckyDirection: string;
  mantra: string;
  friendlyNumbers: number[];
  neutralNumbers: number[];
  enemyNumbers: number[];
}

export interface BhagyankInfo {
  number: number;
  planet: string;
  sanskritPlanet: string;
  destinyRole: string;
  lifePathDescription: string;
  karmicLessons: string[];
  matureYears: string;
  bestDirections: string[];
  spiritualAdvice: string;
}

export interface DriverConductorSynergy {
  mulank: number;
  bhagyank: number;
  relationship: HarmonyVerdict;
  relationshipLabel: string;
  sanskritTerm: string;
  compatibilityScore: number; // 0 - 100%
  analysis: string;
  guidance: string;
}

export interface LetterBreakdown {
  letter: string;
  value: number;
  isVowel: boolean;
}

export interface NameAnalysisResult {
  rawName: string;
  system: NumerologySystem;
  letters: LetterBreakdown[];
  words: {
    word: string;
    compound: number;
    root: number;
    letters: LetterBreakdown[];
  }[];
  compoundNumber: number;
  rootNumber: number;
  compoundMeaning: string;
  soulUrgeCompound: number;
  soulUrgeRoot: number;
  soulUrgeDescription: string;
  personalityCompound: number;
  personalityRoot: number;
  personalityDescription: string;
  harmonyWithMulank: HarmonyVerdict;
  harmonyWithBhagyank: HarmonyVerdict;
  overallNameVerdict: 'Highly Auspicious' | 'Favorable' | 'Neutral' | 'Challenging / Needs Tuning';
  nameAdvice: string;
}

export interface NameTuningSuggestion {
  suggestedName: string;
  adjustmentDescription: string;
  letterAdded: string;
  compoundNumber: number;
  rootNumber: number;
  rulingPlanet: string;
  compoundMeaning: string;
  verdict: 'Highly Auspicious' | 'Favorable' | 'Neutral';
  harmonyWithMulank: HarmonyVerdict;
  harmonyWithBhagyank: HarmonyVerdict;
}

export interface LoShuPlane {
  name: string;
  planeType: 'mental' | 'emotional' | 'practical' | 'thought' | 'will' | 'action' | 'golden' | 'silver';
  title: string;
  numbers: number[];
  presentCount: number;
  isComplete: boolean;
  significance: string;
}

export interface MissingNumberRemedy {
  number: number;
  planet: string;
  sanskritName: string;
  defectSignificance: string;
  vedicRemedy: string;
  gemstone: string;
  rudraksha: string;
  colorRemedy: string;
  mantra: string;
}

export interface NumberRepetitionInfo {
  number: number;
  count: number;
  meaning: string;
}

export interface LoShuGridResult {
  grid: Record<number, number>; // counts of 1 through 9
  allDigitsFound: number[];
  completedPlanes: LoShuPlane[];
  incompletePlanes: LoShuPlane[];
  missingNumbers: MissingNumberRemedy[];
  repetitionAnalysis: NumberRepetitionInfo[];
}

export interface PersonalYearResult {
  year: number;
  personalYearNumber: number;
  rulingPlanet: string;
  theme: string;
  summary: string;
  keyOpportunities: string[];
  precautions: string[];
  months: {
    monthNumber: number;
    monthName: string;
    personalMonthNumber: number;
    theme: string;
  }[];
}

export interface VehicleOrPhoneAnalysis {
  input: string;
  type: 'mobile' | 'vehicle' | 'custom';
  digits: number[];
  compoundSum: number;
  rootNumber: number;
  rulingPlanet: string;
  harmonyWithMulank: HarmonyVerdict;
  harmonyWithBhagyank: HarmonyVerdict;
  suitabilityScore: number;
  verdict: string;
  recommendation: string;
}
