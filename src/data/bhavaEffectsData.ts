import { HouseNumber } from '../types/astrology';

export interface BhavaLifeImpact {
  houseNumber: HouseNumber;
  sanskritName: string;
  devanagari: string;
  name: string;
  domainName: string;
  naturalSign: string;
  naturalLord: string;
  karakas: string[];
  bodyParts: string[];
  
  // Detailed explanation of how this Bhava affects people
  howItAffectsLife: {
    coreDomain: string;
    personalityAndMindset: string;
    careerAndAmbition: string;
    financesAndProsperity: string;
    relationshipsAndFamily: string;
    healthAndVitality: string;
  };

  // Planetary influences in this house
  beneficInfluence: string;
  maleficInfluence: string;
  
  // Lord placement dynamics
  lordInKendraEffect: string;
  lordInTrikonaEffect: string;
  lordInDusthanaEffect: string;

  // Actionable advice & Remedies
  keyStrengths: string[];
  vulnerabilitiesToWatch: string[];
  practicalGuidance: string;
  vedicRemedy: string;
}

export const BHAVA_EFFECTS_DATA: Record<HouseNumber, BhavaLifeImpact> = {
  1: {
    houseNumber: 1,
    sanskritName: 'Tanu Bhava (तनु भाव)',
    devanagari: 'प्रथम भाव - तनु भाव / लग्न',
    name: '1st House of Self, Physique, Personality & Vitality',
    domainName: 'Self-Identity & Life Purpose',
    naturalSign: 'Aries (Mesha)',
    naturalLord: 'Mars (Mangal)',
    karakas: ['Sun (Surya)'],
    bodyParts: ['Head', 'Brain', 'Facial features', 'Forehead', 'Overall physical build'],
    howItAffectsLife: {
      coreDomain: 'The Lagna or 1st House is the foundational anchor of the horoscope. It represents your soul\'s entry into this physical world, establishing your physical constitution, innate psychology, stamina, and destiny blueprint.',
      personalityAndMindset: 'Shapes your self-image, willpower, self-confidence, and demeanor. A fortified 1st house grants radiant charisma, independence, courage, and natural leadership that earns spontaneous respect.',
      careerAndAmbition: 'Dictates how you project yourself in the world. Determines whether you step forward as a pioneer and leader or prefer supporting roles. Drives your self-directed motivation.',
      financesAndProsperity: 'The 1st house is both a Kendra (action) and a Trikona (fortune). When strong, it enables you to turn personal talent directly into enduring wealth through self-reliance.',
      relationshipsAndFamily: 'Defines your first impression and interpersonal boundaries. It influences how easily others relate to you and whether your natural presence attracts or intimidates people.',
      healthAndVitality: 'Governs the central nervous system, brain, and total physical resilience. A strong 1st house repels illnesses and accelerates recovery from physical strain.'
    },
    beneficInfluence: 'Jupiter, Venus, or Mercury in the 1st house bestows a handsome/charming appearance, radiant complexion, noble manners, optimism, high longevity, and magnetic social appeal.',
    maleficInfluence: 'Mars, Saturn, Rahu, or Ketu here creates an intense, fiery or serious personality. It grants great toughness and warrior grit, but requires balancing ego, controlling anger, and guarding against head injuries.',
    lordInKendraEffect: 'When the 1st Lord sits in a Kendra (1st, 4th, 7th, 10th), the person achieves high social eminence, strong vitality, and commands authority throughout life.',
    lordInTrikonaEffect: 'When the 1st Lord sits in a Trikona (1st, 5th, 9th), the native is blessed with divine fortune, sharp intellect, righteous character, and effortless recognition.',
    lordInDusthanaEffect: 'When the 1st Lord sits in a Dusthana (6th, 8th, 12th), success requires overcoming early health sensitivities and working through personal transformations before reaching full potential.',
    keyStrengths: ['Natural self-confidence', 'Physical vitality', 'Leadership aura', 'Clear sense of identity'],
    vulnerabilitiesToWatch: ['Excessive pride or ego', 'Impatience with differing viewpoints', 'Headaches or eye strain under stress'],
    practicalGuidance: 'Invest in regular physical exercise, maintain upright posture, and practice daily self-reflection to align actions with your highest moral values.',
    vedicRemedy: 'Perform daily Surya Namaskar facing East at dawn; chant the Gayatri Mantra 108 times and wear your Lagna Lord\'s supportive gemstone.'
  },
  2: {
    houseNumber: 2,
    sanskritName: 'Dhana Bhava (धन भाव)',
    devanagari: 'द्वितीय भाव - धन / कुटुंब / वाणी भाव',
    name: '2nd House of Wealth, Family Lineage & Speech',
    domainName: 'Accumulated Wealth, Speech & Family Values',
    naturalSign: 'Taurus (Vrishabha)',
    naturalLord: 'Venus (Shukra)',
    karakas: ['Jupiter (Guru)', 'Mercury (Budh)'],
    bodyParts: ['Face', 'Eyes (Right eye)', 'Mouth', 'Teeth', 'Tongue', 'Throat', 'Vocal cords'],
    howItAffectsLife: {
      coreDomain: 'Governs accumulated liquid wealth, gold, bank balance, domestic happiness with the family of origin, vocal speech tone, and food intake.',
      personalityAndMindset: 'Shapes your verbal eloquence, truthfulness, capacity to listen, and psychological attachment to family heritage and material stability.',
      careerAndAmbition: 'Crucial for careers involving speaking, singing, banking, asset management, hospitality, culinary arts, education, and family-owned businesses.',
      financesAndProsperity: 'The primary treasury house of the chart. Shows how much income you retain and accumulate into lasting savings and valuable heritage assets.',
      relationshipsAndFamily: 'Reveals early childhood nurturing, family heritage, and closeness to immediate relatives. Shows how respectfully you communicate with family.',
      healthAndVitality: 'Governs the throat, vocal cords, teeth, gums, right eye, and nutritional intake. Direct link between dietary discipline and bodily health.'
    },
    beneficInfluence: 'Jupiter, Venus, or Mercury here blesses the native with poetic or persuasive speech, melodious voice, high ancestral inheritance, refined dietary taste, and vast financial security.',
    maleficInfluence: 'Saturn, Mars, or Rahu in the 2nd house can produce blunt, sarcastic, or harsh speech during conflicts, financial fluctuations, or dietary indiscretions that require conscious self-control.',
    lordInKendraEffect: 'The 2nd Lord in a Kendra creates stable family businesses, large estate assets, and reliable institutional income.',
    lordInTrikonaEffect: 'The 2nd Lord in a Trikona creates a supreme Dhana Yoga, bestowing effortless accumulation of wealth, cultured speech, and pious family traditions.',
    lordInDusthanaEffect: 'The 2nd Lord in a Dusthana warns against reckless lending, urging careful budgeting and avoiding speculative financial schemes.',
    keyStrengths: ['Persuasive eloquence', 'Financial discipline', 'Lineage loyalty', 'Appreciation for high quality'],
    vulnerabilitiesToWatch: ['Blunt speech when agitated', 'Attachment to material possessions', 'Indulgent eating habits'],
    practicalGuidance: 'Practice mindful speech (Vak Shuddhi); never use deceitful or vulgar language, and save a fixed percentage of income every month.',
    vedicRemedy: 'Donate yellow sweets or grains on Thursdays; chant the Kanakadhara Stotram or "Om Shreem Mahalakshmiyei Namaha" for financial abundance.'
  },
  3: {
    houseNumber: 3,
    sanskritName: 'Sahaja Bhava / Parakrama (सहज / पराक्रम भाव)',
    devanagari: 'तृतीय भाव - सहज / पराक्रम भाव',
    name: '3rd House of Courage, Siblings, Communication & Enterprise',
    domainName: 'Courage, Self-Effort & Communication',
    naturalSign: 'Gemini (Mithuna)',
    naturalLord: 'Mercury (Budh)',
    karakas: ['Mars (Mangal)', 'Mercury (Budh)'],
    bodyParts: ['Shoulders', 'Arms', 'Hands', 'Collarbones', 'Right Ear', 'Upper respiratory tract'],
    howItAffectsLife: {
      coreDomain: 'The house of personal courage, athletic prowess, initiative, younger siblings, short journeys, writing, technology, and self-made success.',
      personalityAndMindset: 'Determines whether you take bold risks or hesitate. Governs your manual dexterity, curiosity, street-smart intelligence, and tenacity.',
      careerAndAmbition: 'Supreme for media, journalism, sales, IT, marketing, writing, sports, acting, digital communications, and independent entrepreneurship.',
      financesAndProsperity: 'As an Upachaya (growth) house, earnings improve progressively with age through grit, networking, and creative hustle.',
      relationshipsAndFamily: 'Governs relations with younger brothers, sisters, cousins, and immediate neighbors. Reflects teamwork and collaborative goodwill.',
      healthAndVitality: 'Governs physical stamina, shoulder strength, respiratory health, hands, and upper nervous system.'
    },
    beneficInfluence: 'Benefics here grant artistic talent, literary genius, pleasant voice, excellent relations with siblings, and sweet diplomatic negotiation skills.',
    maleficInfluence: 'Malefics (Mars, Sun, Saturn, Rahu) excel in the 3rd house! They bestow fearless courage, unshakeable stamina, competitive dominance, and supreme entrepreneurial drive.',
    lordInKendraEffect: 'The 3rd Lord in a Kendra bestows prominent brothers/collaborators and frequent fruitful travels that expand career horizons.',
    lordInTrikonaEffect: 'The 3rd Lord in a Trikona transforms self-effort into auspicious dharmic ventures, making writing and creative arts deeply successful.',
    lordInDusthanaEffect: 'The 3rd Lord in a Dusthana suggests occasional misunderstandings with siblings; success comes after persevering through initial solitary struggles.',
    keyStrengths: ['Fearless initiative', 'Mental agility and dexterity', 'Compelling communication', 'Resilient self-drive'],
    vulnerabilitiesToWatch: ['Restlessness', 'Impatience with slow processes', 'Risk of arm/shoulder strain'],
    practicalGuidance: 'Write down your ideas regularly, hone manual skills (writing, instrument, sports), and maintain open communication with brothers and sisters.',
    vedicRemedy: 'Recite the Hanuman Chalisa on Tuesdays for courage and physical vitality; feed birds with grain mix.'
  },
  4: {
    houseNumber: 4,
    sanskritName: 'Sukha Bhava / Matru Bhava (सुख / मातृ भाव)',
    devanagari: 'चतुर्थ भाव - सुख / मातृ भाव',
    name: '4th House of Mother, Home, Property, Vehicles & Inner Peace',
    domainName: 'Domestic Harmony, Real Estate & Emotional Roots',
    naturalSign: 'Cancer (Karka)',
    naturalLord: 'Moon (Chandra)',
    karakas: ['Moon (Chandra)', 'Mercury (Budh)', 'Venus (Shukra)'],
    bodyParts: ['Chest', 'Heart', 'Lungs', 'Breasts', 'Ribcage'],
    howItAffectsLife: {
      coreDomain: 'The anchor of the heart, representing maternal blessings, home environment, real estate, agricultural lands, vehicles (Vahana), and inner peace (Sukha).',
      personalityAndMindset: 'Determines your emotional stability, psychological contentment, attachment to homeland, and ability to feel genuinely at peace within yourself.',
      careerAndAmbition: 'Governs real estate development, agriculture, education, automobile sectors, interior design, psychology, and public hospitality.',
      financesAndProsperity: 'Governs fixed assets, residential homes, landed property, commercial real estate, and luxurious transportation vehicles.',
      relationshipsAndFamily: 'Represents the mother, maternal ancestors, and overall domestic bliss. A harmonious 4th house creates a peaceful, loving home haven.',
      healthAndVitality: 'Governs cardiac health, lung capacity, chest vitality, and emotional wellness. Mental stress directly impacts the chest and digestion.'
    },
    beneficInfluence: 'Jupiter, Venus, or Moon here bestows lavish homes, luxury cars, profound maternal love, respected formal education, and deep psychological serenity.',
    maleficInfluence: 'Saturn, Mars, or Rahu in the 4th house can cause domestic restlessness, disputes over property, early separation from homeland, or friction with maternal figures.',
    lordInKendraEffect: 'The 4th Lord in a Kendra grants extensive lands, regal conveyances, and widespread social popularity in one\'s city or state.',
    lordInTrikonaEffect: 'The 4th Lord in a Trikona confers high academic degrees, spiritual wisdom, noble residences, and peaceful family prosperity.',
    lordInDusthanaEffect: 'The 4th Lord in a Dusthana indicates prosperity through foreign lands or away from one\'s birthplace; advises careful verification of property titles.',
    keyStrengths: ['Emotional depth', 'Nurturing domestic warmth', 'Real estate acquisition', 'Inner contentment'],
    vulnerabilitiesToWatch: ['Emotional oversensitivity', 'Homesickness or reluctance to step out', 'Chest/heart stress under emotional pressure'],
    practicalGuidance: 'Touch your mother\'s feet or seek maternal blessings regularly; keep your living space uncluttered and infused with natural light and fresh air.',
    vedicRemedy: 'Offer water to the Moon on Purnima; keep a silver coin given by your mother; recite the Mahishasura Mardini Stotram.'
  },
  5: {
    houseNumber: 5,
    sanskritName: 'Putra Bhava / Poorvapunya (पुत्र / पूर्वपुण्य भाव)',
    devanagari: 'पञ्चम भाव - बुद्धि / विद्या / पूर्वपुण्य भाव',
    name: '5th House of Intellect, Progeny, Past Karma & Creative Brilliance',
    domainName: 'Intellect, Creativity & Good Karma',
    naturalSign: 'Leo (Simha)',
    naturalLord: 'Sun (Surya)',
    karakas: ['Jupiter (Guru)'],
    bodyParts: ['Stomach', 'Upper Abdomen', 'Liver', 'Gallbladder', 'Pancreas', 'Spine'],
    howItAffectsLife: {
      coreDomain: 'The supreme house of Poorva Punya (merit accumulated from past lives), intelligence, memory, creative authorship, speculative gains, and children.',
      personalityAndMindset: 'Governs your intellect (Dhi), creative flair, romantic impulses, moral discernment, and intuitive flashes of inspiration.',
      careerAndAmbition: 'Rules advisory roles, research, teaching, entertainment, speculative finance, software architecture, politics, and high-level strategy.',
      financesAndProsperity: 'A core Trikona of wealth. Governs sudden gains, investment acumen, stock market intelligence, and royalties from intellectual property.',
      relationshipsAndFamily: 'Governs romantic courtship, love affairs, joy with children, and the moral character of your progeny.',
      healthAndVitality: 'Governs stomach digestion, liver efficiency, pancreatic health, and abdominal vitality. Clean diet preserves mental sharpness.'
    },
    beneficInfluence: 'Jupiter, Venus, or Mercury here bestows razor-sharp intellect, poetic genius, distinguished and dutiful children, investment gains, and profound mantra siddhi.',
    maleficInfluence: 'Saturn, Mars, or Rahu in the 5th house brings unconventional thinking and sharp technical/engineering logic, but may cause delays or concerns regarding children and speculative volatility.',
    lordInKendraEffect: 'The 5th Lord in a Kendra produces a powerful Raja Yoga, conferring fame, high advisory posts, political clout, and widespread scholastic honor.',
    lordInTrikonaEffect: 'The 5th Lord in a Trikona elevates divine intuition, deep spiritual merit, righteous prosperity, and lifelong intellectual triumphs.',
    lordInDusthanaEffect: 'The 5th Lord in a Dusthana cautions against impulsive gambling or unverified investments; favors deep research and spiritual sadhana.',
    keyStrengths: ['Brilliant intellect', 'Creative innovation', 'Intuitive wisdom', 'Mentorship and leadership'],
    vulnerabilitiesToWatch: ['Over-speculation', 'High expectations from loved ones', 'Digestive acid issues when mentally stressed'],
    practicalGuidance: 'Cultivate a habit of daily reading, practice creative hobbies (writing, design, music), and avoid reckless financial gambles.',
    vedicRemedy: 'Chant the Gayatri Mantra or Saraswati Stotram daily; donate yellow books, pens, or educational kits to needy students.'
  },
  6: {
    houseNumber: 6,
    sanskritName: 'Ari / Roga / Shatru Bhava (अरि / रोग भाव)',
    devanagari: 'षष्ठ भाव - रोग / ऋण / शत्रु भाव',
    name: '6th House of Health, Debts, Adversaries & Daily Service',
    domainName: 'Health, Resilience, Overcoming Obstacles & Work Ethic',
    naturalSign: 'Virgo (Kanya)',
    naturalLord: 'Mercury (Budh)',
    karakas: ['Mars (Mangal)', 'Saturn (Shani)'],
    bodyParts: ['Intestines', 'Digestive tract', 'Kidneys', 'Lower abdomen', 'Navel region'],
    howItAffectsLife: {
      coreDomain: 'Governs daily routines, work ethic, service to society, immune defense against diseases, legal disputes, debts, and victory over adversaries.',
      personalityAndMindset: 'Shapes your analytical scrutiny, attention to detail, competitive edge, discipline under stress, and willingness to work tirelessly.',
      careerAndAmbition: 'Dominant for medicine, nursing, litigation, armed forces, auditing, veterinary sciences, public service, and operations management.',
      financesAndProsperity: 'Governs loans, credit management, debt reduction, and financial litigation. A well-placed house enables mastery over debt to build assets.',
      relationshipsAndFamily: 'Governs maternal uncles and aunts, subordinates, employees, and pets. Reveals how you handle conflicts and workplace politics.',
      healthAndVitality: 'Directly reflects your immune defense, gut biome, digestive health, and resistance to seasonal or lifestyle diseases.'
    },
    beneficInfluence: 'Benefics here make you peaceful, forgiving, and free from malicious enemies, but caution is needed to maintain strict dietary and debt discipline.',
    maleficInfluence: 'Malefics (Mars, Saturn, Rahu, Sun) shine brightly in the 6th house (Shatru Hanta Yoga)! They crush rivals, win court cases, grant ironclad immunity, and thrive in fierce competition.',
    lordInKendraEffect: 'The 6th Lord in a Kendra gives success in competitive examinations, legal administration, and medical institutions.',
    lordInTrikonaEffect: 'The 6th Lord in a Trikona directs competitive energy into dharmic battles for social justice and institutional reform.',
    lordInDusthanaEffect: 'The 6th Lord in another Dusthana forms a Harsha Viparita Raja Yoga, turning unexpected crises into massive breakthroughs.',
    keyStrengths: ['Ironclad discipline', 'Competitive grit', 'Diagnostic problem-solving', 'Service orientation'],
    vulnerabilitiesToWatch: ['Obsessive perfectionism', 'Holding chronic work stress in the gut', 'Overworking without rest'],
    practicalGuidance: 'Maintain a clean gut through fiber-rich diet, pay bills promptly to avoid karmic debt, and resolve petty disputes with cool detachment.',
    vedicRemedy: 'Feed stray dogs or crows on Saturdays; chant the Maha Mrityunjaya Mantra for health and vitality.'
  },
  7: {
    houseNumber: 7,
    sanskritName: 'Kalatra Bhava / Jaya (कलत्र भाव)',
    devanagari: 'सप्तम भाव - कलत्र / विवाह / साझेदारी भाव',
    name: '7th House of Marriage, Business Partnerships & Public Interaction',
    domainName: 'Spouse, Partnerships & Social Alliances',
    naturalSign: 'Libra (Tula)',
    naturalLord: 'Venus (Shukra)',
    karakas: ['Venus (Shukra)'],
    bodyParts: ['Lower Back', 'Pelvis', 'Bladder', 'Reproductive organs', 'Lumbar spine'],
    howItAffectsLife: {
      coreDomain: 'The house directly opposite the Lagna, governing the life partner, marriage quality, commercial partnerships, contracts, and foreign trade.',
      personalityAndMindset: 'Reflects what you seek in others, your diplomatic skills, negotiation temperament, and capacity for mutual compromise.',
      careerAndAmbition: 'Crucial for commercial business, joint ventures, international trade, public relations, event management, and diplomacy.',
      financesAndProsperity: 'Shows financial fortune attained after marriage or through cooperative commercial alliances and loyal client contracts.',
      relationshipsAndFamily: 'The definitive house of the spouse, revealing marital compatibility, spousal temperament, and long-term domestic loyalty.',
      healthAndVitality: 'Governs the kidneys, urinary bladder, reproductive health, and lower back vitality. Emotional discord affects the lower lumbar region.'
    },
    beneficInfluence: 'Jupiter, Venus, or Mercury here blesses with a beautiful, cultured, wealthy, and devoted spouse, harmonious married life, and prosperous partnerships.',
    maleficInfluence: 'Mars (Manglik Dosha), Saturn, Rahu, or Sun here brings strong individuality, potential marital friction, late marriage, or partners of starkly different backgrounds.',
    lordInKendraEffect: 'The 7th Lord in a Kendra grants an influential partner, high public standing, and successful joint commercial ventures.',
    lordInTrikonaEffect: 'The 7th Lord in a Trikona brings an auspicious, righteous life companion who acts as a catalyst for mutual spiritual and material growth.',
    lordInDusthanaEffect: 'The 7th Lord in a Dusthana requires patience in partnerships, clear written contracts, and emotional sensitivity with the spouse.',
    keyStrengths: ['Diplomatic tact', 'Partnership synergy', 'Public charm', 'Negotiation skill'],
    vulnerabilitiesToWatch: ['Codependency or excessive compromise', 'Projecting personal insecurities onto partners', 'Lower back stiffness'],
    practicalGuidance: 'Prioritize honest, respectful communication with your spouse; never enter commercial partnerships without clear written clarity.',
    vedicRemedy: 'Offer white sweets or fragrant flowers to Goddess Lakshmi on Fridays; respect and cherish your life partner.'
  },
  8: {
    houseNumber: 8,
    sanskritName: 'Randhra / Ayu Bhava (रन्ध्र / आयु भाव)',
    devanagari: 'अष्टम भाव - आयु / गूढ़ विद्या / परिवर्तन भाव',
    name: '8th House of Longevity, Sudden Transformation, Secrets & Mysticism',
    domainName: 'Longevity, Transformation & Hidden Knowledge',
    naturalSign: 'Scorpio (Vrishchika)',
    naturalLord: 'Mars (Mangal)',
    karakas: ['Saturn (Shani)'],
    bodyParts: ['Excretory system', 'Pelvic floor', 'Perineum', 'Colon', 'Vital life prana (Kundalini)'],
    howItAffectsLife: {
      coreDomain: 'Governs longevity (Ayu), sudden unearned wealth, joint finances, inheritance, occult sciences, deep psychological research, and major life rebirths.',
      personalityAndMindset: 'Grants penetrating intuition, psychological insight, fascination with the mysteries of life and death, and ability to handle crisis with nerves of steel.',
      careerAndAmbition: 'Thrives in surgery, forensic science, insurance, tax investigation, geology, data mining, esoteric astrology, and crisis recovery.',
      financesAndProsperity: 'Governs partner\'s finances, wills, insurances, inheritances, corporate royalties, and unexpected windfalls or restructuring.',
      relationshipsAndFamily: 'Governs in-laws (spouse\'s family), confidential bonds, and deep soul-to-soul vulnerability.',
      healthAndVitality: 'Governs chronic health, vitality reserves (Kundalini), longevity, and deep bodily detoxification processes.'
    },
    beneficInfluence: 'Jupiter or Venus here gives long life, smooth peaceful transitions, inheritance benefits, and profound philosophical or spiritual wisdom.',
    maleficInfluence: 'Saturn gives exceptionally long life; Mars or Rahu gives intense transformative experiences, interest in occult secrets, and unexpected turning points.',
    lordInKendraEffect: 'The 8th Lord in a Kendra gives sudden prominent public roles and resilience through massive societal or organizational shifts.',
    lordInTrikonaEffect: 'The 8th Lord in a Trikona awakens profound intuition, research brilliance, interest in ancient scriptures, and sudden dharmic blessings.',
    lordInDusthanaEffect: 'The 8th Lord in 6th or 12th creates a Sarala Viparita Raja Yoga, producing immense wealth and triumph through the collapse of competitors.',
    keyStrengths: ['Profound psychological intuition', 'Unshakeable crisis poise', 'Capacity for total rebirth', 'Research depth'],
    vulnerabilitiesToWatch: ['Secretiveness', 'Obsessive brooding over past betrayals', 'Fear of vulnerability'],
    practicalGuidance: 'Embrace life transitions without fear, practice pranayama to balance life force, and study sacred philosophy or meditation regularly.',
    vedicRemedy: 'Chant the Maha Mrityunjaya Mantra 108 times on Mondays; light a sesame oil lamp for Lord Shiva or Bhairava.'
  },
  9: {
    houseNumber: 9,
    sanskritName: 'Dharma / Bhagya Bhava (धर्म / भाग्य भाव)',
    devanagari: 'नवम भाव - धर्म / भाग्य / गुरु भाव',
    name: '9th House of Fortune, Higher Wisdom, Guru & Pilgrimage',
    domainName: 'Fortune, Dharma, Higher Learning & Divine Grace',
    naturalSign: 'Sagittarius (Dhanu)',
    naturalLord: 'Jupiter (Guru)',
    karakas: ['Jupiter (Guru)', 'Sun (Surya)'],
    bodyParts: ['Thighs', 'Hips', 'Femur bones', 'Sciatic nerve', 'Arterial blood circulation'],
    howItAffectsLife: {
      coreDomain: 'The supreme Trikona of Bhagya (good luck and divine grace), higher philosophical wisdom, father, preceptor (Guru), pilgrimage, and righteousness (Dharma).',
      personalityAndMindset: 'Cultivates nobility, optimistic faith, broad worldview, moral honor, respect for elders, and generosity of spirit.',
      careerAndAmbition: 'Prominent in higher education, law, philosophy, publishing, international travel, foreign missions, and spiritual leadership.',
      financesAndProsperity: 'The house of effortless good fortune. When strong, opportunities arrive at the right time, turning modest efforts into large successes.',
      relationshipsAndFamily: 'Governs the father, mentors, spiritual guides, and grandchildren. A harmonious 9th house reflects blessed family lineage.',
      healthAndVitality: 'Governs the hips, thighs, sciatic nerve, and overall constitutional vitality. Active walking and travel stimulate this house.'
    },
    beneficInfluence: 'Jupiter, Venus, or Mercury here bestows brilliant luck, noble father, spiritual enlightenment, international acclaim, and high ethical stature.',
    maleficInfluence: 'Sun gives strong principles and fatherly leadership; Saturn or Mars gives disciplined adherence to truth, though relationship with traditional dogmas may require re-evaluation.',
    lordInKendraEffect: 'The 9th Lord in a Kendra produces supreme Dharma-Karmadhipati Yoga, granting regal status, international renown, and magnificent accomplishments.',
    lordInTrikonaEffect: 'The 9th Lord in a Trikona multiplies divine blessings, immense scholastic honor, and lifelong material and spiritual fulfillment.',
    lordInDusthanaEffect: 'The 9th Lord in a Dusthana advises cultivating your own spiritual convictions and serving mentors selflessly to unlock dormant fortune.',
    keyStrengths: ['Expansive wisdom', 'Divine good fortune', 'High ethical standards', 'Inspiring optimism'],
    vulnerabilitiesToWatch: ['Righteous preachy attitude', 'Over-optimism leading to poor logistical planning', 'Hip or sciatic stiffness'],
    practicalGuidance: 'Always honor your father, teachers, and elders; embark on pilgrimages or nature retreats, and support charitable educational causes.',
    vedicRemedy: 'Offer water to Peepal tree on Thursdays; chant "Om Brihaspataye Namaha" or Guru Paduka Stotram; donate yellow fruits.'
  },
  10: {
    houseNumber: 10,
    sanskritName: 'Karma / Rajya Bhava (कर्म / राज्य भाव)',
    devanagari: 'दशम भाव - कर्म / राज्य / मान-सम्मान भाव',
    name: '10th House of Career, Public Status, Authority & Achievements',
    domainName: 'Career, Reputation, Public Impact & Leadership',
    naturalSign: 'Capricorn (Makara)',
    naturalLord: 'Saturn (Shani)',
    karakas: ['Sun (Surya)', 'Saturn (Shani)', 'Jupiter (Guru)', 'Mercury (Budh)'],
    bodyParts: ['Knees', 'Kneecaps', 'Joints', 'Bones', 'Skeletal frame'],
    howItAffectsLife: {
      coreDomain: 'The highest point in the sky at birth (Midheaven). Governs career achievements, social reputation, government honors, executive command, and professional destiny.',
      personalityAndMindset: 'Instills ambition, organizational responsibility, drive to leave a lasting legacy, civic dignity, and executive perseverance.',
      careerAndAmbition: 'The primary career engine of the chart. Determines your professional trajectory, leadership rank, and public visibility in the community.',
      financesAndProsperity: 'Governs primary professional earnings, corporate bonuses, government contracts, and commercial enterprise profits.',
      relationshipsAndFamily: 'Governs superiors, mentors, bosses, the public, and father\'s status in society. Reflects how society at large regards you.',
      healthAndVitality: 'Governs knees, joints, skeletal structure, and constitutional endurance under sustained workload.'
    },
    beneficInfluence: 'Jupiter (Amala Yoga), Venus, or Mercury here bestows an unblemished public reputation, beloved leadership, creative or intellectual career triumphs, and honorable status.',
    maleficInfluence: 'Sun (Digbala) and Mars (Digbala) achieve peak directional strength in the 10th house, creating supreme administrative power, military command, and massive career dominance! Saturn gives slow, steady, unshakeable rise.',
    lordInKendraEffect: 'The 10th Lord in a Kendra produces massive professional authority, commercial mastery, and enduring societal respect.',
    lordInTrikonaEffect: 'The 10th Lord in a Trikona aligns career directly with life purpose (Dharma), ensuring fulfilling, ethical, and lucrative professional work.',
    lordInDusthanaEffect: 'The 10th Lord in a Dusthana suggests career success in specialized problem-solving, overseas operations, healthcare, or independent consulting.',
    keyStrengths: ['Executive command', 'Professional perseverance', 'Sense of public duty', 'Legacy building'],
    vulnerabilitiesToWatch: ['Workaholism', 'Neglecting family life for public status', 'Knee or joint fatigue from overexertion'],
    practicalGuidance: 'Perform your daily duties with total dedication without obsessing over quick fruits; lead teams with fairness, empathy, and clear standards.',
    vedicRemedy: 'Perform daily prayers to Lord Surya; feed crows with boiled rice on Saturdays; maintain ethical transparency in all business dealings.'
  },
  11: {
    houseNumber: 11,
    sanskritName: 'Labha / Aya Bhava (लाभ / आय भाव)',
    devanagari: 'एकादश भाव - लाभ / आय / मित्र भाव',
    name: '11th House of Gains, Cash Flow, Aspirations & Social Networks',
    domainName: 'Income, Gains, Social Circle & Realization of Goals',
    naturalSign: 'Aquarius (Kumbha)',
    naturalLord: 'Saturn (Shani)',
    karakas: ['Jupiter (Guru)'],
    bodyParts: ['Calves', 'Shins', 'Ankles', 'Left Ear', 'Circulatory system'],
    howItAffectsLife: {
      coreDomain: 'The ultimate Upachaya house of gains (Labha), continuous cash inflow, fulfillment of deep desires, influential friendship circles, and elder siblings.',
      personalityAndMindset: 'Fosters egalitarian values, social networking intelligence, progressive idealism, and capacity to build large community movements.',
      careerAndAmbition: 'Dominant for tech startups, global corporations, non-profits, mass media platforms, influencer networks, and social organizations.',
      financesAndProsperity: 'The primary cash flow generator of the chart. Shows multiple streams of income, investments paying off, and accumulation of liquid funds.',
      relationshipsAndFamily: 'Governs elder brothers and sisters, long-standing friends, benefactors, and broad professional alliances.',
      healthAndVitality: 'Governs the ankles, shins, peripheral circulation, and left ear. Good hydration and movement support this house.'
    },
    beneficInfluence: 'Jupiter, Venus, or Mercury here blesses with vast financial abundance, high-profile supportive friends, fulfillment of major life wishes, and multiple lucrative income streams.',
    maleficInfluence: 'All planets prosper in the 11th house! Malefics (Rahu, Saturn, Mars, Sun) generate massive revenues, widespread networks, and ability to fulfill ambitious material desires.',
    lordInKendraEffect: 'The 11th Lord in a Kendra ensures regular financial windfalls and powerful institutional patrons supporting your ventures.',
    lordInTrikonaEffect: 'The 11th Lord in a Trikona creates an auspicious Dhana Yoga, making earnings righteous, continuous, and aligned with noble causes.',
    lordInDusthanaEffect: 'The 11th Lord in a Dusthana advises cautious management of loans and investments; profits come through foreign or unconventional avenues.',
    keyStrengths: ['Exceptional networking', 'Multiple income channels', 'Realization of aspirations', 'Egalitarian leadership'],
    vulnerabilitiesToWatch: ['Superficial acquaintances', 'Material insatiability', 'Ankle or calf fatigue'],
    practicalGuidance: 'Nurture mutually supportive relationships, support collective humanitarian goals, and diversify your income portfolio responsibly.',
    vedicRemedy: 'Donate to community shelters; chant the Kubera Mantra or "Om Shreem Hreem Kleem Maha Lakshmyai Namah"; feed birds on Wednesdays.'
  },
  12: {
    houseNumber: 12,
    sanskritName: 'Vyaya / Moksha Bhava (व्यय / मोक्ष भाव)',
    devanagari: 'द्वादश भाव - व्यय / विदेश / मोक्ष भाव',
    name: '12th House of Expenditure, Foreign Lands, Isolation & Moksha (Liberation)',
    domainName: 'Spiritual Liberation, Foreign Residence, Solitude & Subconscious Mind',
    naturalSign: 'Pisces (Meena)',
    naturalLord: 'Jupiter (Guru)',
    karakas: ['Saturn (Shani)', 'Ketu'],
    bodyParts: ['Feet', 'Toes', 'Left Eye', 'Lymphatic system', 'Sleep cycle (Pineal gland)'],
    howItAffectsLife: {
      coreDomain: 'The final house of the zodiac, representing spiritual liberation (Moksha), foreign settlement, expenditures, hospitals, ashrams, subconscious dreams, and bedroom pleasures (Sayana Sukha).',
      personalityAndMindset: 'Fosters detachment, vivid imagination, empathy for the marginalized, meditative depth, and freedom from superficial worldly ego.',
      careerAndAmbition: 'Flourishes in international trade, foreign embassies, multinational corporations, hospitals, spiritual centers, film/creative isolation, and research.',
      financesAndProsperity: 'Governs how you spend wealth. When harmonized, spending goes toward noble charities, sound foreign investments, and spiritual pilgrimages.',
      relationshipsAndFamily: 'Governs intimate private moments, secret connections, and relationships with foreign cultures or distant communities.',
      healthAndVitality: 'Governs sleep quality, dream states, foot reflexology, and immune lymphatic drainage. Regular deep sleep is essential for rejuvenation.'
    },
    beneficInfluence: 'Jupiter, Venus (Exalted in 12th), or Mercury here gives luxurious comfortable sleep, blissful bed pleasures, foreign prosperity, philanthropic generosity, and spiritual ascension.',
    maleficInfluence: 'Saturn, Mars, Rahu, or Ketu here stimulates deep spiritual detachment, interest in yoga, overseas residence, but calls for mindfulness regarding sleep routines and expenditures.',
    lordInKendraEffect: 'The 12th Lord in a Kendra grants extensive global travel, prominent foreign postings, and success in multinational institutions.',
    lordInTrikonaEffect: 'The 12th Lord in a Trikona creates an innate spiritual seeker who finds enlightenment through meditation, scriptural study, and selfless charity.',
    lordInDusthanaEffect: 'The 12th Lord in the 6th or 8th forms a Vimala Viparita Raja Yoga, shielding the native from financial loss and turning expenses into gains.',
    keyStrengths: ['Spiritual depth', 'Global adaptability', 'Creative imagination', 'Philanthropic grace'],
    vulnerabilitiesToWatch: ['Sleep disturbances from overactive imagination', 'Impulsive spending', 'Tendency to withdraw excessively'],
    practicalGuidance: 'Maintain a peaceful sleep sanctuary free from screens, donate regularly to charitable hospitals or ashrams, and practice daily meditation before bed.',
    vedicRemedy: 'Practice Yoga Nidra or silent meditation; donate footwear or blankets to the needy; chant "Om Namo Narayanaya" before sleeping.'
  }
};
