/**
 * Krishnamurti Paddhati (KP System) & Classical Vedic Patrika Engine
 * Computes:
 * - Sub-Lords (अं.) and Sub-Sub-Lords (प्र.) according to Vimshottari proportions (120-year cycle)
 * - Nirayana Bhava Cusps (निरयण भाव १ से १२)
 * - Balance of Dasha at Birth (भोग्य दशा काल : [स्वामी] X वर्ष Y मास Z दिन)
 * - Pars Fortuna (फॉर्च्युना)
 * - Hindi Rashi & Graha Abbreviations with Degrees (सू, चं, मं, बु, गु, शु, श, रा, के)
 * - Outer Grahas (हर्ष / Uranus, नेप / Neptune, प्लूटो / Pluto)
 */

export interface KPGrahaRow {
  id: string;
  nameHindi: string;
  isRetrograde: boolean;
  retroMarker: string; // 'व' or ''
  rashiNameHindi: string;
  rashiNumber: number;
  dmsString: string; // '25:45:07'
  degreesInRashi: number;
  rashiLordHindi: string;
  nakshatraLordHindi: string;
  subLordHindi: string;
  subSubLordHindi: string;
  longitude: number;
  shortCode: string; // 'सू', 'चं', etc.
}

export interface KPBhavaRow {
  bhavaNumber: number;
  rashiNameHindi: string;
  rashiNumber: number;
  dmsString: string;
  degreesInRashi: number;
  rashiLordHindi: string;
  nakshatraLordHindi: string;
  subLordHindi: string;
  subSubLordHindi: string;
  cuspLongitude: number;
}

export interface KPPattrkaData {
  titleHindi: string;
  bhogyaDashaString: string; // 'गुरु 3 वर्ष 2 मास 15 दिन'
  grahasList: KPGrahaRow[];
  bhavasList: KPBhavaRow[];
  ayanamshaDMS: string; // '23:48:27'
  fortunaString: string; // 'कर्क 03:44:46'
  lagnaSignHindi: string;
  lagnaDegreeDMS: string;
  moonSignHindi: string;
  moonDegreeDMS: string;
}

// 12 Rashis in Devanagari Hindi (as displayed in classical Patrika)
export const RASHIS_HINDI = [
  'मेष',
  'वृष',
  'मिथुन',
  'कर्क',
  'सिंह',
  'कन्या',
  'तुला',
  'वृश्चिक',
  'धनु',
  'मकर',
  'कुंभ',
  'मीन',
];

// Rashi Lords in Hindi (1-12)
export const RASHI_LORDS_HINDI: Record<number, string> = {
  1: 'मंगल',
  2: 'शुक्र',
  3: 'बुध',
  4: 'चंद्र',
  5: 'सूर्य',
  6: 'बुध',
  7: 'शुक्र',
  8: 'मंगल',
  9: 'गुरु',
  10: 'शनि',
  11: 'शनि',
  12: 'गुरु',
};

// Standard Vimshottari 9-Planet cycle & years (total = 120)
export const KP_VIMSHOTTARI_CYCLE: {
  id: string;
  nameHindi: string;
  shortCode: string;
  years: number;
}[] = [
  { id: 'ketu', nameHindi: 'केतु', shortCode: 'के', years: 7 },
  { id: 'venus', nameHindi: 'शुक्र', shortCode: 'शु', years: 20 },
  { id: 'sun', nameHindi: 'सूर्य', shortCode: 'सू', years: 6 },
  { id: 'moon', nameHindi: 'चंद्र', shortCode: 'चं', years: 10 },
  { id: 'mars', nameHindi: 'मंगल', shortCode: 'मं', years: 7 },
  { id: 'rahu', nameHindi: 'राहु', shortCode: 'रा', years: 18 },
  { id: 'jupiter', nameHindi: 'गुरु', shortCode: 'गु', years: 16 },
  { id: 'saturn', nameHindi: 'शनि', shortCode: 'श', years: 19 },
  { id: 'mercury', nameHindi: 'बुध', shortCode: 'बु', years: 17 },
];

/**
 * Format decimal degrees into standard DD:MM:SS (अंश:कला:विकला)
 */
export function formatDegreesToDMS(degDecimal: number): {
  str: string;
  d: number;
  m: number;
  s: number;
} {
  const norm = ((degDecimal % 360) + 360) % 360;
  const inRashi = norm % 30;

  const d = Math.floor(inRashi);
  const remMinutes = (inRashi - d) * 60;
  const m = Math.floor(remMinutes);
  const s = Math.floor((remMinutes - m) * 60);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return {
    str: `${pad(d)}:${pad(m)}:${pad(s)}`,
    d,
    m,
    s,
  };
}

/**
 * Full span DMS for Ayanamsha or absolute longitude
 */
export function formatFullDMS(degDecimal: number): string {
  const d = Math.floor(degDecimal);
  const remM = (degDecimal - d) * 60;
  const m = Math.floor(remM);
  const s = Math.floor((remM - m) * 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d)}:${pad(m)}:${pad(s)}`;
}

/**
 * Calculate Julian Day Number from Date, Time, and Timezone
 */
export function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hour: number = 12,
  minute: number = 0,
  tzOffset: number = 5.5
): number {
  let y = isNaN(year) || !year ? 2000 : year;
  let m = isNaN(month) || !month ? 1 : month;
  let d = isNaN(day) || !day ? 1 : day;
  let h = isNaN(hour) ? 12 : hour;
  let min = isNaN(minute) ? 0 : minute;
  let tz = isNaN(tzOffset) ? 5.5 : tzOffset;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const dayFrac = d + (h + min / 60 - tz) / 24;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + b - 1524.5;
}

/**
 * Calculate Sub-Lord and Sub-Sub-Lord for a given sidereal longitude
 * Each Nakshatra is 13°20' = 800 arc-minutes.
 * Within each Nakshatra, the 9 subs are apportioned according to Vimshottari years (out of 120),
 * starting with the Lord of that Nakshatra.
 */
export function getKPSubLords(longitude: number): {
  rashiNumber: number;
  rashiNameHindi: string;
  degreesInRashi: number;
  dmsString: string;
  rashiLordHindi: string;
  nakshatraIndex: number;
  nakshatraLordHindi: string;
  subLordHindi: string;
  subSubLordHindi: string;
} {
  const safeLon = isNaN(longitude) || longitude === undefined || longitude === null ? 0 : longitude;
  const normLon = ((safeLon % 360) + 360) % 360;
  const rashiNumber = Math.max(1, Math.min(12, Math.floor(normLon / 30) + 1));
  const rashiNameHindi = RASHIS_HINDI[rashiNumber - 1] || 'मेष';
  const degreesInRashi = normLon % 30;
  const { str: dmsString } = formatDegreesToDMS(degreesInRashi);
  const rashiLordHindi = RASHI_LORDS_HINDI[rashiNumber] || 'मंगल';

  // Nakshatra span: 13° 20' = 800 arc-minutes
  const nakSpanMinutes = 800;
  const totalMinutes = normLon * 60;
  const nakIndex = Math.max(0, Math.min(26, Math.floor(totalMinutes / nakSpanMinutes) % 27));
  const elapsedMinutesInNak = totalMinutes % nakSpanMinutes;

  // Nakshatra lord starting index in the 9-planet cycle
  const nakLordIndex = Math.max(0, Math.min(8, nakIndex % 9));
  const nakLord = KP_VIMSHOTTARI_CYCLE[nakLordIndex] || KP_VIMSHOTTARI_CYCLE[0];
  const nakshatraLordHindi = nakLord.nameHindi;

  // Calculate Sub-Lord by accumulating sub spans in arc-minutes
  let accumulatedSubMinutes = 0;
  let subIndex = 0;
  let subLordHindi = nakshatraLordHindi;
  let subSpanMinutes = 0;
  let elapsedMinutesInSub = 0;

  for (let i = 0; i < 9; i++) {
    const pIdx = (nakLordIndex + i) % 9;
    const planet = KP_VIMSHOTTARI_CYCLE[pIdx] || KP_VIMSHOTTARI_CYCLE[0];
    const planetYears = planet.years;
    // Sub span = 800 * (years / 120)
    const span = (nakSpanMinutes * planetYears) / 120;
    if (elapsedMinutesInNak >= accumulatedSubMinutes && elapsedMinutesInNak < accumulatedSubMinutes + span + 0.0000001) {
      subIndex = pIdx;
      subLordHindi = planet.nameHindi;
      subSpanMinutes = span;
      elapsedMinutesInSub = elapsedMinutesInNak - accumulatedSubMinutes;
      break;
    }
    accumulatedSubMinutes += span;
  }

  // Calculate Sub-Sub-Lord (Pratyantar within Sub)
  let accumulatedSubSubMinutes = 0;
  let subSubLordHindi = subLordHindi;

  for (let j = 0; j < 9; j++) {
    const ssIdx = (subIndex + j) % 9;
    const ssPlanet = KP_VIMSHOTTARI_CYCLE[ssIdx] || KP_VIMSHOTTARI_CYCLE[0];
    const ssYears = ssPlanet.years;
    // Sub-sub span = subSpan * (ssYears / 120)
    const ssSpan = (subSpanMinutes * ssYears) / 120;
    if (elapsedMinutesInSub >= accumulatedSubSubMinutes && elapsedMinutesInSub < accumulatedSubSubMinutes + ssSpan + 0.0000001) {
      subSubLordHindi = ssPlanet.nameHindi;
      break;
    }
    accumulatedSubSubMinutes += ssSpan;
  }

  return {
    rashiNumber,
    rashiNameHindi,
    degreesInRashi,
    dmsString,
    rashiLordHindi,
    nakshatraIndex: nakIndex,
    nakshatraLordHindi,
    subLordHindi,
    subSubLordHindi,
  };
}

/**
 * Calculate Balance of Dasha at birth (भोग्य दशा काल)
 * Formula:
 * Moon longitude -> Nakshatra -> Elapsed portion of Nakshatra
 * Remaining portion = 1 - (elapsed / span)
 * Balance years = DashaYears of Nakshatra Lord * Remaining portion
 */
export function calculateBhogyaDasha(moonLongitude: number): {
  lordHindi: string;
  years: number;
  months: number;
  days: number;
  formattedHindi: string;
} {
  const safeLon = isNaN(moonLongitude) || moonLongitude === undefined || moonLongitude === null ? 0 : moonLongitude;
  const norm = ((safeLon % 360) + 360) % 360;
  const nakSpan = 360 / 27; // 13.333333°
  const nakIndex = Math.max(0, Math.min(26, Math.floor(norm / nakSpan) % 27));
  const elapsed = norm % nakSpan;
  const fractionElapsed = elapsed / nakSpan;
  const fractionRemaining = Math.max(0, 1 - fractionElapsed);

  const lordIdx = Math.max(0, Math.min(8, nakIndex % 9));
  const birthLord = KP_VIMSHOTTARI_CYCLE[lordIdx] || KP_VIMSHOTTARI_CYCLE[0];
  const totalRemainingYears = birthLord.years * fractionRemaining;

  const years = Math.floor(totalRemainingYears);
  const remMonthsDec = (totalRemainingYears - years) * 12;
  const months = Math.floor(remMonthsDec);
  const days = Math.round((remMonthsDec - months) * 30.4375);

  const formattedHindi = `${birthLord.nameHindi} ${years} वर्ष ${months} मास ${days} दिन`;

  return {
    lordHindi: birthLord.nameHindi,
    years,
    months,
    days,
    formattedHindi,
  };
}

/**
 * Calculate Pars Fortuna (फॉर्च्युना)
 * Daytime birth: Ascendant + Moon - Sun
 * Nighttime birth: Ascendant + Sun - Moon
 */
export function calculateFortuna(
  sunLon: number,
  moonLon: number,
  ascLon: number,
  isDaytime: boolean = true
): {
  longitude: number;
  rashiNameHindi: string;
  rashiNumber: number;
  dmsString: string;
  formattedHindi: string;
} {
  const sLon = isNaN(sunLon) ? 0 : sunLon;
  const mLon = isNaN(moonLon) ? 0 : moonLon;
  const aLon = isNaN(ascLon) ? 0 : ascLon;

  let fortunaLon = isDaytime
    ? aLon + mLon - sLon
    : aLon + sLon - mLon;

  fortunaLon = ((fortunaLon % 360) + 360) % 360;
  const rashiNumber = Math.max(1, Math.min(12, Math.floor(fortunaLon / 30) + 1));
  const rashiNameHindi = RASHIS_HINDI[rashiNumber - 1] || 'मेष';
  const { str: dmsString } = formatDegreesToDMS(fortunaLon % 30);

  return {
    longitude: fortunaLon,
    rashiNameHindi,
    rashiNumber,
    dmsString,
    formattedHindi: `${rashiNameHindi} ${dmsString}`,
  };
}

/**
 * Approximate Sidereal Longitudes of Uranus (हर्ष), Neptune (नेप), Pluto (प्लूटो)
 */
export function getOuterPlanetsSidereal(
  julianDate: number,
  ayanamshaDeg: number = 23.85
): {
  uranus: { lon: number; isRetro: boolean };
  neptune: { lon: number; isRetro: boolean };
  pluto: { lon: number; isRetro: boolean };
} {
  const jd = isNaN(julianDate) || !julianDate ? 2451545.0 : julianDate;
  const ayan = isNaN(ayanamshaDeg) ? 23.85 : ayanamshaDeg;
  const d = jd - 2451545.0;

  // Mean tropical longitudes (standard astronomical approximations)
  const uLonTrop = (314.055 + 0.011725806 * d) % 360;
  const nLonTrop = (304.348 + 0.00598106 * d) % 360;
  const pLonTrop = (238.929 + 0.0039757 * d) % 360;

  const norm = (v: number) => ((v % 360) + 360) % 360;

  const uLonSid = norm(uLonTrop - ayan);
  const nLonSid = norm(nLonTrop - ayan);
  const pLonSid = norm(pLonTrop - ayan);

  return {
    uranus: { lon: uLonSid, isRetro: false },
    neptune: { lon: nLonSid, isRetro: false },
    pluto: { lon: pLonSid, isRetro: false },
  };
}
