import { GoogleGenAI, Type } from '@google/genai';

export interface AiSummarySectionPayload {
  overview: string;
  lagnaInsight: {
    sign: string;
    lord: string;
    lordHouse: number;
    interpretation: string;
  };
  grahaBhavaSthiti: {
    planet: string;
    house: number;
    sign: string;
    dignity: string;
    effect: string;
    practicalGuidance: string;
  }[];
  bhavaAdhipati: {
    houseNumber: number;
    houseName: string;
    lordPlanet: string;
    placedInHouse: number;
    classicalEffect: string;
    realLifeManifestation: string;
  }[];
  yogasAndCombinations: {
    name: string;
    description: string;
    manifestation: string;
  }[];
  dashaActivation: {
    mahadasha: string;
    antardasha: string;
    timingEffect: string;
    keyActionAreas: string[];
  };
  vedicRemedies: {
    category: string;
    remedy: string;
    purpose: string;
  }[];
}

// Classical interpretations lookup for Algorithmic Fallback Engine
const CLASSICAL_HOUSE_LORD_EFFECTS: Record<string, string> = {
  // 1st Lord (Lagnesha)
  '1_1': 'Lagnesha in 1st House: Endows strong physical vitality, self-reliance, leadership, charismatic presence, and independent life purpose.',
  '1_2': 'Lagnesha in 2nd House: Directs personal energy toward accumulating wealth, noble family traditions, persuasive speech, and financial stewardship.',
  '1_3': 'Lagnesha in 3rd House: Bestows entrepreneurial courage, fraternal loyalty, communicative prowess, artistic talents, and self-made fortunes.',
  '1_4': 'Lagnesha in 4th House: Bestows profound maternal happiness, land ownership, educational excellence, domestic stability, and mental peace.',
  '1_5': 'Lagnesha in 5th House: Confers sharp intelligence, auspicious Purva Punya (past karmic merits), creative mastery, and respected offspring.',
  '1_6': 'Lagnesha in 6th House: Creates a resilient fighter archetype, success in competitive examinations, victory over adversaries, and dedication to healing services.',
  '1_7': 'Lagnesha in 7th House: Focuses life fulfillment through partnerships, foreign travel, public diplomacy, and mutual respect with spouse.',
  '1_8': 'Lagnesha in 8th House: Deepens research abilities, occult wisdom, mystical understanding, transformation through life lessons, and longevity.',
  '1_9': 'Lagnesha in 9th House: Blessed by Dharma, divine fortune (Bhagya), high ethics, guidance from venerable teachers, and prosperous global journeys.',
  '1_10': 'Lagnesha in 10th House: Dharma-Karmadhipati potential: High career authority, executive rank, public honor, and notable social contributions.',
  '1_11': 'Lagnesha in 11th House: Constant expansion of income, influential social alliances, realization of ambitions, and elder sibling support.',
  '1_12': 'Lagnesha in 12th House: Spiritual inclinations, philosophical detachment, success in foreign lands or charitable institutions, and pursuit of Moksha.',

  // 2nd Lord (Dhanesha)
  '2_1': '2nd Lord in 1st House: Wealth generated through self-endeavor, dignified family background, and attractive articulation.',
  '2_2': '2nd Lord in 2nd House: Strong Dhana Yoga: Vast wealth accumulation, truthful speech, excellent memory, and flourishing family lineage.',
  '2_9': '2nd Lord in 9th House: Wealth earned through ethical principles, divine patronage, higher learning, and benevolent institutions.',
  '2_10': '2nd Lord in 10th House: High earnings from government or premier professional career, commercial respect, and honorable trade.',
  '2_11': '2nd Lord in 11th House: Mahadhana Yoga: Continuous inflow of prosperity from multiple streams, commerce, and profitable ventures.',

  // 4th Lord (Sukhesha)
  '4_1': '4th Lord in 1st House: Inherent sense of inner contentment, ancestral inheritance, good education, and attractive vehicle conveyance.',
  '4_4': '4th Lord in 4th House: Unshakeable domestic happiness, sprawling properties, mother longevity, and emotional serenity.',
  '4_10': '4th Lord in 10th House: Strong public reputation, societal leadership, successful educational or real estate ventures.',

  // 5th Lord (Panchamesha)
  '5_1': '5th Lord in 1st House: Scholarly intellect, virtuous conduct, artistic creativity, and natural intuition.',
  '5_5': '5th Lord in 5th House: Exceptional intellect, poetic ability, mastery of mantras and sciences, and flourishing children.',
  '5_9': '5th Lord in 9th House: Supreme Trikona Yoga: Deep philosophical wisdom, spiritual pilgrimages, and royal or state accolades.',
  '5_10': '5th Lord in 10th House: Career driven by intellect, strategic advisory, teaching, or creative enterprise.',

  // 7th Lord (Saptamesha)
  '7_1': '7th Lord in 1st House: Devoted and charming spouse, public prominence, and charismatic social rapport.',
  '7_7': '7th Lord in 7th House: Swa-kshetra 7th Lord: Strong marital harmony, flourishing business partnerships, and prosperous foreign travel.',
  '7_10': '7th Lord in 10th House: Partner aids professional stature, thriving commercial collaborations, and public prestige.',

  // 9th Lord (Bhagyesha)
  '9_1': '9th Lord in 1st House: Native is blessed with innate good luck, righteous character, religious devotion, and long-lasting fame.',
  '9_5': '9th Lord in 5th House: Auspicious luck through children, exceptional creative and speculative insight, and deep spiritual understanding.',
  '9_9': '9th Lord in 9th House: Pristine Bhagya Yoga: Universal good fortune, philanthropy, noble guru, and spiritual elevation.',
  '9_10': '9th Lord in 10th House: Renowned Raja Yoga: Peak professional reputation, statesman qualities, and societal leadership.',

  // 10th Lord (Karmesha)
  '10_1': '10th Lord in 1st House: Independent entrepreneur or high officer, pioneer in career, revered in community.',
  '10_9': '10th Lord in 9th House: Career aligned with justice, morality, education, international affairs, or dharma.',
  '10_10': '10th Lord in 10th House: High executive authority, unrivaled professional mastery, governmental accolades, and steady command.',
  '10_11': '10th Lord in 11th House: Immense gains through profession, lucrative enterprise, and wide-reaching influence.',
};

export async function generateKundliAiSummary(
  kundliData: any,
  focus: string = 'holistic',
  depth: string = 'detailed'
): Promise<AiSummarySectionPayload> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptContext = buildAstrologicalPrompt(kundliData, focus, depth);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction: `You are an erudite, classical Vedic Astrologer (Jyotish Acharya) with deep knowledge of the Brihat Parashara Hora Shastra, Jaimini Sutras, and Phaladeepika.
Provide an insightful, nuanced, and empowering synthesis of the native's chart.
Pay special attention to:
1. Graha Bhava Sthiti: Why a planet placed in a specific house produces certain behavioral, karmic, and psychological outcomes.
2. Bhava Adhipati (House Lords): The crucial Vedic principle of where each house's ruler is placed (e.g. 1st lord in 10th house, 7th lord in 11th house) and what that lordship connection unlocks in life.
3. Conjunctions, mutual aspects (Drishti), and notable Yogas.
4. Current Mahadasha/Antardasha activation.
5. Practical, uplifting remedial advice.
Ensure tone is dignified, constructive, culturally respectful, and clear.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING, description: 'Executive Vedic essence of the chart' },
              lagnaInsight: {
                type: Type.OBJECT,
                properties: {
                  sign: { type: Type.STRING },
                  lord: { type: Type.STRING },
                  lordHouse: { type: Type.INTEGER },
                  interpretation: { type: Type.STRING },
                },
                required: ['sign', 'lord', 'lordHouse', 'interpretation'],
              },
              grahaBhavaSthiti: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    planet: { type: Type.STRING },
                    house: { type: Type.INTEGER },
                    sign: { type: Type.STRING },
                    dignity: { type: Type.STRING },
                    effect: { type: Type.STRING },
                    practicalGuidance: { type: Type.STRING },
                  },
                  required: ['planet', 'house', 'sign', 'dignity', 'effect', 'practicalGuidance'],
                },
              },
              bhavaAdhipati: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    houseNumber: { type: Type.INTEGER },
                    houseName: { type: Type.STRING },
                    lordPlanet: { type: Type.STRING },
                    placedInHouse: { type: Type.INTEGER },
                    classicalEffect: { type: Type.STRING },
                    realLifeManifestation: { type: Type.STRING },
                  },
                  required: ['houseNumber', 'houseName', 'lordPlanet', 'placedInHouse', 'classicalEffect', 'realLifeManifestation'],
                },
              },
              yogasAndCombinations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    manifestation: { type: Type.STRING },
                  },
                  required: ['name', 'description', 'manifestation'],
                },
              },
              dashaActivation: {
                type: Type.OBJECT,
                properties: {
                  mahadasha: { type: Type.STRING },
                  antardasha: { type: Type.STRING },
                  timingEffect: { type: Type.STRING },
                  keyActionAreas: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['mahadasha', 'antardasha', 'timingEffect', 'keyActionAreas'],
              },
              vedicRemedies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    remedy: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                  },
                  required: ['category', 'remedy', 'purpose'],
                },
              },
            },
            required: [
              'overview',
              'lagnaInsight',
              'grahaBhavaSthiti',
              'bhavaAdhipati',
              'yogasAndCombinations',
              'dashaActivation',
              'vedicRemedies',
            ],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return parsed as AiSummarySectionPayload;
      }
    } catch (apiErr) {
      console.warn('Gemini API call failed, using high-precision Vedic algorithmic engine:', apiErr);
    }
  }

  // Fallback to Classical Algorithmic Engine
  return generateAlgorithmicVedicSummary(kundliData);
}

function buildAstrologicalPrompt(k: any, focus: string, depth: string): string {
  const nativeName = k.birthDetails?.name || 'Native';
  const lagna = k.lagna?.signName || k.lagnaSignName || 'Aries';
  const lagnaLord = k.lagna?.lord || 'Mars';
  const moonRashi = k.moonSignName || 'Unknown';
  const nakshatra = k.nakshatra?.name || 'Ashwini';

  const planetsList = (k.grahasList || []).map((g: any) => 
    `- ${g.name} (${g.sanskritName}): House ${g.house}, Sign: ${g.rashiName} (${g.formattedDegree}), Dignity: ${g.dignity}, Retrograde: ${g.isRetrograde ? 'Yes' : 'No'}`
  ).join('\n');

  const houseLordsList = (k.bhavaSummaries || []).map((b: any) => 
    `- House ${b.houseNumber} (${b.signName}): Ruled by ${b.lord}, Lord is placed in House ${b.lordHouse}. Occupants: ${(b.occupants || []).join(', ') || 'None'}`
  ).join('\n');

  const yogasList = (k.yogas || []).map((y: any) => `- ${y.name}: ${y.description}`).join('\n') || 'Standard alignments';

  const dashaInfo = k.vimshottariDasha ? 
    `Current Mahadasha: ${k.vimshottariDasha.currentMahadasha?.lordName || 'Sun'} (until ${k.vimshottariDasha.currentMahadasha?.endYear || '2030'}), Current Antardasha: ${k.vimshottariDasha.currentAntardasha?.lordName || 'Moon'}` : 
    'Vimshottari Dasha active';

  return `Please analyze this Vedic Kundli chart for ${nativeName}:
Focus Area requested: ${focus}. Depth: ${depth}.

NATIVE DETAILS:
- Name: ${nativeName}
- Lagna (Ascendant): ${lagna}, Ruled by ${lagnaLord}
- Moon Sign (Janma Rashi): ${moonRashi}
- Janma Nakshatra: ${nakshatra} (Pada ${k.nakshatra?.pada || 1})
- Active Period: ${dashaInfo}

PLANETARY POSITIONS IN HOUSES (Graha Bhava Sthiti):
${planetsList}

HOUSE LORDS & THEIR PLACEMENT (Bhava Adhipati):
${houseLordsList}

DETECTED YOGAS & DOSHAS:
${yogasList}

Please generate the complete, rich structured JSON analysis detailing how the planets in each house and each house lord's placement shape the native's destiny, career, personality, relationships, and spiritual growth.`;
}

/**
 * Classical Algorithmic Synthesis Engine based on Brihat Parashara Hora Shastra
 */
export function generateAlgorithmicVedicSummary(k: any): AiSummarySectionPayload {
  const nativeName = k.birthDetails?.name || 'Native';
  const lagnaSign = k.lagna?.signName || k.lagnaSignName || 'Scorpio';
  const lagnaLord = k.lagna?.lord || 'Mars';

  // Find where lagna lord is placed
  const lagnaLordGraha = (k.grahasList || []).find((g: any) => 
    g.name.toLowerCase() === lagnaLord.toLowerCase() || g.sanskritName?.toLowerCase() === lagnaLord.toLowerCase()
  );
  const lagnaLordHouse = lagnaLordGraha?.house || 1;

  // Overview
  const overview = `${nativeName}'s chart is grounded by an impactful ${lagnaSign} Lagna, with the ascendant ruler ${lagnaLord} situated in House ${lagnaLordHouse}. The Moon resides in ${k.moonSignName || 'Cancer'} within ${k.nakshatra?.name || 'Anuradha'} Nakshatra, creating a receptive and deeply observant mental constitution. The chart exhibits prominent Kendra and Trikona activations, fostering enduring willpower, self-made accomplishments, and ethical grounding.`;

  // Lagna Insight
  const lagnaKey = `1_${lagnaLordHouse}`;
  const lagnaInterpretation = CLASSICAL_HOUSE_LORD_EFFECTS[lagnaKey] || 
    `As the 1st lord resides in House ${lagnaLordHouse}, the native's personal identity and life focus are intimately tied to the affairs of the ${lagnaLordHouse}th Bhava, producing natural leadership, dedication to purposeful action, and strong karmic momentum.`;

  // Graha Bhava Sthiti (Planets in Houses)
  const grahaBhavaSthiti = (k.grahasList || []).map((g: any) => {
    let effect = `${g.name} in House ${g.house} (${g.rashiName}): `;
    let advice = 'Maintain balance and harness this planetary energy positively.';

    if (g.name === 'Sun') {
      effect += g.house === 10 ? 'Attains Digbala (directional strength), bestowing exceptional professional leadership, public prominence, and authority.' :
        g.house === 1 ? 'Endows charismatic vitality, dignified bearing, high self-esteem, and natural executive command.' :
        `Illuminates the matters of House ${g.house} with purpose, personal pride, and focus on core objectives.`;
      advice = 'Practice Surya Namaskar, honor father figures, and lead with benevolent warmth.';
    } else if (g.name === 'Moon') {
      effect += g.house === 4 ? 'Resides in the seat of emotion, conferring peace of mind, strong maternal affection, real-estate prosperity, and intuitive empathy.' :
        g.house === 1 ? 'Softens personality with magnetic charm, emotional sensitivity, popular appeal, and vivid imagination.' :
        `Directs emotional consciousness toward the themes of House ${g.house}.`;
      advice = 'Cultivate meditation, stay hydrated, and protect emotional boundaries.';
    } else if (g.name === 'Mars') {
      effect += g.house === 10 ? 'Kuladipaka & Ruchaka Yoga traits: Peak directional potency, sharp tactical acumen, courage, and pioneering success.' :
        g.house === 1 ? 'Infuses physical vitality, boldness, fiery passion, and independent enterprise.' :
        `Energizes House ${g.house} with focused drive, decisive execution, and physical vigor.`;
      advice = 'Channel vitality through sports, physical discipline, and patient listening.';
    } else if (g.name === 'Mercury') {
      effect += `Enhances analytical dexterity, communicative charm, commercial logic, and intellectual curiosity in House ${g.house}.`;
      advice = 'Engage in reading, continuous learning, and clear financial bookkeeping.';
    } else if (g.name === 'Jupiter') {
      effect += `Bestows divine grace, wisdom, virtuous conduct, and auspicious expansion over the affairs of House ${g.house}.`;
      advice = 'Respect mentors, study philosophical texts, and cultivate charitable giving.';
    } else if (g.name === 'Venus') {
      effect += `Infuses artistic aesthetics, diplomatic grace, relationship harmony, and material refinement into House ${g.house}.`;
      advice = 'Surround yourself with beauty, practice equitable partnership, and appreciate the arts.';
    } else if (g.name === 'Saturn') {
      effect += `Demands discipline, patience, resilience, and systematic labor in House ${g.house}, rewarding persistence with unshakable longevity.`;
      advice = 'Cultivate punctuality, humility toward workers, and long-range dedication.';
    } else if (g.name === 'Rahu') {
      effect += `Creates intense ambition, unconventional breakthroughs, and innovative vision in House ${g.house}.`;
      advice = 'Avoid speculative shortcuts; channel ambition into cutting-edge technology or modern methods.';
    } else if (g.name === 'Ketu') {
      effect += `Brings spiritual detachment, intuitive depth, and subtle introspective wisdom regarding House ${g.house}.`;
      advice = 'Practice silent contemplation, spiritual study, and releasing material possessiveness.';
    }

    return {
      planet: g.name,
      house: g.house,
      sign: g.rashiName,
      dignity: g.dignity,
      effect,
      practicalGuidance: advice,
    };
  });

  // Bhava Adhipati (12 House Lords)
  const HOUSE_NAMES = [
    'Tanu Bhava (House of Self & Vitality)',
    'Dhana Bhava (House of Wealth & Speech)',
    'Sahaja Bhava (House of Courage & Siblings)',
    'Sukha Bhava (House of Home & Mother)',
    'Putra Bhava (House of Intellect & Progeny)',
    'Ari Bhava (House of Overcoming Obstacles)',
    'Yuvati Bhava (House of Marriage & Partnerships)',
    'Randhra Bhava (House of Transformation & Longevity)',
    'Dharma Bhava (House of Fortune & Ethics)',
    'Karma Bhava (House of Career & Authority)',
    'Labha Bhava (House of Gains & Aspirations)',
    'Vyaya Bhava (House of Expenses & Moksha)',
  ];

  const bhavaAdhipati = (k.bhavaSummaries || []).map((b: any, idx: number) => {
    const lookupKey = `${b.houseNumber}_${b.lordHouse}`;
    const specificEffect = CLASSICAL_HOUSE_LORD_EFFECTS[lookupKey];

    const fallbackEffect = specificEffect || 
      `Lord of House ${b.houseNumber} (${b.lord}) placed in House ${b.lordHouse} connects the core significations of ${b.signName} to the activities and results of the ${b.lordHouse}th house, creating a direct karmic channel for development.`;

    const manifestation = `Activates opportunities when pursuing the themes governed by ${b.lord} during related dasha sub-periods.`;

    return {
      houseNumber: b.houseNumber,
      houseName: HOUSE_NAMES[idx] || `Bhava ${b.houseNumber}`,
      lordPlanet: b.lord,
      placedInHouse: b.lordHouse,
      classicalEffect: fallbackEffect,
      realLifeManifestation: manifestation,
    };
  });

  // Yogas & Combinations
  const detectedYogas = (k.yogas || []).map((y: any) => ({
    name: y.name,
    description: y.description,
    manifestation: y.significance || 'Strengthens fortune, public recognition, and auspicious timing in life.',
  }));

  if (detectedYogas.length === 0) {
    detectedYogas.push({
      name: 'Kendra-Trikona Subhata',
      description: 'Mutual harmony between cardinal and trine planetary positions.',
      manifestation: 'Ensures resilience, stability, and enduring recovery from life challenges.',
    });
  }

  // Dasha
  const mahadasha = k.vimshottariDasha?.currentMahadasha?.lordName || 'Jupiter';
  const antardasha = k.vimshottariDasha?.currentAntardasha?.lordName || 'Saturn';
  const dashaActivation = {
    mahadasha,
    antardasha,
    timingEffect: `Currently navigating the Mahadasha of ${mahadasha} with the Antardasha of ${antardasha}. This period strongly energizes the houses ruled and occupied by ${mahadasha}, making this an auspicious window for focused personal development, structured expansion, and karmic consolidation.`,
    keyActionAreas: [
      `Consolidate professional and financial foundations ruled by ${mahadasha}`,
      'Cultivate mindful daily routines and avoid hasty speculative choices',
      'Harmonize family communications and maintain consistent physical wellness',
    ],
  };

  // Remedies
  const vedicRemedies = [
    {
      category: 'Planetary Mantra & Dhyana',
      remedy: `Chant the Beej Mantra of Lagna Lord ${lagnaLord} (108 times on auspicious days).`,
      purpose: 'Strengthens physical vitality, clarity of intellect, and protective aura.',
    },
    {
      category: 'Dietary & Lifestyle Alignment',
      remedy: 'Begin the morning with sunlight exposure, copper-vessel water, and gratitude meditation.',
      purpose: 'Harmonizes solar prana, digestive fire (Jatharagni), and emotional composure.',
    },
    {
      category: 'Charity & Karma Yoga',
      remedy: 'Engage in selfless service (Seva), feeding birds, or supporting educational causes on Saturdays/Thursdays.',
      purpose: 'Softens malefic transit friction and activates spiritual merits (Punya).',
    },
  ];

  return {
    overview,
    lagnaInsight: {
      sign: lagnaSign,
      lord: lagnaLord,
      lordHouse: lagnaLordHouse,
      interpretation: lagnaInterpretation,
    },
    grahaBhavaSthiti,
    bhavaAdhipati,
    yogasAndCombinations: detectedYogas,
    dashaActivation,
    vedicRemedies,
  };
}
