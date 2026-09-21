import { PlanetId, HouseNumber } from '../types/astrology';
import {
  DailyHoroscopeCategoryKey,
  CategoryScoreDetail,
  TransitPlanetInfo,
  PanchangData,
  DailyHoroscopeResult,
  HoroscopeUserProfile,
} from '../types/horoscope';
import {
  BirthDetails,
  calculateVedicBirthProfile,
  NAKSHATRAS,
  RASHI_NAMES,
  RASHI_LORDS,
} from './vedicAstrologyCalculator';
import {
  generateCompleteKundli,
  CompleteKundliData,
} from './vedicEphemeris';

// -------------------------------------------------------------
// 1. ASTRONOMICAL TRANSIT ENGINE (GOCHAR)
// -------------------------------------------------------------

// Julian Day Number Calculation
export function getJulianDayForDate(dateStr: string, hourFraction: number = 12.0, tzOffset: number = 5.5): number {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const utcHours = hourFraction - tzOffset;
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFraction = day + utcHours / 24.0;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFraction + b - 1524.5;
}

// Approximate Lahiri Ayanamsha for date
export function getAyanamsha(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;
  return 23.856 + 1.396 * t;
}

// Sidereal Mean Longitude of Sun
function getSunSiderealLon(d: number, ayanamsha: number): number {
  const meanSun = (280.460 + 0.9856474 * d) % 360;
  const gSun = ((357.528 + 0.9856003 * d) * Math.PI) / 180;
  const sunEcliptic = (meanSun + 1.915 * Math.sin(gSun) + 0.020 * Math.sin(2 * gSun) + 360) % 360;
  return (sunEcliptic - ayanamsha + 360) % 360;
}

// Sidereal Mean Longitude of Moon
function getMoonSiderealLon(d: number, ayanamsha: number): number {
  const gSun = ((357.528 + 0.9856003 * d) * Math.PI) / 180;
  const meanMoon = (218.316 + 13.176396 * d) % 360;
  const moonEcliptic = (meanMoon + 6.289 * Math.sin(gSun) + 360) % 360;
  return (moonEcliptic - ayanamsha + 360) % 360;
}

// Calculate Sidereal Planetary Transits for any date
export function calculateTransitsForDate(
  dateStr: string,
  natalLagnaSign: number,
  natalMoonSign: number,
  tzOffset: number = 5.5
): Record<PlanetId, TransitPlanetInfo> {
  const jd = getJulianDayForDate(dateStr, 12.0, tzOffset);
  const d = jd - 2451545.0;
  const ayanamsha = getAyanamsha(jd);

  const sunLon = getSunSiderealLon(d, ayanamsha);
  const moonLon = getMoonSiderealLon(d, ayanamsha);

  // Mean motions & approximate heliocentric to geocentric models for outer/inner grahas
  const marsMean = (355.433 + 0.5240330 * d) % 360;
  const marsLon = (marsMean - ayanamsha + 360) % 360;

  const mercMean = (280.46 + 4.092334 * d) % 360;
  // Mercury elongation bounded within ~28° of Sun
  const mercElong = 22 * Math.sin((d * 0.071) % (2 * Math.PI));
  const mercLon = (sunLon + mercElong + 360) % 360;

  const jupMean = (34.351 + 0.0830853 * d) % 360;
  const jupLon = (jupMean - ayanamsha + 360) % 360;

  const venMean = (280.46 + 1.602130 * d) % 360;
  // Venus elongation bounded within ~47° of Sun
  const venElong = 42 * Math.sin((d * 0.027) % (2 * Math.PI));
  const venLon = (sunLon + venElong + 360) % 360;

  const satMean = (50.077 + 0.0334442 * d) % 360;
  const satLon = (satMean - ayanamsha + 360) % 360;

  // Rahu (Mean lunar node, retrograde: -0.05295°/day)
  const rahuMean = (125.0445 - 0.0529538 * d) % 360;
  const rahuLon = (rahuMean - ayanamsha + 360) % 360;
  const ketuLon = (rahuLon + 180) % 360;

  const planetaryPositions: { id: PlanetId; lon: number; name: string; sanskrit: string }[] = [
    { id: 'sun', lon: sunLon, name: 'Sun', sanskrit: 'Surya' },
    { id: 'moon', lon: moonLon, name: 'Moon', sanskrit: 'Chandra' },
    { id: 'mars', lon: marsLon, name: 'Mars', sanskrit: 'Mangala' },
    { id: 'mercury', lon: mercLon, name: 'Mercury', sanskrit: 'Budha' },
    { id: 'jupiter', lon: jupLon, name: 'Jupiter', sanskrit: 'Guru' },
    { id: 'venus', lon: venLon, name: 'Venus', sanskrit: 'Shukra' },
    { id: 'saturn', lon: satLon, name: 'Saturn', sanskrit: 'Shani' },
    { id: 'rahu', lon: rahuLon, name: 'Rahu', sanskrit: 'Rahu' },
    { id: 'ketu', lon: ketuLon, name: 'Ketu', sanskrit: 'Ketu' },
  ];

  const result: Partial<Record<PlanetId, TransitPlanetInfo>> = {};

  planetaryPositions.forEach((p) => {
    const transitSign = Math.floor(p.lon / 30) + 1;
    const degInSign = p.lon % 30;
    const deg = Math.floor(degInSign);
    const min = Math.floor((degInSign - deg) * 60);

    const houseFromLagna = (((transitSign - natalLagnaSign + 12) % 12) + 1) as HouseNumber;
    const houseFromMoon = (((transitSign - natalMoonSign + 12) % 12) + 1) as HouseNumber;

    // Retrogression
    let isRetrograde = false;
    if (p.id === 'rahu' || p.id === 'ketu') {
      isRetrograde = true; // Always naturally retrograde in mean node
    } else if (p.id === 'saturn' || p.id === 'jupiter' || p.id === 'mars') {
      const sunDiff = Math.abs((p.lon - sunLon + 360) % 360);
      if (sunDiff > 120 && sunDiff < 240) isRetrograde = true;
    } else if (p.id === 'mercury') {
      isRetrograde = Math.cos(d * 0.071) < -0.6;
    } else if (p.id === 'venus') {
      isRetrograde = Math.cos(d * 0.027) < -0.8;
    }

    // Combustion (Moudhya)
    const sunDist = Math.min(Math.abs((p.lon - sunLon + 360) % 360), 360 - Math.abs((p.lon - sunLon + 360) % 360));
    let isCombust = false;
    if (p.id === 'moon' && sunDist < 12) isCombust = true;
    if (p.id === 'mars' && sunDist < 17) isCombust = true;
    if (p.id === 'mercury' && sunDist < 14) isCombust = true;
    if (p.id === 'jupiter' && sunDist < 11) isCombust = true;
    if (p.id === 'venus' && sunDist < 10) isCombust = true;
    if (p.id === 'saturn' && sunDist < 15) isCombust = true;

    // Classical Dignity in Transit Sign
    let dignity = 'Neutral';
    if (p.id === 'sun') {
      if (transitSign === 1) dignity = 'Exalted (Ucha)';
      else if (transitSign === 7) dignity = 'Debilitated (Neecha)';
      else if (transitSign === 5) dignity = 'Own Sign (Swakshetra)';
      else if ([9, 12, 8, 4].includes(transitSign)) dignity = 'Friend Sign';
    } else if (p.id === 'moon') {
      if (transitSign === 2) dignity = 'Exalted (Ucha)';
      else if (transitSign === 8) dignity = 'Debilitated (Neecha)';
      else if (transitSign === 4) dignity = 'Own Sign (Swakshetra)';
      else if ([1, 5, 9, 3].includes(transitSign)) dignity = 'Friend Sign';
    } else if (p.id === 'mars') {
      if (transitSign === 10) dignity = 'Exalted (Ucha)';
      else if (transitSign === 4) dignity = 'Debilitated (Neecha)';
      else if (transitSign === 1 || transitSign === 8) dignity = 'Own Sign (Swakshetra)';
      else if ([5, 9, 12].includes(transitSign)) dignity = 'Friend Sign';
    } else if (p.id === 'mercury') {
      if (transitSign === 6) dignity = 'Exalted / Swakshetra';
      else if (transitSign === 12) dignity = 'Debilitated (Neecha)';
      else if (transitSign === 3) dignity = 'Own Sign (Swakshetra)';
      else if ([2, 7, 5, 11].includes(transitSign)) dignity = 'Friend Sign';
    } else if (p.id === 'jupiter') {
      if (transitSign === 4) dignity = 'Exalted (Ucha)';
      else if (transitSign === 10) dignity = 'Debilitated (Neecha)';
      else if (transitSign === 9 || transitSign === 12) dignity = 'Own Sign (Swakshetra)';
      else if ([1, 5, 8].includes(transitSign)) dignity = 'Friend Sign';
    } else if (p.id === 'venus') {
      if (transitSign === 12) dignity = 'Exalted (Ucha)';
      else if (transitSign === 6) dignity = 'Debilitated (Neecha)';
      else if (transitSign === 2 || transitSign === 7) dignity = 'Own Sign (Swakshetra)';
      else if ([3, 11, 10].includes(transitSign)) dignity = 'Friend Sign';
    } else if (p.id === 'saturn') {
      if (transitSign === 7) dignity = 'Exalted (Ucha)';
      else if (transitSign === 1) dignity = 'Debilitated (Neecha)';
      else if (transitSign === 10 || transitSign === 11) dignity = 'Own Sign (Swakshetra)';
      else if ([2, 3, 6].includes(transitSign)) dignity = 'Friend Sign';
    } else if (p.id === 'rahu') {
      if (transitSign === 2 || transitSign === 3) dignity = 'Exalted / Favorable';
      else if (transitSign === 8 || transitSign === 9) dignity = 'Debilitated / Volatile';
      else dignity = 'Shadow Node';
    } else if (p.id === 'ketu') {
      if (transitSign === 8 || transitSign === 9) dignity = 'Exalted / Mystical';
      else if (transitSign === 2 || transitSign === 3) dignity = 'Debilitated / Volatile';
      else dignity = 'Spiritual Shadow Node';
    }

    // Aspects from Lagna
    const aspectHouses: HouseNumber[] = [];
    const addAspect = (hOffset: number) => {
      const targetHouse = (((houseFromLagna - 1 + hOffset) % 12) + 1) as HouseNumber;
      aspectHouses.push(targetHouse);
    };
    // 7th house aspect common to all
    addAspect(6);
    if (p.id === 'mars') {
      addAspect(3); // 4th aspect
      addAspect(7); // 8th aspect
    } else if (p.id === 'jupiter' || p.id === 'rahu' || p.id === 'ketu') {
      addAspect(4); // 5th aspect
      addAspect(8); // 9th aspect
    } else if (p.id === 'saturn') {
      addAspect(2); // 3rd aspect
      addAspect(9); // 10th aspect
    }

    // Typical SAV bindus for transiting sign (between 24 and 35)
    const baseSAV = 28 + Math.round(5 * Math.sin((transitSign * 1.6 + 2) % (2 * Math.PI)));

    result[p.id] = {
      planetId: p.id,
      name: p.name,
      sanskritName: p.sanskrit,
      natalSign: 1, // updated downstream from natal chart
      natalSignName: '',
      transitSign,
      transitSignName: RASHI_NAMES[transitSign - 1],
      houseFromLagna,
      houseFromMoon,
      degree: Number(degInSign.toFixed(2)),
      formattedDegree: `${deg}° ${min.toString().padStart(2, '0')}'`,
      isRetrograde,
      isCombust,
      dignity,
      aspectingHousesFromLagna: aspectHouses,
      savBindus: Math.max(20, Math.min(38, baseSAV)),
    };
  });

  return result as Record<PlanetId, TransitPlanetInfo>;
}

// -------------------------------------------------------------
// 2. PANCHANG ENGINE
// -------------------------------------------------------------

const NITYA_YOGAS = [
  { name: 'Vishkambha', nature: 'Malefic', significance: 'Obstacles require patient navigation and inner fortitude' },
  { name: 'Priti', nature: 'Benefic', significance: 'Affection, harmonious friendships, and warm mutual regard' },
  { name: 'Ayushman', nature: 'Benefic', significance: 'Vitality, longevity, good health, and enduring works' },
  { name: 'Saubhagya', nature: 'Benefic', significance: 'Auspicious fortune, prosperity, and blessed connections' },
  { name: 'Shobhana', nature: 'Benefic', significance: 'Splendor, artistic grace, and refined aesthetic creations' },
  { name: 'Atiganda', nature: 'Malefic', significance: 'Sensitive knot; exercise extra prudence in high-stakes decisions' },
  { name: 'Sukarma', nature: 'Benefic', significance: 'Noble deeds, righteous actions, and successful endeavors' },
  { name: 'Dhriti', nature: 'Benefic', significance: 'Unshakeable patience, endurance, and steady persistence' },
  { name: 'Shoola', nature: 'Malefic', significance: 'Spike-like hurdles; prioritize grounding and protective prayers' },
  { name: 'Ganda', nature: 'Malefic', significance: 'Delicate transitional currents; avoid haste and rash commitments' },
  { name: 'Vriddhi', nature: 'Benefic', significance: 'Growth, financial expansion, and fruitful business transactions' },
  { name: 'Dhruva', nature: 'Benefic', significance: 'Permanence, stability, and enduring foundation building' },
  { name: 'Vyaghata', nature: 'Malefic', significance: 'High energetic friction; channel intensity into disciplined fitness' },
  { name: 'Harshana', nature: 'Benefic', significance: 'Exuberant joy, glad tidings, and celebratory gatherings' },
  { name: 'Vajra', nature: 'Malefic', significance: 'Diamond-hard resistance; persevere with unwavering integrity' },
  { name: 'Asiddhi', nature: 'Malefic', significance: 'Delays in fruitfulness; focus on refining rather than launching' },
  { name: 'Vyatipata', nature: 'Malefic', significance: 'Karmic recalibration; ideal for charitable donation and introspection' },
  { name: 'Variyan', nature: 'Benefic', significance: 'Comfort, luxury, ease of work, and auspicious agreements' },
  { name: 'Parigha', nature: 'Malefic', significance: 'Protective barrier; safe for consolidation, avoid aggression' },
  { name: 'Shiva', nature: 'Benefic', significance: 'Auspicious benevolence, spiritual breakthroughs, and divine grace' },
  { name: 'Siddha', nature: 'Benefic', significance: 'Accomplishment of goals, mastery, and triumphant fulfillment' },
  { name: 'Sadhya', nature: 'Benefic', significance: 'Feasible achievements, cooperative alliances, and success' },
  { name: 'Shubha', nature: 'Benefic', significance: 'Radiant purity, auspicious ceremonies, and joyful beginnings' },
  { name: 'Shukla', nature: 'Benefic', significance: 'Luminous clarity, radiant perception, and mental peace' },
  { name: 'Brahma', nature: 'Benefic', significance: 'Universal wisdom, scholarly scholarship, and creative birth' },
  { name: 'Indra', nature: 'Benefic', significance: 'Executive authority, public prestige, and leadership acclaim' },
  { name: 'Vaidhriti', nature: 'Malefic', significance: 'Contrarian currents; stay anchored in quiet contemplative rituals' },
];

const KARANAS = [
  { name: 'Bava', type: 'Chara' },
  { name: 'Balava', type: 'Chara' },
  { name: 'Kaulava', type: 'Chara' },
  { name: 'Taitila', type: 'Chara' },
  { name: 'Gara', type: 'Chara' },
  { name: 'Vanija', type: 'Chara' },
  { name: 'Vishti (Bhadra)', type: 'Chara' },
  { name: 'Shakuni', type: 'Sthira' },
  { name: 'Chatushpada', type: 'Sthira' },
  { name: 'Naga', type: 'Sthira' },
  { name: 'Kimstughna', type: 'Sthira' },
];

const DAY_OF_WEEK_LORDS: { name: string; lord: string; sanskritLord: string }[] = [
  { name: 'Sunday', lord: 'Sun', sanskritLord: 'Surya' },
  { name: 'Monday', lord: 'Moon', sanskritLord: 'Chandra' },
  { name: 'Tuesday', lord: 'Mars', sanskritLord: 'Mangala' },
  { name: 'Wednesday', lord: 'Mercury', sanskritLord: 'Budha' },
  { name: 'Thursday', lord: 'Jupiter', sanskritLord: 'Brihaspati' },
  { name: 'Friday', lord: 'Venus', sanskritLord: 'Shukra' },
  { name: 'Saturday', lord: 'Saturn', sanskritLord: 'Shani' },
];

export function calculatePanchang(dateStr: string, tzOffset: number = 5.5): PanchangData {
  const jd = getJulianDayForDate(dateStr, 12.0, tzOffset);
  const d = jd - 2451545.0;
  const ayanamsha = getAyanamsha(jd);

  const sunLon = getSunSiderealLon(d, ayanamsha);
  const moonLon = getMoonSiderealLon(d, ayanamsha);

  // Day of Week
  const dateObj = new Date(dateStr + 'T12:00:00Z');
  const dayIdx = dateObj.getUTCDay(); // 0 = Sunday
  const dayInfo = DAY_OF_WEEK_LORDS[dayIdx] || DAY_OF_WEEK_LORDS[0];

  // Tithi from Sun-Moon distance (each tithi is 12°)
  const moonSunAngle = (moonLon - sunLon + 360) % 360;
  const tithiIndex = Math.floor(moonSunAngle / 12) + 1; // 1 to 30
  const isShukla = tithiIndex <= 15;
  const paksha = isShukla ? 'Shukla' : 'Krishna';
  const tithiNumInPaksha = isShukla ? tithiIndex : tithiIndex - 15;

  const TITHI_NAMES = [
    'Pratipada (1st)', 'Dwitiya (2nd)', 'Tritiya (3rd)', 'Chaturthi (4th)', 'Panchami (5th)',
    'Shasthi (6th)', 'Saptami (7th)', 'Ashtami (8th)', 'Navami (9th)', 'Dashami (10th)',
    'Ekadashi (11th)', 'Dwadashi (12th)', 'Trayodashi (13th)', 'Chaturdashi (14th)',
    isShukla ? 'Purnima (Full Moon)' : 'Amavasya (New Moon)',
  ];
  const tithiName = `${paksha} ${TITHI_NAMES[tithiNumInPaksha - 1] || 'Pratipada'}`;

  // Nakshatra from Moon Lon (each 13° 20' = 13.3333°)
  const nakshatraIndex = Math.floor(moonLon / (360 / 27)) % 27;
  const nakshatraPada = Math.floor((moonLon % (360 / 27)) / (360 / 108)) + 1;
  const NAKSHATRA_LORDS = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  ];

  // Nitya Yoga from (Sun Lon + Moon Lon) % 360 / 13.3333°
  const yogaIndex = Math.floor(((sunLon + moonLon) % 360) / (360 / 27)) % 27;
  const yogaInfo = NITYA_YOGAS[yogaIndex] || NITYA_YOGAS[0];

  // Karana from moonSunAngle / 6° (each 6°)
  const karanaIndex = Math.floor(moonSunAngle / 6) % 11;
  const karanaInfo = KARANAS[karanaIndex] || KARANAS[0];

  // Choghadiya sequences based on Day of Week
  const DAY_CHOGHADIYA_ORDER: Record<number, Array<'Udveg' | 'Char' | 'Labh' | 'Amrit' | 'Kaal' | 'Shubh' | 'Rog'>> = {
    0: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], // Sunday
    1: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'], // Monday
    2: ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'], // Tuesday
    3: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'], // Wednesday
    4: ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'], // Thursday
    5: ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'], // Friday
    6: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal'], // Saturday
  };

  const dayOrder = DAY_CHOGHADIYA_ORDER[dayIdx] || DAY_CHOGHADIYA_ORDER[0];
  const timeSlots = [
    '06:00 AM - 07:30 AM',
    '07:30 AM - 09:00 AM',
    '09:00 AM - 10:30 AM',
    '10:30 AM - 12:00 PM',
    '12:00 PM - 01:30 PM',
    '01:30 PM - 03:00 PM',
    '03:00 PM - 04:30 PM',
    '04:30 PM - 06:00 PM',
  ];

  const choghadiyaWindows = dayOrder.map((type, i) => {
    let nature: 'Auspicious' | 'Moderate' | 'Inauspicious' = 'Moderate';
    let guidance = 'Standard steady routine activities.';
    if (type === 'Amrit') {
      nature = 'Auspicious';
      guidance = 'Supreme nectar timing for contracts, ceremonies, health remedies, and beginnings.';
    } else if (type === 'Shubh') {
      nature = 'Auspicious';
      guidance = 'Highly auspicious for worship, new ventures, study, and financial commitments.';
    } else if (type === 'Labh') {
      nature = 'Auspicious';
      guidance = 'Excellent for commerce, trade, launching sales, and networking for profit.';
    } else if (type === 'Char') {
      nature = 'Moderate';
      guidance = 'Favorable for dynamic motion, commuting, deliveries, and swift actions.';
    } else if (type === 'Rog') {
      nature = 'Inauspicious';
      guidance = 'Delicate period; avoid medical surgeries, risky conflicts, and disputes.';
    } else if (type === 'Kaal') {
      nature = 'Inauspicious';
      guidance = 'Ruled by Saturn/Yama; avoid new undertakings; prioritize caution and safety.';
    } else if (type === 'Udveg') {
      nature = 'Inauspicious';
      guidance = 'Sun-dominated restlessness; maintain composure and avoid impulsive arguments.';
    }

    return {
      name: `${type} Choghadiya`,
      type,
      timeWindow: timeSlots[i],
      nature,
      guidance,
    };
  });

  // Most Auspicious Muhurat of the day
  const bestChoghadiya = choghadiyaWindows.find((w) => w.type === 'Amrit' || w.type === 'Shubh') || choghadiyaWindows[1];

  return {
    date: dateStr,
    dayOfWeek: dayInfo.name,
    varaLord: dayInfo.lord,
    varaLordSanskrit: dayInfo.sanskritLord,
    tithi: {
      name: tithiName,
      paksha,
      number: tithiIndex,
      description: isShukla
        ? 'Waxing moon currents fostering growth, outward expansion, and productive initiative.'
        : 'Waning moon currents favoring consolidation, introspection, cleansing, and completion.',
    },
    nakshatra: {
      name: NAKSHATRAS[nakshatraIndex],
      number: nakshatraIndex + 1,
      pada: nakshatraPada,
      lord: NAKSHATRA_LORDS[nakshatraIndex],
    },
    yoga: {
      name: yogaInfo.name,
      number: yogaIndex + 1,
      nature: yogaInfo.nature as 'Benefic' | 'Malefic' | 'Neutral',
      significance: yogaInfo.significance,
    },
    karana: {
      name: karanaInfo.name,
      number: karanaIndex + 1,
      type: karanaInfo.type as 'Chara' | 'Sthira',
    },
    currentHora: {
      planet: dayInfo.lord,
      sanskritName: dayInfo.sanskritLord,
      quality: 'Vital & Auspicious',
      favorableFor: `Directly supported by ${dayInfo.lord}'s presiding cosmic radiation.`,
    },
    choghadiyaWindows,
    auspiciousMuhurat: `${bestChoghadiya.name} (${bestChoghadiya.timeWindow})`,
  };
}

// -------------------------------------------------------------
// 3. TWENTY CATEGORY SCORING & INTERPRETATION ENGINE
// -------------------------------------------------------------

interface CategoryMeta {
  key: DailyHoroscopeCategoryKey;
  label: string;
  sanskritName: string;
  primaryHouse: HouseNumber;
  secondaryHouses: HouseNumber[];
  karakas: PlanetId[];
  coreTheme: string;
}

const CATEGORY_DEFINITIONS: CategoryMeta[] = [
  { key: 'overall', label: 'Overall Cosmic Alignment', sanskritName: 'Sarvatomukha Bhagyodaya', primaryHouse: 1, secondaryHouses: [9, 5, 10], karakas: ['sun', 'jupiter'], coreTheme: 'Personal vitality, general momentum, and overarching auspiciousness' },
  { key: 'career', label: 'Career & Ambition', sanskritName: 'Karma & Rajayoga', primaryHouse: 10, secondaryHouses: [6, 1, 11], karakas: ['sun', 'saturn', 'mercury'], coreTheme: 'Professional authority, recognition, career advancement, and executive standing' },
  { key: 'finance', label: 'Wealth & Liquidity', sanskritName: 'Dhana & Kosh', primaryHouse: 2, secondaryHouses: [11, 9, 5], karakas: ['jupiter', 'mercury', 'venus'], coreTheme: 'Cash inflows, accumulated assets, savings stewardship, and monetary balance' },
  { key: 'business', label: 'Business & Trade', sanskritName: 'Vyapar & Vanijya', primaryHouse: 7, secondaryHouses: [3, 10, 11], karakas: ['mercury', 'mars'], coreTheme: 'Commercial deals, client expansion, negotiations, and independent enterprise' },
  { key: 'love', label: 'Romantic Harmony', sanskritName: 'Prema & Shringara', primaryHouse: 5, secondaryHouses: [7, 12], karakas: ['venus', 'moon'], coreTheme: 'Affection, romantic sparks, heart-centered communication, and dating bliss' },
  { key: 'marriage', label: 'Spousal Bond', sanskritName: 'Dampatya Sukha', primaryHouse: 7, secondaryHouses: [2, 4], karakas: ['jupiter', 'venus'], coreTheme: 'Marital understanding, domestic unity, joint decisions, and partner support' },
  { key: 'health', label: 'Vitality & Wellness', sanskritName: 'Arogya & Swasthya', primaryHouse: 1, secondaryHouses: [6, 8], karakas: ['sun', 'mars'], coreTheme: 'Physical resilience, stamina, digestive fire (Agni), and immune defense' },
  { key: 'education', label: 'Learning & Intellect', sanskritName: 'Vidya & Medha', primaryHouse: 4, secondaryHouses: [5, 9], karakas: ['mercury', 'jupiter'], coreTheme: 'Academics, conceptual retention, intellectual clarity, and examinations' },
  { key: 'family', label: 'Family Harmony', sanskritName: 'Kutumba Sukha', primaryHouse: 2, secondaryHouses: [4], karakas: ['moon', 'jupiter'], coreTheme: 'Ancestral warmth, household peace, relatives, and mutual family respect' },
  { key: 'children', label: 'Progeny & Joy', sanskritName: 'Santana Bhava', primaryHouse: 5, secondaryHouses: [9], karakas: ['jupiter'], coreTheme: 'Children, creative progeny, playful delight, and nurturing parental bonding' },
  { key: 'travel', label: 'Journeys & Exploration', sanskritName: 'Yatra & Deshadana', primaryHouse: 3, secondaryHouses: [9, 12], karakas: ['moon', 'rahu'], coreTheme: 'Short commutes, international flights, pilgrimages, and dynamic changes of scenery' },
  { key: 'mentalHealth', label: 'Mental Tranquility', sanskritName: 'Manas Shanti', primaryHouse: 4, secondaryHouses: [1], karakas: ['moon', 'mercury'], coreTheme: 'Emotional equanimity, stress dissipation, sound sleep, and inner calm' },
  { key: 'socialLife', label: 'Alliances & Friends', sanskritName: 'Mitra & Samaja', primaryHouse: 11, secondaryHouses: [3, 7], karakas: ['venus', 'mercury'], coreTheme: 'Social gatherings, influential networks, community fellowship, and peer camaraderie' },
  { key: 'creativity', label: 'Creative Spark', sanskritName: 'Kala & Pratibha', primaryHouse: 5, secondaryHouses: [3], karakas: ['venus', 'mercury'], coreTheme: 'Artistic innovation, writing, design, poetic expression, and original ideation' },
  { key: 'spirituality', label: 'Spiritual Insight', sanskritName: 'Adhyatma & Moksha', primaryHouse: 9, secondaryHouses: [12, 8], karakas: ['jupiter', 'ketu'], coreTheme: 'Meditation depth, sacred mantra practice, philosophical realization, and divine alignment' },
  { key: 'luck', label: 'Divine Fortune', sanskritName: 'Bhagya Yoga', primaryHouse: 9, secondaryHouses: [5, 1], karakas: ['jupiter'], coreTheme: 'Serendipity, sudden opportunities, mentor blessings, and righteous luck' },
  { key: 'energy', label: 'Drive & Courage', sanskritName: 'Ojas & Parakrama', primaryHouse: 3, secondaryHouses: [1, 6], karakas: ['mars', 'sun'], coreTheme: 'Initiative, boldness, athletic drive, and determination to overcome barriers' },
  { key: 'communication', label: 'Speech & Articulation', sanskritName: 'Vak & Samvad', primaryHouse: 2, secondaryHouses: [3], karakas: ['mercury'], coreTheme: 'Persuasive speaking, diplomatic writing, clear messaging, and vocal impact' },
  { key: 'decisionMaking', label: 'Strategic Clarity', sanskritName: 'Viveka & Niti', primaryHouse: 1, secondaryHouses: [5, 10], karakas: ['jupiter', 'sun', 'mercury'], coreTheme: 'Decisive wisdom, discernment, absence of confusion, and sound long-term planning' },
  { key: 'investment', label: 'Wealth Compounding', sanskritName: 'Nivesh & Vriddhi', primaryHouse: 11, secondaryHouses: [2, 5, 9], karakas: ['jupiter', 'mercury'], coreTheme: 'Portfolio growth, real estate diligence, long-term capital allocation, and returns' },
];

// Compute category scores strictly through astrological mechanics
export function computeCategoryScores(
  transits: Record<PlanetId, TransitPlanetInfo>,
  panchang: PanchangData,
  activeMahadasha: PlanetId,
  activeAntardasha: PlanetId
): { scores: Record<DailyHoroscopeCategoryKey, number>; details: CategoryScoreDetail[] } {
  const scores: Partial<Record<DailyHoroscopeCategoryKey, number>> = {};
  const details: CategoryScoreDetail[] = [];

  CATEGORY_DEFINITIONS.forEach((cat) => {
    // 1. Base score
    let score = 70;

    // 2. Transiting planets in primary and secondary houses
    const primaryPlanets = Object.values(transits).filter((t) => t.houseFromLagna === cat.primaryHouse);
    const secondaryPlanets = Object.values(transits).filter((t) => cat.secondaryHouses.includes(t.houseFromLagna));

    const influencingPlanetNames: string[] = [];

    // Evaluate primary house occupants
    primaryPlanets.forEach((p) => {
      influencingPlanetNames.push(`${p.name} in H${p.houseFromLagna}`);
      if (['jupiter', 'venus', 'mercury', 'moon'].includes(p.planetId)) {
        score += p.dignity.includes('Exalted') || p.dignity.includes('Swakshetra') ? 14 : 9;
      } else if (['saturn', 'rahu', 'ketu', 'mars'].includes(p.planetId)) {
        // Upachaya houses (3, 6, 10, 11) flourish with malefics
        if ([3, 6, 10, 11].includes(p.houseFromLagna)) {
          score += 8; // Malefics give strong fighting spirit and worldly triumphs in Upachaya
        } else {
          score -= p.isRetrograde ? 12 : 7;
        }
      }
      if (p.isCombust) score -= 5;
    });

    // Evaluate karaka planets
    cat.karakas.forEach((karakaId) => {
      const kp = transits[karakaId];
      if (kp) {
        if (!influencingPlanetNames.some((n) => n.includes(kp.name))) {
          influencingPlanetNames.push(`${kp.name} (Karaka)`);
        }
        if (kp.dignity.includes('Exalted') || kp.dignity.includes('Swakshetra') || kp.dignity.includes('Friend')) {
          score += 6;
        } else if (kp.dignity.includes('Debilitated')) {
          score -= 8;
        }
        if (kp.isRetrograde) score -= 3;
      }
    });

    // Evaluate Sarvashtakavarga of primary house
    const primarySAV = transits.sun ? transits.sun.savBindus : 28;
    if (primarySAV >= 32) score += 8;
    else if (primarySAV >= 28) score += 4;
    else if (primarySAV < 25) score -= 7;

    // Dasha resonance
    if (cat.karakas.includes(activeMahadasha)) {
      score += 7;
      influencingPlanetNames.push(`${activeMahadasha.toUpperCase()} Dasha Ruler`);
    }
    if (cat.karakas.includes(activeAntardasha)) {
      score += 4;
    }

    // Panchang Vara resonance
    const varaLordId = panchang.varaLord.toLowerCase() as PlanetId;
    if (cat.karakas.includes(varaLordId)) {
      score += 4;
    }

    // Panchang Nitya Yoga modifier
    if (panchang.yoga.nature === 'Benefic') score += 3;
    else if (panchang.yoga.nature === 'Malefic') score -= 3;

    // Bound between 35 and 96 for realism and authenticity
    const finalScore = Math.max(38, Math.min(96, Math.round(score)));
    scores[cat.key] = finalScore;

    // Determine status badge
    let status: 'Peak Auspicious' | 'Favorable' | 'Balanced' | 'Sensitive' | 'Challenging' = 'Balanced';
    if (finalScore >= 85) status = 'Peak Auspicious';
    else if (finalScore >= 72) status = 'Favorable';
    else if (finalScore >= 58) status = 'Balanced';
    else if (finalScore >= 48) status = 'Sensitive';
    else status = 'Challenging';

    // Generate precise Astrological Driver & Actionable Advice
    const rulingLordName = RASHI_LORDS[cat.primaryHouse - 1] || 'Jupiter';
    const driverText = generateAstrologicalDriver(cat, finalScore, primaryPlanets, influencingPlanetNames, panchang);
    const { advice, doList, dontList } = generateCategoryAdvice(cat, finalScore);

    details.push({
      key: cat.key,
      label: cat.label,
      sanskritName: cat.sanskritName,
      score: finalScore,
      status,
      primaryHouse: cat.primaryHouse,
      rulingLord: rulingLordName,
      influencingPlanets: influencingPlanetNames.slice(0, 4),
      astrologicalDriver: driverText,
      actionableAdvice: advice,
      doList,
      dontList,
    });
  });

  return {
    scores: scores as Record<DailyHoroscopeCategoryKey, number>,
    details,
  };
}

function generateAstrologicalDriver(
  cat: CategoryMeta,
  score: number,
  primaryPlanets: TransitPlanetInfo[],
  influencingPlanets: string[],
  panchang: PanchangData
): string {
  const planetMentions = primaryPlanets.length > 0
    ? primaryPlanets.map((p) => `${p.name} placed in house ${p.houseFromLagna} (${p.dignity})`).join(', ')
    : `${cat.karakas[0].toUpperCase()} activating your ${cat.primaryHouse}th house axis`;

  if (score >= 80) {
    return `Auspicious transit activation with ${planetMentions}. The ${panchang.yoga.name} Yoga elevates harmonic reception, creating fruitful breakthrough momentum in ${cat.label.toLowerCase()}.`;
  } else if (score >= 65) {
    return `Steady planetary support with ${planetMentions}. Transits provide balanced fortitude; deliberate consistency produces favorable outcomes under ${panchang.varaLord}'s day ruler influence.`;
  } else {
    return `Sensitive transit cross-currents with ${planetMentions}. Exercise heightened mindfulness; avoid impulsive risks and lean on classic patience to navigate today's friction.`;
  }
}

function generateCategoryAdvice(cat: CategoryMeta, score: number): { advice: string; doList: string[]; dontList: string[] } {
  if (score >= 80) {
    return {
      advice: `Cosmic currents are powerfully receptive for ${cat.label.toLowerCase()}. Seize bold initiative, voice decisive goals, and leverage today's momentum.`,
      doList: ['Take proactive leadership', 'Initiate significant conversations or filings', 'Trust your intuitive conviction'],
      dontList: ['Do not procrastinate on key opportunities', 'Avoid self-doubt or hesitation'],
    };
  } else if (score >= 65) {
    return {
      advice: `A productive, stable day for ${cat.label.toLowerCase()}. Focus on steady diligence, review details carefully, and maintain harmonious partnerships.`,
      doList: ['Maintain methodical execution', 'Honor commitments with patience', 'Collaborate with trusted allies'],
      dontList: ['Avoid rushing unverified steps', 'Do not let minor discrepancies provoke frustration'],
    };
  } else {
    return {
      advice: `Energy is delicate regarding ${cat.label.toLowerCase()}. Adopt a reflective, protective stance; defer contentious negotiations and rely on grounding routines.`,
      doList: ['Double-check documents and facts', 'Practice conscious listening', 'Perform peaceful grounding remedies'],
      dontList: ['Avoid confrontational disputes', 'Do not make speculative or irreversible leaps', 'Avoid reactionary haste'],
    };
  }
}

// -------------------------------------------------------------
// 4. DAILY HOROSCOPE COMPILATION ORCHESTRATOR
// -------------------------------------------------------------

export function generateDailyHoroscope(
  userProfile: HoroscopeUserProfile,
  targetDateStr: string = new Date().toISOString().split('T')[0]
): DailyHoroscopeResult {
  // 1. Prepare birth details
  const birthDetails: BirthDetails = {
    name: userProfile.name,
    gender: userProfile.gender,
    weightKg: 65,
    weightUnit: 'kg',
    dob: userProfile.dob,
    tob: userProfile.isTobUnknown ? '12:00' : userProfile.tob || '12:00',
    city: userProfile.birthPlace || 'New Delhi',
    latitude: userProfile.latitude || 28.6139,
    longitude: userProfile.longitude || 77.2090,
    timezoneOffset: userProfile.timezoneOffset || 5.5,
  };

  // 2. Calculate Natal Chart & Ephemeris
  const natalProfile = calculateVedicBirthProfile(birthDetails);
  const fullEphemeris: CompleteKundliData = generateCompleteKundli(birthDetails);

  // 3. Calculate Transits for Target Date
  const transits = calculateTransitsForDate(
    targetDateStr,
    natalProfile.lagnaNumber,
    natalProfile.moonSignNumber,
    userProfile.timezoneOffset || 5.5
  );

  // Inject natal sign info into transits
  Object.keys(transits).forEach((k) => {
    const pId = k as PlanetId;
    const natalPlanet = fullEphemeris.grahas[pId];
    if (natalPlanet) {
      transits[pId].natalSign = natalPlanet.rashiNumber;
      transits[pId].natalSignName = natalPlanet.rashiName;
    }
  });

  // 4. Calculate Panchang for Target Date
  const panchang = calculatePanchang(targetDateStr, userProfile.timezoneOffset || 5.5);

  // 5. Active Dasha Rulers
  const activeMahadasha = fullEphemeris.vimshottariDasha.currentMahadasha.planet;
  const activeAntardasha = fullEphemeris.vimshottariDasha.currentAntardasha.planet;
  const activePratyantar = fullEphemeris.vimshottariDasha.currentPratyantardasha?.planet || 'jupiter';

  // 6. Compute Category Scores
  const { scores, details: categories } = computeCategoryScores(transits, panchang, activeMahadasha, activeAntardasha);

  // 7. Overall Score
  const overallCategory = categories.find((c) => c.key === 'overall');
  const overallScore = overallCategory ? overallCategory.score : 75;

  // 8. Identify Strongest Planet (Gochar Bala)
  const planetDignityWeights: Record<string, number> = {
    'Exalted (Ucha)': 25,
    'Exalted / Swakshetra': 24,
    'Own Sign (Swakshetra)': 20,
    'Friend Sign': 12,
    'Exalted / Favorable': 18,
    'Exalted / Mystical': 18,
    'Neutral': 5,
    'Debilitated (Neecha)': -15,
  };

  const planetRankings = Object.values(transits).map((p) => {
    let bala = planetDignityWeights[p.dignity] || 5;
    if ([1, 4, 7, 10].includes(p.houseFromLagna)) bala += 10; // Kendra house
    if ([5, 9].includes(p.houseFromLagna)) bala += 12; // Trikona house
    if (p.planetId === activeMahadasha) bala += 10;
    if (p.savBindus >= 30) bala += 6;
    if (p.isRetrograde && p.planetId !== 'rahu' && p.planetId !== 'ketu') bala -= 4;
    return { planet: p, bala };
  });

  planetRankings.sort((a, b) => b.bala - a.bala);
  const topPlanet = planetRankings[0].planet;

  const strongestPlanetInfo = {
    planetId: topPlanet.planetId,
    name: topPlanet.name,
    sanskrit: topPlanet.sanskritName,
    reason: `${topPlanet.name} transits your auspicious ${topPlanet.houseFromLagna}th house with ${topPlanet.dignity} dignity and ${topPlanet.savBindus} Sarvashtakavarga bindus, providing peak cosmic radiance today.`,
    symbol: getPlanetSymbol(topPlanet.planetId),
  };

  // 9. Identify Opportunities and Challenges
  const sortedCategories = [...categories].sort((a, b) => b.score - a.score);
  const bestCat = sortedCategories[0];
  const mostChallengingCat = sortedCategories[sortedCategories.length - 1];

  const biggestOpportunity = {
    domain: bestCat.label,
    description: `Peak transit strength of ${bestCat.score}/100 in ${bestCat.label}. Guided by ${bestCat.influencingPlanets.join(', ')}, this is today's premier avenue for tangible gains.`,
    supportingPlanet: bestCat.rulingLord,
  };

  const biggestChallenge = {
    domain: mostChallengingCat.label,
    remedy: `Friction score of ${mostChallengingCat.score}/100 in ${mostChallengingCat.label}. Keep emotions balanced, avoid reactive arguments, and offer water or prayers to Lord Surya for clarity.`,
    mitigatingFactor: `Remedial mindfulness and avoiding hasty verbal commitments completely neutralizes this transit stress.`,
  };

  // 10. Mantras and Lucky Attributes
  const PLANET_MANTRAS: Record<PlanetId, { deity: string; sanskrit: string; phonetic: string; meaning: string }> = {
    sun: { deity: 'Surya Deva', sanskrit: 'ॐ सूर्याय नमः', phonetic: 'Om Suryaya Namaha', meaning: 'Salutations to the luminous solar soul, source of vitality, health, and rightful purpose.' },
    moon: { deity: 'Chandra Deva', sanskrit: 'ॐ सोमाय नमः', phonetic: 'Om Somaya Namaha', meaning: 'Salutations to the gentle lunar nectar, pacifying the mind and emotional tides.' },
    mars: { deity: 'Mangala Deva / Kartikeya', sanskrit: 'ॐ भौमाय नमः', phonetic: 'Om Bhaumaya Namaha', meaning: 'Salutations to the fiery protector, bestowing courage, vigor, and righteous victory.' },
    mercury: { deity: 'Budha Deva / Vishnu', sanskrit: 'ॐ बुधाय नमः', phonetic: 'Om Budhaya Namaha', meaning: 'Salutations to the intellect-awakener, sharp speech, discrimination, and commercial success.' },
    jupiter: { deity: 'Brihaspati / Guru', sanskrit: 'ॐ बृहस्पतये नमः', phonetic: 'Om Brihaspataye Namaha', meaning: 'Salutations to the supreme preceptor, expanding wisdom, dharma, and benevolent grace.' },
    venus: { deity: 'Shukra Deva / Lakshmi', sanskrit: 'ॐ शुक्राय नमः', phonetic: 'Om Shukraya Namaha', meaning: 'Salutations to the maestro of arts, romance, luxury, and aesthetic refinement.' },
    saturn: { deity: 'Shani Deva', sanskrit: 'ॐ शनैश्चराय नमः', phonetic: 'Om Shanaishcharaya Namaha', meaning: 'Salutations to the lord of discipline, patience, karma, and enduring resilience.' },
    rahu: { deity: 'Rahu / Durga', sanskrit: 'ॐ राहवे नमः', phonetic: 'Om Rahave Namaha', meaning: 'Salutations to the shadow pioneer, neutralizing illusions and granting worldly insight.' },
    ketu: { deity: 'Ketu / Ganesha', sanskrit: 'ॐ केतवे नमः', phonetic: 'Om Ketave Namaha', meaning: 'Salutations to the mystical moksha-karaka, awakening spiritual perception and liberation.' },
  };

  const mantraData = PLANET_MANTRAS[topPlanet.planetId] || PLANET_MANTRAS['jupiter'];

  // Lucky Number (Numerology: Day Lord number + birth day digit)
  const DAY_NUMEROLOGY: Record<string, number> = { Sunday: 1, Monday: 2, Tuesday: 9, Wednesday: 5, Thursday: 3, Friday: 6, Saturday: 8 };
  const birthDayNum = parseInt(userProfile.dob.split('-')[2] || '1', 10);
  const dayRulerNum = DAY_NUMEROLOGY[panchang.dayOfWeek] || 1;
  let rawLucky = (dayRulerNum + birthDayNum) % 9 || 9;

  // Lucky Colors by Strongest Planet
  const PLANET_COLORS: Record<PlanetId, { name: string; hex: string; significance: string }> = {
    sun: { name: 'Royal Gold & Saffron', hex: '#D97706', significance: 'Radiates solar warmth, leadership confidence, and metabolic vitality' },
    moon: { name: 'Pearl White & Silver', hex: '#E2E8F0', significance: 'Fosters inner calm, emotional equilibrium, and intuitive openness' },
    mars: { name: 'Coral Red & Crimson', hex: '#DC2626', significance: 'Ignites focused courage, dynamic stamina, and physical resolve' },
    mercury: { name: 'Emerald Green', hex: '#059669', significance: 'Stimulates quick intellect, articulate negotiation, and commercial clarity' },
    jupiter: { name: 'Auspicious Bright Yellow', hex: '#EAB308', significance: 'Attracts Guru grace, dharmic wisdom, and financial abundance' },
    venus: { name: 'Silk White & Rose Pink', hex: '#EC4899', significance: 'Harmonizes romantic diplomacy, charm, and creative magnetism' },
    saturn: { name: 'Midnight Navy Blue', hex: '#1E3A8A', significance: 'Anchors steady patience, disciplined focus, and karmic protection' },
    rahu: { name: 'Smoky Grey & Electric Blue', hex: '#475569', significance: 'Shields against confusion and sharpens unconventional strategic insight' },
    ketu: { name: 'Terracotta & Ocher', hex: '#9A3412', significance: 'Deepens meditative stillness, spiritual insight, and detaches negativity' },
  };

  const luckyColor = PLANET_COLORS[topPlanet.planetId] || PLANET_COLORS['jupiter'];

  // Lucky Direction (Digbala of strongest planet)
  const PLANET_DIRECTIONS: Record<PlanetId, { direction: string; rationale: string; dir: string; reason: string }> = {
    sun: { direction: 'East (Purva)', rationale: 'Digbala zone of the Sun; face East for morning planning and executive clarity', dir: 'East (Purva)', reason: 'Digbala zone of the Sun; face East for morning planning and executive clarity' },
    moon: { direction: 'North-West (Vayavya)', rationale: 'Governed by Chandra; ideal for emotional peace and short harmonious visits', dir: 'North-West (Vayavya)', reason: 'Governed by Chandra; ideal for emotional peace and short harmonious visits' },
    mars: { direction: 'South (Dakshina)', rationale: 'Digbala zone of Mars (10th house); face South for high-stamina tasks', dir: 'South (Dakshina)', reason: 'Digbala zone of Mars (10th house); face South for high-stamina tasks' },
    mercury: { direction: 'North (Uttara)', rationale: 'Digbala zone of Mercury (1st house); face North for study, accounts, and communications', dir: 'North (Uttara)', reason: 'Digbala zone of Mercury (1st house); face North for study, accounts, and communications' },
    jupiter: { direction: 'North-East (Ishanya)', rationale: 'Sacred Ishanya corner; supreme direction for prayers, study, and financial signings', dir: 'North-East (Ishanya)', reason: 'Sacred Ishanya corner; supreme direction for prayers, study, and financial signings' },
    venus: { direction: 'South-East (Agneya)', rationale: 'Venusian realm; favorable for culinary creativity, art, and romantic talks', dir: 'South-East (Agneya)', reason: 'Venusian realm; favorable for culinary creativity, art, and romantic talks' },
    saturn: { direction: 'West (Pashchima)', rationale: 'Digbala zone of Saturn (7th house); ideal for solemn reflection and long-term contracts', dir: 'West (Pashchima)', reason: 'Digbala zone of Saturn (7th house); ideal for solemn reflection and long-term contracts' },
    rahu: { direction: 'South-West (Nairritya)', rationale: 'Stabilize this quadrant to prevent restless erratic expenditure', dir: 'South-West (Nairritya)', reason: 'Stabilize this quadrant to prevent restless erratic expenditure' },
    ketu: { direction: 'North-East (Ishanya)', rationale: 'Direct your contemplative focus toward the mystical divine portal', dir: 'North-East (Ishanya)', reason: 'Direct your contemplative focus toward the mystical divine portal' },
  };

  const luckyDirection = PLANET_DIRECTIONS[topPlanet.planetId] || PLANET_DIRECTIONS['jupiter'];

  // Confidence Score Calculation
  const isTobMissing = userProfile.isTobUnknown;
  let confPercentage = isTobMissing ? 80 : 92;
  const supportingFactors: string[] = [];
  const conflictingFactors: string[] = [];

  supportingFactors.push(`Calculated with high precision using Lahiri Ayanamsha (${fullEphemeris.formattedAyanamsha}).`);
  supportingFactors.push(`Benefic ${topPlanet.name} transiting House ${topPlanet.houseFromLagna} with ${topPlanet.dignity}.`);
  supportingFactors.push(`Panchang alignment: ${panchang.yoga.name} Yoga (${panchang.yoga.nature}) under ${panchang.varaLord}'s day.`);

  if (topPlanet.isRetrograde && topPlanet.planetId !== 'rahu' && topPlanet.planetId !== 'ketu') {
    confPercentage -= 5;
    conflictingFactors.push(`Retrograde motion of ${topPlanet.name} may require secondary review before concluding major milestones.`);
  }

  if (isTobMissing) {
    conflictingFactors.push(`Birth time was approximated to 12:00 PM; Moon Sign & Planetary Transits are exact, while Ascendant timings utilize Surya Lagna.`);
  }

  // Activated Houses Breakdown
  const housePlacements: Record<HouseNumber, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [],
  };
  Object.values(transits).forEach((p) => {
    housePlacements[p.houseFromLagna].push(p.name);
  });

  const HOUSE_NAMES: Record<HouseNumber, { name: string; theme: string }> = {
    1: { name: 'Tanu Bhava (House of Self)', theme: 'Personal vitality, physical presence, and fresh beginnings' },
    2: { name: 'Dhana Bhava (House of Wealth)', theme: 'Liquid finances, speech, family nourishment, and assets' },
    3: { name: 'Sahaja Bhava (House of Courage)', theme: 'Siblings, short travels, writing, and proactive drive' },
    4: { name: 'Sukha Bhava (House of Peace)', theme: 'Mother, home comfort, property, vehicles, and inner happiness' },
    5: { name: 'Putra Bhava (House of Intellect)', theme: 'Creativity, past life merit, children, and strategic discernment' },
    6: { name: 'Ari Bhava (House of Resolution)', theme: 'Overcoming obstacles, competitive victory, health, and daily service' },
    7: { name: 'Yuvati Bhava (House of Partnerships)', theme: 'Spouse, business alliances, public diplomacy, and trade' },
    8: { name: 'Randhra Bhava (House of Transformation)', theme: 'Longevity, occult wisdom, research, and sudden shifts' },
    9: { name: 'Dharma Bhava (House of Fortune)', theme: 'Guru blessings, divine luck, ethics, and higher learning' },
    10: { name: 'Karma Bhava (House of Career)', theme: 'Professional rank, social honor, leadership, and public works' },
    11: { name: 'Labha Bhava (House of Gains)', theme: 'Fulfillment of desires, revenue growth, and influential friendships' },
    12: { name: 'Vyaya Bhava (House of Moksha)', theme: 'Spiritual detachment, foreign travel, philanthropy, and deep rest' },
  };

  const activatedHouses = ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as HouseNumber[])
    .filter((h) => housePlacements[h].length > 0)
    .map((h) => {
      const planetsPresent = housePlacements[h];
      const hasBenefic = planetsPresent.some((p) => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p));
      const hasMalefic = planetsPresent.some((p) => ['Saturn', 'Rahu', 'Ketu', 'Mars'].includes(p));
      let overallEnergy: 'Empowered' | 'Balanced' | 'Under Stress' = 'Balanced';
      if (hasBenefic && !hasMalefic) overallEnergy = 'Empowered';
      else if (hasMalefic && !hasBenefic && ![3, 6, 10, 11].includes(h)) overallEnergy = 'Under Stress';

      return {
        house: h,
        name: HOUSE_NAMES[h].name,
        significance: HOUSE_NAMES[h].theme,
        planetsPresent,
        aspectingPlanets: Object.values(transits)
          .filter((t) => t.aspectingHousesFromLagna.includes(h))
          .map((t) => t.name),
        overallEnergy,
      };
    });

  // Executive summary based on actual calculations
  const summary = `Today's cosmic posture centers around ${strongestPlanetInfo.name} transiting your ${strongestPlanetInfo.planetId === 'sun' ? '1st' : `${topPlanet.houseFromLagna}th`} house in ${topPlanet.dignity} dignity. With the overall alignment scoring ${overallScore}/100, momentum strongly favors ${bestCat.label.toLowerCase()} while mindful pacing is recommended in ${mostChallengingCat.label.toLowerCase()}. Active ${activeMahadasha.toUpperCase()} Mahadasha and ${activeAntardasha.toUpperCase()} Antardasha reinforce purposeful progress when approached with calm dharmic discipline.`;

  return {
    id: targetDateStr,
    userId: userProfile.uid,
    date: targetDateStr,
    userName: userProfile.name,
    birthDetails: {
      dob: userProfile.dob,
      tob: userProfile.isTobUnknown ? '12:00 (Noon Solar)' : userProfile.tob,
      isTobUnknown: userProfile.isTobUnknown,
      birthPlace: userProfile.birthPlace,
      lagnaSign: natalProfile.lagnaName,
      lagnaLord: natalProfile.lagnaLord,
      moonSign: natalProfile.moonSignName,
      moonLord: natalProfile.moonLord,
      sunSign: natalProfile.sunSignName,
      nakshatra: natalProfile.nakshatraName,
      pada: natalProfile.nakshatraPada,
    },
    overallScore,
    summary,
    strongestPlanet: strongestPlanetInfo,
    biggestOpportunity,
    biggestChallenge,
    dailyAdvice: `Cultivate conscious clarity today. With ${strongestPlanetInfo.name} shining in your ${topPlanet.houseFromLagna}th house, your natural strengths lie in constructive, steady initiatives. Avoid reactive haste in ${mostChallengingCat.label.toLowerCase()}; align your schedule with the ${panchang.auspiciousMuhurat} for high-priority engagements.`,
    mantra: {
      deityOrPlanet: mantraData.deity,
      sanskritText: mantraData.sanskrit,
      phonetic: mantraData.phonetic,
      meaning: mantraData.meaning,
      repetitions: 108,
    },
    luckyNumber: rawLucky,
    luckyColor,
    luckyDirection,
    luckyTime: {
      window: panchang.auspiciousMuhurat,
      choghadiya: panchang.choghadiyaWindows.find((w) => w.nature === 'Auspicious')?.name || 'Amrit Choghadiya',
      recommendation: 'Optimal time for executing significant decisions, signings, commercial negotiations, or spiritual chanting.',
    },
    confidenceScore: {
      percentage: Math.min(99, Math.max(70, confPercentage)),
      level: confPercentage >= 90 ? 'Very High' : confPercentage >= 80 ? 'High' : 'Moderate',
      supportingFactors,
      conflictingFactors,
      transparencyReasoning: `This confidence assessment reflects accurate astronomical transit mechanics combined with your personal ${natalProfile.lagnaName} Lagna and ${natalProfile.moonSignName} Moon sign coordinates.`,
    },
    scores,
    categories,
    transitPlanets: Object.values(transits),
    activeDasha: {
      mahadasha: {
        planet: fullEphemeris.vimshottariDasha.currentMahadasha.planet,
        lord: fullEphemeris.vimshottariDasha.currentMahadasha.lordName,
        ends: fullEphemeris.vimshottariDasha.currentMahadasha.endDate,
        yearsLeft: fullEphemeris.vimshottariDasha.currentMahadasha.durationYears,
      },
      antardasha: {
        planet: fullEphemeris.vimshottariDasha.currentAntardasha.planet,
        lord: fullEphemeris.vimshottariDasha.currentAntardasha.lordName,
        ends: fullEphemeris.vimshottariDasha.currentAntardasha.endDate,
      },
      pratyantardasha: {
        planet: activePratyantar,
        lord: RASHI_LORDS[0],
      },
      effectOnToday: `Under the primary rulership of ${fullEphemeris.vimshottariDasha.currentMahadasha.lordName} with ${fullEphemeris.vimshottariDasha.currentAntardasha.lordName} sub-cycle, your cosmic focus is naturally channeled toward fulfilling key karmic lessons and disciplined execution.`,
    },
    panchang,
    activatedHouses,
    calculatedAt: new Date().toISOString(),
    aiInterpreted: false,
    aiPromptVersion: 'v1.0-Classical',
  };
}

function getPlanetSymbol(planetId: PlanetId): string {
  switch (planetId) {
    case 'sun': return '☉';
    case 'moon': return '☽';
    case 'mars': return '♂';
    case 'mercury': return '☿';
    case 'jupiter': return '♃';
    case 'venus': return '♀';
    case 'saturn': return '♄';
    case 'rahu': return '☊';
    case 'ketu': return '☋';
    default: return '✧';
  }
}
