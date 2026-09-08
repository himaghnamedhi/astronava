import { PlanetId } from '../types/astrology';

export type PakshaType = 'Shukla Paksha (Waxing / Bright)' | 'Krishna Paksha (Waning / Dark)';
export type TithiGroup = 'Nanda (Joy & Prosperity)' | 'Bhadra (Auspicious & Steady)' | 'Jaya (Victory & Conquest)' | 'Rikta (Power & Transformation)' | 'Poorna (Fullness & Completion)';

export interface TithiDetails {
  index: number; // 1 to 30
  name: string; // e.g. "Shukla Pratipada", "Purnima", "Krishna Ashtami"
  sanskritName: string; // e.g. "शुक्ल प्रतिपदा"
  paksha: PakshaType;
  tithiNumberInPaksha: number; // 1 to 15
  group: TithiGroup;
  rulingDeity: string;
  rulingPlanet: string;
  element: 'Fire (Agni)' | 'Earth (Prithvi)' | 'Space (Akash)' | 'Water (Jal)' | 'Air (Vayu)';
  auspiciousNature: string;
  summary: string;
  howItAffectsPerson: {
    corePersonality: string;
    emotionalNature: string;
    careerAndWealth: string;
    relationshipTendencies: string;
    lifeStrengths: string[];
    potentialChallenges: string[];
    spiritualFocus: string;
    recommendedRemedy: string;
  };
}

export interface ComputedTithiResult {
  tithiIndex: number;
  tithi: TithiDetails;
  name: string;
  sanskritName: string;
  rulingDeity: string;
  rulingPlanet: string;
  elongationDeg: number;
  paksha: 'Shukla' | 'Krishna';
  percentageElapsed: number;
  formattedElongation: string;
}

// -------------------------------------------------------------
// COMPLETE 30 VEDIC TITHIS DATASET
// -------------------------------------------------------------

export const TITHIS_DATA: Record<number, TithiDetails> = {
  1: {
    index: 1,
    name: 'Shukla Pratipada (Padwa)',
    sanskritName: 'शुक्ल प्रतिपदा',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 1,
    group: 'Nanda (Joy & Prosperity)',
    rulingDeity: 'Agni (God of Sacred Fire)',
    rulingPlanet: 'Sun (Surya)',
    element: 'Fire (Agni)',
    auspiciousNature: 'Auspicious for new initiatives, vows, educational beginnings, and agricultural starts.',
    summary: 'The inaugural day of the bright lunar cycle, symbolizing primordial spark, creation, and fresh willpower.',
    howItAffectsPerson: {
      corePersonality: 'Endowed with a pioneering spirit, self-motivated drive, and natural leadership. You enjoy commencing new enterprises, setting personal benchmarks, and charting your own independent course in life.',
      emotionalNature: 'Warm, direct, and straightforward. You dislike ambiguity and express feelings openly with honest enthusiasm, though you may easily burn with impatience if momentum slows down.',
      careerAndWealth: 'Excels in roles demanding entrepreneurial initiative, pioneering concepts, administrative command, or technological innovation. Wealth grows steadily through proactive personal efforts rather than passive inheritance.',
      relationshipTendencies: 'Passionate and loyal in friendships and love. You value partners who respect your autonomy and support your forward-looking dreams without smothering your independence.',
      lifeStrengths: ['Unshakeable initiative', 'Courage to start anew', 'Charismatic vitality', 'Clear sense of direction'],
      potentialChallenges: ['Occasional hastiness', 'Impatience with slow learners', 'Pride when challenged'],
      spiritualFocus: 'Worship of Lord Agni and daily Surya Namaskar at dawn to channel internal digestive and creative fire constructively.',
      recommendedRemedy: 'Perform Gayatri mantra recitation at sunrise and offer water (Arghya) with red flowers to the rising Sun.'
    }
  },
  2: {
    index: 2,
    name: 'Shukla Dwitiya',
    sanskritName: 'शुक्ल द्वितीया',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 2,
    group: 'Bhadra (Auspicious & Steady)',
    rulingDeity: 'Brahma (The Creator)',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Earth (Prithvi)',
    auspiciousNature: 'Highly auspicious for foundation stone laying, investments, marriage, and long-term covenants.',
    summary: 'The second lunar phase of stability, material manifestation, and structured creativity.',
    howItAffectsPerson: {
      corePersonality: 'Methodical, grounded, and aesthetically cultured. You possess an innate sense of balance, fine taste, and architectural order, preferring sustainable gradual growth over volatile risks.',
      emotionalNature: 'Nurturing, calm, and emotionally steady. You create a comforting environment around you, serving as an emotional anchor for friends and family.',
      careerAndWealth: 'Thrives in banking, real estate, design, public relations, agriculture, and high-quality commerce. Financial discipline is high, leading to substantial asset accumulation over time.',
      relationshipTendencies: 'Deeply devoted, valuing domestic harmony, shared values, and mutual respect. You seek a partner who appreciates tradition, cozy home life, and stable commitments.',
      lifeStrengths: ['Prudent financial judgment', 'Artistic appreciation', 'Steadfast loyalty', 'Calming social presence'],
      potentialChallenges: ['Reluctance to embrace rapid changes', 'Occasional over-cautiousness', 'Possessiveness'],
      spiritualFocus: 'Meditation on Lord Brahma and Goddess Saraswati for divine wisdom, purity of thought, and creative genius.',
      recommendedRemedy: 'Offer white flowers and raw milk to Lord Shiva on Mondays; honor elderly family mentors.'
    }
  },
  3: {
    index: 3,
    name: 'Shukla Tritiya',
    sanskritName: 'शुक्ल तृतीया',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 3,
    group: 'Jaya (Victory & Conquest)',
    rulingDeity: 'Gauri (Divine Mother of Grace & Auspiciousness)',
    rulingPlanet: 'Mars (Mangal)',
    element: 'Space (Akash)',
    auspiciousNature: 'Celebrated for Akshaya Tritiya; supreme for wealth ventures, ceremonies, arts, and buying precious metals.',
    summary: 'A day of imperishable fortune, sweet eloquence, victorious endeavors, and divine feminine grace.',
    howItAffectsPerson: {
      corePersonality: 'Charming, diplomatic, yet quietly determined. You combine aesthetic refinement with resilient determination, knowing how to conquer obstacles through wit and tact rather than brute confrontation.',
      emotionalNature: 'Harmonious and affectionate. You dislike ugly disputes and strive to maintain gracious social relationships, seeking beauty and poetic elegance in everyday interactions.',
      careerAndWealth: 'Excellent prospects in diplomacy, arts, luxury trade, law, consulting, and management. You are blessed with "Akshaya" energy—wealth and reputation earned through righteous means expand steadily.',
      relationshipTendencies: 'Romantic, considerate, and deeply devoted. You value intellectual rapport and emotional companionship, building an inspiring sanctuary of mutual trust.',
      lifeStrengths: ['Irresistible charm', 'Diplomatic finesse', 'Resilient optimism', 'Artistic sensitivity'],
      potentialChallenges: ['Tendency to avoid necessary confrontations', 'Sensitivity to harsh environments'],
      spiritualFocus: 'Devotion to Goddess Parvati/Gauri and chanting Lalita Sahasranama for lasting family bliss and prosperity.',
      recommendedRemedy: 'Donate sweets or yellow clothing to young girls on Thursdays; light a ghee lamp at dusk.'
    }
  },
  4: {
    index: 4,
    name: 'Shukla Chaturthi',
    sanskritName: 'शुक्ल चतुर्थी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 4,
    group: 'Rikta (Power & Transformation)',
    rulingDeity: 'Ganesha (Remover of All Obstacles)',
    rulingPlanet: 'Mercury (Budh)',
    element: 'Water (Jal)',
    auspiciousNature: 'Powerful for neutralizing adversaries, strategic planning, intellectual research, and competitive exams.',
    summary: 'Governed by Vighnaharta Ganesha, turning complex adversities into stepping stones for mastery.',
    howItAffectsPerson: {
      corePersonality: 'Sharp-witted, analytical, and highly resourceful. You possess an uncanny knack for troubleshooting tangled dilemmas that baffle others, exhibiting deep tenacity when pursuing goals.',
      emotionalNature: 'Intense and perceptive. You see through pretense quickly, occasionally guarding your heart behind a layer of intellectual detachment until genuine trust is cemented.',
      careerAndWealth: 'Flourishes in engineering, investigative research, medicine, cybersecurity, law, and high-stakes problem-solving. Wealth is earned through specialized technical prowess and strategic foresight.',
      relationshipTendencies: 'Selectively loyal. You prefer a small circle of deeply trusted confidants and seek an intellectually stimulating partner who can keep pace with your active mind.',
      lifeStrengths: ['Master problem solver', 'Mental agility', 'Steely perseverance', 'Resistance to manipulation'],
      potentialChallenges: ['Overly skeptical mindset', 'Sarcasm under stress', 'Overthinking small setbacks'],
      spiritualFocus: 'Regular chanting of the Ganesha Atharvashirsha or "Om Gam Ganapataye Namaha" to shatter all inner and outer impediments.',
      recommendedRemedy: 'Offer Durva grass and modak to Lord Ganesha on Wednesdays; avoid initiating contentious debates.'
    }
  },
  5: {
    index: 5,
    name: 'Shukla Panchami',
    sanskritName: 'शुक्ल पञ्चमी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 5,
    group: 'Poorna (Fullness & Completion)',
    rulingDeity: 'Naga (Divine Serpent Wisdom) / Saraswati',
    rulingPlanet: 'Jupiter (Guru)',
    element: 'Air (Vayu)',
    auspiciousNature: 'Auspicious for education, medicine, spiritual initiations, arts, and healing.',
    summary: 'A day of abundant spiritual intellect, healing wisdom, and harmonious communion with cosmic knowledge.',
    howItAffectsPerson: {
      corePersonality: 'Scholarly, intuitive, and blessed with expansive vision. You have a philosophical curiosity, a natural attraction to higher learning, and an innate respect for moral integrity and ancient traditions.',
      emotionalNature: 'Generous, optimistic, and benevolent. You harbor great compassion for suffering individuals and naturally inspire goodwill in your community.',
      careerAndWealth: 'Exceptional in teaching, medicine, holistic therapies, literature, advisory roles, and financial planning. Wealth flows naturally as a byproduct of authentic service and wise counsel.',
      relationshipTendencies: 'Noble, broad-minded, and supportive. You treat your life partner as an intellectual equal and spiritual companion, nurturing growth and happiness in the home.',
      lifeStrengths: ['Broad philosophical insight', 'High moral stature', 'Eloquent pedagogical skill', 'Healing presence'],
      potentialChallenges: ['Occasional dogmatism', 'Neglecting practical details due to idealistic visions'],
      spiritualFocus: 'Worship of Goddess Saraswati and Lord Vishnu; recitation of sacred texts and pursuit of higher yogic studies.',
      recommendedRemedy: 'Feed cows on Thursdays with yellow gram (Chana Dal) and donate books or stationery to deserving students.'
    }
  },
  6: {
    index: 6,
    name: 'Shukla Shashthi',
    sanskritName: 'शुक्ल षष्ठी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 6,
    group: 'Nanda (Joy & Prosperity)',
    rulingDeity: 'Kartikeya (Murugan / Skanda - Divine Commander)',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Fire (Agni)',
    auspiciousNature: 'Ideal for taking command, competitive achievements, surgical operations, building construction, and sports.',
    summary: 'Imbued with warrior courage, strategic defense, athletic vitality, and victory over adversaries.',
    howItAffectsPerson: {
      corePersonality: 'Brave, competitive, and fiercely protective of those under your care. You have athletic stamina, righteous indignation against injustice, and the fortitude to conquer daunting obstacles.',
      emotionalNature: 'Passionate and loyal. You wear your convictions on your sleeve and defend friends courageously, though you must guard against quick-triggered anger.',
      careerAndWealth: 'Thrives in defense, law enforcement, corporate strategy, surgery, competitive athletics, and civil engineering. Wealth comes through resolute discipline and competitive distinction.',
      relationshipTendencies: 'Chivalrous, protective, and intensely loyal. You expect direct honesty and mutual loyalty, standing like a fortress beside your partner in difficult times.',
      lifeStrengths: ['Commanding courage', 'Protective instincts', 'High stamina and physical resilience', 'Tactical acumen'],
      potentialChallenges: ['Hot temper when provoked', 'Stubborn resistance to retreat even when prudent'],
      spiritualFocus: 'Worship of Lord Kartikeya (Skanda) or Hanuman Ji for courage, physical vitality, and victory over internal negative vasanas.',
      recommendedRemedy: 'Chant the Subrahmanya Gayatri or Hanuman Chalisa; consume fresh green fruits on Tuesdays.'
    }
  },
  7: {
    index: 7,
    name: 'Shukla Saptami',
    sanskritName: 'शुक्ल सप्तमी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 7,
    group: 'Bhadra (Auspicious & Steady)',
    rulingDeity: 'Surya (The Sun God / Ravi)',
    rulingPlanet: 'Saturn (Shani)',
    element: 'Earth (Prithvi)',
    auspiciousNature: 'Excellent for travel, vehicle purchases, leadership roles, medical convalescence, and government negotiations.',
    summary: 'The day of solar radiance, health vitality, regal stature, and moral purity.',
    howItAffectsPerson: {
      corePersonality: 'Dignified, principled, and radiating quiet self-respect. You value truth, honorable conduct, and civic duty, earning instinctive respect from peers without demanding it loudly.',
      emotionalNature: 'Controlled, noble, and self-contained. You handle emotional crises with composed equilibrium, serving as a pillar of strength when others falter.',
      careerAndWealth: 'Excellent in public administration, government service, corporate executive leadership, politics, and energy sectors. Stable, enduring wealth backed by solid societal honor.',
      relationshipTendencies: 'Caring, formal, and deeply honorable. You honor marriage vows wholeheartedly, seeking a spouse who shares your ethical standards and family values.',
      lifeStrengths: ['Unblemished integrity', 'Natural executive command', 'Strong constitutional vitality', 'Long-term reliability'],
      potentialChallenges: ['Occasional aloofness or pride', 'Stiffness in casual social banter'],
      spiritualFocus: 'Daily recitation of the Aditya Hridaya Stotram to cultivate supreme vitality, solar brilliance, and spiritual sovereignty.',
      recommendedRemedy: 'Practice Surya Namaskar facing East at dawn; donate copper utensils or wheat on Sundays.'
    }
  },
  8: {
    index: 8,
    name: 'Shukla Ashtami',
    sanskritName: 'शुक्ल अष्टमी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 8,
    group: 'Jaya (Victory & Conquest)',
    rulingDeity: 'Maa Durga & Lord Shiva (Rudra)',
    rulingPlanet: 'Rahu',
    element: 'Space (Akash)',
    auspiciousNature: 'Potent for inner spiritual transformation, overcoming chronic troubles, fortress protection, and devotional fasting.',
    summary: 'A day of fierce protective energy, karmic purification, and divine empowerment over negativity.',
    howItAffectsPerson: {
      corePersonality: 'Dynamic, perceptive, and endowed with occult insight. You can endure severe trials without breaking, transforming crises into personal empowerment with exceptional mental fortitude.',
      emotionalNature: 'Deep, multifaceted, and watchful. You possess high emotional depth and empathy for the downtrodden, though you guard your inner sanctuary closely.',
      careerAndWealth: 'Success in crisis management, research, psychiatry, military intelligence, spiritual leadership, and transformative industries. Wealth fluctuates initially but stabilizes strongly in mature years.',
      relationshipTendencies: 'Passionate and transformative. Your relationships are deep and evolutionary; you need a partner of equal psychological depth who appreciates loyalty and emotional authenticity.',
      lifeStrengths: ['Unmatched resilience', 'Profound intuition', 'Fearless in crises', 'Ability to reinvent oneself'],
      potentialChallenges: ['Secretiveness', 'Occasional inner restlessness or distrust'],
      spiritualFocus: 'Worship of Maa Durga (Chandi Path) and Lord Shiva (Maha Mrityunjaya Mantra) to dissolve all malefic afflictions.',
      recommendedRemedy: 'Light a mustard oil or sesame lamp near a Peepal tree on Saturdays; offer red flowers to Goddess Durga.'
    }
  },
  9: {
    index: 9,
    name: 'Shukla Navami',
    sanskritName: 'शुक्ल नवमी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 9,
    group: 'Rikta (Power & Transformation)',
    rulingDeity: 'Durga / Sri Rama (Divine Righteousness)',
    rulingPlanet: 'Sun (Surya)',
    element: 'Water (Jal)',
    auspiciousNature: 'Celebrated as Ram Navami; superior for destroying negative forces, legal conquests, and rigorous tapasya.',
    summary: 'A tithi of intense righteous willpower, triumph of dharma over adharma, and unbending purpose.',
    howItAffectsPerson: {
      corePersonality: 'Principled warrior spirit, driven by justice and fairness. You cannot tolerate injustice or hypocrisy and are willing to stand alone for a righteous cause if necessary.',
      emotionalNature: 'Firm, loyal, and noble. You do not hold petty grudges, but once betrayed, you detach cleanly and decisively.',
      careerAndWealth: 'Prominent in legal fields, judicial work, defense, investigative journalism, social activism, and leadership. Wealth is built through relentless hard work and honorable reputation.',
      relationshipTendencies: 'Protective, devoted, and uncompromising on truth. You seek a partner who embodies mutual respect, moral fortitude, and shared aspirations.',
      lifeStrengths: ['Moral fearlessness', 'Heroic endurance', 'Leadership under fire', 'Total dedication to duty'],
      potentialChallenges: ['Black-and-white thinking', 'Inflexibility with flawed human nature'],
      spiritualFocus: 'Devotion to Lord Sri Rama and recitation of the Ramcharitmanas or Sundarkand for peace, victory, and supreme protection.',
      recommendedRemedy: 'Chant "Shri Ram Jai Ram Jai Jai Ram" 108 times; donate food to the hungry on Tuesdays.'
    }
  },
  10: {
    index: 10,
    name: 'Shukla Dashami',
    sanskritName: 'शुक्ल दशमी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 10,
    group: 'Poorna (Fullness & Completion)',
    rulingDeity: 'Yama (Lord of Dharma & Cosmic Order)',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Air (Vayu)',
    auspiciousNature: 'Celebrated as Vijaya Dashami; supreme for all undertakings, travels, career launches, and major contracts.',
    summary: 'The tithi of victorious fruition, cosmic order, universal accomplishment, and regal triumph.',
    howItAffectsPerson: {
      corePersonality: 'Prudent, ethical, and gifted with a commanding sense of civic destiny. You understand social structures, lead with quiet authority, and consistently produce concrete results in life.',
      emotionalNature: 'Balanced, fair-minded, and serene. You rarely lose your temper and treat both success and failure with philosophical equanimity.',
      careerAndWealth: 'Outstanding prospects in public administration, judiciary, corporate governance, architecture, and international commerce. Wealth is substantial, stable, and respected in society.',
      relationshipTendencies: 'Harmonious, mature, and supportive. You build a stable household founded on mutual dignity, intellectual sharing, and shared family prestige.',
      lifeStrengths: ['Supreme organizing talent', 'High ethical standards', 'Even temperament', 'Visionary execution'],
      potentialChallenges: ['Tendency to overburden yourself with responsibilities', 'Occasional emotional sobriety'],
      spiritualFocus: 'Meditation on Dharma and worship of Lord Vishnu / Dharma Raja for righteous living and inner illumination.',
      recommendedRemedy: 'Perform daily gratitude prayers; feed birds with mixed grains in the morning.'
    }
  },
  11: {
    index: 11,
    name: 'Shukla Ekadashi',
    sanskritName: 'शुक्ल एकादशी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 11,
    group: 'Nanda (Joy & Prosperity)',
    rulingDeity: 'Vishvadeva & Lord Vishnu (Narayana)',
    rulingPlanet: 'Mars (Mangal)',
    element: 'Fire (Agni)',
    auspiciousNature: 'The supreme day for fasting, spiritual austerities, charity, divine communion, and mental purification.',
    summary: 'The most sacred lunar day for transcendental consciousness, devotional purity, and liberation of the soul.',
    howItAffectsPerson: {
      corePersonality: 'Deeply spiritual, philosophical, and endowed with refined intuition. You have a pure heart, high moral sensibilities, and a natural attraction to contemplation, meditation, and sacred knowledge.',
      emotionalNature: 'Gentle, forgiving, and empathetic. You possess high emotional intelligence, feeling the joys and pains of others keenly, and naturally radiate peace.',
      careerAndWealth: 'Excels in education, philanthropy, counseling, publishing, healthcare, spiritual leadership, and ethical entrepreneurship. Wealth comes through auspicious and clean avenues.',
      relationshipTendencies: 'Soulful, devoted, and compassionate. You seek a spiritual union rather than mere physical companionship, cherishing a partner who honors your inner quest.',
      lifeStrengths: ['Refined spiritual intuition', 'Compassionate empathy', 'Moral incorruptibility', 'Graceful communication'],
      potentialChallenges: ['Over-sensitivity to coarse environments', 'Guilt over worldly ambitions'],
      spiritualFocus: 'Observance of Ekadashi fasting and recitation of the Vishnu Sahasranama to bestow supreme peace and liberation.',
      recommendedRemedy: 'Fast or take light fruit diet on Ekadashi; chant "Om Namo Bhagavate Vasudevaya" 108 times daily.'
    }
  },
  12: {
    index: 12,
    name: 'Shukla Dwadashi',
    sanskritName: 'शुक्ल द्वादशी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 12,
    group: 'Bhadra (Auspicious & Steady)',
    rulingDeity: 'Lord Vishnu (Hari / Madhava)',
    rulingPlanet: 'Mercury (Budh)',
    element: 'Earth (Prithvi)',
    auspiciousNature: 'Ideal for philanthropic donations, completing sacred pledges, house warming, and inaugurating temples.',
    summary: 'A day of divine benevolence, philanthropic prosperity, spiritual reward, and inner fulfillment.',
    howItAffectsPerson: {
      corePersonality: 'Kind-hearted, generous, and gifted with a cultured intellect. You naturally attract benefactors and mentors, possessing the rare trait of rejoicing in others\' happiness.',
      emotionalNature: 'Serene, forgiving, and warm. You bring an aura of hospitality, comfort, and gracious generosity wherever you step.',
      careerAndWealth: 'Prominent in educational institutions, trusts, medicine, finance, publishing, and public charities. Financial blessings are consistent, with wealth frequently shared for community welfare.',
      relationshipTendencies: 'Affectionate, patient, and devoted. You make a delightful partner and parent, creating an uplifting, harmonious home atmosphere filled with books and music.',
      lifeStrengths: ['Generous philanthropy', 'Broad cultural knowledge', 'Healing diplomacy', 'Deep family devotion'],
      potentialChallenges: ['Difficulty saying "no" to demanding people', 'Risk of being taken advantage of'],
      spiritualFocus: 'Worship of Sri Hari Vishnu and breaking fasts with sacred Tulsi leaves and water for divine blessings.',
      recommendedRemedy: 'Water and circumambulate the sacred Tulsi plant daily; donate grain or clothing on Dwadashi.'
    }
  },
  13: {
    index: 13,
    name: 'Shukla Trayodashi',
    sanskritName: 'शुक्ल त्रयोदशी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 13,
    group: 'Jaya (Victory & Conquest)',
    rulingDeity: 'Kamadeva (Deity of Desire & Beauty) & Pradosh Shiva',
    rulingPlanet: 'Jupiter (Guru)',
    element: 'Space (Akash)',
    auspiciousNature: 'Celebrated as Pradosham; supreme for love, arts, friendship, sensual happiness, and dissolving past sins.',
    summary: 'Governed by beauty, creative magnetism, aesthetic delight, and evening communion with Lord Shiva.',
    howItAffectsPerson: {
      corePersonality: 'Magnetic, charismatic, and artistic. You possess physical elegance, expressive eyes, and a natural aesthetic flair that wins hearts and charms audiences effortlessly.',
      emotionalNature: 'Romantic, expressive, and lively. You enjoy celebration, music, poetry, and affectionate camaraderie, lifting the spirits of everyone in your company.',
      careerAndWealth: 'Splendid in creative arts, entertainment, diplomacy, luxury industries, gastronomy, fashion, and marketing. Prosperity is high, fueled by your popularity and charismatic appeal.',
      relationshipTendencies: 'Deeply romantic and attentive. You seek passionate emotional resonance and aesthetic harmony in your relationship, cherishing thoughtful gestures and poetic romance.',
      lifeStrengths: ['Irresistible charisma', 'Creative mastery', 'Social popularity', 'Innate aesthetic discernment'],
      potentialChallenges: ['Vulnerability to sensory overindulgence', 'Disappointment when romance loses novelty'],
      spiritualFocus: 'Observance of Pradosha Vratam at twilight and recitation of Shiva Tandava Stotram for grace and dissolution of karmas.',
      recommendedRemedy: 'Light a sesame oil lamp during Pradosha twilight on Trayodashi; wear sandalwood or rose essential oils.'
    }
  },
  14: {
    index: 14,
    name: 'Shukla Chaturdashi',
    sanskritName: 'शुक्ल चतुर्दशी',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 14,
    group: 'Rikta (Power & Transformation)',
    rulingDeity: 'Shiva / Rudra',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Water (Jal)',
    auspiciousNature: 'Potent for esoteric research, conquering formidable foes, spiritual austerities, and breaking toxic cycles.',
    summary: 'The eve of the Full Moon, pregnant with intense psychic energy, mystical awakening, and intense focus.',
    howItAffectsPerson: {
      corePersonality: 'Intense, visionary, and possessing strong psychic stamina. You walk through life with deep awareness, perceiving hidden undercurrents that casual observers miss completely.',
      emotionalNature: 'Passionate and complex. Your emotions run deep like ocean currents; you experience life at full volume and possess formidable willpower to overcome internal turmoil.',
      careerAndWealth: 'Thrives in groundbreaking research, psychology, esoteric sciences, defense technology, metallurgy, and high-intensity creative works. Wealth arrives through mastery of difficult domains.',
      relationshipTendencies: 'Fiercely loyal and transformative. You seek an intense, authentic soul connection, rejecting superficial small-talk and valuing unconditional loyalty above all else.',
      lifeStrengths: ['Extraordinary mental power', 'Psychic intuition', 'Courage in darkness', 'Ability to initiate deep change'],
      potentialChallenges: ['Emotional turbulence during full moon peaks', 'Propensity for brooding'],
      spiritualFocus: 'Maha Mrityunjaya Japa and Abhishek of the Shiva Lingam to channel intense psychic energies into profound spiritual realization.',
      recommendedRemedy: 'Chant "Om Namah Shivaya" with Rudraksha beads; practice deep rhythmic pranayama during stressful periods.'
    }
  },
  15: {
    index: 15,
    name: 'Purnima (Full Moon)',
    sanskritName: 'पूर्णिमा',
    paksha: 'Shukla Paksha (Waxing / Bright)',
    tithiNumberInPaksha: 15,
    group: 'Poorna (Fullness & Completion)',
    rulingDeity: 'Chandra (Soma / Moon God) & Satyanarayana',
    rulingPlanet: 'Saturn (Shani)',
    element: 'Air (Vayu)',
    auspiciousNature: 'Supreme for Satyanarayana Puja, spiritual culmination, public events, charity, and honoring ancestors.',
    summary: 'The zenith of lunar effulgence, radiating total completeness, emotional nourishment, and magnetic abundance.',
    howItAffectsPerson: {
      corePersonality: 'Radiant, charismatic, and deeply magnetic. You possess an expansive aura, natural popularity, and a generous spirit that draws people into your orbit like a warm hearth.',
      emotionalNature: 'Rich, expressive, and nurturing. Your emotional reservoir is vast and deeply empathetic, though you are sensitive to the energetic moods of your surroundings.',
      careerAndWealth: 'Prominent in leadership, mass media, politics, hospitality, education, arts, and public welfare. You achieve wide social recognition, and wealth flows through public goodwill and expansive projects.',
      relationshipTendencies: 'Deeply loving, generous, and devoted. You shower your family and partner with affection, seeking emotional wholeness and building an open, hospitable home.',
      lifeStrengths: ['Luminous personal charisma', 'Vast empathy', 'Expansive leadership', 'Natural social prominence'],
      potentialChallenges: ['Emotional highs and lows', 'Difficulty saying no due to excessive generosity'],
      spiritualFocus: 'Performing Sri Satyanarayana Vrata and offering milk and water to the Full Moon at night for peace of mind.',
      recommendedRemedy: 'Drink water from a silver cup; practice Chandra Trataka (soft gazing at the Full Moon) for mental clarity.'
    }
  },
  16: {
    index: 16,
    name: 'Krishna Pratipada',
    sanskritName: 'कृष्ण प्रतिपदा',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 1,
    group: 'Nanda (Joy & Prosperity)',
    rulingDeity: 'Agni (Sacred Fire)',
    rulingPlanet: 'Sun (Surya)',
    element: 'Fire (Agni)',
    auspiciousNature: 'Good for consolidating gains, internal review, scholarly writing, and starting reflective projects.',
    summary: 'The beginning of the introspective waning fortnight, channeling creative fire into wisdom and consolidation.',
    howItAffectsPerson: {
      corePersonality: 'Thoughtful, determined, and independent. You possess the initiative of Pratipada balanced with a reflective inner maturity, preferring calculated action over impulsive bravado.',
      emotionalNature: 'Steady and self-sufficient. You do not crave external validation, deriving satisfaction from inner competence and quiet mastery.',
      careerAndWealth: 'Strong in advisory, strategy, finance, manufacturing, and executive management. Wealth is built through patient execution and solid organizational systems.',
      relationshipTendencies: 'Reliable and straightforward. You honor commitments meticulously and expect the same unpretentious honesty from your partner.',
      lifeStrengths: ['Strategic patience', 'Independent thinking', 'Reliable work ethic', 'Calm under pressure'],
      potentialChallenges: ['Tendency toward introversion', 'Can be somewhat obstinate in opinions'],
      spiritualFocus: 'Internal Agnihotra meditation and cultivation of discerning intellect (Buddhi) through study of scriptures.',
      recommendedRemedy: 'Offer red sandalwood to Lord Surya; practice mindful eating during sunset.'
    }
  },
  17: {
    index: 17,
    name: 'Krishna Dwitiya',
    sanskritName: 'कृष्ण द्वितीया',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 2,
    group: 'Bhadra (Auspicious & Steady)',
    rulingDeity: 'Brahma (The Cosmic Architect)',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Earth (Prithvi)',
    auspiciousNature: 'Auspicious for foundation planning, quiet craftsmanship, business stabilization, and agriculture.',
    summary: 'A phase of grounded realism, steady preservation of resources, and deep craftsmanship.',
    howItAffectsPerson: {
      corePersonality: 'Practical, reliable, and deeply appreciative of quality. You are patient with details and prefer building lasting institutions rather than chasing fleeting fads.',
      emotionalNature: 'Grounding and faithful. You rarely display volatile temper, providing a quiet comforting presence to family members.',
      careerAndWealth: 'Flourishes in construction, agriculture, accounting, engineering, real estate, and trade. Wealth accumulates safely through compound interest and conservative investments.',
      relationshipTendencies: 'Loyal and protective. You express love through practical service, reliability, and ensuring domestic comfort.',
      lifeStrengths: ['Practical wisdom', 'High dependability', 'Steadfast loyalty', 'Financial shrewdness'],
      potentialChallenges: ['Resistance to sudden changes', 'Occasionally overly cautious'],
      spiritualFocus: 'Meditation on stability and chanting of Om Namah Shivaya with mindful breath awareness.',
      recommendedRemedy: 'Feed cows with green fodder on Mondays; maintain a small garden or indoor plants.'
    }
  },
  18: {
    index: 18,
    name: 'Krishna Tritiya',
    sanskritName: 'कृष्ण तृतीया',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 3,
    group: 'Jaya (Victory & Conquest)',
    rulingDeity: 'Gauri (Divine Mother)',
    rulingPlanet: 'Mars (Mangal)',
    element: 'Space (Akash)',
    auspiciousNature: 'Favorable for strategic defense, arts, healing, and overcoming competitors through tactical intelligence.',
    summary: 'A day of quiet resilience, tactical mastery, and the protective grace of the Divine Mother.',
    howItAffectsPerson: {
      corePersonality: 'Resilient, tactful, and courageous in subtlety. You know when to advance and when to wait, achieving victory through endurance rather than noise.',
      emotionalNature: 'Compassionate yet guarded. You preserve your emotional energy for genuine relationships and stand fiercely beside loved ones in trouble.',
      careerAndWealth: 'Prominent in medicine, strategic defense, counseling, craftsmanship, and analytical consulting. Wealth is achieved through specialized skill and persistent dedication.',
      relationshipTendencies: 'Deeply devoted and protective. You appreciate mutual loyalty and build a fortress of domestic peace with your chosen companion.',
      lifeStrengths: ['Tactical patience', 'Deep resilience', 'Quiet courage', 'Unshakeable loyalty'],
      potentialChallenges: ['Guardedness in early acquaintances', 'Harboring silent grievances'],
      spiritualFocus: 'Worship of Goddess Durga and Gauri for protection from hidden adversaries and toxic influences.',
      recommendedRemedy: 'Donate warm food or blankets to the needy; light an evening lamp for Goddess Parvati.'
    }
  },
  19: {
    index: 19,
    name: 'Krishna Chaturthi',
    sanskritName: 'कृष्ण चतुर्थी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 4,
    group: 'Rikta (Power & Transformation)',
    rulingDeity: 'Ganesha (Sankashti Chaturthi)',
    rulingPlanet: 'Mercury (Budh)',
    element: 'Water (Jal)',
    auspiciousNature: 'Supreme for Sankashti fasting, dissolving deep-rooted karmic obstacles, and inner yogic purification.',
    summary: 'A powerful day of obstacle destruction, karmic cleansing, and inner spiritual breakthroughs.',
    howItAffectsPerson: {
      corePersonality: 'Tenacious, intuitive, and capable of enduring trials to emerge victorious. You have a knack for turning difficulties into profound personal triumphs.',
      emotionalNature: 'Introspective and perceptive. You understand the pain of others and often serve as a wise counselor who helps people navigate dark moments.',
      careerAndWealth: 'Success in crisis consulting, psychology, investigative work, surgery, engineering, and administrative turnarounds. Wealth is earned through overcoming early hurdles.',
      relationshipTendencies: 'Supportive, understanding, and deeply committed. You stand by your partner through thick and thin, valuing authentic character over superficial charm.',
      lifeStrengths: ['Triumph over adversity', 'Incisive analytical mind', 'Profound empathy', 'Unyielding resolve'],
      potentialChallenges: ['Tendency to anticipate problems prematurely', 'Pessimistic moods when exhausted'],
      spiritualFocus: 'Observance of Sankashti Chaturthi moonrise prayers and fasting to Lord Ganesha for freedom from debt and worry.',
      recommendedRemedy: 'Offer red hibiscus flowers and jaggery to Lord Ganesha; avoid initiating petty disputes on Tuesdays.'
    }
  },
  20: {
    index: 20,
    name: 'Krishna Panchami',
    sanskritName: 'कृष्ण पञ्चमी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 5,
    group: 'Poorna (Fullness & Completion)',
    rulingDeity: 'Naga (Serpent Deities of Hidden Wisdom)',
    rulingPlanet: 'Jupiter (Guru)',
    element: 'Air (Vayu)',
    auspiciousNature: 'Ideal for herbal medicine, spiritual study, esoteric initiation, and learning secret arts.',
    summary: 'A phase of deep intuitive knowledge, awakening of dormant potential, and mystical insight.',
    howItAffectsPerson: {
      corePersonality: 'Intuitive, scholarly, and possessing a deep interest in hidden or mystical truths. You enjoy delving beneath surfaces to grasp fundamental cosmic laws.',
      emotionalNature: 'Reflective and calm. You feel at home in contemplative environments and value quiet moments for self-discovery.',
      careerAndWealth: 'Excels in research, pharmacy, psychology, philosophy, data analysis, and educational administration. Wealth is steady and sustained by specialized expertise.',
      relationshipTendencies: 'Gentle, thoughtful, and understanding. You seek a partner who respects your intellectual independence and spiritual pursuits.',
      lifeStrengths: ['Sharp intuitive faculty', 'Scholarly depth', 'Healing empathy', 'Calm demeanor'],
      potentialChallenges: ['Occasional detachment from mundane practicalities', 'Aloofness'],
      spiritualFocus: 'Meditation on Kundalini shakti and recitation of Om Namo Bhagavate Vasudevaya.',
      recommendedRemedy: 'Feed stray animals; offer milk or clean water at the base of sacred trees.'
    }
  },
  21: {
    index: 21,
    name: 'Krishna Shashthi',
    sanskritName: 'कृष्ण षष्ठी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 6,
    group: 'Nanda (Joy & Prosperity)',
    rulingDeity: 'Kartikeya (Murugan / Commander of Light)',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Fire (Agni)',
    auspiciousNature: 'Good for disciplined training, athletic preparation, team defense, and medical healing.',
    summary: 'A day of disciplined courage, strategic defense, and mastery over mental weaknesses.',
    howItAffectsPerson: {
      corePersonality: 'Disciplined, focused, and dutiful. You thrive under structured routines and take pride in completing challenging assignments with distinction.',
      emotionalNature: 'Controlled and loyal. You prefer quiet acts of devotion rather than flashy declarations, standing firm in adversity.',
      careerAndWealth: 'Prominent in healthcare, administration, technology, civil engineering, and team management. Steady wealth through disciplined professional contribution.',
      relationshipTendencies: 'Dependable and respectful. You value mutual duty and build a secure, structured household for your loved ones.',
      lifeStrengths: ['Iron discipline', 'High work ethics', 'Reliable execution', 'Courageous composure'],
      potentialChallenges: ['Excessive self-criticism', 'Difficulty relaxing outside of work'],
      spiritualFocus: 'Worship of Lord Kartikeya and practice of daily physical yoga for balance and mental sharpness.',
      recommendedRemedy: 'Chant the Kartikeya Gayatri mantra; donate copper items on Tuesdays.'
    }
  },
  22: {
    index: 22,
    name: 'Krishna Saptami',
    sanskritName: 'कृष्ण सप्तमी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 7,
    group: 'Bhadra (Auspicious & Steady)',
    rulingDeity: 'Surya (The Sun God)',
    rulingPlanet: 'Saturn (Shani)',
    element: 'Earth (Prithvi)',
    auspiciousNature: 'Good for travel, organizational restructuring, legal consultation, and health recovery.',
    summary: 'A day of quiet authority, balanced judgment, and enduring constitutional strength.',
    howItAffectsPerson: {
      corePersonality: 'Serious, responsible, and principled. You command respect through quiet competence and integrity rather than self-aggrandizement.',
      emotionalNature: 'Dignified and mature. You do not easily get swayed by emotional melodrama, maintaining an even keel.',
      careerAndWealth: 'Thrives in public service, judiciary, auditing, corporate governance, and operations. Wealth is built through long-term investments and prudent governance.',
      relationshipTendencies: 'Faithful and supportive. You are a steady, rock-solid companion who provides enduring emotional security.',
      lifeStrengths: ['Maturity of judgment', 'Executive composure', 'Constitutional resilience', 'High integrity'],
      potentialChallenges: ['Tendency to carry the weight of the world', 'Emotional austerity'],
      spiritualFocus: 'Daily Surya Namaskar and silent japa of Gayatri mantra to maintain inner luminosity.',
      recommendedRemedy: 'Donate black sesame or mustard oil on Saturdays; spend time under the morning sun.'
    }
  },
  23: {
    index: 23,
    name: 'Krishna Ashtami (Janmashtami / Kalashtami)',
    sanskritName: 'कृष्ण अष्टमी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 8,
    group: 'Jaya (Victory & Conquest)',
    rulingDeity: 'Lord Krishna & Bhairava (Shiva)',
    rulingPlanet: 'Rahu',
    element: 'Space (Akash)',
    auspiciousNature: 'Famed for Lord Krishna\'s divine appearance; supreme for dissolving fear, spiritual devotion, and triumph in crises.',
    summary: 'A tithi of divine incarnation in the darkest hour, symbolizing the victory of divine light over tyranny.',
    howItAffectsPerson: {
      corePersonality: 'Deeply charismatic, multifaceted, and strategically brilliant. Like Lord Krishna born at midnight in darkness, you have the rare gift to conquer seemingly impossible odds with cheerful equanimity.',
      emotionalNature: 'Complex, deeply affectionate, yet capable of profound detachment when dharma requires it.',
      careerAndWealth: 'Excels in diplomacy, high-stakes leadership, psychology, law, creative arts, and visionary entrepreneurship. Wealth rises dramatically after navigating early karmic tests.',
      relationshipTendencies: 'Playful yet profoundly devoted. You seek deep spiritual and intellectual companionship, bringing joy and reassurance to your partner.',
      lifeStrengths: ['Strategic brilliance', 'Fearless in dark circumstances', 'Magnetic charm', 'Profound spiritual insight'],
      potentialChallenges: ['Encountering early life turbulence', 'Complex social entanglements'],
      spiritualFocus: 'Devotion to Lord Krishna (Bhagavad Gita recitation) and chanting "Om Namo Bhagavate Vasudevaya".',
      recommendedRemedy: 'Fast on Krishna Ashtami; offer butter and Tulsi leaves to Lord Krishna; help orphans or underprivileged children.'
    }
  },
  24: {
    index: 24,
    name: 'Krishna Navami',
    sanskritName: 'कृष्ण नवमी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 9,
    group: 'Rikta (Power & Transformation)',
    rulingDeity: 'Durga / Matrikas',
    rulingPlanet: 'Sun (Surya)',
    element: 'Water (Jal)',
    auspiciousNature: 'Potent for dismantling negative habits, overcoming competitors, detoxing, and spiritual protection.',
    summary: 'A day of fierce purification, breaking shackles of ignorance, and unshakeable courage.',
    howItAffectsPerson: {
      corePersonality: 'Fiercely honest, uncompromising, and protective of values. You have an aversion to superficiality and possess intense drive to eliminate corruption or injustice.',
      emotionalNature: 'Passionate and loyal. You value authenticity and defend your loved ones with unconditional dedication.',
      careerAndWealth: 'Prominent in advocacy, investigative research, health sciences, security, and turnaround leadership. Wealth is earned through demanding, specialized work.',
      relationshipTendencies: 'Devoted and protective. You demand complete truthfulness and reward it with unwavering loyalty and deep emotional support.',
      lifeStrengths: ['Uncompromising integrity', 'Fierce protective spirit', 'Courage against odds', 'Mental stamina'],
      potentialChallenges: ['Sharp tongue when agitated', 'Impatience with deceitful people'],
      spiritualFocus: 'Chanting Durga Chalisa or Devi Kavacham for absolute protection against negative vibrations.',
      recommendedRemedy: 'Light a camphor lamp at home in the evening; donate food or clothes to needy women.'
    }
  },
  25: {
    index: 25,
    name: 'Krishna Dashami',
    sanskritName: 'कृष्ण दशमी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 10,
    group: 'Poorna (Fullness & Completion)',
    rulingDeity: 'Yama (Dharma Raja)',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Air (Vayu)',
    auspiciousNature: 'Good for legal matters, civic responsibilities, administrative decisions, and charity.',
    summary: 'A phase of moral rectitude, lawful duty, consolidation of karma, and sober achievement.',
    howItAffectsPerson: {
      corePersonality: 'Responsible, lawful, and respected for clear judgment. You act as a voice of reason in chaotic situations, earning trust across various walks of life.',
      emotionalNature: 'Balanced, fair, and composed. You weigh issues objectively and rarely act out of spite.',
      careerAndWealth: 'Success in law, civic leadership, corporate governance, auditing, and organizational management. Stable and honorable wealth.',
      relationshipTendencies: 'Honorable, dedicated, and structured. You provide lasting security and peace of mind to your family.',
      lifeStrengths: ['Impartial judgment', 'High reliability', 'Civic leadership', 'Emotional balance'],
      potentialChallenges: ['Excessive seriousness', 'Difficulty loosening up in festive settings'],
      spiritualFocus: 'Mindfulness of karma and recitation of Vishnu Sahasranama for peace and prosperity.',
      recommendedRemedy: 'Feed crows and stray dogs in the morning; practice forgiveness regularly.'
    }
  },
  26: {
    index: 26,
    name: 'Krishna Ekadashi (Apara / Kamada etc.)',
    sanskritName: 'कृष्ण एकादशी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 11,
    group: 'Nanda (Joy & Prosperity)',
    rulingDeity: 'Vishvadeva & Lord Narayana',
    rulingPlanet: 'Mars (Mangal)',
    element: 'Fire (Agni)',
    auspiciousNature: 'Celebrated for deep spiritual fasting, releasing karmic debts, and acquiring transcendental peace.',
    summary: 'A holy tithi of deep detachment, inner spiritual illumination, and purification of past karmic burdens.',
    howItAffectsPerson: {
      corePersonality: 'Deeply contemplative, spiritually mature, and possessing a detached, noble perspective. You understand the temporary nature of material pursuits and prioritize lasting inner peace.',
      emotionalNature: 'Forgiving, peaceful, and empathetic. You act as a natural healing salve for emotionally distressed souls.',
      careerAndWealth: 'Prominent in counseling, education, medicine, spiritual instruction, publishing, and public welfare. Wealth comes cleanly and is managed with wisdom.',
      relationshipTendencies: 'Soulful, respectful, and unconditionally supportive. You offer profound acceptance and gentle encouragement to your life partner.',
      lifeStrengths: ['Spiritual wisdom', 'Deep tranquility', 'Generous forgiveness', 'Healing presence'],
      potentialChallenges: ['Tendency toward ascetic detachment', 'Indifference to competitive rat races'],
      spiritualFocus: 'Ekadashi fasting, devotional singing, and continuous remembrance of the divine supreme being.',
      recommendedRemedy: 'Fast on Krishna Ekadashi with water or fruits; chant the Hare Krishna Maha-Mantra.'
    }
  },
  27: {
    index: 27,
    name: 'Krishna Dwadashi',
    sanskritName: 'कृष्ण द्वादशी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 12,
    group: 'Bhadra (Auspicious & Steady)',
    rulingDeity: 'Lord Vishnu (Govinda)',
    rulingPlanet: 'Mercury (Budh)',
    element: 'Earth (Prithvi)',
    auspiciousNature: 'Auspicious for charity, feeding the hungry, breaking spiritual fasts, and scholarly study.',
    summary: 'A day of divine benevolence, quiet intellectual joy, and rewarding selfless service.',
    howItAffectsPerson: {
      corePersonality: 'Humble, kind, and intellectually discerning. You prefer doing good in silence without public applause, finding joy in uplifting fellow humans.',
      emotionalNature: 'Calm, understanding, and gracious. You possess an innate sense of dignity that never condescends to others.',
      careerAndWealth: 'Flourishes in education, healthcare, social entrepreneurship, writing, and administrative support. Wealth is stable and blessed with peace of mind.',
      relationshipTendencies: 'Attentive, gentle, and deeply reliable. You build a supportive and loving home environment.',
      lifeStrengths: ['Humble generosity', 'Quiet competence', 'Peaceful demeanor', 'Unselfish service'],
      potentialChallenges: ['Underestimating personal talents', 'Hesitation to claim rightful recognition'],
      spiritualFocus: 'Worship of Lord Vishnu and offering food and water to travelers and seekers.',
      recommendedRemedy: 'Offer Tulsi leaves to Lord Vishnu on Dwadashi; feed cows with soaked gram.'
    }
  },
  28: {
    index: 28,
    name: 'Krishna Trayodashi (Masa Shivaratri / Pradosh)',
    sanskritName: 'कृष्ण त्रयोदशी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 13,
    group: 'Jaya (Victory & Conquest)',
    rulingDeity: 'Lord Shiva (Mahadeva)',
    rulingPlanet: 'Jupiter (Guru)',
    element: 'Space (Akash)',
    auspiciousNature: 'Celebrated as Masa Shivaratri; supreme for dissolving all sins, overcoming fear of death, and achieving liberation.',
    summary: 'The holy eve of cosmic silence, absolute stillness, and union with the transcendent Shiva consciousness.',
    howItAffectsPerson: {
      corePersonality: 'Philosophical, introspective, and possessing profound inner gravity. You are rarely unsettled by worldly crises, having a deep anchor in timeless truths.',
      emotionalNature: 'Serene, self-contained, and deeply compassionate. You possess the rare capacity to absorb the sorrow of others without losing your center.',
      careerAndWealth: 'Prominent in research, medicine, philosophy, spiritual teaching, emergency response, and advisory work. Wealth is stable and decoupled from obsessive greed.',
      relationshipTendencies: 'Deep, steady, and protective. You form an unshakeable bond with your companion, valuing soul-level intimacy and spiritual unity.',
      lifeStrengths: ['Profound inner stillness', 'Crisis resilience', 'Spiritual depth', 'Wisdom beyond age'],
      potentialChallenges: ['Tendency toward extreme solitude', 'Disinterest in trivial socializing'],
      spiritualFocus: 'Observance of Masa Shivaratri vigil and chanting "Om Namah Shivaya" with deep meditative absorption.',
      recommendedRemedy: 'Perform milk and water Abhishekam on a Shiva Lingam on Trayodashi evening.'
    }
  },
  29: {
    index: 29,
    name: 'Krishna Chaturdashi (Narak Chaturdashi / Shivaratri)',
    sanskritName: 'कृष्ण चतुर्दशी',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 14,
    group: 'Rikta (Power & Transformation)',
    rulingDeity: 'Rudra / Kali / Yama',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Water (Jal)',
    auspiciousNature: 'Ideal for intense spiritual sadhana, destroying deepest karmic toxins, and invoking divine protection.',
    summary: 'The darkest night preceding the New Moon, holding supreme occult power, fierce purification, and rebirth.',
    howItAffectsPerson: {
      corePersonality: 'Intense, fearless, and gifted with deep psychological and occult perception. You can walk through trials that would shatter ordinary people, emerging purified and empowered.',
      emotionalNature: 'Deeply private and intense. You feel emotions with volcanic depth but present an impenetrable exterior of composure to the world.',
      careerAndWealth: 'Thrives in surgery, psychiatry, forensic investigations, defense research, crisis turnaround, and deep sciences. Wealth is built through mastery over high-stress environments.',
      relationshipTendencies: 'Unconditionally loyal yet fiercely selective. You demand absolute authenticity and cannot tolerate betrayal or deception.',
      lifeStrengths: ['Fearless courage', 'Psychological insight', 'Power of total rebirth', 'Unshakeable willpower'],
      potentialChallenges: ['Prone to intense brooding', 'Difficulty letting go of painful memories'],
      spiritualFocus: 'Devotion to Lord Shiva and Maa Kali for the destruction of inner demons, fear, and karmic knots.',
      recommendedRemedy: 'Light a sesame oil lamp facing South in the evening; chant Maha Mrityunjaya Mantra 108 times.'
    }
  },
  30: {
    index: 30,
    name: 'Amavasya (New Moon)',
    sanskritName: 'अमावस्या',
    paksha: 'Krishna Paksha (Waning / Dark)',
    tithiNumberInPaksha: 15,
    group: 'Poorna (Fullness & Completion)',
    rulingDeity: 'Pitrus (Ancestral Souls) & Shiva',
    rulingPlanet: 'Saturn (Shani)',
    element: 'Air (Vayu)',
    auspiciousNature: 'Supreme for ancestral rites (Tarpanam), charitable donations, deep meditation, and inner rejuvenation.',
    summary: 'The conjunction of Sun and Moon, a moment of profound zero-point stillness, ancestral blessings, and karmic reset.',
    howItAffectsPerson: {
      corePersonality: 'Profound, introspective, and intuitively gifted. Born when the solar soul and lunar mind merge, you possess deep philosophical wisdom, an old soul persona, and acute sensitivity to the unseen realms.',
      emotionalNature: 'Intensely introspective and sensitive. You require regular periods of quiet retreat to recharge your subtle energy fields and process feelings deeply.',
      careerAndWealth: 'Excels in research, history, psychology, hospice care, philosophy, astrology, and creative writing. Wealth grows steadily when aligned with ancestral traditions and public welfare.',
      relationshipTendencies: 'Deeply loyal, soulful, and protective. You seek a companion who understands your need for occasional solitude and shares your spiritual outlook on life.',
      lifeStrengths: ['Profound intuition', 'Old-soul wisdom', 'Ancestral blessings', 'Depth of understanding'],
      potentialChallenges: ['Vulnerability to melancholy or low physical stamina during new moons', 'Need for grounding'],
      spiritualFocus: 'Tarpanam and prayers for ancestral peace; worship of Lord Shiva to transform darkness into brilliant spiritual light.',
      recommendedRemedy: 'Offer water and sesame seeds to ancestors on Amavasya; feed cows and crows; light a ghee lamp at night.'
    }
  }
};

// -------------------------------------------------------------
// TITHI CALCULATION ALGORITHM
// -------------------------------------------------------------

export function calculateTithiFromDegrees(sunLongitude: number, moonLongitude: number): ComputedTithiResult {
  // Compute angular separation: Moon - Sun
  let diff = (moonLongitude - sunLongitude) % 360;
  if (diff < 0) diff += 360;

  // Each Tithi is exactly 12 degrees
  const tithiIndex = Math.floor(diff / 12) + 1; // 1 to 30
  const normalizedIndex = Math.min(30, Math.max(1, tithiIndex));
  
  // Degrees elapsed in current Tithi
  const degInTithi = diff % 12;
  const percentageElapsed = Math.round((degInTithi / 12) * 100);

  const tithi = TITHIS_DATA[normalizedIndex];
  const paksha = normalizedIndex <= 15 ? 'Shukla' : 'Krishna';

  const deg = Math.floor(diff);
  const min = Math.floor((diff - deg) * 60);

  return {
    tithiIndex: normalizedIndex,
    tithi,
    name: tithi ? tithi.name : 'Vedic Tithi',
    sanskritName: tithi ? tithi.sanskritName : '',
    rulingDeity: tithi ? tithi.rulingDeity : '',
    rulingPlanet: tithi ? tithi.rulingPlanet : '',
    elongationDeg: diff,
    paksha,
    percentageElapsed,
    formattedElongation: `${deg}° ${min}' (${diff.toFixed(2)}°)`,
  };
}
