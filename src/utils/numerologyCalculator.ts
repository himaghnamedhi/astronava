import {
  NumerologySystem,
  NameAnalysisResult,
  LetterBreakdown,
  LoShuGridResult,
  LoShuPlane,
  NumberRepetitionInfo,
  MissingNumberRemedy,
  PersonalYearResult,
  DriverConductorSynergy,
  VehicleOrPhoneAnalysis,
  NameTuningSuggestion,
} from '../types/numerology';
import {
  CHALDEAN_MAP,
  PYTHAGOREAN_MAP,
  VOWELS,
  MULANK_DETAILS,
  BHAGYANK_DETAILS,
  COMPOUND_NUMBER_MEANINGS,
  LO_SHU_PLANES,
  MISSING_NUMBER_REMEDIES,
  PERSONAL_YEAR_PREDICTIONS,
  getPlanetaryHarmony,
} from '../data/numerologyData';

/**
 * Reduce any integer to a single digit (1-9) using standard digital root formula.
 */
export function reduceToSingleDigit(num: number): number {
  if (num <= 0) return 0;
  return ((num - 1) % 9) + 1;
}

/**
 * Calculate Mulank (Driver / Root Number / Psychic Number) from the Day of Birth (1-31).
 */
export function calculateMulank(day: number): number {
  if (day < 1) day = 1;
  if (day > 31) day = 31;
  return reduceToSingleDigit(day);
}

/**
 * Calculate Bhagyank (Conductor / Destiny Number / Life Path Number) from DD + MM + YYYY.
 */
export function calculateBhagyank(day: number, month: number, year: number): number {
  const sumDigits = (n: number) =>
    Math.abs(n)
      .toString()
      .split('')
      .reduce((acc, char) => acc + (parseInt(char, 10) || 0), 0);

  const totalSum = sumDigits(day) + sumDigits(month) + sumDigits(year);
  return reduceToSingleDigit(totalSum);
}

/**
 * Evaluate Driver-Conductor (Mulank & Bhagyank) relationship in Vedic Numerology.
 */
export function evaluateDriverConductor(mulank: number, bhagyank: number): DriverConductorSynergy {
  const harmony = getPlanetaryHarmony(mulank, bhagyank);
  const mulankInfo = MULANK_DETAILS[mulank] || MULANK_DETAILS[1];
  const bhagyankInfo = BHAGYANK_DETAILS[bhagyank] || BHAGYANK_DETAILS[1];

  let relationshipLabel = 'Neutral / Balanced Harmony';
  let sanskritTerm = 'Sama (सम संबंध)';
  let compatibilityScore = 70;
  let guidance =
    'Your Driver (Mulank) and Conductor (Bhagyank) maintain a balanced diplomatic neutrality. While not effortlessly harmonious, there are few conflicting friction points. Clear intentionality brings high success.';

  if (harmony === 'mitra') {
    relationshipLabel = 'Friendly & Highly Auspicious';
    sanskritTerm = 'Mitra (मित्र संबंध)';
    compatibilityScore = 95;
    guidance =
      'Your Driver and Conductor planets share natural friendship and affinity. Your core personality desires naturally align with your larger destiny path, creating smooth flow, intuitive opportunities, and strong karmic backing.';
  } else if (harmony === 'shatru') {
    relationshipLabel = 'Challenging / Inimical Friction';
    sanskritTerm = 'Shatru (शत्रु संबंध)';
    compatibilityScore = 45;
    guidance =
      'Your Driver and Conductor planets hold opposing natural elements (such as Fire vs Water, or Sun/Mars vs Saturn/Venus). You may frequently feel an internal tug-of-war between what you emotionally desire (Mulank) and what your life responsibilities demand (Bhagyank). Performing targeted Vedic remedies, tuning your Name vibration to a neutral/friendly number, and cultivating conscious discipline resolves this friction.';
  }

  const analysis = `Mulank ${mulank} (${mulankInfo.sanskritPlanet}) acts as the inner pilot of your desires, temperament, and instinctive reactions. Bhagyank ${bhagyank} (${bhagyankInfo.sanskritPlanet}) governs the outer highway of your life path, career opportunities, and ultimate destination. Together, they form a ${relationshipLabel} (${sanskritTerm}) with a calculated vibrational synergy of ${compatibilityScore}%.`;

  return {
    mulank,
    bhagyank,
    relationship: harmony,
    relationshipLabel,
    sanskritTerm,
    compatibilityScore,
    analysis,
    guidance,
  };
}

/**
 * Perform comprehensive Name Numerology using Chaldean or Pythagorean system.
 */
export function calculateNameNumerology(
  name: string,
  system: NumerologySystem = 'chaldean',
  mulank: number = 1,
  bhagyank: number = 1
): NameAnalysisResult {
  const cleanName = (name || '').trim().toUpperCase();
  const map = system === 'chaldean' ? CHALDEAN_MAP : PYTHAGOREAN_MAP;

  const rawWords = cleanName.split(/\s+/).filter(Boolean);
  const allLetters: LetterBreakdown[] = [];
  const wordsResult: NameAnalysisResult['words'] = [];

  let totalCompound = 0;
  let vowelsCompound = 0;
  let consonantsCompound = 0;

  for (const word of rawWords) {
    let wordCompound = 0;
    const wordLetters: LetterBreakdown[] = [];

    for (const char of word) {
      if (/[A-Z]/.test(char)) {
        const val = map[char] || 0;
        const isVowel = VOWELS.has(char);
        const item: LetterBreakdown = { letter: char, value: val, isVowel };

        wordLetters.push(item);
        allLetters.push(item);
        wordCompound += val;

        if (isVowel) {
          vowelsCompound += val;
        } else {
          consonantsCompound += val;
        }
      }
    }

    totalCompound += wordCompound;
    wordsResult.push({
      word,
      compound: wordCompound,
      root: reduceToSingleDigit(wordCompound),
      letters: wordLetters,
    });
  }

  const rootNumber = reduceToSingleDigit(totalCompound);
  const soulUrgeRoot = reduceToSingleDigit(vowelsCompound);
  const personalityRoot = reduceToSingleDigit(consonantsCompound);

  const compoundInfo = COMPOUND_NUMBER_MEANINGS[totalCompound] || {
    title: `Vibration of Compound ${totalCompound}`,
    verdict: 'Neutral',
    meaning: `The compound number ${totalCompound} resolves into root ${rootNumber}. Its energy reflects personal initiative tempered by self-discipline.`,
  };

  const harmonyWithMulank = getPlanetaryHarmony(rootNumber, mulank);
  const harmonyWithBhagyank = getPlanetaryHarmony(rootNumber, bhagyank);

  let overallNameVerdict: NameAnalysisResult['overallNameVerdict'] = 'Favorable';
  let nameAdvice = '';

  if (harmonyWithMulank === 'mitra' && harmonyWithBhagyank === 'mitra') {
    overallNameVerdict = 'Highly Auspicious';
    nameAdvice = `Your name number ${rootNumber} (Compound ${totalCompound}) is in harmonious Mitra (Friendship) with BOTH your Mulank (${mulank}) and Bhagyank (${bhagyank}). This generates an auspicious resonant frequency, magnifying good fortune, public reception, and effortless opportunity.`;
  } else if (harmonyWithMulank === 'shatru' || harmonyWithBhagyank === 'shatru') {
    overallNameVerdict = 'Challenging / Needs Tuning';
    nameAdvice = `Your name number ${rootNumber} has an inimical (Shatru) vibration with either your Mulank or Bhagyank. In classical Vedic and Chaldean numerology, tuning the spelling by adding or modifying a letter to reach a friendly compound number (such as 14, 15, 19, 23, 24, 32, 33, 37, 41, 42, 51) will remove career obstacles and attract positive vibrations.`;
  } else {
    overallNameVerdict = 'Neutral';
    nameAdvice = `Your name number ${rootNumber} maintains a neutral diplomatic harmony with your birth date numbers. It creates stable, steady results without significant friction.`;
  }

  return {
    rawName: cleanName,
    system,
    letters: allLetters,
    words: wordsResult,
    compoundNumber: totalCompound,
    rootNumber,
    compoundMeaning: `${compoundInfo.title}: ${compoundInfo.meaning}`,
    soulUrgeCompound: vowelsCompound,
    soulUrgeRoot,
    soulUrgeDescription: `Soul Urge (Heart's Desire) number ${soulUrgeRoot} reveals your deepest inner spiritual yearning, subconscious motivations, and true emotional happiness.`,
    personalityCompound: consonantsCompound,
    personalityRoot,
    personalityDescription: `Personality (Outer Impression) number ${personalityRoot} represents the persona you project into the world, your social magnetic aura, and how others perceive you on first encounter.`,
    harmonyWithMulank,
    harmonyWithBhagyank,
    overallNameVerdict,
    nameAdvice,
  };
}

/**
 * Generate Lo Shu Grid (3x3 Magic Square) from Date of Birth, Mulank, and Bhagyank.
 */
export function buildLoShuGrid(
  dob: { day: number; month: number; year: number },
  mulank: number,
  bhagyank: number
): LoShuGridResult {
  const grid: Record<number, number> = {
    1: 0, 2: 0, 3: 0,
    4: 0, 5: 0, 6: 0,
    7: 0, 8: 0, 9: 0,
  };

  const allDigitsFound: number[] = [];

  // Extract all non-zero digits from day, month, year
  const extractDigits = (val: number) => {
    val.toString().split('').forEach((c) => {
      const d = parseInt(c, 10);
      if (d >= 1 && d <= 9) {
        grid[d] = (grid[d] || 0) + 1;
        allDigitsFound.push(d);
      }
    });
  };

  extractDigits(dob.day);
  extractDigits(dob.month);
  extractDigits(dob.year);

  // In authentic Indian/Vedic Lo Shu tradition, Mulank and Bhagyank are also placed into the grid
  if (mulank >= 1 && mulank <= 9) {
    grid[mulank] = (grid[mulank] || 0) + 1;
    allDigitsFound.push(mulank);
  }
  if (bhagyank >= 1 && bhagyank <= 9) {
    grid[bhagyank] = (grid[bhagyank] || 0) + 1;
    allDigitsFound.push(bhagyank);
  }

  // Check Lo Shu Planes
  const completedPlanes: LoShuPlane[] = [];
  const incompletePlanes: LoShuPlane[] = [];

  LO_SHU_PLANES.forEach((planeDef) => {
    let presentCount = 0;
    planeDef.numbers.forEach((num) => {
      if (grid[num] && grid[num] > 0) {
        presentCount++;
      }
    });

    const isComplete = presentCount === planeDef.numbers.length;
    const planeObj: LoShuPlane = {
      name: planeDef.name,
      planeType: planeDef.planeType,
      title: planeDef.title,
      numbers: planeDef.numbers,
      presentCount,
      isComplete,
      significance: planeDef.significance,
    };

    if (isComplete) {
      completedPlanes.push(planeObj);
    } else {
      incompletePlanes.push(planeObj);
    }
  });

  // Missing Numbers & Remedies
  const missingNumbers: MissingNumberRemedy[] = [];
  for (let num = 1; num <= 9; num++) {
    if (!grid[num] || grid[num] === 0) {
      const remedy = MISSING_NUMBER_REMEDIES[num];
      if (remedy) {
        missingNumbers.push(remedy);
      }
    }
  }

  // Repetition Analysis
  const repetitionAnalysis: NumberRepetitionInfo[] = [];
  const repetitionMeanings: Record<number, Record<number, string>> = {
    1: {
      1: 'Once: Balanced self-expression; communicates personal thoughts with ease.',
      2: 'Twice: Highly communicative, articulate, and understanding listener.',
      3: 'Three times: Very talkative or expressive, occasional restlessness.',
      4: 'Four or more: Struggle with self-containment, over-assertive or suppressed feelings.',
    },
    2: {
      1: 'Once: Sensitive and intuitive; enjoys harmonious companionship.',
      2: 'Twice: Deep intuitive psychic perception, very empathetic.',
      3: 'Three times: Highly sensitive, prone to mood swings or emotional hurt.',
      4: 'Four or more: Extreme emotional vulnerability; requires meditative grounding.',
    },
    3: {
      1: 'Once: Good mental clarity, creative curiosity, and positive outlook.',
      2: 'Twice: Superb imaginative and literary skills, expressive teacher or writer.',
      3: 'Three times: Over-imaginative, occasional day-dreaming, unfocused energy.',
      4: 'Four or more: Scattered intellectual focus, highly eccentric genius.',
    },
    4: {
      1: 'Once: Practical, structured, organized, respects disciplined routine.',
      2: 'Twice: Highly meticulous, mechanical aptitude, excels in systems.',
      3: 'Three times: Excessive rigidity, stubbornness, resistant to spontaneous shifts.',
      4: 'Four or more: Overworked, extreme obsession with minor details.',
    },
    5: {
      1: 'Once: Emotional balance, communicative freedom, adaptable versatility.',
      2: 'Twice: Highly adventurous, charismatic salesperson, rapid mental recovery.',
      3: 'Three times: Restless risk-taker, difficulty sitting still, love of gambling/thrills.',
      4: 'Four or more: Hyperactive nervous energy; needs daily grounding.',
    },
    6: {
      1: 'Once: Deep love of home, family loyalty, and aesthetic appreciation.',
      2: 'Twice: High creative talent, nurturing disposition, protective over children.',
      3: 'Three times: Over-protective, prone to domestic worry and perfectionism.',
      4: 'Four or more: Excessive domestic burden or anxiety over loved ones.',
    },
    7: {
      1: 'Once: Learn through experience, philosophical curiosity, analytical mind.',
      2: 'Twice: High spiritual and research inclination, intuitive occult insight.',
      3: 'Three times: Deep emotional disillusionment in early youth leading to profound sagehood.',
      4: 'Four or more: Complete spiritual asceticism or feeling misunderstood by society.',
    },
    8: {
      1: 'Once: Attention to detail, diligent worker, steady financial realism.',
      2: 'Twice: Master of enterprise, shrewd business sense, powerful stamina.',
      3: 'Three times: Heavy responsibilities, intense material battles followed by massive triumphs.',
      4: 'Four or more: Unrelenting workaholism; needs conscious relaxation.',
    },
    9: {
      1: 'Once: Ambitious, humanitarian, generous, possesses sound willpower.',
      2: 'Twice: High intellectual idealism, critical discernment, humanitarian drive.',
      3: 'Three times: Extremely passionate, quick-tempered, fiercely idealistic crusader.',
      4: 'Four or more: Overwhelming mental or combative drive; needs creative outlet.',
    },
  };

  for (let num = 1; num <= 9; num++) {
    const count = grid[num] || 0;
    if (count > 0) {
      const clampedCount = count > 4 ? 4 : count;
      const desc =
        repetitionMeanings[num]?.[clampedCount] ||
        `Appears ${count} times: Indicates strong emphasis of this planetary frequency.`;
      repetitionAnalysis.push({
        number: num,
        count,
        meaning: desc,
      });
    }
  }

  return {
    grid,
    allDigitsFound,
    completedPlanes,
    incompletePlanes,
    missingNumbers,
    repetitionAnalysis,
  };
}

/**
 * Calculate Personal Year & 12 Personal Months for a given target calendar year.
 */
export function calculatePersonalYear(
  day: number,
  month: number,
  targetYear: number = new Date().getFullYear()
): PersonalYearResult {
  const sumDigits = (n: number) =>
    Math.abs(n)
      .toString()
      .split('')
      .reduce((acc, char) => acc + (parseInt(char, 10) || 0), 0);

  const baseSum = sumDigits(day) + sumDigits(month) + sumDigits(targetYear);
  const personalYearNumber = reduceToSingleDigit(baseSum);

  const prediction = PERSONAL_YEAR_PREDICTIONS[personalYearNumber] || PERSONAL_YEAR_PREDICTIONS[1];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const months = monthNames.map((name, idx) => {
    const monthNum = idx + 1;
    const personalMonthNumber = reduceToSingleDigit(personalYearNumber + monthNum);
    const monthPlanet = MULANK_DETAILS[personalMonthNumber]?.planet || 'Sun';
    return {
      monthNumber: monthNum,
      monthName: name,
      personalMonthNumber,
      theme: `${name}: Vibration ${personalMonthNumber} (${monthPlanet}) - Focus on ${
        PERSONAL_YEAR_PREDICTIONS[personalMonthNumber]?.theme.split(',')[0] || 'Progress'
      }`,
    };
  });

  return {
    year: targetYear,
    personalYearNumber,
    rulingPlanet: prediction.rulingPlanet,
    theme: prediction.theme,
    summary: prediction.summary,
    keyOpportunities: prediction.keyOpportunities,
    precautions: prediction.precautions,
    months,
  };
}

/**
 * Evaluate Mobile Number or Vehicle Registration Number for Numerological Harmony.
 */
export function evaluateVehicleOrMobile(
  input: string,
  type: 'mobile' | 'vehicle' | 'custom' = 'mobile',
  mulank: number = 1,
  bhagyank: number = 1
): VehicleOrPhoneAnalysis {
  const raw = (input || '').toUpperCase().trim();
  const digits: number[] = [];

  for (const char of raw) {
    if (/[0-9]/.test(char)) {
      digits.push(parseInt(char, 10));
    } else if (/[A-Z]/.test(char) && type === 'vehicle') {
      // In vehicle plates, letters also contribute via Chaldean value
      const letterVal = CHALDEAN_MAP[char] || 0;
      if (letterVal > 0) digits.push(letterVal);
    }
  }

  const compoundSum = digits.reduce((a, b) => a + b, 0);
  const rootNumber = reduceToSingleDigit(compoundSum);
  const rulingPlanet = MULANK_DETAILS[rootNumber]?.planet || 'Unknown';

  const harmonyWithMulank = getPlanetaryHarmony(rootNumber, mulank);
  const harmonyWithBhagyank = getPlanetaryHarmony(rootNumber, bhagyank);

  let suitabilityScore = 70;
  let verdict = 'Moderate / Neutral Alignment';
  let recommendation = `This ${type} totals to Compound ${compoundSum} and Root ${rootNumber} (${rulingPlanet}). It offers stable, moderate results for everyday use.`;

  if (harmonyWithMulank === 'mitra' && harmonyWithBhagyank === 'mitra') {
    suitabilityScore = 95;
    verdict = 'Highly Auspicious & Lucky';
    recommendation = `Excellent vibration! Root number ${rootNumber} is a natural Mitra (Friend) to both your Mulank ${mulank} and Bhagyank ${bhagyank}. This enhances positive calls, smooth journeys, and business opportunities.`;
  } else if (harmonyWithMulank === 'shatru' || harmonyWithBhagyank === 'shatru') {
    suitabilityScore = 40;
    verdict = 'Conflicting Vibration / Requires Caution';
    recommendation = `This ${type} root number ${rootNumber} carries conflicting (Shatru) planetary energy with your birth numbers. If possible, consider selecting a number whose digits sum to a friendly root (like ${MULANK_DETAILS[mulank]?.friendlyNumbers.join(', ')}).`;
  }

  return {
    input: raw,
    type,
    digits,
    compoundSum,
    rootNumber,
    rulingPlanet,
    harmonyWithMulank,
    harmonyWithBhagyank,
    suitabilityScore,
    verdict,
    recommendation,
  };
}

/**
 * Suggest optimal spelling variations for a name that needs tuning.
 * Evaluates subtle letter additions (e.g. adding 'A', 'I', 'E', 'H', 'S', or subtle initial)
 * to achieve royal compound vibrations (e.g. 14, 15, 19, 21, 23, 24, 32, 33, 37, 41, 42, 45, 46, 50, 51)
 * that harmonize (Mitra) with the native's Mulank and Bhagyank.
 */
export function generateNameTuningSuggestions(
  rawName: string,
  system: NumerologySystem = 'chaldean',
  mulank: number = 1,
  bhagyank: number = 1
): NameTuningSuggestion[] {
  if (!rawName || !rawName.trim()) return [];

  const cleanName = rawName.trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const firstName = words[0];
  const restName = words.slice(1).join(' ');

  const candidateGenerators: {
    desc: string;
    letter: string;
    generate: (f: string, r: string) => string;
  }[] = [
    { desc: 'Add subtle "a" to first name', letter: 'A (+1)', generate: (f, r) => `${f}a${r ? ' ' + r : ''}` },
    { desc: 'Add soft "h" to first name', letter: 'H (+5)', generate: (f, r) => `${f}h${r ? ' ' + r : ''}` },
    { desc: 'Add subtle "i" to first name', letter: 'I (+1)', generate: (f, r) => `${f}i${r ? ' ' + r : ''}` },
    { desc: 'Add harmonic "e" to first name', letter: 'E (+5)', generate: (f, r) => `${f}e${r ? ' ' + r : ''}` },
    {
      desc: 'Double first vowel ("a" → "aa")',
      letter: 'A (+1)',
      generate: (f, r) => {
        const idx = f.search(/[aeiou]/i);
        if (idx !== -1) {
          return `${f.slice(0, idx + 1)}${f[idx]}${f.slice(idx + 1)}${r ? ' ' + r : ''}`;
        }
        return `${f}a${r ? ' ' + r : ''}`;
      },
    },
    {
      desc: 'Double "i" → "ee"',
      letter: 'E/I (+5/+1)',
      generate: (f, r) => {
        if (/i/i.test(f)) {
          return `${f.replace(/i/i, 'ee')}${r ? ' ' + r : ''}`;
        }
        return `${f}n${r ? ' ' + r : ''}`;
      },
    },
    { desc: 'Add resonant "n" to first name', letter: 'N (+5)', generate: (f, r) => `${f}n${r ? ' ' + r : ''}` },
    { desc: 'Add lucky "s" to first name', letter: 'S (+3)', generate: (f, r) => `${f}s${r ? ' ' + r : ''}` },
    { desc: 'Add auspicious "A." initial', letter: 'A. (+1)', generate: (f, r) => `${f} A.${r ? ' ' + r : ''}` },
    { desc: 'Add lucky "K." initial', letter: 'K. (+2)', generate: (f, r) => `${f} K.${r ? ' ' + r : ''}` },
    { desc: 'Add royal "R." initial', letter: 'R. (+2)', generate: (f, r) => `${f} R.${r ? ' ' + r : ''}` },
    { desc: 'Add prosperous "S." initial', letter: 'S. (+3)', generate: (f, r) => `${f} S.${r ? ' ' + r : ''}` },
    ...(restName
      ? [
          { desc: 'Add subtle "a" to surname', letter: 'A (+1)', generate: (f: string, r: string) => `${f} ${r}a` },
          { desc: 'Add soft "h" to surname', letter: 'H (+5)', generate: (f: string, r: string) => `${f} ${r}h` },
          { desc: 'Double consonant in surname', letter: 'Consonant', generate: (f: string, r: string) => `${f} ${r}${r.slice(-1)}` },
        ]
      : []),
  ];

  const ROYAL_COMPOUNDS = new Set([14, 15, 19, 21, 23, 24, 32, 33, 37, 41, 42, 45, 46, 50, 51]);
  const suggestions: NameTuningSuggestion[] = [];
  const seenNames = new Set<string>([cleanName.toUpperCase()]);

  for (const gen of candidateGenerators) {
    const candidateName = gen.generate(firstName, restName).trim();
    const key = candidateName.toUpperCase();
    if (seenNames.has(key)) continue;
    seenNames.add(key);

    const evalResult = calculateNameNumerology(candidateName, system, mulank, bhagyank);

    const isMitraMulank = evalResult.harmonyWithMulank === 'mitra';
    const isNoShatru = evalResult.harmonyWithMulank !== 'shatru' && evalResult.harmonyWithBhagyank !== 'shatru';
    const isRoyal = ROYAL_COMPOUNDS.has(evalResult.compoundNumber);

    if ((isMitraMulank && isNoShatru) || (isRoyal && isNoShatru)) {
      const meaningObj = COMPOUND_NUMBER_MEANINGS[evalResult.compoundNumber];
      suggestions.push({
        suggestedName: candidateName,
        adjustmentDescription: gen.desc,
        letterAdded: gen.letter,
        compoundNumber: evalResult.compoundNumber,
        rootNumber: evalResult.rootNumber,
        rulingPlanet: MULANK_DETAILS[evalResult.rootNumber]?.planet || 'Mercury',
        compoundMeaning: meaningObj?.title ? `${meaningObj.title} - ${meaningObj.meaning}` : evalResult.compoundMeaning,
        verdict: evalResult.overallNameVerdict as 'Highly Auspicious' | 'Favorable' | 'Neutral',
        harmonyWithMulank: evalResult.harmonyWithMulank,
        harmonyWithBhagyank: evalResult.harmonyWithBhagyank,
      });
    }

    if (suggestions.length >= 4) break;
  }

  return suggestions;
}
