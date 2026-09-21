import { PlanetId, HouseNumber } from './astrology';

export type DailyHoroscopeCategoryKey =
  | 'overall'
  | 'career'
  | 'finance'
  | 'business'
  | 'love'
  | 'marriage'
  | 'health'
  | 'education'
  | 'family'
  | 'children'
  | 'travel'
  | 'mentalHealth'
  | 'socialLife'
  | 'creativity'
  | 'spirituality'
  | 'luck'
  | 'energy'
  | 'communication'
  | 'decisionMaking'
  | 'investment';

export interface HoroscopeUserProfile {
  uid: string;
  name: string;
  email: string;
  dob: string; // YYYY-MM-DD
  tob: string; // HH:mm
  isTobUnknown: boolean;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  preferredLanguage?: 'en' | 'hi' | 'sa';
  notificationTime?: string; // e.g. "07:00"
  preferredNotificationTime?: string; // alias for compatibility
  notificationsEnabled?: boolean;
  notificationChannels?: ('email' | 'push' | 'sms' | 'whatsapp')[];
  consentGiven: boolean;
  consentTimestamp?: string;
  registeredAt?: string;
}

export interface CategoryScoreDetail {
  key: DailyHoroscopeCategoryKey;
  label: string;
  sanskritName: string;
  score: number; // 0 to 100
  status: 'Peak Auspicious' | 'Favorable' | 'Balanced' | 'Sensitive' | 'Challenging';
  primaryHouse: HouseNumber;
  rulingLord: string;
  influencingPlanets: string[];
  astrologicalDriver: string;
  actionableAdvice: string;
  doList: string[];
  dontList: string[];
}

export interface TransitPlanetInfo {
  planetId: PlanetId;
  name: string;
  sanskritName: string;
  natalSign: number; // 1 to 12
  natalSignName: string;
  transitSign: number; // 1 to 12
  transitSignName: string;
  houseFromLagna: HouseNumber;
  houseFromMoon: HouseNumber;
  degree: number;
  formattedDegree: string;
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: string;
  aspectingHousesFromLagna: HouseNumber[];
  savBindus: number;
}

export interface PanchangData {
  date: string;
  dayOfWeek: string;
  varaLord: string;
  varaLordSanskrit: string;
  tithi: {
    name: string;
    paksha: 'Shukla' | 'Krishna';
    number: number;
    description: string;
  };
  nakshatra: {
    name: string;
    number: number;
    pada: number;
    lord: string;
  };
  yoga: {
    name: string;
    number: number;
    nature: 'Benefic' | 'Malefic' | 'Neutral';
    significance: string;
  };
  karana: {
    name: string;
    number: number;
    type: 'Chara' | 'Sthira';
  };
  currentHora: {
    planet: string;
    sanskritName: string;
    quality: string;
    favorableFor: string;
  };
  choghadiyaWindows: {
    name: string;
    type: 'Amrit' | 'Shubh' | 'Labh' | 'Char' | 'Rog' | 'Kaal' | 'Udveg';
    timeWindow: string;
    nature: 'Auspicious' | 'Moderate' | 'Inauspicious';
    guidance: string;
  }[];
  auspiciousMuhurat: string;
}

export interface DailyHoroscopeResult {
  id: string; // ISO date string (YYYY-MM-DD)
  userId: string;
  date: string;
  userName: string;
  birthDetails: {
    dob: string;
    tob: string;
    isTobUnknown: boolean;
    birthPlace: string;
    lagnaSign: string;
    lagnaLord: string;
    moonSign: string;
    moonLord: string;
    sunSign: string;
    nakshatra: string;
    pada: number;
  };
  overallScore: number;
  summary: string;
  strongestPlanet: {
    planetId: PlanetId;
    name: string;
    sanskrit: string;
    reason: string;
    symbol: string;
  };
  biggestOpportunity: {
    domain: string;
    description: string;
    supportingPlanet: string;
  };
  biggestChallenge: {
    domain: string;
    remedy: string;
    mitigatingFactor: string;
  };
  dailyAdvice: string;
  mantra: {
    deityOrPlanet: string;
    sanskritText: string;
    phonetic: string;
    meaning: string;
    repetitions: number;
  };
  luckyNumber: number;
  luckyColor: {
    name: string;
    hex: string;
    significance: string;
  };
  luckyDirection: {
    direction: string;
    rationale: string;
    dir?: string;
    reason?: string;
  };
  luckyTime: {
    window: string;
    choghadiya: string;
    recommendation: string;
  };
  confidenceScore: {
    percentage: number;
    level: 'Very High' | 'High' | 'Moderate';
    supportingFactors: string[];
    conflictingFactors: string[];
    transparencyReasoning: string;
  };
  scores: Record<DailyHoroscopeCategoryKey, number>;
  categories: CategoryScoreDetail[];
  transitPlanets: TransitPlanetInfo[];
  activeDasha: {
    mahadasha: { planet: PlanetId; lord: string; ends: string; yearsLeft: number };
    antardasha: { planet: PlanetId; lord: string; ends: string };
    pratyantardasha: { planet: PlanetId; lord: string };
    effectOnToday: string;
  };
  panchang: PanchangData;
  activatedHouses: {
    house: HouseNumber;
    name: string;
    significance: string;
    planetsPresent: string[];
    aspectingPlanets: string[];
    overallEnergy: 'Empowered' | 'Balanced' | 'Under Stress';
  }[];
  calculatedAt: string;
  aiInterpreted: boolean;
  aiPromptVersion: string;
}

export interface HoroscopeFeedbackRecord {
  id: string;
  userId: string;
  date: string;
  rating: 1 | 2 | 3 | 4;
  accuracyVerdict: string;
  comment?: string;
  createdAt: string;
}

export interface HoroscopeSubscriptionRecord {
  id: string;
  userId: string;
  email: string;
  phoneNumber?: string;
  preferredTime: string;
  channels: ('email' | 'push' | 'sms' | 'whatsapp')[];
  active: boolean;
  consentGiven: boolean;
  createdAt: string;
}

export interface AdminDailyJobLog {
  id: string;
  date: string;
  timestamp: string;
  totalUsersChecked: number;
  processedCount: number;
  cacheHitCount: number;
  fallbackCount: number;
  errorCount: number;
  promptVersion: string;
  status: 'Completed' | 'In Progress' | 'Warning' | 'Error';
  notes: string;
}
