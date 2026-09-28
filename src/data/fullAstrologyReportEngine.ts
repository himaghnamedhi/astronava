import { PlanetId, HouseNumber, ChartStyle } from '../types/astrology';
import { 
  CompleteKundliData, 
  GrahaSpashta, 
  DignityType, 
  DivisionalChartType,
  DashaPeriod
} from './vedicEphemeris';
import { 
  RASHI_NAMES, 
  RASHI_LORDS, 
  NAKSHATRAS, 
  BirthDetails 
} from './vedicAstrologyCalculator';
import { HOUSES_DATA } from './housesData';
import { PLANETS_DATA } from './planetsData';
import { BHAVA_EFFECTS_DATA } from './bhavaEffectsData';
import { calculateTransitsForDate } from './horoscopeEngine';

// -------------------------------------------------------------
// 1. DATA TYPES FOR THE FULL ASTROLOGY REPORT
// -------------------------------------------------------------

export interface HouseAnalysisReport {
  houseNumber: HouseNumber;
  sanskritName: string;
  name: string;
  signNumber: number;
  signName: string;
  signElement: string;
  whatHouseRepresents: string;
  planetsInHouse: {
    planetId: PlanetId;
    name: string;
    sanskritName: string;
    dignity: DignityType;
    isRetrograde: boolean;
    isCombust: boolean;
    plainEnglishMeaning: string;
  }[];
  houseLord: {
    planetId: PlanetId;
    name: string;
    sanskritName: string;
    placedInHouse: HouseNumber;
    plainEnglishConnection: string;
    technicalCode: string; // e.g. "6L in 10H"
  };
  aspectsAndConjunctions: string[];
  strengthAndDignitySummary: string;
  possiblePositiveManifestations: string[];
  possibleChallenges: string[];
  realLifeScenarios: string[]; // 3 to 7 real-life everyday possibilities
}

export interface PlanetAnalysisReport {
  id: PlanetId;
  name: string;
  sanskritName: string;
  avatar: string;
  house: HouseNumber;
  signNumber: number;
  signName: string;
  degrees: string;
  nakshatra: string;
  nakshatraPada: number;
  nakshatraLord: string;
  housesRuled: HouseNumber[];
  dignity: DignityType;
  avastha: string;
  isRetrograde: boolean;
  isCombust: boolean;
  aspectsCastToHouses: HouseNumber[];
  aspectsReceivedFromPlanets: string[];
  naturalSignification: string;
  plainEnglishInterpretation: string;
  technicalSummary: string;
  possibleManifestations: string[];
}

export interface DomainForecastItem {
  domain: 'Career' | 'Money' | 'Education' | 'Relationships' | 'Family' | 'Health & Wellbeing' | 'Travel & Foreign Opportunities' | 'Personal Development';
  theme: string;
  possibleManifestations: string[];
  whyAstrologicalBasis: string;
  timingWindow: string;
  intensity: 'High' | 'Favorable' | 'Transformational' | 'Steady' | 'Requires Patience';
}

export interface MultiYearForecastPeriod {
  periodId: string;
  label: string; // e.g. "2026 Q1 - Q3 • Jupiter in Gemini & Shani in Pisces"
  startDate: string;
  endDate: string;
  mahadashaLord: string;
  antardashaLord: string;
  activePlanetaryThemes: string;
  jupiterTransitHouse: HouseNumber;
  saturnTransitHouse: HouseNumber;
  rahuTransitHouse: HouseNumber;
  ketuTransitHouse: HouseNumber;
  overallPeriodTheme: string;
  domains: Record<string, DomainForecastItem>;
}

export interface FullAstrologyReportData {
  nativeName: string;
  gender: string;
  birthDateFormatted: string;
  birthTimeFormatted: string;
  birthPlace: string;
  generatedDate: string;
  selectedForecastYears: 1 | 2 | 3 | 5;

  // 1. Executive Summary
  executiveSummary: {
    headline: string;
    lifeCoreTheme: string;
    majorOpportunities: string[];
    mindsetGuidance: string[];
    currentCosmicClimate: string;
  };

  // 2. Chart Overview
  chartOverview: {
    ascendantSign: string;
    ascendantLord: string;
    moonSign: string;
    moonNakshatra: string;
    sunSign: string;
    chartElementBalance: { fire: number; earth: number; air: number; water: number };
    kendraStrongCount: number;
    trikonaCount: number;
    overviewNarrative: string;
  };

  // 3. Ascendant (Lagna)
  ascendantAnalysis: {
    sign: string;
    exactDegree: string;
    nakshatra: string;
    pada: number;
    lord: string;
    lordPlacedInHouse: HouseNumber;
    lordPlacedInSign: string;
    physicalTraitsAndVibe: string;
    psychologicalTemperament: string;
    lifeOrientation: string;
  };

  // 4. All 12 Houses Detailed
  houses: HouseAnalysisReport[];

  // 5. All 9 Planets Detailed
  planets: PlanetAnalysisReport[];

  // 6. House Lords Matrix
  houseLordsMatrix: {
    houseNumber: HouseNumber;
    houseName: string;
    lord: string;
    placedInHouse: HouseNumber;
    placedInSign: string;
    technicalCode: string;
    normalLanguageSummary: string;
  }[];

  // 7. Planetary Aspects (Drishti)
  aspectsBreakdown: {
    planet: string;
    aspectsHouses: { house: HouseNumber; houseName: string; type: string }[];
    mutualAspects: string[];
    practicalImpact: string;
  }[];

  // 8. Yogas & Auspicious Combinations
  yogas: {
    name: string;
    sanskritName: string;
    type: string;
    description: string;
    realLifeImpact: string;
  }[];

  // 9. Dasha Analysis
  dashaAnalysis: {
    currentMahadasha: string;
    currentAntardasha: string;
    currentPratyantardasha: string;
    mahadashaEndYear: number;
    dashaNarrative: string;
    upcomingMilestones: { period: string; planetCombo: string; theme: string }[];
  };

  // 10. Multi-Year Prediction
  multiYearForecast: {
    durationYears: 1 | 2 | 3 | 5;
    introOverview: string;
    periods: MultiYearForecastPeriod[];
  };

  // 11 - 17 Life Domain Syntheses
  lifeDomains: {
    career: {
      headline: string;
      primaryInfluences: string;
      possiblePaths: string[];
      longTermOutlook: string;
    };
    money: {
      headline: string;
      primaryInfluences: string;
      accumulationPatterns: string[];
      financialWisdom: string;
    };
    education: {
      headline: string;
      primaryInfluences: string;
      intellectualStrengths: string[];
      higherLearningOutlook: string;
    };
    relationships: {
      headline: string;
      primaryInfluences: string;
      partnershipStyle: string[];
      relationshipAdvice: string;
    };
    family: {
      headline: string;
      primaryInfluences: string;
      domesticHarmony: string[];
      ancestralDynamics: string;
    };
    health: {
      headline: string;
      primaryInfluences: string;
      vitalityPointers: string[];
      mindBodyCare: string;
    };
    travel: {
      headline: string;
      primaryInfluences: string;
      travelIndications: string[];
      foreignSettlementPotential: string;
    };
  };

  // 18. Strengths & Challenges
  strengthsAndChallenges: {
    innateStrengths: { title: string; explanation: string }[];
    karmicChallenges: { title: string; guidance: string }[];
  };

  // 19. Possible Life Manifestations (Scenarios)
  lifeManifestations: {
    category: string;
    scenarioTitle: string;
    whatMayHappen: string;
    howToPrepare: string;
  }[];

  // 20. Technical Details (Collapsed by default)
  technicalDetails: {
    ayanamsha: string;
    tithiDetails: string;
    atmakaraka: string;
    amatyakaraka: string;
    sarvashtakavargaPoints: { sign: string; bindus: number; house: number }[];
    d9NavamshaHighlights: string[];
    d10DasamshaHighlights: string[];
  };
}

// -------------------------------------------------------------
// 2. ASPECT CALCULATION ENGINE (VEDIC DRISHTI)
// -------------------------------------------------------------

function calculateVedicAspects(
  placements: Record<PlanetId, HouseNumber>
): Record<PlanetId, HouseNumber[]> {
  const aspects: Record<PlanetId, HouseNumber[]> = {
    sun: [],
    moon: [],
    mars: [],
    mercury: [],
    jupiter: [],
    venus: [],
    saturn: [],
    rahu: [],
    ketu: [],
  };

  const getOffsetHouse = (base: HouseNumber, offset: number): HouseNumber => {
    return ((((base - 1) + offset) % 12) + 1) as HouseNumber;
  };

  (Object.keys(placements) as PlanetId[]).forEach((pId) => {
    const h = placements[pId];
    if (!h) return;

    // All planets cast 7th house aspect (opposition)
    aspects[pId].push(getOffsetHouse(h, 6));

    // Special aspects
    if (pId === 'mars') {
      // Mars aspects 4th, 7th, 8th
      aspects[pId].push(getOffsetHouse(h, 3)); // 4th from itself
      aspects[pId].push(getOffsetHouse(h, 7)); // 8th from itself
    } else if (pId === 'jupiter' || pId === 'rahu' || pId === 'ketu') {
      // Jupiter, Rahu, Ketu aspect 5th, 7th, 9th
      aspects[pId].push(getOffsetHouse(h, 4)); // 5th from itself
      aspects[pId].push(getOffsetHouse(h, 8)); // 9th from itself
    } else if (pId === 'saturn') {
      // Saturn aspects 3rd, 7th, 10th
      aspects[pId].push(getOffsetHouse(h, 2)); // 3rd from itself
      aspects[pId].push(getOffsetHouse(h, 9)); // 10th from itself
    }
  });

  return aspects;
}

// Helper: Which planets aspect a specific house
function getPlanetsAspectingHouse(
  targetHouse: HouseNumber,
  aspects: Record<PlanetId, HouseNumber[]>
): PlanetId[] {
  const list: PlanetId[] = [];
  (Object.keys(aspects) as PlanetId[]).forEach((pId) => {
    if (aspects[pId].includes(targetHouse)) {
      list.push(pId);
    }
  });
  return list;
}

// -------------------------------------------------------------
// 3. REAL-LIFE SCENARIOS GENERATOR (3 TO 7 POSSIBILITIES PER HOUSE)
// -------------------------------------------------------------

function generateRealLifeScenariosForHouse(
  house: HouseNumber,
  occupants: PlanetId[],
  lord: string,
  lordHouse: HouseNumber,
  signName: string
): string[] {
  const scenarios: string[] = [];

  switch (house) {
    case 1:
      scenarios.push('You may often be perceived as the natural initiator or leader in group activities.');
      scenarios.push('Your physical stamina and energy levels could directly mirror your emotional enthusiasm for your work.');
      scenarios.push('People might frequently come to you when they need someone decisive who is not afraid to take accountability.');
      scenarios.push('You could experience significant physical transformations or style shifts during major life transitions.');
      if (occupants.includes('sun') || occupants.includes('mars')) {
        scenarios.push('You may feel uncomfortable taking orders from others and thrive best when given autonomy or managing projects independently.');
      } else if (occupants.includes('jupiter') || occupants.includes('venus')) {
        scenarios.push('You may possess a naturally calming, disarming demeanor that helps de-escalate tension in meetings or negotiations.');
      } else {
        scenarios.push('You could discover that cultivating a steady daily physical routine is your fastest anchor for mental clarity.');
      }
      break;

    case 2:
      scenarios.push('Your financial security may be strongly linked to family heritage, values, or shared ancestral resources.');
      scenarios.push('You could have a distinct vocal cadence or persuasive speech style that helps in sales, teaching, or presentations.');
      scenarios.push('You may find satisfaction in accumulating tangible assets or long-term conservative investments rather than speculative risks.');
      scenarios.push('Food preferences, dining habits, and oral hygiene could play an unusually prominent role in your general wellbeing.');
      scenarios.push('In family gatherings, your viewpoint may carry noticeable weight when practical or financial decisions are on the table.');
      break;

    case 3:
      scenarios.push('You may find yourself excelling in short-term sprints, content creation, digital communication, or rapid execution.');
      scenarios.push('Your relationship with younger siblings or immediate neighbors could involve frequent mentorship or shared side-projects.');
      scenarios.push('You might frequently travel on short domestic trips, weekend explorations, or commute-heavy professional assignments.');
      scenarios.push('You could possess strong dexterity or talent with your hands, whether in typing, craftsmanship, music, or surgical precision.');
      scenarios.push('You may notice that courage and self-reliance produce far greater breakthroughs for you than waiting for outside assistance.');
      break;

    case 4:
      scenarios.push('Your home environment could serve as an essential sanctuary where your emotional nervous system resets.');
      scenarios.push('Property ownership, domestic decorating, or upgrading vehicles may bring deep inner emotional fulfillment.');
      scenarios.push('Your relationship with your mother or maternal figures may have strongly sculpted your psychological foundation.');
      scenarios.push('You could experience a strong pull toward staying connected to your homeland, or alternately building your own private compound.');
      scenarios.push('Unresolved emotional domestic stress might quickly reflect in digestive or heart-rate variations if boundary hygiene is neglected.');
      break;

    case 5:
      scenarios.push('You may have a natural aptitude for strategic thinking, creative writing, speculative intelligence, or mentoring.');
      scenarios.push('Romance and emotional courtship for you could involve a high desire for intellectual connection and mutual inspiration.');
      scenarios.push('Children or younger protégés might play a central role in bringing joy, pride, or major life lessons to your world.');
      scenarios.push('You could enjoy hobbies where intuition and analysis meet, such as financial markets, chess, coding, or artistic design.');
      scenarios.push('Past positive karmic credits (Purva Punya) may unexpectedly rescue you from tight corners when all logical solutions seem exhausted.');
      break;

    case 6:
      scenarios.push('You may show exceptional resilience when dealing with logistical crises, tight deadlines, or hostile workplace competition.');
      scenarios.push('Careers in problem-solving, medicine, audit, legal advocacy, dispute resolution, or service management could suit you naturally.');
      scenarios.push('You might need to watch out for over-analyzing minor conflicts or taking on other people\'s burdens unnecessarily.');
      scenarios.push('Daily routines, clean nutrition, and anti-inflammatory habits could be the decisive difference between high energy and fatigue.');
      scenarios.push('Your greatest career promotions might happen immediately after you successfully resolve a difficult conflict or turnaround challenge.');
      break;

    case 7:
      scenarios.push('Significant life progress and self-discovery could occur primarily through the mirror of one-on-one partnerships.');
      scenarios.push('Your ideal life partner or business associate may bring complementary traits that balance your blind spots.');
      scenarios.push('Public relations, client negotiation, trade, or collaborative ventures could form a major revenue stream for you.');
      scenarios.push('You might find yourself frequently traveling overseas or dealing with clients from cross-cultural backgrounds.');
      scenarios.push('Maintaining transparent expectations regarding roles and finances will be essential for long-term marital serenity.');
      break;

    case 8:
      scenarios.push('You may possess an uncanny intuition for uncovering hidden truths, deep research, or reading between the lines.');
      scenarios.push('Financial windfalls, partner\'s assets, tax benefits, inheritance, or joint ventures could periodically restructure your net worth.');
      scenarios.push('You could undergo 2 to 3 major psychological transformations in life where an old identity completely dissolves into a new chapter.');
      scenarios.push('An interest in astrology, esoteric psychology, data forensics, or emergency crisis management could be quite pronounced.');
      scenarios.push('During high-stress periods, emotional privacy and solitary contemplation will be your most effective regenerative tools.');
      break;

    case 9:
      scenarios.push('Long-distance international travel, pilgrimages, or cross-border educational pursuits could expand your destiny horizons.');
      scenarios.push('You may develop a deeply personal moral code or philosophy that evolves beyond conventional childhood indoctrination.');
      scenarios.push('Mentors, university professors, spiritual guides, or father figures could play catalytic roles in your biggest opportunities.');
      scenarios.push('You might feel a strong calling to publish, teach, broadcast, or share expansive philosophical perspectives with broader audiences.');
      scenarios.push('Generosity and ethical integrity will likely function as your strongest magnet for unexpected synchronistic fortune (Bhagya).');
      break;

    case 10:
      scenarios.push('Your professional reputation, social authority, and legacy could be among your most cherished personal priorities.');
      scenarios.push('You may feel drawn toward executive responsibility, institutional leadership, government work, or running your own venture.');
      scenarios.push('The public may often see you as more serious or accomplished than you privately feel inside.');
      scenarios.push('Your career path could experience steady compounding over time, reaching its peak influence in your mid-thirties and beyond.');
      scenarios.push('Balancing demanding career milestones with emotional peace at home will be a lifelong rewarding balancing act.');
      break;

    case 11:
      scenarios.push('Large social networks, professional associations, and influential friend circles could be your greatest engine of financial gain.');
      scenarios.push('You may establish multiple independent streams of passive or entrepreneurial income over the course of your career.');
      scenarios.push('Support from elder siblings, senior executives, or industry patrons could unlock doors that talent alone could not.');
      scenarios.push('You might be drawn to humanitarian causes, community organizing, technological platforms, or collective scaling efforts.');
      scenarios.push('Setting ambitious 5-year targets will likely inspire you far more than modest, incremental day-to-day goals.');
      break;

    case 12:
      scenarios.push('You may experience profound mental breakthroughs and creative ideas when you are alone in quiet, contemplative spaces.');
      scenarios.push('Opportunities involving foreign countries, remote work, international relocations, or multinational companies could figure prominently.');
      scenarios.push('A natural inclination toward philanthropy, spirituality, meditation, or subconscious exploration could be present.');
      scenarios.push('You may periodically need to consciously manage your expenditure habits and guard against sleep disturbances or restless nights.');
      scenarios.push('Letting go of attachment to outcomes could paradoxically be the exact catalyst that brings your greatest worldly successes.');
      break;
  }

  // Add customized scenario connecting lord placement
  scenarios.push(
    `Because the ruler of this house (${lord}) sits in your ${lordHouse}th house, your ${HOUSES_DATA[house].name.split(',')[0]} matters will naturally express themselves through ${HOUSES_DATA[lordHouse].name.split(',')[0]} activities.`
  );

  return scenarios;
}

// -------------------------------------------------------------
// 4. MULTI-YEAR PREDICTION ENGINE (1, 2, 3, 5 YEARS)
// -------------------------------------------------------------

export function generateMultiYearForecast(
  kundli: CompleteKundliData,
  forecastYears: 1 | 2 | 3 | 5 = 3
): MultiYearForecastPeriod[] {
  const currentYear = new Date().getFullYear();
  const periods: MultiYearForecastPeriod[] = [];

  const natalLagna = kundli.lagna.signNumber;
  const natalMoon = kundli.grahas.moon.rashiNumber;

  // We divide each year into 2 halves (H1: Jan-Jun, H2: Jul-Dec)
  const totalHalfYears = forecastYears * 2;

  for (let i = 0; i < totalHalfYears; i++) {
    const periodYear = currentYear + Math.floor(i / 2);
    const isFirstHalf = i % 2 === 0;
    const startDate = `${periodYear}-${isFirstHalf ? '01-01' : '07-01'}`;
    const endDate = `${periodYear}-${isFirstHalf ? '06-30' : '12-31'}`;
    const midDateStr = `${periodYear}-${isFirstHalf ? '04-01' : '10-01'}`;

    // Calculate sidereal transits for this period
    const transits = calculateTransitsForDate(midDateStr, natalLagna, natalMoon);

    const jupTransitHouse = transits.jupiter.houseFromLagna;
    const satTransitHouse = transits.saturn.houseFromLagna;
    const rahuTransitHouse = transits.rahu.houseFromLagna;
    const ketuTransitHouse = transits.ketu.houseFromLagna;

    // Resolve active Dasha for this timeframe
    const currentMaha = kundli.vimshottariDasha.currentMahadasha.lordName;
    const currentAntar = kundli.vimshottariDasha.currentAntardasha.lordName;

    const jupSignName = transits.jupiter.transitSignName;
    const satSignName = transits.saturn.transitSignName;

    const periodLabel = `${periodYear} ${isFirstHalf ? 'H1 (Jan - Jun)' : 'H2 (Jul - Dec)'} • Guru in ${jupSignName} & Shani in ${satSignName}`;

    // Period Theme
    let periodTheme = `A phase characterized by ${jupTransitHouse === 1 || jupTransitHouse === 5 || jupTransitHouse === 9 ? 'expansive fortune, wisdom and personal alignment' : jupTransitHouse === 10 ? 'prominent professional elevation and recognition' : jupTransitHouse === 11 ? 'lucrative income networking and goal achievement' : 'steady internal reflection and pragmatic consolidation'}.`;

    // 8 Life Domains for this Period
    const domains: Record<string, DomainForecastItem> = {
      career: {
        domain: 'Career',
        theme: jupTransitHouse === 10 || satTransitHouse === 10 || kundli.houseOccupants[10].length > 0
          ? 'Professional Authority, Expansion & Key Milestones'
          : 'Competence Building, Skill Deepening & Strategic Positioning',
        possibleManifestations: [
          'Opportunities to take on larger strategic leadership or elevated project responsibilities.',
          'Possible negotiations regarding role title, compensation restructuring, or organizational pivoting.',
          'Patience required during operational bottlenecks; high reward for consistent delivery.',
        ],
        whyAstrologicalBasis: `Jupiter activating House ${jupTransitHouse} while Saturn oversees House ${satTransitHouse} from Lagna; energized under ${currentMaha}-${currentAntar} Dasha.`,
        timingWindow: `${isFirstHalf ? 'February to May' : 'August to November'} ${periodYear}`,
        intensity: jupTransitHouse === 10 || satTransitHouse === 10 ? 'High' : 'Favorable',
      },

      money: {
        domain: 'Money',
        theme: jupTransitHouse === 2 || jupTransitHouse === 11 || satTransitHouse === 2 || satTransitHouse === 11
          ? 'Asset Accumulation & Inflow Expansion'
          : 'Resource Conservation & Prudent Portfolio Management',
        possibleManifestations: [
          'Potential for unexpected secondary revenue or consulting streams to mature.',
          'Favorable window for structured debt liquidation or real estate investment evaluation.',
          'Encouragement to avoid impulsive speculative investments in volatile instruments.',
        ],
        whyAstrologicalBasis: `2nd House (Dhana) and 11th House (Labha) receiving planetary transits; ${currentMaha} cycle influencing resource allocation.`,
        timingWindow: `${isFirstHalf ? 'March to June' : 'September to December'} ${periodYear}`,
        intensity: 'Favorable',
      },

      education: {
        domain: 'Education',
        theme: 'Intellectual Specialization & Certifications',
        possibleManifestations: [
          'High receptivity for absorbing complex analytical, technical, or philosophical systems.',
          'Possible formal enrollment in professional accreditations, executive diplomas, or research.',
          'Writing, speaking, or publishing academic/thought-leadership material may gain traction.',
        ],
        whyAstrologicalBasis: `Activation of 4th House (Foundations) and 5th/9th Houses (Higher Wisdom) under current cosmic alignments.`,
        timingWindow: `${isFirstHalf ? 'January to April' : 'July to October'} ${periodYear}`,
        intensity: 'Steady',
      },

      relationships: {
        domain: 'Relationships',
        theme: jupTransitHouse === 7 || satTransitHouse === 7 || rahuTransitHouse === 7
          ? 'Deepening Commitments & Relationship Maturation'
          : 'Emotional Harmony, Balance & Clear Boundaries',
        possibleManifestations: [
          'Constructive dialogues with your significant other about long-term vision, residency, or mutual finances.',
          'Unmarried natives may encounter meaningful prospects through professional or family networks.',
          'Importance of conscious listening over proving points during temporary planetary retrogrades.',
        ],
        whyAstrologicalBasis: `7th House of partnership receiving transits; Venus and Jupiter harmonics harmonizing emotional expectations.`,
        timingWindow: `${isFirstHalf ? 'April to June' : 'October to December'} ${periodYear}`,
        intensity: jupTransitHouse === 7 ? 'High' : 'Steady',
      },

      family: {
        domain: 'Family',
        theme: 'Domestic Sanctuary & Generational Solidarity',
        possibleManifestations: [
          'Possible domestic renovations, vehicle upgrades, or hosting family auspicious celebrations.',
          'Supportive role in assisting parents or elders with health, legal, or administrative tasks.',
          'Deepening sense of belonging and peace when surrounded by genuine ancestral roots.',
        ],
        whyAstrologicalBasis: `4th Bhava (Sukha/Matru) and 2nd Bhava (Kutumba) planetary oversight during this sub-period.`,
        timingWindow: `${isFirstHalf ? 'February to May' : 'August to November'} ${periodYear}`,
        intensity: 'Steady',
      },

      health: {
        domain: 'Health & Wellbeing',
        theme: satTransitHouse === 1 || satTransitHouse === 6 || satTransitHouse === 8
          ? 'Structural Discipline, Rest & Stamina Management'
          : 'Vitality Renewal & Mind-Body Optimization',
        possibleManifestations: [
          'Encouragement to establish regular sleep rhythms and reduce evening screen exposure.',
          'Benefits from low-impact strength training, yoga, and mindful joint/back care.',
          'Digestive efficiency improves noticeably when meals are synchronized with daylight hours.',
        ],
        whyAstrologicalBasis: `1st House (Lagna body) and 6th House (Roga) alignment with current transit speed of Saturn.`,
        timingWindow: `${isFirstHalf ? 'January to March' : 'July to September'} ${periodYear}`,
        intensity: satTransitHouse === 1 || satTransitHouse === 6 ? 'Requires Patience' : 'Steady',
      },

      travel: {
        domain: 'Travel & Foreign Opportunities',
        theme: jupTransitHouse === 9 || jupTransitHouse === 12 || rahuTransitHouse === 12
          ? 'Cross-Border Expeditions & Horizon Expansion'
          : 'Short Domestic Journeys & Nature Retreats',
        possibleManifestations: [
          'Prospects for international business travel, spiritual pilgrimages, or relocations.',
          'Rejuvenating weekend retreats in nature that rekindle creative enthusiasm.',
          'Smooth processing of travel documentation or cross-jurisdictional clearances.',
        ],
        whyAstrologicalBasis: `9th Bhava (Tirtha/Long journeys) and 12th Bhava (Foreign realms) activated by current Gochar.`,
        timingWindow: `${isFirstHalf ? 'May to June' : 'November to December'} ${periodYear}`,
        intensity: jupTransitHouse === 9 || jupTransitHouse === 12 ? 'High' : 'Favorable',
      },

      personalDevelopment: {
        domain: 'Personal Development',
        theme: 'Self-Mastery, Dharma & Spiritual Awakening',
        possibleManifestations: [
          'Deepening meditation, mantra contemplation, or disciplined journaling practice.',
          'A shift away from superficial validation toward internal calm and purpose-driven living.',
          'Developing a compassionate, detached perspective toward past life grievances.',
        ],
        whyAstrologicalBasis: `Vedic Navamsha (D9) maturation cycle and active Mahadasha lord harmonics.`,
        timingWindow: `Ongoing throughout ${periodYear}`,
        intensity: 'Transformational',
      },
    };

    periods.push({
      periodId: `forecast-${periodYear}-${isFirstHalf ? 'h1' : 'h2'}`,
      label: periodLabel,
      startDate,
      endDate,
      mahadashaLord: currentMaha,
      antardashaLord: currentAntar,
      activePlanetaryThemes: `Mahadasha of ${currentMaha} • Antardasha of ${currentAntar}`,
      jupiterTransitHouse: jupTransitHouse,
      saturnTransitHouse: satTransitHouse,
      rahuTransitHouse: rahuTransitHouse,
      ketuTransitHouse: ketuTransitHouse,
      overallPeriodTheme: periodTheme,
      domains,
    });
  }

  return periods;
}

// -------------------------------------------------------------
// 5. MASTER GENERATION FUNCTION
// -------------------------------------------------------------

export function generateFullAstrologyReport(
  kundli: CompleteKundliData,
  forecastYears: 1 | 2 | 3 | 5 = 3
): FullAstrologyReportData {
  const details = kundli.birthDetails;
  const lagnaSign = kundli.lagna.signNumber;
  const lagnaSignName = kundli.lagna.signName;
  const lagnaLord = kundli.lagna.lord;

  // 1. Calculate All Aspects
  const planetPlacements: Record<PlanetId, HouseNumber> = {} as any;
  (Object.keys(kundli.grahas) as PlanetId[]).forEach((pId) => {
    planetPlacements[pId] = kundli.grahas[pId].house;
  });
  const aspects = calculateVedicAspects(planetPlacements);

  // 2. Element Balance
  const elementCounts = { fire: 0, earth: 0, air: 0, water: 0 };
  const rashiElements: ('fire' | 'earth' | 'air' | 'water')[] = [
    'fire', 'earth', 'air', 'water',
    'fire', 'earth', 'air', 'water',
    'fire', 'earth', 'air', 'water',
  ];
  kundli.grahasList.forEach((g) => {
    const el = rashiElements[g.rashiNumber - 1];
    elementCounts[el] += 1;
  });

  // 3. Kendra & Trikona counts
  let kendraCount = 0;
  let trikonaCount = 0;
  kundli.grahasList.forEach((g) => {
    if ([1, 4, 7, 10].includes(g.house)) kendraCount++;
    if ([1, 5, 9].includes(g.house)) trikonaCount++;
  });

  // 4. Generate 12 Houses in depth
  const houses: HouseAnalysisReport[] = ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as HouseNumber[]).map((hNum) => {
    const signNum = (((lagnaSign - 1 + (hNum - 1)) % 12) + 1);
    const signName = RASHI_NAMES[signNum - 1];
    const signElement = rashiElements[signNum - 1];
    const lord = RASHI_LORDS[signNum - 1];
    const occupants = kundli.houseOccupants[hNum] || [];

    // Find lord's placement house
    const lordPlanetId = (Object.keys(kundli.grahas) as PlanetId[]).find(
      (p) => kundli.grahas[p].name === lord || kundli.grahas[p].sanskritName === lord
    ) || 'sun';
    const lordHouse = kundli.grahas[lordPlanetId]?.house || 1;

    // Aspects received
    const aspectingPlanets = getPlanetsAspectingHouse(hNum, aspects);
    const aspectsTextList: string[] = [];
    aspectingPlanets.forEach((pId) => {
      aspectsTextList.push(`${kundli.grahas[pId].name} (${kundli.grahas[pId].sanskritName}) casts a direct Vedic aspect onto this house.`);
    });
    if (occupants.length > 1) {
      aspectsTextList.push(`Conjunction of ${occupants.map((p) => kundli.grahas[p].name).join(' & ')} inside this house.`);
    }

    const planetsInHouse = occupants.map((pId) => {
      const g = kundli.grahas[pId];
      const planetData = PLANETS_DATA[pId]?.effects?.[hNum];
      return {
        planetId: pId,
        name: g.name,
        sanskritName: g.sanskritName,
        dignity: g.dignity,
        isRetrograde: g.isRetrograde,
        isCombust: g.isCombust,
        plainEnglishMeaning: planetData?.summary || 
          `${g.name} placed in your ${hNum}th house infuses its natural ${g.sanskritName} energy into this sphere of life, creating strong focus on ${HOUSES_DATA[hNum].lifeThemes.slice(0, 2).join(' and ')}.`,
      };
    });

    const technicalCode = `${hNum}L in ${lordHouse}H (${lord} in ${kundli.grahas[lordPlanetId]?.rashiName || 'own'})`;
    const plainEnglishConnection = `The ruler of your ${HOUSES_DATA[hNum].name.split(',')[0]} (${lord}) is situated in your ${lordHouse}th house (${HOUSES_DATA[lordHouse].name.split(',')[0]}). In plain terms, your ${HOUSES_DATA[hNum].lifeThemes[0].toLowerCase()} is strongly fueled by how you manage your ${HOUSES_DATA[lordHouse].lifeThemes[0].toLowerCase()}.`;

    // Real-life scenarios
    const realLifeScenarios = generateRealLifeScenariosForHouse(hNum, occupants, lord, lordHouse, signName);

    // Strengths & Challenges
    const possiblePositiveManifestations = [
      `Favorable balance when cultivating ${HOUSES_DATA[hNum].lifeThemes.slice(0, 2).join(' and ')}.`,
      `Natural resilience in ${HOUSES_DATA[hNum].name.split(',')[0]} matters whenever proactive initiative is taken.`,
      `Ability to inspire others through authentic competence in this life area.`,
      `Constructive support from planetary lords during positive dasha cycles.`,
    ];

    const possibleChallenges = [
      `Tendency to over-attach emotional energy to ${HOUSES_DATA[hNum].lifeThemes[0].toLowerCase()} during stressful phases.`,
      `Potential impatience if outcomes in this domain take longer than expected to mature.`,
      `Need to establish healthy personal boundaries with external demands.`,
    ];

    return {
      houseNumber: hNum,
      sanskritName: HOUSES_DATA[hNum].sanskritName,
      name: HOUSES_DATA[hNum].name,
      signNumber: signNum,
      signName,
      signElement,
      whatHouseRepresents: HOUSES_DATA[hNum].description,
      planetsInHouse,
      houseLord: {
        planetId: lordPlanetId,
        name: lord,
        sanskritName: kundli.grahas[lordPlanetId]?.sanskritName || lord,
        placedInHouse: lordHouse,
        plainEnglishConnection,
        technicalCode,
      },
      aspectsAndConjunctions: aspectsTextList.length > 0 ? aspectsTextList : ['No direct harsh malefic aspects detected.'],
      strengthAndDignitySummary: `${signName} (${signElement} element), governed by ${lord}. ${occupants.length} resident planet(s).`,
      possiblePositiveManifestations,
      possibleChallenges,
      realLifeScenarios,
    };
  });

  // 5. Generate All 9 Planets in depth
  const planets: PlanetAnalysisReport[] = kundli.grahasList.map((g) => {
    // Find houses ruled
    const ruled: HouseNumber[] = [];
    for (let h = 1; h <= 12; h++) {
      const sNum = (((lagnaSign - 1 + (h - 1)) % 12) + 1);
      const lName = RASHI_LORDS[sNum - 1];
      if (lName === g.name || lName === g.sanskritName) {
        ruled.push(h as HouseNumber);
      }
    }

    const castAspects = aspects[g.id] || [];
    const receivedAspects: string[] = [];
    (Object.keys(aspects) as PlanetId[]).forEach((otherId) => {
      if (otherId !== g.id && aspects[otherId].includes(g.house)) {
        receivedAspects.push(`${kundli.grahas[otherId].name} (${kundli.grahas[otherId].sanskritName})`);
      }
    });

    const planetEffects = PLANETS_DATA[g.id]?.effects?.[g.house];

    const plainEnglishInterpretation = planetEffects?.summary || 
      `${g.name} sits in your ${g.house}th house (${g.rashiName}). This combines the planet's core qualities with the themes of this house, guiding your everyday inclinations and natural strengths.`;

    const technicalSummary = `${g.name} (${g.sanskritName}) • ${g.rashiName} ${g.formattedDegree} • House ${g.house} • ${g.dignity} • Nakshatra: ${g.nakshatraName} (Pada ${g.nakshatraPada}) • Rules Houses ${ruled.join(', ') || 'None'}`;

    return {
      id: g.id,
      name: g.name,
      sanskritName: g.sanskritName,
      avatar: g.avatar,
      house: g.house,
      signNumber: g.rashiNumber,
      signName: g.rashiName,
      degrees: g.formattedDegree,
      nakshatra: g.nakshatraName,
      nakshatraPada: g.nakshatraPada,
      nakshatraLord: g.nakshatraLord,
      housesRuled: ruled,
      dignity: g.dignity,
      avastha: g.avastha || 'Yuva (Active)',
      isRetrograde: g.isRetrograde,
      isCombust: g.isCombust,
      aspectsCastToHouses: castAspects,
      aspectsReceivedFromPlanets: receivedAspects,
      naturalSignification: PLANETS_DATA[g.id]?.centralDescription || '',
      plainEnglishInterpretation,
      technicalSummary,
      possibleManifestations: planetEffects?.bulletPoints || [
        `Enhances focus in matters of the ${g.house}th house.`,
        `Gives distinct temperament aligned with ${g.rashiName}.`,
        `Energizes ${ruled.length > 0 ? `houses ${ruled.join(' & ')}` : 'destiny path'} during its Dasha sub-periods.`,
      ],
    };
  });

  // 6. House Lords Matrix
  const houseLordsMatrix = houses.map((h) => ({
    houseNumber: h.houseNumber,
    houseName: h.name,
    lord: h.houseLord.name,
    placedInHouse: h.houseLord.placedInHouse,
    placedInSign: kundli.grahas[h.houseLord.planetId]?.rashiName || 'Own',
    technicalCode: h.houseLord.technicalCode,
    normalLanguageSummary: h.houseLord.plainEnglishConnection,
  }));

  // 7. Aspects Breakdown
  const aspectsBreakdown = (Object.keys(aspects) as PlanetId[]).map((pId) => {
    const p = kundli.grahas[pId];
    const castList = aspects[pId].map((h) => ({
      house: h,
      houseName: HOUSES_DATA[h].name.split(',')[0],
      type: pId === 'mars' && [4, 8].includes(h) ? 'Special Mars Aspect' :
            pId === 'jupiter' && [5, 9].includes(h) ? 'Special Trinal Grace' :
            pId === 'saturn' && [3, 10].includes(h) ? 'Special Saturn Aspect' :
            'Full 7th Direct Drishti',
    }));

    const mutualAspects: string[] = [];
    (Object.keys(aspects) as PlanetId[]).forEach((otherId) => {
      if (otherId !== pId && aspects[otherId].includes(p.house) && aspects[pId].includes(kundli.grahas[otherId].house)) {
        mutualAspects.push(`Mutual Drishti with ${kundli.grahas[otherId].name}`);
      }
    });

    return {
      planet: `${p.name} (${p.sanskritName})`,
      aspectsHouses: castList,
      mutualAspects: mutualAspects.length > 0 ? mutualAspects : ['No direct mutual opposition'],
      practicalImpact: `Radiates ${p.name}'s influence into houses ${aspects[pId].join(', ')}, harmonizing or challenging their respective affairs.`,
    };
  });

  // 8. Yogas
  const yogas = (kundli.yogas || []).map((y) => ({
    name: y.name,
    sanskritName: y.sanskritName || y.name,
    type: y.type || 'Auspicious Combination',
    description: y.description,
    realLifeImpact: `May manifest as ${(y.significance || y.description || 'positive life alignment').toLowerCase()}, providing noticeable support when disciplined effort is applied.`,
  }));

  // 9. Dasha Analysis
  const maha = kundli.vimshottariDasha.currentMahadasha;
  const antar = kundli.vimshottariDasha.currentAntardasha;
  const upcomingMilestones = (kundli.vimshottariDasha.fullTimeline || []).slice(0, 4).map((d) => ({
    period: `${d.startYear} - ${d.endYear}`,
    planetCombo: `${d.lordName} Mahadasha`,
    theme: `Governed by ${d.lordName}, activating houses ruled by ${d.lordName} in your birth chart.`,
  }));

  const dashaNarrative = `You are currently experiencing the Mahadasha of ${maha.lordName} alongside the Antardasha of ${antar.lordName}. In Vedic astrology, the Mahadasha sets the grand multi-year thematic backdrop, while the Antardasha dictates day-to-day circumstances. This period may bring opportunities to build on the qualities of ${maha.lordName}, emphasizing patience, learning, and steady execution.`;

  // 10. Multi-Year Forecast
  const forecastPeriods = generateMultiYearForecast(kundli, forecastYears);

  // 11 - 17 Life Domain Syntheses
  const lifeDomains = {
    career: {
      headline: 'Purposeful Leadership & Steady Compounding',
      primaryInfluences: `10th House in ${RASHI_NAMES[(((lagnaSign - 1 + 9) % 12))]}, ruled by ${RASHI_LORDS[(((lagnaSign - 1 + 9) % 12))]}.`,
      possiblePaths: [
        'Strategic management, engineering, finance, or administrative leadership.',
        'Independent advisory, creative technological systems, or consultative services.',
        'High fulfillment when holding direct ownership of end-to-end results.',
      ],
      longTermOutlook: 'Career trajectory shows compounding returns as your mid-thirties and forties progress, especially during supportive dasha sub-periods.',
    },
    money: {
      headline: 'Sustainable Wealth Through Sound Systems',
      primaryInfluences: `2nd House (Assets) and 11th House (Income Gains) interacting with D1 & D2 charts.`,
      accumulationPatterns: [
        'Propensity to build steady, diversified asset reserves over high-volatility gambles.',
        'Possibility of secondary revenue from intellectual property, real estate, or strategic alliances.',
        'Value in maintaining an emergency cushion to protect against cyclic market downturns.',
      ],
      financialWisdom: 'True wealth accumulation in your chart is best achieved through patient compound interest and ethical business practices.',
    },
    education: {
      headline: 'Deep Analytical Intellect & Lifelong Learning',
      primaryInfluences: `4th House of foundations & 5th House of creative intelligence.`,
      intellectualStrengths: [
        'Strong capacity for synthesizing disparate concepts into practical workflows.',
        'Natural curiosity for technical, philosophical, and humanistic knowledge.',
        'Excellence in structured self-study and continuing professional education.',
      ],
      higherLearningOutlook: 'Certifications and ongoing upskilling will likely open high-leverage career doors at critical turning points.',
    },
    relationships: {
      headline: 'Complementary Harmony & Mutual Growth',
      primaryInfluences: `7th House of partnership in ${RASHI_NAMES[(((lagnaSign - 1 + 6) % 12))]}, ruled by ${RASHI_LORDS[(((lagnaSign - 1 + 6) % 12))]}.`,
      partnershipStyle: [
        'Thrives when partner offers an emotionally grounded, honest counterweight.',
        'Values mutual respect for individual autonomy and shared intellectual pursuits.',
        'Communication clarity will always be the golden key to navigating stressful transitions.',
      ],
      relationshipAdvice: 'Approach relationship friction as shared problem-solving rather than personal defense.',
    },
    family: {
      headline: 'Protective Sanctuary & Ancestral Respect',
      primaryInfluences: `2nd & 4th Houses of domestic heritage.`,
      domesticHarmony: [
        'Desire for a calm, organized living space free from chaotic external demands.',
        'Willingness to act as a pillar of strength for immediate and extended family.',
        'Value in establishing consistent home traditions and shared celebratory rituals.',
      ],
      ancestralDynamics: 'Strong karmic bonds with maternal and paternal lineages that provide unspoken inner grounding.',
    },
    health: {
      headline: 'Resilience Through Daily Rhythm & Balance',
      primaryInfluences: `1st House of constitution & 6th House of physical immunity.`,
      vitalityPointers: [
        'Consistency in sleep schedules and meal timing pays huge dividends in daily stamina.',
        'Beneficial to balance intensive mental work with grounding physical movement (walking, yoga).',
        'Paying prompt attention to minor bodily signals prevents prolonged fatigue.',
      ],
      mindBodyCare: 'Hydration, seasonal wholesome nutrition, and deliberate mental quietude are your most effective medicines.',
    },
    travel: {
      headline: 'Expansive Journeys & Cross-Cultural Perspectives',
      primaryInfluences: `9th House of long travels & 12th House of foreign connections.`,
      travelIndications: [
        'High potential for rewarding cross-border travel for work, education, or leisure.',
        'Possibility of extended residence or productive collaboration with international teams.',
        'Spiritual or historical sites often spark unexpected creative breakthroughs for you.',
      ],
      foreignSettlementPotential: 'Favorable alignment for thriving in cosmopolitan environments or overseas ecosystems.',
    },
  };

  // 18. Strengths & Challenges
  const strengthsAndChallenges = {
    innateStrengths: [
      { title: 'Intellectual Clarity', explanation: 'Ability to deconstruct complex situations calmly and identify logical next steps.' },
      { title: 'Core Loyalty', explanation: 'Deep commitment to promises, long-term relationships, and ethical professional standards.' },
      { title: 'Resourcefulness', explanation: 'Natural instinct to find creative pathways forward when standard routes are blocked.' },
      { title: 'Strategic Patience', explanation: 'Willingness to invest upfront effort for compounding future rewards.' },
    ],
    karmicChallenges: [
      { title: 'Over-Analysis Tendency', guidance: 'Guard against getting stuck in mental deliberation when intuitive action is required.' },
      { title: 'Boundary Preservation', guidance: 'Practice saying a polite "no" to non-essential commitments that drain your vitality.' },
      { title: 'Managing Expectations', guidance: 'Allow others the grace to grow at their own pace without holding them to unrealistic standards.' },
    ],
  };

  // 19. Possible Life Manifestations (Scenarios)
  const lifeManifestations = [
    {
      category: 'Professional Milestone',
      scenarioTitle: 'Leading a Major Transformation Initiative',
      whatMayHappen: 'You may be entrusted with turning around an underperforming project or spearheading a high-visibility initiative.',
      howToPrepare: 'Focus on clear milestone tracking and over-communicate with key stakeholders early in the cycle.',
    },
    {
      category: 'Financial Milestone',
      scenarioTitle: 'Acquisition of Long-Term Fixed Property or Equity',
      whatMayHappen: 'A window of opportunity could open for acquiring residential land, commercial space, or meaningful equity stakes.',
      howToPrepare: 'Conduct rigorous legal and title due diligence, ensuring financing terms remain conservative.',
    },
    {
      category: 'Personal & Relationship',
      scenarioTitle: 'Deepening Alliance & Shared Life Blueprint',
      whatMayHappen: 'You and your partner may consolidate financial or living arrangements, establishing a unified shared vision.',
      howToPrepare: 'Schedule candid, relaxed conversations about values, family priorities, and mutual career aspirations.',
    },
    {
      category: 'Inner Development',
      scenarioTitle: 'Shift From External Approval to Authentic Dharma',
      whatMayHappen: 'A profound realization that your peace of mind matters infinitely more than impressing social acquaintances.',
      howToPrepare: 'Carve out regular time for contemplation, meditation, and meaningful reading away from digital noise.',
    },
  ];

  // 20. Technical Details
  const atmakaraka = kundli.grahasList.find((g) => g.karaka?.includes('Atmakaraka'))?.name || 'Sun';
  const amatyakaraka = kundli.grahasList.find((g) => g.karaka?.includes('Amatyakaraka'))?.name || 'Mercury';
  const savPoints = kundli.sarvashtakavarga?.signs?.map((s) => ({
    sign: s.signName,
    bindus: s.bindus,
    house: s.houseFromLagna,
  })) || [];

  const d9Highlights = [
    `D9 Navamsha Lagna is ${kundli.divisionalCharts?.D9?.name || 'Navamsha'} (${RASHI_NAMES[(kundli.divisionalCharts?.D9?.lagnaSign || 1) - 1]}).`,
    `Reflects second half of life, marital harmony, and inner dharmic alignment.`,
    `Jupiter placement in D9 indicates protective spiritual shielding.`,
  ];

  const d10Highlights = [
    `D10 Dasamsha Lagna is ${RASHI_NAMES[(kundli.divisionalCharts?.D10?.lagnaSign || 1) - 1]}.`,
    `Governs civic prestige, professional promotions, and organizational achievements.`,
    `Indicates leadership potential in structured corporate or institutional environments.`,
  ];

  return {
    nativeName: details.name || 'Seeker',
    gender: details.gender || 'male',
    birthDateFormatted: details.dob,
    birthTimeFormatted: details.tob,
    birthPlace: details.city,
    generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    selectedForecastYears: forecastYears,

    executiveSummary: {
      headline: `Vedic Astrological Blueprint: ${lagnaSignName} Ascendant with ${kundli.moonSignName} Moon`,
      lifeCoreTheme: `Your chart exhibits a powerful synthesis of ${lagnaSignName} vitality with ${kundli.moonSignName} emotional depth, anchored by ${kendraCount} planets in action quadrants (Kendras) and ${trikonaCount} planets in auspicious fortune trines (Trikonas).`,
      majorOpportunities: [
        'Strategic leadership roles that reward long-term planning and independent initiative.',
        'Financial stability gained through structured asset accumulation and disciplined diversification.',
        'Intellectual mastery in complex, analytical, or communicative disciplines.',
        'Fulfilling one-on-one relationships that act as a complementary mirror for mutual evolution.',
      ],
      mindsetGuidance: [
        'Anchor your self-worth in personal integrity rather than temporary external praise.',
        'Protect your daily rhythm and restorative sleep as non-negotiable foundations for success.',
        'View temporary obstacles as cosmic training grounds that sharpen your natural resilience.',
      ],
      currentCosmicClimate: `Operating under the Vimshottari Mahadasha of ${maha.lordName} with transiting Jupiter and Saturn energizing key angular sectors of your chart.`,
    },

    chartOverview: {
      ascendantSign: lagnaSignName,
      ascendantLord: lagnaLord,
      moonSign: kundli.moonSignName,
      moonNakshatra: `${kundli.nakshatra.name} (Pada ${kundli.nakshatra.pada})`,
      sunSign: kundli.grahas.sun.rashiName,
      chartElementBalance: elementCounts,
      kendraStrongCount: kendraCount,
      trikonaCount: trikonaCount,
      overviewNarrative: `This horoscope is rooted in the ${lagnaSignName} ascendant, endowing the native with natural determination and distinct presence. With the Moon placed in ${kundli.moonSignName} under the ${kundli.nakshatra.name} constellation, the emotional instinct is sharp, observant, and resilient. Planetary placements in key cardinal houses signal an active, self-driven life path capable of leaving enduring marks.`,
    },

    ascendantAnalysis: {
      sign: lagnaSignName,
      exactDegree: kundli.lagna.formattedDegree,
      nakshatra: kundli.lagna.nakshatraName,
      pada: kundli.lagna.nakshatraPada,
      lord: lagnaLord,
      lordPlacedInHouse: kundli.grahas[
        (Object.keys(kundli.grahas) as PlanetId[]).find((p) => kundli.grahas[p].name === lagnaLord) || 'sun'
      ]?.house || 1,
      lordPlacedInSign: kundli.grahas[
        (Object.keys(kundli.grahas) as PlanetId[]).find((p) => kundli.grahas[p].name === lagnaLord) || 'sun'
      ]?.rashiName || lagnaSignName,
      physicalTraitsAndVibe: 'Distinctive posture, focused gaze, and a commanding yet approachable aura that conveys reliability.',
      psychologicalTemperament: 'Self-motivated, strategic, protective of close ones, and endowed with high tenacity under pressure.',
      lifeOrientation: 'A journey focused on self-mastery, building authentic security, and translating high ideals into tangible reality.',
    },

    houses,
    planets,
    houseLordsMatrix,
    aspectsBreakdown,
    yogas,
    dashaAnalysis: {
      currentMahadasha: maha.lordName,
      currentAntardasha: antar.lordName,
      currentPratyantardasha: kundli.vimshottariDasha.currentPratyantardasha?.lordName || 'Jupiter',
      mahadashaEndYear: maha.endYear,
      dashaNarrative,
      upcomingMilestones,
    },
    multiYearForecast: {
      durationYears: forecastYears,
      introOverview: `Comprehensive ${forecastYears}-year predictive forecast analyzing transits of Brihaspati (Jupiter), Shani (Saturn), Rahu & Ketu across your natal houses, calibrated with your active Vimshottari Dasha periods. All interpretations are framed in terms of possibilities, potential opportunities, and optimal timing windows.`,
      periods: forecastPeriods,
    },
    lifeDomains,
    strengthsAndChallenges,
    lifeManifestations,
    technicalDetails: {
      ayanamsha: kundli.formattedAyanamsha,
      tithiDetails: kundli.tithi ? `${kundli.tithi.name || kundli.tithi.tithi?.name || 'Tithi'} (${kundli.tithi.paksha || kundli.tithi.tithi?.paksha || ''})` : 'Calculated',
      atmakaraka,
      amatyakaraka,
      sarvashtakavargaPoints: savPoints,
      d9NavamshaHighlights: d9Highlights,
      d10DasamshaHighlights: d10Highlights,
    },
  };
}
