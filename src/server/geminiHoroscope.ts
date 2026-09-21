import { GoogleGenAI, Type } from '@google/genai';
import { DailyHoroscopeResult } from '../types/horoscope';

export interface AiHoroscopeInterpretation {
  aiSummary: string;
  opportunityInsight: string;
  challengeGuidance: string;
  personalMantraGuidance: string;
  practicalAffirmation: string;
  promptVersionUsed: string;
}

export async function interpretDailyHoroscopeWithAi(
  horoscope: DailyHoroscopeResult,
  promptVersion: string = 'v1.0-Classical'
): Promise<AiHoroscopeInterpretation> {
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

      let promptTone = 'Classical Parashari Vedic astrology with dignified, compassionate, and empowering tone.';
      if (promptVersion === 'v1.1-Executive') {
        promptTone = 'Crisp, modern executive coaching tone with bulleted astrological rationale for busy professionals.';
      } else if (promptVersion === 'v2.0-DeepShastra') {
        promptTone = 'In-depth classical Jyotish referencing planetary karakas, bhava lordships, and ancient shastric sutras.';
      }

      const promptContext = `
PERSONAL BIRTH & HOROSCOPE DATA (STRICT MATHEMATICAL CALCULATION - DO NOT ALTER):
- Native Name: ${horoscope.userName}
- Lagna (Ascendant): ${horoscope.birthDetails.lagnaSign} (Lord: ${horoscope.birthDetails.lagnaLord})
- Moon Sign (Rashi): ${horoscope.birthDetails.moonSign} (Lord: ${horoscope.birthDetails.moonLord})
- Sun Sign: ${horoscope.birthDetails.sunSign}
- Nakshatra: ${horoscope.birthDetails.nakshatra} (Pada ${horoscope.birthDetails.pada})
- Date of Prediction: ${horoscope.date}
- Overall Alignment Score: ${horoscope.overallScore}/100
- Strongest Planet Today: ${horoscope.strongestPlanet.name} (${horoscope.strongestPlanet.sanskrit}) - ${horoscope.strongestPlanet.reason}
- Prime Opportunity: ${horoscope.biggestOpportunity.domain} - ${horoscope.biggestOpportunity.description}
- Prime Sensitive Area: ${horoscope.biggestChallenge.domain} - ${horoscope.biggestChallenge.remedy}
- Active Vimshottari Mahadasha: ${horoscope.activeDasha.mahadasha.lord} | Antardasha: ${horoscope.activeDasha.antardasha.lord}
- Panchang: ${horoscope.panchang.dayOfWeek} (${horoscope.panchang.varaLord} Vara), ${horoscope.panchang.tithi.name}, ${horoscope.panchang.yoga.name} Yoga (${horoscope.panchang.yoga.nature}), ${horoscope.panchang.karana.name} Karana
- Lucky Color: ${horoscope.luckyColor.name} | Lucky Number: ${horoscope.luckyNumber} | Auspicious Time: ${horoscope.luckyTime.window}

CRITICAL RULES:
1. Ground your interpretation strictly in the provided planetary positions and calculated scores.
2. DO NOT alter any calculated values, houses, or planetary locations.
3. Frame predictions constructively: emphasize human free will (Purushartha) and practical wisdom.
4. Explain WHY these transits influence the day using the computed Gochar and Panchang.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptContext,
        config: {
          systemInstruction: `You are an erudite, ethical Vedic Astrologer (Jyotish Acharya).
Your tone guideline: ${promptTone}
Explain verified astrological calculations in accessible, lucid language without deterministic fatalism.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiSummary: {
                type: Type.STRING,
                description: 'A 2-3 paragraph flowing synthesis of today’s astrological transits and energy currents for the native.',
              },
              opportunityInsight: {
                type: Type.STRING,
                description: 'Detailed explanation of why today’s strongest transit unlocks tangible progress in the highest scoring category.',
              },
              challengeGuidance: {
                type: Type.STRING,
                description: 'Compassionate, practical advice on how to gracefully navigate today’s sensitive planetary tensions.',
              },
              personalMantraGuidance: {
                type: Type.STRING,
                description: 'Vedic explanation of how chanting the recommended Beej mantra balances and aligns subtle solar/lunar prana.',
              },
              practicalAffirmation: {
                type: Type.STRING,
                description: 'A single, high-impact morning affirmation grounded in today’s favorable graha alignment.',
              },
            },
            required: ['aiSummary', 'opportunityInsight', 'challengeGuidance', 'personalMantraGuidance', 'practicalAffirmation'],
          },
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text);
        return {
          aiSummary: parsed.aiSummary,
          opportunityInsight: parsed.opportunityInsight,
          challengeGuidance: parsed.challengeGuidance,
          personalMantraGuidance: parsed.personalMantraGuidance,
          practicalAffirmation: parsed.practicalAffirmation,
          promptVersionUsed: promptVersion,
        };
      }
    } catch (err) {
      console.warn('Gemini API interpretation failed or timed out, activating Classical Shastric Fallback:', err);
    }
  }

  // Classical Algorithmic Fallback Engine
  return generateClassicalHoroscopeFallback(horoscope, promptVersion);
}

export function generateClassicalHoroscopeFallback(
  h: DailyHoroscopeResult,
  promptVersion: string = 'v1.0-Classical'
): AiHoroscopeInterpretation {
  const p = h.strongestPlanet;
  const opp = h.biggestOpportunity;
  const chal = h.biggestChallenge;

  const aiSummary = `As the celestial sphere turns on ${h.panchang.dayOfWeek}, your ${h.birthDetails.lagnaSign} Lagna receives notable activation through ${p.name} (${p.sanskrit}) radiating from your transiting chart. With the overall alignment index registering at ${h.overallScore}/100, the cosmos invites intentional forward movement rather than rushed friction. The presiding ${h.panchang.varaLord} day lord harmonizes with the ${h.panchang.yoga.name} Yoga, offering stable grounding for your daily endeavors.

Under the prevailing ${h.activeDasha.mahadasha.lord} Mahadasha and ${h.activeDasha.antardasha.lord} Antardasha, your mind and actions are guided toward karmic clarity. Today's cosmic currents favor conscious focus on ${opp.domain.toLowerCase()}, where favorable planetary aspects amplify your natural instincts. Honor your physical rhythm and utilize the auspicious ${h.luckyTime.window} window for pivotal actions.`;

  const opportunityInsight = `Your highest potential today blossoms in ${opp.domain} (Scoring ${h.scores[h.categories[0]?.key || 'career'] || 88}/100). The auspicious positioning of ${p.name} creates an unobstructed conduit for strategic communication, partnerships, and meaningful accomplishments. Align your decisive steps with this window.`;

  const challengeGuidance = `Extra mindfulness is advised in ${chal.domain}. Transit tensions may prompt impatience or hasty assumptions; counter this by observing thoughtful pauses before reacting. Engaging in peaceful deep breaths and respecting differing viewpoints will effortlessly neutralize friction.`;

  const personalMantraGuidance = `Chanting "${h.mantra.phonetic}" (${h.mantra.repetitions} repetitions) resonates directly with ${p.name}'s subtle vibrational frequency, stabilizing your mental focus (Manas) and shielding your aura against erratic external noise.`;

  const practicalAffirmation = `I move through this day with calm discernment, anchored in the strength of my inner self and guided by righteous purpose.`;

  return {
    aiSummary,
    opportunityInsight,
    challengeGuidance,
    personalMantraGuidance,
    practicalAffirmation,
    promptVersionUsed: `${promptVersion} (Vedic Shastric Fallback)`,
  };
}
