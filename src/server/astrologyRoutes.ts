import { Router, Request, Response } from 'express';
import { generateCompleteKundli } from '../data/vedicEphemeris.ts';
import { calculateVedAstroMatch } from '../data/vedicMatchCalculator.ts';
import { generateDailyHoroscope } from '../data/horoscopeEngine.ts';
import { HoroscopeUserProfile } from '../types/horoscope.ts';
import {
  calculateVedicBirthProfile,
  POPULAR_CITIES,
  BirthDetails,
} from '../data/vedicAstrologyCalculator.ts';
import {
  NAVARATNA_DATA,
  LAGNA_RECOMMENDATIONS,
  LIFE_GOAL_PRESETS,
  checkGemstoneCompatibility,
} from '../data/gemstoneData.ts';
import {
  calculateMulank,
  calculateBhagyank,
  evaluateDriverConductor,
  calculateNameNumerology,
  generateNameTuningSuggestions,
  buildLoShuGrid,
  calculatePersonalYear,
  evaluateVehicleOrMobile,
} from '../utils/numerologyCalculator.ts';
import {
  MULANK_DETAILS,
  BHAGYANK_DETAILS,
  COMPOUND_NUMBER_MEANINGS,
} from '../data/numerologyData.ts';
import { generateKundliAiSummary, generateFullAstrologyReportWithAi } from './geminiAstrology.ts';

export const astrologyApiRouter = Router();

// -------------------------------------------------------------
// 0. API METADATA & HEALTH CHECK
// -------------------------------------------------------------
astrologyApiRouter.get('/meta', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    name: 'Astronava Vedic Astrology Engine API',
    description: 'Complete server-side REST API for Android, iOS and Web clients',
    timestamp: new Date().toISOString(),
    endpoints: [
      { path: '/api/v1/kundli/calculate', method: 'POST', description: 'Full Janam Kundli, Lagna, Planetary Dignities, Dashas & Divisional Charts' },
      { path: '/api/v1/horoscope/daily', method: 'POST', description: 'Personalized Daily Horoscope, Gochara Transits & Remedies' },
      { path: '/api/v1/gemstones/recommend', method: 'POST', description: 'Vedic Ratna (Life, Lucky, Punya Stones) and energization procedures' },
      { path: '/api/v1/match/compatibility', method: 'POST', description: 'Ashtakoota 36-Guna Kundli Milan, Manglik Dosha & Verdict' },
      { path: '/api/v1/numerology/calculate', method: 'POST', description: 'Mulank, Bhagyank, Lo Shu 3x3 Grid, Personal Year Forecast' },
      { path: '/api/v1/name-correction/tune', method: 'POST', description: 'Chaldean & Pythagorean Vedic Name Harmonization & Tuning' },
      { path: '/api/v1/ai/summary', method: 'POST', description: 'AI Executive Summary for Vedic Kundli' },
      { path: '/api/v1/ai/full-report', method: 'POST', description: 'Comprehensive AI Astrological Life Report' },
    ],
  });
});

// -------------------------------------------------------------
// 1. KUNDLI GENERATOR & CALCULATION API
// -------------------------------------------------------------
astrologyApiRouter.post('/kundli/calculate', (req: Request, res: Response) => {
  try {
    const { name, dob, tob, latitude, longitude, timezoneOffset, gender, isTobUnknown, ayanamsha } = req.body;

    if (!dob) {
      return res.status(400).json({
        error: 'Date of birth (dob) is required in YYYY-MM-DD format',
        code: 'MISSING_DOB',
      });
    }

    const birthDetails: any = {
      name: String(name || 'Seeker').trim(),
      gender: gender === 'female' ? 'female' : 'male',
      dob: String(dob).trim(),
      tob: String(tob || '12:00').trim(),
      latitude: typeof latitude === 'number' ? latitude : 28.6139,
      longitude: typeof longitude === 'number' ? longitude : 77.2090,
      timezoneOffset: typeof timezoneOffset === 'number' ? timezoneOffset : 5.5,
      isTobUnknown: Boolean(isTobUnknown),
      ayanamsha: ayanamsha || 'lahiri',
    };

    const kundli = generateCompleteKundli(birthDetails);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      birthDetails,
      data: {
        lagna: kundli.lagna,
        grahas: kundli.grahas,
        grahasList: kundli.grahasList,
        houseOccupants: kundli.houseOccupants,
        vimshottariDasha: kundli.vimshottariDasha,
        divisionalCharts: {
          d1: kundli.divisionalCharts?.D1,
          d9: kundli.divisionalCharts?.D9,
          d10: kundli.divisionalCharts?.D10,
        },
        sarvashtakavarga: kundli.sarvashtakavarga,
        yogas: kundli.yogas || [],
        doshas: kundli.doshas || {},
      },
    });
  } catch (err: any) {
    console.error('API Kundli calculation failed:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal error calculating Vedic Kundli',
    });
  }
});

// -------------------------------------------------------------
// 2. DAILY HOROSCOPE & TRANSITS API
// -------------------------------------------------------------
astrologyApiRouter.post('/horoscope/daily', (req: Request, res: Response) => {
  try {
    const { name, dob, tob, latitude, longitude, timezoneOffset, gender, targetDate, sign } = req.body;

    const date = targetDate || new Date().toISOString().split('T')[0];

    const userProfile: HoroscopeUserProfile = {
      uid: 'mobile-guest-' + Date.now(),
      name: String(name || 'Seeker').trim(),
      email: 'mobile-user@astronava.internal',
      dob: String(dob || '1995-01-01').trim(),
      tob: String(tob || '06:00').trim(),
      isTobUnknown: false,
      birthPlace: 'Local Coordinates',
      latitude: typeof latitude === 'number' ? latitude : 28.6139,
      longitude: typeof longitude === 'number' ? longitude : 77.2090,
      timezoneOffset: typeof timezoneOffset === 'number' ? timezoneOffset : 5.5,
      gender: gender === 'female' ? 'female' : 'male',
      consentGiven: true,
    };

    const result = generateDailyHoroscope(userProfile, date);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      targetDate: date,
      data: result,
    });
  } catch (err: any) {
    console.error('API Horoscope generation failed:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Error generating daily horoscope',
    });
  }
});

// -------------------------------------------------------------
// 3. VEDIC GEMSTONE RECOMMENDER API
// -------------------------------------------------------------
astrologyApiRouter.post('/gemstones/recommend', (req: Request, res: Response) => {
  try {
    const { lagnaId, dob, tob, latitude, longitude, timezoneOffset, weightKg, lifeGoal } = req.body;

    let resolvedLagnaId = typeof lagnaId === 'number' && lagnaId >= 1 && lagnaId <= 12 ? lagnaId : 1;

    // If birth details are provided instead of or in addition to lagnaId, calculate authentic Lagna
    let calculatedProfile: any = null;
    if (dob) {
      const birthDetails: BirthDetails = {
        name: 'Seeker',
        gender: 'male',
        weightKg: Number(weightKg) || 65,
        weightUnit: 'kg',
        dob: String(dob).trim(),
        tob: String(tob || '12:00').trim(),
        city: 'Coordinates',
        latitude: typeof latitude === 'number' ? latitude : 28.6139,
        longitude: typeof longitude === 'number' ? longitude : 77.2090,
        timezoneOffset: typeof timezoneOffset === 'number' ? timezoneOffset : 5.5,
      };

      try {
        calculatedProfile = calculateVedicBirthProfile(birthDetails);
        if (calculatedProfile && calculatedProfile.lagnaNumber) {
          resolvedLagnaId = calculatedProfile.lagnaNumber;
        }
      } catch (calcErr) {
        console.warn('Birth profile calculation fallback to lagnaId:', calcErr);
      }
    }

    const lagnaRec = LAGNA_RECOMMENDATIONS[resolvedLagnaId] || LAGNA_RECOMMENDATIONS[1];
    const lifeStoneInfo = NAVARATNA_DATA[lagnaRec.lifeStone.gemId];
    const luckyStoneInfo = NAVARATNA_DATA[lagnaRec.luckyStone.gemId];
    const punyaStoneInfo = NAVARATNA_DATA[lagnaRec.punyaStone.gemId];
    const yogakarakaInfo = lagnaRec.yogakarakaStone
      ? NAVARATNA_DATA[lagnaRec.yogakarakaStone.gemId]
      : null;

    // Body weight ratti calculation: 1 ratti per 10-12 kg body weight
    const userWeight = Math.max(35, Math.min(150, Number(weightKg) || 65));
    const recommendedRattiMin = Math.round((userWeight / 12) * 10) / 10;
    const recommendedRattiMax = Math.round((userWeight / 10) * 10) / 10;

    // Optional life goal preset match
    const matchedGoal = lifeGoal
      ? LIFE_GOAL_PRESETS.find(
          (g) => g.id === lifeGoal || g.title.toLowerCase().includes(String(lifeGoal).toLowerCase())
        )
      : null;

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      lagna: {
        id: lagnaRec.lagnaId,
        name: lagnaRec.lagnaName,
        sanskritName: lagnaRec.sanskritName,
        element: lagnaRec.element,
        rulingPlanet: lagnaRec.rulingPlanet,
      },
      weightCalculations: {
        weightKg: userWeight,
        recommendedRattiRange: `${recommendedRattiMin} - ${recommendedRattiMax} Ratti`,
        formula: '1 Ratti per 10-12 kg of body weight (minimum 4.25 Ratti for adults)',
      },
      primaryRecommendations: {
        lifeStone: {
          ...lagnaRec.lifeStone,
          details: lifeStoneInfo,
        },
        luckyStone: {
          ...lagnaRec.luckyStone,
          details: luckyStoneInfo,
        },
        punyaStone: {
          ...lagnaRec.punyaStone,
          details: punyaStoneInfo,
        },
        yogakarakaStone: yogakarakaInfo
          ? {
              ...lagnaRec.yogakarakaStone,
              details: yogakarakaInfo,
            }
          : null,
      },
      strictlyAvoid: lagnaRec.strictlyAvoid,
      dashaSpecificGems: lagnaRec.dashaSpecificGems,
      generalGuidance: lagnaRec.overallGuidance,
      lifeGoalRecommendation: matchedGoal || null,
      allNavaratnas: Object.values(NAVARATNA_DATA).map((gem) => ({
        id: gem.id,
        name: gem.name,
        sanskritName: gem.sanskritName,
        planet: gem.planet,
        idealMetal: gem.idealMetal,
        idealFinger: gem.idealFinger,
        wearingDay: gem.wearingDay,
        beejMantra: gem.beejMantra,
        chantCount: gem.chantCount,
      })),
    });
  } catch (err: any) {
    console.error('API Gemstones recommendation failed:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Error generating gemstone recommendations',
    });
  }
});

// -------------------------------------------------------------
// 4. ASHTAKOOTA 36-GUNA KUNDLI MILAN API
// -------------------------------------------------------------
astrologyApiRouter.post('/match/compatibility', (req: Request, res: Response) => {
  try {
    const { p1, p2 } = req.body;

    if (!p1 || !p2 || !p1.dob || !p2.dob) {
      return res.status(400).json({
        error: 'Both partner profiles (p1, p2) with date of birth (dob) are required.',
        code: 'MISSING_PARTNER_DATA',
      });
    }

    const partner1 = {
      name: String(p1.name || 'Partner 1').trim(),
      gender: p1.gender || 'male',
      dob: String(p1.dob).trim(),
      tob: String(p1.tob || '12:00').trim(),
      city: p1.city || 'City 1',
      latitude: typeof p1.latitude === 'number' ? p1.latitude : 28.6139,
      longitude: typeof p1.longitude === 'number' ? p1.longitude : 77.2090,
      timezoneOffset: typeof p1.timezoneOffset === 'number' ? p1.timezoneOffset : 5.5,
    };

    const partner2 = {
      name: String(p2.name || 'Partner 2').trim(),
      gender: p2.gender || 'female',
      dob: String(p2.dob).trim(),
      tob: String(p2.tob || '12:00').trim(),
      city: p2.city || 'City 2',
      latitude: typeof p2.latitude === 'number' ? p2.latitude : 19.0760,
      longitude: typeof p2.longitude === 'number' ? p2.longitude : 72.8777,
      timezoneOffset: typeof p2.timezoneOffset === 'number' ? p2.timezoneOffset : 5.5,
    };

    const matchReport = calculateVedAstroMatch(partner1 as any, partner2 as any);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      partner1: { name: partner1.name, gender: partner1.gender, dob: partner1.dob },
      partner2: { name: partner2.name, gender: partner2.gender, dob: partner2.dob },
      data: matchReport,
    });
  } catch (err: any) {
    console.error('API Kundli Milan failed:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Error calculating horoscope compatibility',
    });
  }
});

// -------------------------------------------------------------
// 5. VEDIC NUMEROLOGY CALCULATOR API
// -------------------------------------------------------------
astrologyApiRouter.post('/numerology/calculate', (req: Request, res: Response) => {
  try {
    const { name, day, month, year, system } = req.body;

    const d = Math.max(1, Math.min(31, parseInt(day, 10) || 1));
    const m = Math.max(1, Math.min(12, parseInt(month, 10) || 1));
    const y = Math.max(1800, Math.min(2100, parseInt(year, 10) || 1990));
    const numerologySystem = system === 'pythagorean' ? 'pythagorean' : 'chaldean';

    // 1. Core Vedic numbers
    const mulank = calculateMulank(d);
    const bhagyank = calculateBhagyank(d, m, y);
    const synergy = evaluateDriverConductor(mulank, bhagyank);

    // 2. Name Numerology
    const personName = String(name || '').trim();
    const nameAnalysis = personName
      ? calculateNameNumerology(personName, numerologySystem)
      : null;

    // 3. Lo Shu Grid 3x3
    const loShu = buildLoShuGrid({ day: d, month: m, year: y }, mulank, bhagyank);

    // 4. Personal Year
    const currentYear = new Date().getFullYear();
    const personalYear = calculatePersonalYear(d, m, currentYear);

    // 5. Interpretations
    const mulankInfo = MULANK_DETAILS[mulank] || MULANK_DETAILS[1];
    const bhagyankInfo = BHAGYANK_DETAILS[bhagyank] || BHAGYANK_DETAILS[1];

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      input: { name: personName, day: d, month: m, year: y, system: numerologySystem },
      data: {
        coreNumbers: {
          mulank: {
            number: mulank,
            name: 'Driver / Root Number (Mulank)',
            ...mulankInfo,
          },
          bhagyank: {
            number: bhagyank,
            name: 'Conductor / Destiny Number (Bhagyank)',
            ...bhagyankInfo,
          },
          synergy,
        },
        nameAnalysis,
        loShuGrid: loShu,
        personalYear: {
          year: currentYear,
          ...personalYear,
        },
      },
    });
  } catch (err: any) {
    console.error('API Numerology calculation failed:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Error calculating numerology profile',
    });
  }
});

// -------------------------------------------------------------
// 6. VEDIC NAME CORRECTION & TUNING API
// -------------------------------------------------------------
astrologyApiRouter.post('/name-correction/tune', (req: Request, res: Response) => {
  try {
    const { currentName, targetMulank, targetBhagyank, system } = req.body;

    if (!currentName || typeof currentName !== 'string' || !currentName.trim()) {
      return res.status(400).json({
        error: 'Current name (currentName) is required',
        code: 'MISSING_NAME',
      });
    }

    const cleanName = currentName.trim();
    const numerologySystem = system === 'pythagorean' ? 'pythagorean' : 'chaldean';
    const currentAnalysis = calculateNameNumerology(cleanName, numerologySystem);

    const tm = targetMulank ? Number(targetMulank) : 1;
    const tb = targetBhagyank ? Number(targetBhagyank) : 1;

    // Generate tuning suggestions with algorithmic spelling variations
    const suggestions = generateNameTuningSuggestions(cleanName, numerologySystem, tm, tb);

    const compoundMeaning = COMPOUND_NUMBER_MEANINGS[currentAnalysis.compoundNumber] || {
      name: `Vibration ${currentAnalysis.compoundNumber}`,
      nature: 'Neutral Vibration',
      description: 'Balanced compound energetic vibration in classical numerology.',
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      currentName: cleanName,
      system: numerologySystem,
      currentAnalysis: {
        ...currentAnalysis,
        compoundMeaning,
      },
      targetDriver: tm,
      targetConductor: tb,
      suggestions,
    });
  } catch (err: any) {
    console.error('API Name correction failed:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Error tuning name spelling',
    });
  }
});

// -------------------------------------------------------------
// 7. AI KUNDLI SUMMARY & REPORTS API
// -------------------------------------------------------------
astrologyApiRouter.post('/ai/summary', async (req: Request, res: Response) => {
  try {
    const { kundliData, focus, depth } = req.body;
    if (!kundliData || typeof kundliData !== 'object') {
      return res.status(400).json({ error: 'Kundli data object is required' });
    }

    const summary = await generateKundliAiSummary(kundliData, focus, depth);
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: summary,
    });
  } catch (err: any) {
    console.error('API AI Summary error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to generate AI Kundli summary',
    });
  }
});

astrologyApiRouter.post('/ai/full-report', async (req: Request, res: Response) => {
  try {
    const { kundliData, forecastYears } = req.body;
    if (!kundliData || typeof kundliData !== 'object') {
      return res.status(400).json({ error: 'Kundli data object is required' });
    }

    const boundedYears = Math.min(10, Math.max(1, Number(forecastYears) || 3));
    const report = await generateFullAstrologyReportWithAi(kundliData, boundedYears as any);
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: report,
    });
  } catch (err: any) {
    console.error('API Full Astrology Report error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to generate full report',
    });
  }
});
