export interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  subcategories?: {
    name: string;
    slug: string;
    description: string;
    displayOrder: number;
  }[];
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: 'Gemstones',
    slug: 'gemstones',
    description: '100% Natural, untreated Vedic gemstones certified by leading gemological laboratories for planetary empowerment.',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    subcategories: [
      { name: 'Planet-wise Gemstones', slug: 'planet-wise-gemstones', description: 'Selected specifically according to Vedic Navagraha rulers.', displayOrder: 1 },
      { name: 'Birthstones', slug: 'birthstones', description: 'Harmonious birthstones aligned with Vedic Rashi and Western astrology.', displayOrder: 2 },
      { name: 'Certified Gemstones', slug: 'certified-gemstones', description: 'Government and IGI lab-tested raw and cut loose gemstones.', displayOrder: 3 },
      { name: 'Gemstone Rings', slug: 'gemstone-rings', description: 'Astrologically consecrated Panchdhatu and 22K Gold rings with open-back designs.', displayOrder: 4 },
      { name: 'Gemstone Pendants', slug: 'gemstone-pendants', description: 'Prana Pratishtha consecrated pendants for direct skin contact.', displayOrder: 5 },
    ],
  },
  {
    name: 'Rudraksha',
    slug: 'rudraksha',
    description: 'Sacred Himalayan Rudraksha beads ethically sourced from Nepal and Indonesia, consecrated with ancient Vedic mantras.',
    imageUrl: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80',
    displayOrder: 2,
    subcategories: [
      { name: 'Individual Mukhi Rudraksha', slug: 'individual-mukhi', description: 'Authentic 1 to 21 Mukhi collector Nepal beads.', displayOrder: 1 },
      { name: 'Rudraksha Bracelets', slug: 'rudraksha-bracelets', description: 'Protective wrist wearables threaded in pure silver and auspicious red silk.', displayOrder: 2 },
      { name: 'Japa & Kanthi Malas', slug: 'rudraksha-malas', description: 'Traditional 108+1 bead chanting and wearing malas.', displayOrder: 3 },
    ],
  },
  {
    name: 'Crystals',
    slug: 'crystals',
    description: 'High-vibrational natural healing crystals, towers, and clusters selected to clear negative energies and amplify aura fields.',
    imageUrl: 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&w=800&q=80',
    displayOrder: 3,
    subcategories: [
      { name: 'Clear Quartz', slug: 'clear-quartz', description: 'The Master Healer crystal for spiritual clarity and intention manifestation.', displayOrder: 1 },
      { name: 'Rose Quartz', slug: 'rose-quartz', description: 'The stone of unconditional love, compassion, and heart chakra alignment.', displayOrder: 2 },
      { name: 'Citrine', slug: 'citrine', description: 'The Merchant Stone of wealth, abundance, and solar plexus vitality.', displayOrder: 3 },
      { name: 'Amethyst', slug: 'amethyst', description: 'Deep purple serenity crystal for third-eye awakening and restful calm.', displayOrder: 4 },
      { name: 'Black Tourmaline', slug: 'black-tourmaline', description: 'Premier psychic grounding and EMF protection shield.', displayOrder: 5 },
      { name: 'Other Healing Crystals', slug: 'other-healing-crystals', description: 'Lapis Lazuli, Selenite, Pyrite, and Carnelian treasures.', displayOrder: 6 },
    ],
  },
];

export interface SeedProduct {
  name: string;
  slug: string;
  categorySlug: string;
  brand: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  salePrice?: string;
  sku: string;
  stock: number;
  weight: string;
  tags: string;
  planet?: string;
  zodiac?: string;
  certification: string;
  benefits: string;
  specifications: string;
  careInstructions: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  images: {
    url: string;
    altText: string;
    isPrimary: boolean;
    displayOrder: number;
    variationKey?: string;
  }[];
  variations?: {
    type: string;
    value: string;
    sku: string;
    price?: string;
    salePrice?: string;
    stock: number;
    imageUrl?: string;
  }[];
}

export const SEED_PRODUCTS: SeedProduct[] = [
  // 1. Natural Burmese Ruby (Manik)
  {
    name: 'Natural Unheated Burmese Ruby (Manik)',
    slug: 'natural-burmese-ruby-manik',
    categorySlug: 'gemstones',
    brand: 'Astronava Vedic Authentics',
    shortDescription: 'Astrologically potent Pigeon Blood Red Ruby certified untreated by IGI. Dedicated to the Sun (Surya Dev).',
    fullDescription: 'This rare, certified unheated natural Ruby (Manikya) radiates brilliant solar vitality. In classical Vedic astrology (Brihat Samhita), natural Ruby strengthens the Sun (Surya), boosting self-confidence, leadership authority, government patronage, and cardiovascular vitality. Meticulously inspected for eye-clean clarity and superior fire.',
    price: '18500.00',
    salePrice: '15900.00',
    sku: 'GEM-RUBY-001',
    stock: 14,
    weight: '4.25 Ratti (3.88 Carats)',
    tags: 'Ruby, Manik, Sun, Surya, Leo, Vedic Gemstone, Certified',
    planet: 'Sun',
    zodiac: 'Leo',
    certification: 'IGI & Govt. Lab Certified',
    benefits: 'Amplifies leadership influence, increases self-esteem, supports heart and vitality, counters solar debility in D1 birth chart.',
    specifications: JSON.stringify({
      origin: 'Burma (Myanmar)',
      treatment: '100% Natural, Unheated & Untreated',
      hardness: '9.0 Mohs Scale',
      refractiveIndex: '1.762 - 1.770',
      cut: 'Oval Mixed Brilliant Cut',
      colorGrade: 'Vibrant Pigeon Blood Red',
    }),
    careInstructions: 'Clean gently with lukewarm soapy water and soft camel-hair brush. Energize on Sunday morning at sunrise chanting "Om Hram Hreem Hroum Sah Suryaya Namah".',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isPublished: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
        altText: 'Vivid Red Natural Burmese Ruby gemstone on luxury velvet mount',
        isPrimary: true,
        displayOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
        altText: 'Certified Ruby ring mounted in 22k gold open-back setting',
        isPrimary: false,
        displayOrder: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
        altText: 'Macro clarity view of untreated natural Ruby crystal facets',
        isPrimary: false,
        displayOrder: 3,
      },
    ],
    variations: [
      {
        type: 'Metal Setting',
        value: 'Loose Gemstone',
        sku: 'GEM-RUBY-001-LOOSE',
        price: '15900.00',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
      },
      {
        type: 'Metal Setting',
        value: 'Panchdhatu Ring',
        sku: 'GEM-RUBY-001-PANCH',
        price: '18900.00',
        salePrice: '17900.00',
        stock: 4,
        imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
      },
      {
        type: 'Metal Setting',
        value: '22K Hallmarked Gold Ring',
        sku: 'GEM-RUBY-001-GOLD',
        price: '32500.00',
        stock: 2,
        imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
      },
    ],
  },

  // 2. Colombian Emerald (Panna)
  {
    name: 'Top-Grade Natural Colombian Emerald (Panna)',
    slug: 'natural-colombian-emerald-panna',
    categorySlug: 'gemstones',
    brand: 'Astronava Vedic Authentics',
    shortDescription: 'Lush vivid green Muzo-mine Colombian Emerald certified untreated for Mercury (Budh) remediation.',
    fullDescription: 'Celebrated for its captivating deep velvety green hue and tranquil crystalline glow, this natural Colombian Emerald is the supreme ratna for Mercury (Budh Dev). It stimulates intellect, quick wit, eloquence in speech, mathematical acumen, and commerce prowess. Hand-selected for astrological grade purity.',
    price: '24000.00',
    salePrice: '21500.00',
    sku: 'GEM-EMER-002',
    stock: 10,
    weight: '5.10 Ratti (4.65 Carats)',
    tags: 'Emerald, Panna, Mercury, Budh, Gemini, Virgo, Green Gemstone',
    planet: 'Mercury',
    zodiac: 'Gemini, Virgo',
    certification: 'GIA & IGI Certified',
    benefits: 'Enhances cognitive memory, verbal eloquence, analytical decision-making, and financial discernment. Pacifies nervous agitation.',
    specifications: JSON.stringify({
      origin: 'Boyaca, Muzo Mine, Colombia',
      treatment: 'Minor Cedarwood oil (Traditional organic preservation only)',
      hardness: '7.5 - 8.0 Mohs Scale',
      refractiveIndex: '1.577 - 1.583',
      cut: 'Classic Emerald Step Cut',
      colorGrade: 'Luminous Vivid Forest Green',
    }),
    careInstructions: 'Never expose to ultrasonic cleaners or steam. Clean with mild cold water and soft microfiber cloth. Energize on Wednesday morning with "Om Bum Budhaya Namah".',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isPublished: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
        altText: 'Lustrous Colombian emerald showing step-cut transparency',
        isPrimary: true,
        displayOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=80',
        altText: 'Natural Emerald set in Vedic open-back silver ring mount',
        isPrimary: false,
        displayOrder: 2,
      },
    ],
    variations: [
      {
        type: 'Color Grade',
        value: 'Lush Vivid Green',
        sku: 'GEM-EMER-002-LUSH',
        price: '21500.00',
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
      },
      {
        type: 'Color Grade',
        value: 'Deep Forest Green',
        sku: 'GEM-EMER-002-DEEP',
        price: '25900.00',
        stock: 3,
        imageUrl: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=80',
      },
      {
        type: 'Color Grade',
        value: 'Golden Mint Green',
        sku: 'GEM-EMER-002-MINT',
        price: '19800.00',
        stock: 2,
      },
    ],
  },

  // 3. Ceylon Yellow Sapphire (Pukhraj)
  {
    name: 'Certified Ceylon Yellow Sapphire (Pukhraj)',
    slug: 'ceylon-yellow-sapphire-pukhraj',
    categorySlug: 'gemstones',
    brand: 'Astronava Vedic Authentics',
    shortDescription: 'Royal golden Ceylon yellow sapphire with exceptional luster, honoring Guru (Jupiter) for wisdom and fortune.',
    fullDescription: 'Regarded as the most benevolent ratna in Vedic Jyotish, Ceylon Yellow Sapphire (Pushparag) invokes the expansive grace of Brihaspati (Jupiter). It blesses the seeker with academic honor, spiritual insight, marital bliss, financial prosperity, and progeny blessings. Naturally sourced from the gem fields of Ratnapura, Sri Lanka.',
    price: '28000.00',
    salePrice: '24999.00',
    sku: 'GEM-PUKH-003',
    stock: 8,
    weight: '6.20 Ratti (5.65 Carats)',
    tags: 'Yellow Sapphire, Pukhraj, Jupiter, Guru, Sagittarius, Pisces, Wealth',
    planet: 'Jupiter',
    zodiac: 'Sagittarius, Pisces',
    certification: 'Govt. Gem Testing Lab & IGI Certified',
    benefits: 'Attracts auspicious fortune, expansive knowledge, higher mentorship, marital harmony, and spiritual guidance.',
    specifications: JSON.stringify({
      origin: 'Ratnapura, Sri Lanka (Ceylon)',
      treatment: 'Completely Unheated, Zero Glass-Filled',
      hardness: '9.0 Mohs Scale',
      refractiveIndex: '1.762 - 1.770',
      cut: 'Cushion Mixed Cut',
      colorGrade: 'Canary Golden Yellow',
    }),
    careInstructions: 'Wash with warm water and soft brush. Purify in Ganga Jal and unboiled cow milk before first wear on Thursday morning chanting "Om Brim Brihaspataye Namah".',
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isPublished: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=80',
        altText: 'Sparkling Ceylon Yellow Sapphire on display cushion',
        isPrimary: true,
        displayOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80',
        altText: 'Yellow sapphire set in heavy 18K yellow gold prong setting',
        isPrimary: false,
        displayOrder: 2,
      },
    ],
    variations: [
      {
        type: 'Carat Weight',
        value: '4.25 Ratti',
        sku: 'GEM-PUKH-003-4R',
        price: '18500.00',
        stock: 3,
      },
      {
        type: 'Carat Weight',
        value: '6.20 Ratti',
        sku: 'GEM-PUKH-003-6R',
        price: '24999.00',
        stock: 3,
      },
      {
        type: 'Carat Weight',
        value: '8.50 Ratti (Collector Edition)',
        sku: 'GEM-PUKH-003-8R',
        price: '38000.00',
        stock: 2,
      },
    ],
  },

  // 4. Authentic 5 Mukhi Nepal Rudraksha Mala (108+1)
  {
    name: 'Authentic 5 Mukhi Nepal Rudraksha Japa Mala (108+1 Beads)',
    slug: '5-mukhi-nepal-rudraksha-japa-mala',
    categorySlug: 'rudraksha',
    brand: 'Astronava Vedic Authentics',
    shortDescription: 'Sacred Himalayan 5 Mukhi Nepal Rudraksha Mala hand-knotted with traditional Meru bead for meditation and health.',
    fullDescription: 'Sourced directly from the sacred foothills of Pashupatinath, Nepal, this authentic 5 Mukhi (Pancha Mukhi) Rudraksha Mala embodies Lord Shiva in the form of Kalagni Rudra. Known for pacifying negative karma, regulating blood pressure, steadying erratic thoughts, and enhancing meditative absorption.',
    price: '3200.00',
    salePrice: '2499.00',
    sku: 'RUD-MALA-5M-001',
    stock: 45,
    weight: '108g (approx)',
    tags: 'Rudraksha, 5 Mukhi, Mala, Shiva, Nepal, Japa, Meditation',
    planet: 'Jupiter',
    zodiac: 'All Zodiacs',
    certification: 'Shri Pashupatinath Vedic Certification & X-Ray Tested',
    benefits: 'Pacifies high blood pressure, calms nervous heart palpitations, shields aura against negative energy, ideal for daily Maha Mrityunjaya mantra chanting.',
    specifications: JSON.stringify({
      origin: 'Nepal (Himalayan High Altitude)',
      beadCount: '108 + 1 Meru Bead',
      beadSize: '7mm - 8mm Collector Uniform Sizing',
      knotting: 'Double-threaded high-tensile red silk with tassel',
      mukhiProfile: 'Natural deep 5 mukhi clefts without artificial carving',
    }),
    careInstructions: 'Oil once every 3 months with pure sandalwood or almond oil. Keep away from chemical detergents. Chant "Om Hreem Namah" or "Om Namah Shivaya" while wearing.',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isPublished: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1000&q=80',
        altText: 'Traditional Nepal 5 Mukhi Rudraksha Mala with bright silk tassel',
        isPrimary: true,
        displayOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80',
        altText: 'Close up of natural 5 Mukhi Rudraksha facets and Meru bead',
        isPrimary: false,
        displayOrder: 2,
      },
    ],
    variations: [
      {
        type: 'Thread Style',
        value: 'Auspicious Red Silk',
        sku: 'RUD-MALA-5M-RED',
        price: '2499.00',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1000&q=80',
      },
      {
        type: 'Thread Style',
        value: 'Sacred Saffron Yellow',
        sku: 'RUD-MALA-5M-SAFF',
        price: '2499.00',
        stock: 15,
      },
      {
        type: 'Thread Style',
        value: 'Pure 925 Silver Capped',
        sku: 'RUD-MALA-5M-SLVR',
        price: '7999.00',
        salePrice: '6999.00',
        stock: 5,
        imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80',
      },
    ],
  },

  // 5. Rare Collector 1 Mukhi Half-Moon Rudraksha
  {
    name: 'Rare Certified 1 Mukhi Half-Moon Rudraksha',
    slug: 'rare-1-mukhi-half-moon-rudraksha',
    categorySlug: 'rudraksha',
    brand: 'Astronava Vedic Authentics',
    shortDescription: 'Direct manifestation of Supreme Parabrahma Shiva. Certified authentic with silver casing and lab report.',
    fullDescription: 'The Ek Mukhi (1 Mukhi) Rudraksha is the most revered of all sacred beads. It controls the pineal gland, aligns the Sahasrara (Crown) chakra, and destroys lifetimes of difficult planetary afflictions. Encased in a master-crafted 925 sterling silver talisman for daily reverence.',
    price: '9500.00',
    salePrice: '8200.00',
    sku: 'RUD-1M-001',
    stock: 6,
    weight: '3.4g (bead only)',
    tags: '1 Mukhi, Ek Mukhi, Lord Shiva, Crown Chakra, Moksha, Himalayan',
    planet: 'Sun',
    zodiac: 'Leo, All Rashis',
    certification: 'Govt. Approved Laboratory X-Ray & Botanical Identity Certificate',
    benefits: 'Awakens super-consciousness, eradicates deep mental grief, bestows mastery over speech and detachment without worldly renunciation.',
    specifications: JSON.stringify({
      origin: 'Rameshwaram / Haridwar Collector Reserve',
      shape: 'Classic Kaju (Half Moon) Curved Profile',
      casing: 'Hallmarked 925 Pure Sterling Silver Capsule',
      cleftDepth: 'Single uninterrupted deep natural line',
    }),
    careInstructions: 'Handle with sacred reverence. Bathe in rose water during Shivratri, Pradosham, or Monday mornings.',
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    isPublished: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1000&q=80',
        altText: 'Sacred single Mukhi Rudraksha in sterling silver encapsulation',
        isPrimary: true,
        displayOrder: 1,
      },
    ],
    variations: [
      {
        type: 'Encapsulation',
        value: '925 Silver Pendant',
        sku: 'RUD-1M-SLV',
        price: '8200.00',
        stock: 4,
      },
      {
        type: 'Encapsulation',
        value: 'Gold-Plated Astadhatu',
        sku: 'RUD-1M-GOLD',
        price: '8900.00',
        stock: 2,
      },
    ],
  },

  // 6. Natural Brazilian Clear Quartz Crystal Tower
  {
    name: 'Natural Brazilian Clear Quartz Generator Tower',
    slug: 'brazilian-clear-quartz-generator-tower',
    categorySlug: 'crystals',
    brand: 'Astronava Vedic Authentics',
    shortDescription: 'Prismatic, optical-grade Clear Quartz 6-faceted generator point for energy purification and intent amplification.',
    fullDescription: 'Mined from Minas Gerais, Brazil, this high-transparency natural Clear Quartz generator directs divine cosmic light upward through its six natural termination facets. In Vedic crystal healing, Sphatik (Quartz) corresponds to Venus (Shukra) and the Moon (Chandra), creating an impenetrable protective aura in your sacred space.',
    price: '2800.00',
    salePrice: '2199.00',
    sku: 'CRY-CLRQ-TOW-001',
    stock: 22,
    weight: '350g - 420g',
    tags: 'Clear Quartz, Sphatik, Generator, Crystal Healing, Altar, Venus, Chandra',
    planet: 'Venus, Moon',
    zodiac: 'Taurus, Cancer, Pisces',
    certification: '100% Genuine Earth-Mined Mineral Certificate',
    benefits: 'Cleanses stagnant atmospheric energies, amplifies meditation frequencies, dispels electromagnetic stress.',
    specifications: JSON.stringify({
      origin: 'Minas Gerais, Brazil',
      crystalSystem: 'Hexagonal Prismatic Termination',
      clarity: 'Grade AAA Near-Optical Water-Clear',
      dimensions: 'Approx 9.5cm - 11.5cm Height',
    }),
    careInstructions: 'Cleanse under cold running spring water or moonlight on Purnima (Full Moon night). Do not expose to sudden extreme boiling heat.',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isPublished: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&w=1000&q=80',
        altText: 'Crystal clear quartz prismatic tower on dark reflective ground',
        isPrimary: true,
        displayOrder: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
        altText: 'Translucent healing quartz generator with natural rainbow veining',
        isPrimary: false,
        displayOrder: 2,
      },
    ],
    variations: [
      {
        type: 'Size',
        value: 'Medium (approx 8cm, 250g)',
        sku: 'CRY-CLRQ-MED',
        price: '1899.00',
        stock: 12,
      },
      {
        type: 'Size',
        value: 'Large (approx 11cm, 400g)',
        sku: 'CRY-CLRQ-LRG',
        price: '2199.00',
        stock: 8,
      },
      {
        type: 'Size',
        value: 'Master Altar (approx 15cm, 750g)',
        sku: 'CRY-CLRQ-MST',
        price: '3999.00',
        stock: 2,
      },
    ],
  },

  // 7. Raw Madagascar Rose Quartz Love Cluster
  {
    name: 'Raw Madagascar Rose Quartz Heart Chakra Specimen',
    slug: 'raw-madagascar-rose-quartz-specimen',
    categorySlug: 'crystals',
    brand: 'Astronava Vedic Authentics',
    shortDescription: 'Unpolished natural velvety pink Rose Quartz cluster radiating gentle healing energies of unconditional love.',
    fullDescription: 'This raw, unadulterated Rose Quartz from Madagascar glows with delicate pink warmth. It resonates directly with the Anahata (Heart) chakra, dissolving emotional trauma, soothing marital tension, and inviting romantic devotion and self-compassion into the home sanctuary.',
    price: '2100.00',
    salePrice: '1650.00',
    sku: 'CRY-ROSQ-MAD-002',
    stock: 18,
    weight: '300g - 380g',
    tags: 'Rose Quartz, Love, Heart Chakra, Venus, Anahata, Relationships',
    planet: 'Venus',
    zodiac: 'Taurus, Libra',
    certification: 'Authentic Untreated Natural Mineral',
    benefits: 'Harmonizes romantic relationships, relieves emotional sorrow, fosters self-love and empathy in family life.',
    specifications: JSON.stringify({
      origin: 'Antsirabe, Madagascar',
      mineralType: 'Macro-crystalline Rose Quartz',
      finish: '100% Raw Rough Geological Formation',
      chakra: 'Anahata (Heart Chakra)',
    }),
    careInstructions: 'Place in the southwest corner of the bedroom or on a bedside table. Recharge gently with moonlight.',
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isPublished: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80',
        altText: 'Raw pink Rose Quartz crystal chunk showing silky natural luster',
        isPrimary: true,
        displayOrder: 1,
      },
    ],
    variations: [
      {
        type: 'Form',
        value: 'Raw Natural Cluster',
        sku: 'CRY-ROSQ-RAW',
        price: '1650.00',
        stock: 12,
      },
      {
        type: 'Form',
        value: 'Polished Palm Stone',
        sku: 'CRY-ROSQ-PLM',
        price: '1450.00',
        stock: 6,
      },
    ],
  },

  // 8. Natural Golden Citrine Abundance Cluster
  {
    name: 'Natural Congolese Golden Citrine Geode Cluster',
    slug: 'natural-congolese-golden-citrine-cluster',
    categorySlug: 'crystals',
    brand: 'Astronava Vedic Authentics',
    shortDescription: 'Golden honey Citrine cluster for business wealth, Solar Plexus empowerment, and financial abundance.',
    fullDescription: 'Unlike common heat-treated amethyst sold on the commercial market, this is 100% natural, unheated Congolese Golden Citrine (Sunela). Known as the "Merchant Stone", it carries solar fire (Manipura chakra), turning ideas into prosperous manifestations without holding onto negative energies.',
    price: '4800.00',
    salePrice: '3999.00',
    sku: 'CRY-CIT-003',
    stock: 9,
    weight: '280g - 340g',
    tags: 'Citrine, Sunela, Wealth, Abundance, Solar Plexus, Jupiter, Cash Box',
    planet: 'Jupiter, Sun',
    zodiac: 'Sagittarius, Leo',
    certification: 'Natural Unheated Earth Guarantee',
    benefits: 'Attracts wealth flow, stimulates entrepreneurial drive, overcomes procrastination, brightens personal vitality.',
    specifications: JSON.stringify({
      origin: 'Lwena, Democratic Republic of the Congo',
      variety: 'Kundalini Natural Cathedral Citrine',
      color: 'Warm Golden Amber with honey phantoms',
      treatment: '100% Natural, NEVER baked or heat-treated',
    }),
    careInstructions: 'Keep in the cash box, workstation, or north-east prosperity quadrant of your office.',
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isPublished: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
        altText: 'Golden natural citrine geode cluster on altar setting',
        isPrimary: true,
        displayOrder: 1,
      },
    ],
  },

  // 9. Raw Black Tourmaline Protection Shield
  {
    name: 'Raw Brazilian Black Tourmaline EMF & Psychic Shield',
    slug: 'raw-brazilian-black-tourmaline-shield',
    categorySlug: 'crystals',
    brand: 'Astronava Vedic Authentics',
    shortDescription: 'Dense striation Schorl Black Tourmaline stone for grounding, EMF absorption, and Rahu/Saturn pacification.',
    fullDescription: 'Black Tourmaline (Schorl) is the premier energetic vacuum cleaner of the mineral realm. Its columnar striations deflect electromagnetic frequencies from laptops and phones while grounding the Muladhara (Root) chakra. Highly recommended in Vedic Jyotish during challenging Saturn (Shani) or Rahu transits.',
    price: '1600.00',
    salePrice: '1299.00',
    sku: 'CRY-TOUR-004',
    stock: 35,
    weight: '200g - 250g',
    tags: 'Black Tourmaline, Schorl, EMF, Protection, Root Chakra, Saturn, Rahu',
    planet: 'Saturn, Rahu',
    zodiac: 'Capricorn, Aquarius, Scorpio',
    certification: 'Certified Natural Mineral Specimen',
    benefits: 'Absorbs electromagnetic smog, repels ill-wishes and evil eye (Drishti), anchors wandering mental chatter to earth.',
    specifications: JSON.stringify({
      origin: 'Cruzeiro Mine, Brazil',
      mineralClass: 'Schorl Complex Borosilicate',
      structure: 'Natural Trigonal Columnar Striations',
      chakra: 'Muladhara (Root Chakra)',
    }),
    careInstructions: 'Place near primary entrance door or between computer monitors and yourself. Rinse under running cold water weekly.',
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isPublished: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80',
        altText: 'Jet black tourmaline chunk showing fibrous crystalline striations',
        isPrimary: true,
        displayOrder: 1,
      },
    ],
  },
];
