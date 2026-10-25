/**
 * Programmatic Internal API Documentation Generator for Astronava
 * Dynamically aggregates, structures, and documents all internal application endpoints.
 */

export interface InternalEndpointDoc {
  id: string;
  name: string;
  category: 'Astrology Engine' | 'Store & Commerce' | 'Admin & Management' | 'Mobile Native Sync' | 'System & Batch';
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
  badge: string;
  description: string;
  authRequired: boolean;
  authType: 'Public' | 'API Key (X-Astronava-Api-Key)' | 'Bearer Admin Token' | 'Bearer Customer Token';
  rateLimit: string;
  parameters?: Array<{
    name: string;
    in: 'query' | 'path' | 'header' | 'body';
    required: boolean;
    type: string;
    description: string;
    default?: any;
  }>;
  requestBody?: {
    contentType: string;
    required: boolean;
    schema: Record<string, any>;
    example: any;
  };
  responses: Array<{
    status: number;
    description: string;
    example: any;
  }>;
  curlSnippet: string;
  jsSnippet: string;
  kotlinSnippet: string;
  pythonSnippet: string;
}

export function getInternalApiDocs(originUrl: string) {
  const base = originUrl.replace(/\/$/, '');

  const endpoints: InternalEndpointDoc[] = [
    // -------------------------------------------------------------
    // 1. ASTROLOGY ENGINE REST API v1
    // -------------------------------------------------------------
    {
      id: 'v1-kundli-calculate',
      name: 'Janam Kundli Calculation & Ephemeris Analysis',
      category: 'Astrology Engine',
      method: 'POST',
      path: '/api/v1/kundli/calculate',
      badge: 'Core Ephemeris',
      description: 'Generates full Vedic Janam Kundli with Lagna (Ascendant), 9 planetary positions (sign, degree, retrogradation, combustion, dignity), 12 Bhava (houses) with occupant planets, Vimshottari Mahadasha/Antardasha periods, divisional charts (D1, D9 Navamsha, D10 Dashamsha), Yogas, and Doshas.',
      authRequired: true,
      authType: 'API Key (X-Astronava-Api-Key)',
      rateLimit: '120 req/min',
      parameters: [
        { name: 'name', in: 'body', required: false, type: 'string', description: 'Name of the seeker', default: 'Arjun Sharma' },
        { name: 'dob', in: 'body', required: true, type: 'string (YYYY-MM-DD)', description: 'Date of birth', default: '1995-11-23' },
        { name: 'tob', in: 'body', required: false, type: 'string (HH:mm)', description: 'Time of birth in 24hr format', default: '06:45' },
        { name: 'latitude', in: 'body', required: true, type: 'number', description: 'Birthplace latitude in decimal degrees', default: 28.6139 },
        { name: 'longitude', in: 'body', required: true, type: 'number', description: 'Birthplace longitude in decimal degrees', default: 77.2090 },
        { name: 'timezoneOffset', in: 'body', required: false, type: 'number', description: 'Timezone offset in hours from UTC', default: 5.5 },
        { name: 'gender', in: 'body', required: false, type: 'string', description: 'male | female | other', default: 'male' },
        { name: 'ayanamsha', in: 'body', required: false, type: 'string', description: 'lahiri | raman | kp', default: 'lahiri' },
      ],
      requestBody: {
        contentType: 'application/json',
        required: true,
        schema: {
          type: 'object',
          required: ['dob', 'latitude', 'longitude'],
          properties: {
            name: { type: 'string' },
            dob: { type: 'string', example: '1995-11-23' },
            tob: { type: 'string', example: '06:45' },
            latitude: { type: 'number', example: 28.6139 },
            longitude: { type: 'number', example: 77.2090 },
            timezoneOffset: { type: 'number', example: 5.5 },
          },
        },
        example: {
          name: 'Arjun Sharma',
          gender: 'male',
          dob: '1995-11-23',
          tob: '06:45',
          latitude: 28.6139,
          longitude: 77.2090,
          timezoneOffset: 5.5,
          ayanamsha: 'lahiri',
        },
      },
      responses: [
        {
          status: 200,
          description: 'Calculated Janam Kundli and divisional planetary placements',
          example: {
            success: true,
            timestamp: '2026-10-25T08:00:00.000Z',
            birthDetails: { name: 'Arjun Sharma', dob: '1995-11-23', tob: '06:45' },
            data: {
              lagna: { rasi: 'Scorpio', degree: 14.52, house: 1, lord: 'Mars' },
              grahasList: [
                { id: 'sun', name: 'Sun', rasi: 'Scorpio', degree: 7.21, house: 1, isRetrograde: false, dignity: 'Friendly' },
                { id: 'moon', name: 'Moon', rasi: 'Sagittarius', degree: 19.45, house: 2, isRetrograde: false, dignity: 'Neutral' },
                { id: 'mars', name: 'Mars', rasi: 'Scorpio', degree: 28.12, house: 1, isRetrograde: false, dignity: 'Own Sign' },
              ],
              divisionalCharts: { d1: {}, d9: {}, d10: {} },
            },
          },
        },
        { status: 400, description: 'Missing required date of birth or invalid coordinates', example: { error: 'Date of birth (dob) is required in YYYY-MM-DD format', code: 'MISSING_DOB' } },
        { status: 401, description: 'Missing or revoked API Key token', example: { error: 'Unauthorized: Valid X-Astronava-Api-Key required' } },
      ],
      curlSnippet: `curl -X POST "${base}/api/v1/kundli/calculate" \\
  -H "Content-Type: application/json" \\
  -H "X-Astronava-Api-Key: ast_live_your_key_here" \\
  -d '{
    "name": "Arjun Sharma",
    "dob": "1995-11-23",
    "tob": "06:45",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezoneOffset": 5.5
  }'`,
      jsSnippet: `const response = await fetch('${base}/api/v1/kundli/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Astronava-Api-Key': 'ast_live_your_key_here',
  },
  body: JSON.stringify({
    name: 'Arjun Sharma',
    dob: '1995-11-23',
    tob: '06:45',
    latitude: 28.6139,
    longitude: 77.2090,
    timezoneOffset: 5.5,
  }),
});
const data = await response.json();
console.log(data);`,
      kotlinSnippet: `// Retrofit Interface definition
@POST("api/v1/kundli/calculate")
suspend fun calculateKundli(
    @Header("X-Astronava-Api-Key") apiKey: String,
    @Body request: KundliRequest
): Response<KundliResponse>`,
      pythonSnippet: `import requests

url = "${base}/api/v1/kundli/calculate"
headers = {
    "Content-Type": "application/json",
    "X-Astronava-Api-Key": "ast_live_your_key_here"
}
payload = {
    "name": "Arjun Sharma",
    "dob": "1995-11-23",
    "tob": "06:45",
    "latitude": 28.6139,
    "longitude": 77.2090
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    },

    {
      id: 'v1-horoscope-daily',
      name: 'Personalized Daily Horoscope & Gochara Transits',
      category: 'Astrology Engine',
      method: 'POST',
      path: '/api/v1/horoscope/daily',
      badge: 'Daily Feed',
      description: 'Calculates personalized daily predictions based on user birth coordinates and real-time planetary transits. Delivers overall vitality score, domain-wise scores (career, love, finance, health, family, spirituality), auspicious muhurats, lucky color, lucky number, and Vedic remedies.',
      authRequired: true,
      authType: 'API Key (X-Astronava-Api-Key)',
      rateLimit: '120 req/min',
      parameters: [
        { name: 'name', in: 'body', required: false, type: 'string', description: 'Name of the seeker', default: 'Priya Sharma' },
        { name: 'dob', in: 'body', required: true, type: 'string (YYYY-MM-DD)', description: 'Date of birth', default: '1998-04-12' },
        { name: 'tob', in: 'body', required: false, type: 'string (HH:mm)', description: 'Time of birth in 24hr format', default: '08:30' },
        { name: 'latitude', in: 'body', required: true, type: 'number', description: 'Birthplace latitude', default: 28.6139 },
        { name: 'longitude', in: 'body', required: true, type: 'number', description: 'Birthplace longitude', default: 77.2090 },
        { name: 'targetDate', in: 'body', required: false, type: 'string (YYYY-MM-DD)', description: 'Target forecast date', default: new Date().toISOString().split('T')[0] },
      ],
      requestBody: {
        contentType: 'application/json',
        required: true,
        schema: {
          type: 'object',
          required: ['dob', 'latitude', 'longitude'],
          properties: {
            dob: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            targetDate: { type: 'string' },
          },
        },
        example: {
          name: 'Priya Sharma',
          dob: '1998-04-12',
          tob: '08:30',
          latitude: 28.6139,
          longitude: 77.2090,
          targetDate: new Date().toISOString().split('T')[0],
        },
      },
      responses: [
        {
          status: 200,
          description: 'Calculated personalized horoscope for target date',
          example: {
            success: true,
            horoscope: {
              date: '2026-10-25',
              lagna: 'Taurus',
              moonSign: 'Virgo',
              overallScore: 84,
              domainScores: { career: 88, love: 79, finance: 85, health: 91 },
              auspiciousTime: '09:15 AM - 11:00 AM (Abhijit Muhurat)',
              luckyColor: 'Saffron & Gold',
              luckyNumber: 7,
              remedy: 'Offer water to Surya Deva at dawn chanting Gayatri Mantra.',
            },
          },
        },
      ],
      curlSnippet: `curl -X POST "${base}/api/v1/horoscope/daily" \\
  -H "Content-Type: application/json" \\
  -H "X-Astronava-Api-Key: ast_live_your_key_here" \\
  -d '{
    "name": "Priya Sharma",
    "dob": "1998-04-12",
    "tob": "08:30",
    "latitude": 28.6139,
    "longitude": 77.2090
  }'`,
      jsSnippet: `const response = await fetch('${base}/api/v1/horoscope/daily', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Astronava-Api-Key': 'ast_live_your_key_here',
  },
  body: JSON.stringify({
    name: 'Priya Sharma',
    dob: '1998-04-12',
    tob: '08:30',
    latitude: 28.6139,
    longitude: 77.2090,
  }),
});
const data = await response.json();`,
      kotlinSnippet: `@POST("api/v1/horoscope/daily")
suspend fun getDailyHoroscope(
    @Header("X-Astronava-Api-Key") apiKey: String,
    @Body request: HoroscopeRequest
): Response<HoroscopeResponse>`,
      pythonSnippet: `import requests
res = requests.post("${base}/api/v1/horoscope/daily", headers={"X-Astronava-Api-Key": "your_key"}, json={"dob": "1998-04-12", "latitude": 28.6139, "longitude": 77.2090})
print(res.json())`,
    },

    {
      id: 'v1-gemstones-recommend',
      name: 'Vedic Ratna (Gemstone) Dosage & Remedies',
      category: 'Astrology Engine',
      method: 'POST',
      path: '/api/v1/gemstones/recommend',
      badge: 'Remedies Engine',
      description: 'Calculates the auspicious Vedic Ratna remedies based on Lagna Lord, 5th Lord (Purva Punya), and 9th Lord (Bhagya). Determines the Life Stone, Lucky Stone, and Fortune Stone, with carat weight, metal, wearing finger, and energization procedures.',
      authRequired: true,
      authType: 'API Key (X-Astronava-Api-Key)',
      rateLimit: '120 req/min',
      parameters: [
        { name: 'dob', in: 'body', required: true, type: 'string', description: 'Date of birth (YYYY-MM-DD)', default: '1992-07-15' },
        { name: 'tob', in: 'body', required: false, type: 'string', description: 'Time of birth (HH:mm)', default: '14:20' },
        { name: 'latitude', in: 'body', required: true, type: 'number', description: 'Latitude', default: 19.0760 },
        { name: 'longitude', in: 'body', required: true, type: 'number', description: 'Longitude', default: 72.8777 },
      ],
      requestBody: {
        contentType: 'application/json',
        required: true,
        schema: { type: 'object' },
        example: { dob: '1992-07-15', tob: '14:20', latitude: 19.0760, longitude: 72.8777 },
      },
      responses: [
        {
          status: 200,
          description: 'Gemstone recommendations based on ascendant',
          example: {
            success: true,
            lagna: 'Scorpio',
            lifeStone: { name: 'Red Coral (Moonga)', planet: 'Mars', metal: 'Copper or Gold', finger: 'Ring Finger' },
            luckyStone: { name: 'Yellow Sapphire (Pukhraj)', planet: 'Jupiter', metal: 'Gold or Panchdhatu', finger: 'Index Finger' },
            bhagyaStone: { name: 'Pearl (Moti)', planet: 'Moon', metal: 'Silver', finger: 'Little Finger' },
          },
        },
      ],
      curlSnippet: `curl -X POST "${base}/api/v1/gemstones/recommend" \\
  -H "Content-Type: application/json" \\
  -H "X-Astronava-Api-Key: ast_live_your_key_here" \\
  -d '{"dob": "1992-07-15", "tob": "14:20", "latitude": 19.0760, "longitude": 72.8777}'`,
      jsSnippet: `const res = await fetch('${base}/api/v1/gemstones/recommend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Astronava-Api-Key': 'ast_live_your_key_here' },
  body: JSON.stringify({ dob: '1992-07-15', tob: '14:20', latitude: 19.0760, longitude: 72.8777 }),
});`,
      kotlinSnippet: `@POST("api/v1/gemstones/recommend")
suspend fun getGemstoneRecommendations(@Body request: GemstoneRequest): Response<GemstoneResponse>`,
      pythonSnippet: `import requests
res = requests.post("${base}/api/v1/gemstones/recommend", json={"dob": "1992-07-15", "latitude": 19.0760, "longitude": 72.8777})`,
    },

    {
      id: 'v1-match-compatibility',
      name: 'Ashtakoota 36-Guna Kundli Milan & Compatibility',
      category: 'Astrology Engine',
      method: 'POST',
      path: '/api/v1/match/compatibility',
      badge: 'Compatibility',
      description: 'Calculates authentic 36-Guna Vedic Ashtakoota compatibility between two partners. Evaluates Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), and Nadi (8). Performs Manglik Dosha matching and delivers overall verdict.',
      authRequired: true,
      authType: 'API Key (X-Astronava-Api-Key)',
      rateLimit: '120 req/min',
      parameters: [
        { name: 'p1', in: 'body', required: true, type: 'object', description: 'Partner 1 birth details (name, dob, tob, latitude, longitude)' },
        { name: 'p2', in: 'body', required: true, type: 'object', description: 'Partner 2 birth details (name, dob, tob, latitude, longitude)' },
      ],
      requestBody: {
        contentType: 'application/json',
        required: true,
        schema: { type: 'object', required: ['p1', 'p2'] },
        example: {
          p1: { name: 'Rohan', dob: '1993-05-14', tob: '09:15', latitude: 28.6139, longitude: 77.2090 },
          p2: { name: 'Ananya', dob: '1995-09-22', tob: '14:40', latitude: 19.0760, longitude: 72.8777 },
        },
      },
      responses: [
        {
          status: 200,
          description: 'Match score breakdown across all 8 Kootas',
          example: {
            success: true,
            totalGunas: 36,
            obtainedGunas: 29.5,
            percentage: 82,
            verdict: 'Highly Auspicious Match (Uttam Milan)',
            manglikAnalysis: { p1Manglik: false, p2Manglik: false, isCompatible: true },
          },
        },
      ],
      curlSnippet: `curl -X POST "${base}/api/v1/match/compatibility" \\
  -H "Content-Type: application/json" \\
  -H "X-Astronava-Api-Key: ast_live_your_key_here" \\
  -d '{"p1": {"name": "Rohan", "dob": "1993-05-14", "latitude": 28.6139, "longitude": 77.2090}, "p2": {"name": "Ananya", "dob": "1995-09-22", "latitude": 19.0760, "longitude": 72.8777}}'`,
      jsSnippet: `const res = await fetch('${base}/api/v1/match/compatibility', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Astronava-Api-Key': 'ast_live_your_key_here' },
  body: JSON.stringify({ p1: { dob: '1993-05-14', latitude: 28.6139, longitude: 77.209 }, p2: { dob: '1995-09-22', latitude: 19.076, longitude: 72.877 } }),
});`,
      kotlinSnippet: `@POST("api/v1/match/compatibility")
suspend fun calculateMatch(@Body request: MatchRequest): Response<MatchResponse>`,
      pythonSnippet: `import requests
res = requests.post("${base}/api/v1/match/compatibility", json={"p1": {...}, "p2": {...}})`,
    },

    {
      id: 'v1-numerology-calculate',
      name: 'Vedic Numerology, Mulank, Bhagyank & Lo Shu Grid',
      category: 'Astrology Engine',
      method: 'POST',
      path: '/api/v1/numerology/calculate',
      badge: 'Numerology',
      description: 'Calculates Driver Number (Mulank), Conductor Number (Bhagyank), 3x3 Lo Shu Energy Grid, and Personal Year forecast for any birth date.',
      authRequired: true,
      authType: 'API Key (X-Astronava-Api-Key)',
      rateLimit: '120 req/min',
      parameters: [
        { name: 'dob', in: 'body', required: true, type: 'string', description: 'Date of birth (YYYY-MM-DD)', default: '1990-10-28' },
        { name: 'fullName', in: 'body', required: false, type: 'string', description: 'Full birth name', default: 'Vikramaditya Rao' },
      ],
      requestBody: {
        contentType: 'application/json',
        required: true,
        schema: { type: 'object' },
        example: { dob: '1990-10-28', fullName: 'Vikramaditya Rao' },
      },
      responses: [
        {
          status: 200,
          description: 'Calculated Mulank, Bhagyank, and Lo Shu grid',
          example: {
            success: true,
            mulank: 1,
            bhagyank: 3,
            driverConductorRelationship: 'Friendly (Sun & Jupiter harmony)',
            loShuGrid: [[4, 9, 2], [3, 5, 7], [8, 1, 6]],
          },
        },
      ],
      curlSnippet: `curl -X POST "${base}/api/v1/numerology/calculate" \\
  -H "Content-Type: application/json" \\
  -H "X-Astronava-Api-Key: ast_live_your_key_here" \\
  -d '{"dob": "1990-10-28", "fullName": "Vikramaditya Rao"}'`,
      jsSnippet: `const res = await fetch('${base}/api/v1/numerology/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Astronava-Api-Key': 'ast_live_your_key_here' },
  body: JSON.stringify({ dob: '1990-10-28', fullName: 'Vikramaditya Rao' }),
});`,
      kotlinSnippet: `@POST("api/v1/numerology/calculate")
suspend fun calculateNumerology(@Body request: NumerologyRequest): Response<NumerologyResponse>`,
      pythonSnippet: `import requests
res = requests.post("${base}/api/v1/numerology/calculate", json={"dob": "1990-10-28"})`,
    },

    {
      id: 'v1-name-tuning',
      name: 'Chaldean & Pythagorean Vedic Name Harmonization',
      category: 'Astrology Engine',
      method: 'POST',
      path: '/api/v1/name-correction/tune',
      badge: 'Name Science',
      description: 'Evaluates current name spelling against Mulank and Bhagyank vibrations. Suggests phonetic and letter tuning adjustments for maximum fortune and career elevation.',
      authRequired: true,
      authType: 'API Key (X-Astronava-Api-Key)',
      rateLimit: '120 req/min',
      parameters: [
        { name: 'currentName', in: 'body', required: true, type: 'string', description: 'Current name', default: 'Rohit Sharma' },
        { name: 'dob', in: 'body', required: true, type: 'string', description: 'Date of birth (YYYY-MM-DD)', default: '1987-04-30' },
      ],
      requestBody: {
        contentType: 'application/json',
        required: true,
        schema: { type: 'object' },
        example: { currentName: 'Rohit Sharma', dob: '1987-04-30' },
      },
      responses: [
        {
          status: 200,
          description: 'Name tuning suggestions and compound vibration',
          example: {
            success: true,
            currentCompound: 37,
            currentRulingPlanet: 'Sun & Neptune',
            compatibilityStatus: 'Compatible',
            tunedAlternatives: ['Rohit K Sharma (38/2)', 'Rohitt Sharma (42/6)'],
          },
        },
      ],
      curlSnippet: `curl -X POST "${base}/api/v1/name-correction/tune" \\
  -H "Content-Type: application/json" \\
  -H "X-Astronava-Api-Key: ast_live_your_key_here" \\
  -d '{"currentName": "Rohit Sharma", "dob": "1987-04-30"}'`,
      jsSnippet: `const res = await fetch('${base}/api/v1/name-correction/tune', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Astronava-Api-Key': 'ast_live_your_key_here' },
  body: JSON.stringify({ currentName: 'Rohit Sharma', dob: '1987-04-30' }),
});`,
      kotlinSnippet: `@POST("api/v1/name-correction/tune")
suspend fun tuneName(@Body request: NameTuneRequest): Response<NameTuneResponse>`,
      pythonSnippet: `import requests
res = requests.post("${base}/api/v1/name-correction/tune", json={"currentName": "Rohit Sharma", "dob": "1987-04-30"})`,
    },

    {
      id: 'v1-meta',
      name: 'Engine Metadata & Health Inspection',
      category: 'Astrology Engine',
      method: 'GET',
      path: '/api/v1/meta',
      badge: 'Public Discovery',
      description: 'Returns API engine version, online status, server time, and public directory of all active calculation endpoints.',
      authRequired: false,
      authType: 'Public',
      rateLimit: '300 req/min',
      responses: [
        {
          status: 200,
          description: 'API health and directory',
          example: {
            status: 'online',
            version: '1.0.0',
            name: 'Astronava Vedic Astrology Engine API',
            endpoints: [{ path: '/api/v1/kundli/calculate', method: 'POST' }],
          },
        },
      ],
      curlSnippet: `curl -X GET "${base}/api/v1/meta"`,
      jsSnippet: `const res = await fetch('${base}/api/v1/meta');
const data = await res.json();`,
      kotlinSnippet: `@GET("api/v1/meta")
suspend fun getApiMeta(): Response<ApiMetaResponse>`,
      pythonSnippet: `import requests
res = requests.get("${base}/api/v1/meta")`,
    },

    // -------------------------------------------------------------
    // 2. STORE & E-COMMERCE ENDPOINTS
    // -------------------------------------------------------------
    {
      id: 'store-products-list',
      name: 'List Catalog Products with Astrological Filters',
      category: 'Store & Commerce',
      method: 'GET',
      path: '/api/store/products',
      badge: 'Catalog',
      description: 'Retrieves products with support for pagination, search, category slug, planet association, zodiac sign, certified gemstone filters, and price ranges.',
      authRequired: false,
      authType: 'Public',
      rateLimit: '120 req/min',
      parameters: [
        { name: 'categorySlug', in: 'query', required: false, type: 'string', description: 'Filter by category (e.g. certified-gemstones, rudraksha)' },
        { name: 'planet', in: 'query', required: false, type: 'string', description: 'Filter by associated planet (e.g. sun, jupiter)' },
        { name: 'limit', in: 'query', required: false, type: 'number', description: 'Page size limit', default: 20 },
        { name: 'page', in: 'query', required: false, type: 'number', description: 'Page number', default: 1 },
      ],
      responses: [
        {
          status: 200,
          description: 'Array of products and pagination metadata',
          example: { items: [{ id: 1, name: 'Natural Ceylon Blue Sapphire (Neelam)', price: 45000, inStock: true }], total: 48 },
        },
      ],
      curlSnippet: `curl -X GET "${base}/api/store/products?categorySlug=certified-gemstones&limit=10"`,
      jsSnippet: `const res = await fetch('${base}/api/store/products?limit=10');`,
      kotlinSnippet: `@GET("api/store/products")
suspend fun getProducts(@Query("limit") limit: Int): Response<ProductListResponse>`,
      pythonSnippet: `import requests
res = requests.get("${base}/api/store/products")`,
    },

    {
      id: 'store-categories-list',
      name: 'List Active Store Categories Taxonomy',
      category: 'Store & Commerce',
      method: 'GET',
      path: '/api/store/categories',
      badge: 'Taxonomy',
      description: 'Returns all product categories, hierarchy levels, descriptions, and active listing counts.',
      authRequired: false,
      authType: 'Public',
      rateLimit: '120 req/min',
      responses: [
        {
          status: 200,
          description: 'Array of category records',
          example: [{ id: 1, name: 'Certified Gemstones', slug: 'certified-gemstones', productCount: 24 }],
        },
      ],
      curlSnippet: `curl -X GET "${base}/api/store/categories"`,
      jsSnippet: `const res = await fetch('${base}/api/store/categories');`,
      kotlinSnippet: `@GET("api/store/categories")
suspend fun getCategories(): Response<List<Category>>`,
      pythonSnippet: `import requests
res = requests.get("${base}/api/store/categories")`,
    },

    {
      id: 'store-coupons-validate',
      name: 'Validate Coupon Code & Discount Computation',
      category: 'Store & Commerce',
      method: 'POST',
      path: '/api/store/coupons/validate',
      badge: 'Checkout',
      description: 'Checks coupon validity, expiration, minimum cart subtotal, and computes the exact discount amount.',
      authRequired: false,
      authType: 'Public',
      rateLimit: '30 req/min',
      parameters: [
        { name: 'code', in: 'body', required: true, type: 'string', description: 'Coupon code', default: 'VEDIC10' },
        { name: 'subtotal', in: 'body', required: true, type: 'number', description: 'Cart subtotal in INR', default: 5000 },
      ],
      requestBody: {
        contentType: 'application/json',
        required: true,
        schema: { type: 'object' },
        example: { code: 'VEDIC10', subtotal: 5000 },
      },
      responses: [
        {
          status: 200,
          description: 'Coupon validation result',
          example: { valid: true, discountAmount: 500, finalSubtotal: 4500, discountType: 'percentage', discountValue: 10 },
        },
      ],
      curlSnippet: `curl -X POST "${base}/api/store/coupons/validate" -H "Content-Type: application/json" -d '{"code": "VEDIC10", "subtotal": 5000}'`,
      jsSnippet: `const res = await fetch('${base}/api/store/coupons/validate', { method: 'POST', body: JSON.stringify({ code: 'VEDIC10', subtotal: 5000 }) });`,
      kotlinSnippet: `@POST("api/store/coupons/validate")
suspend fun validateCoupon(@Body request: CouponRequest): Response<CouponResponse>`,
      pythonSnippet: `import requests
res = requests.post("${base}/api/store/coupons/validate", json={"code": "VEDIC10", "subtotal": 5000})`,
    },

    // -------------------------------------------------------------
    // 3. ADMIN MANAGEMENT & TELEMETRY API
    // -------------------------------------------------------------
    {
      id: 'admin-api-docs-spec',
      name: 'Programmatic API Documentation & Schema Registry',
      category: 'Admin & Management',
      method: 'GET',
      path: '/api/admin/api/docs',
      badge: 'Admin Only',
      description: 'Programmatically inspects and returns the comprehensive documentation generated from the app internal endpoints, schemas, parameters, code samples, and OpenAPI 3.0 specification.',
      authRequired: true,
      authType: 'Bearer Admin Token',
      rateLimit: '120 req/min',
      parameters: [
        { name: 'format', in: 'query', required: false, type: 'string', description: 'json | openapi (returns OpenAPI 3.0 spec)', default: 'json' },
      ],
      responses: [
        {
          status: 200,
          description: 'Programmatic endpoint documentation registry',
          example: { success: true, totalEndpoints: 20, serverVersion: '1.0.0', endpoints: [] },
        },
        { status: 401, description: 'Missing admin authentication token', example: { error: 'Unauthorized: Admin token required' } },
        { status: 403, description: 'Authenticated user is not an allowlisted administrator', example: { error: 'Forbidden: Admin access restricted' } },
      ],
      curlSnippet: `curl -X GET "${base}/api/admin/api/docs" \\
  -H "Authorization: Bearer <ADMIN_FIREBASE_ID_TOKEN>" \\
  -H "x-admin-email: himaghnamedhi1@gmail.com"`,
      jsSnippet: `const res = await fetch('${base}/api/admin/api/docs', {
  headers: {
    Authorization: 'Bearer ' + token,
    'x-admin-email': 'himaghnamedhi1@gmail.com',
  },
});
const docs = await res.json();`,
      kotlinSnippet: `@GET("api/admin/api/docs")
suspend fun getApiDocs(@Header("Authorization") bearerToken: String): Response<ApiDocsResponse>`,
      pythonSnippet: `import requests
res = requests.get("${base}/api/admin/api/docs", headers={"Authorization": "Bearer admin_token"})`,
    },

    {
      id: 'admin-api-keys-list',
      name: 'List Registered External API Keys',
      category: 'Admin & Management',
      method: 'GET',
      path: '/api/admin/api/keys',
      badge: 'Admin Only',
      description: 'Lists all provisioned API key tokens with masked values, rate limits, created timestamps, and active status.',
      authRequired: true,
      authType: 'Bearer Admin Token',
      rateLimit: '120 req/min',
      responses: [
        {
          status: 200,
          description: 'List of API keys',
          example: { success: true, keys: [{ id: 'key_1', name: 'Android Production Key', maskedKey: 'ast_live_...9f2a', status: 'active', rateLimit: 120 }] },
        },
      ],
      curlSnippet: `curl -X GET "${base}/api/admin/api/keys" -H "Authorization: Bearer <TOKEN>"`,
      jsSnippet: `const res = await fetch('${base}/api/admin/api/keys', { headers: { Authorization: 'Bearer ' + token } });`,
      kotlinSnippet: `@GET("api/admin/api/keys")
suspend fun getApiKeys(@Header("Authorization") token: String): Response<KeyListResponse>`,
      pythonSnippet: `import requests
res = requests.get("${base}/api/admin/api/keys", headers={"Authorization": "Bearer " + token})`,
    },

    {
      id: 'admin-api-keys-create',
      name: 'Provision New External API Key',
      category: 'Admin & Management',
      method: 'POST',
      path: '/api/admin/api/keys',
      badge: 'Admin Only',
      description: 'Generates a new external integration key with configurable rate limits, scopes, and environment. Returns plaintext secret once.',
      authRequired: true,
      authType: 'Bearer Admin Token',
      rateLimit: '60 req/min',
      parameters: [
        { name: 'name', in: 'body', required: true, type: 'string', description: 'Key description name', default: 'Android Mobile App Client' },
        { name: 'environment', in: 'body', required: false, type: 'string', description: 'production | sandbox', default: 'production' },
        { name: 'rateLimit', in: 'body', required: false, type: 'number', description: 'Requests per minute limit', default: 120 },
      ],
      requestBody: {
        contentType: 'application/json',
        required: true,
        schema: { type: 'object' },
        example: { name: 'Android Mobile App Client', environment: 'production', rateLimit: 120, allowedScopes: ['*'] },
      },
      responses: [
        {
          status: 201,
          description: 'Key created and secret token returned',
          example: { success: true, secretKey: 'ast_live_sec_89f0293fa01923', key: { id: 'key_new', name: 'Android Client' } },
        },
      ],
      curlSnippet: `curl -X POST "${base}/api/admin/api/keys" \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Android Mobile Client", "environment": "production", "rateLimit": 120}'`,
      jsSnippet: `const res = await fetch('${base}/api/admin/api/keys', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Android Client', rateLimit: 120 }),
});`,
      kotlinSnippet: `@POST("api/admin/api/keys")
suspend fun createApiKey(@Header("Authorization") token: String, @Body request: CreateKeyRequest): Response<CreateKeyResponse>`,
      pythonSnippet: `import requests
res = requests.post("${base}/api/admin/api/keys", headers={"Authorization": "Bearer " + token}, json={"name": "Android Client"})`,
    },

    {
      id: 'admin-api-logs-query',
      name: 'Query Live API Usage & Audit Logs',
      category: 'Admin & Management',
      method: 'GET',
      path: '/api/admin/api/logs',
      badge: 'Admin Only',
      description: 'Queries telemetry audit logs with search, status code filtering, endpoint path filtering, and pagination.',
      authRequired: true,
      authType: 'Bearer Admin Token',
      rateLimit: '120 req/min',
      parameters: [
        { name: 'statusCode', in: 'query', required: false, type: 'number', description: 'Filter by HTTP status (e.g. 200, 401, 500)' },
        { name: 'search', in: 'query', required: false, type: 'string', description: 'Search term for IP, path, or key name' },
        { name: 'limit', in: 'query', required: false, type: 'number', description: 'Limit rows', default: 50 },
      ],
      responses: [
        {
          status: 200,
          description: 'List of audit logs',
          example: { success: true, total: 320, logs: [{ id: 'log_1', path: '/api/v1/kundli/calculate', statusCode: 200, durationMs: 42 }] },
        },
      ],
      curlSnippet: `curl -X GET "${base}/api/admin/api/logs?limit=50" -H "Authorization: Bearer <TOKEN>"`,
      jsSnippet: `const res = await fetch('${base}/api/admin/api/logs?limit=50', { headers: { Authorization: 'Bearer ' + token } });`,
      kotlinSnippet: `@GET("api/admin/api/logs")
suspend fun getLogs(@Header("Authorization") token: String): Response<LogListResponse>`,
      pythonSnippet: `import requests
res = requests.get("${base}/api/admin/api/logs", headers={"Authorization": "Bearer " + token})`,
    },

    {
      id: 'admin-api-metrics-summary',
      name: 'API Telemetry Consumption Trends & Latency Metrics',
      category: 'Admin & Management',
      method: 'GET',
      path: '/api/admin/api/metrics',
      badge: 'Admin Only',
      description: 'Returns aggregated hourly and 14-day consumption trends, request volumes, error rates, status code breakdowns, and p95 latency percentiles.',
      authRequired: true,
      authType: 'Bearer Admin Token',
      rateLimit: '120 req/min',
      responses: [
        {
          status: 200,
          description: 'Aggregated performance metrics',
          example: {
            success: true,
            metrics: {
              totalRequests24h: 3840,
              avgDurationMs: 38,
              successRatePercent: 99.2,
              dailyTrends: [{ date: 'Oct 24', totalRequests: 3200, errorRate: 0.8 }],
            },
          },
        },
      ],
      curlSnippet: `curl -X GET "${base}/api/admin/api/metrics" -H "Authorization: Bearer <TOKEN>"`,
      jsSnippet: `const res = await fetch('${base}/api/admin/api/metrics', { headers: { Authorization: 'Bearer ' + token } });`,
      kotlinSnippet: `@GET("api/admin/api/metrics")
suspend fun getMetrics(@Header("Authorization") token: String): Response<MetricsResponse>`,
      pythonSnippet: `import requests
res = requests.get("${base}/api/admin/api/metrics", headers={"Authorization": "Bearer " + token})`,
    },

    // -------------------------------------------------------------
    // 4. MOBILE NATIVE SYNC ENDPOINTS
    // -------------------------------------------------------------
    {
      id: 'mobile-kundli-sync',
      name: 'Mobile High-Speed Kundli Calculation',
      category: 'Mobile Native Sync',
      method: 'POST',
      path: '/api/mobile/kundli',
      badge: 'Mobile Sync',
      description: 'Optimized calculation endpoint for native Android and iOS apps with minimal transport overhead and ephemeris payload.',
      authRequired: false,
      authType: 'Public',
      rateLimit: '180 req/min',
      parameters: [
        { name: 'dob', in: 'body', required: true, type: 'string', description: 'YYYY-MM-DD' },
        { name: 'tob', in: 'body', required: true, type: 'string', description: 'HH:mm' },
        { name: 'latitude', in: 'body', required: true, type: 'number', description: 'Decimal latitude' },
        { name: 'longitude', in: 'body', required: true, type: 'number', description: 'Decimal longitude' },
      ],
      requestBody: {
        contentType: 'application/json',
        required: true,
        schema: { type: 'object' },
        example: { dob: '1995-11-23', tob: '06:45', latitude: 28.6139, longitude: 77.2090 },
      },
      responses: [
        { status: 200, description: 'Compact mobile Kundli payload', example: { success: true, kundliData: {} } },
      ],
      curlSnippet: `curl -X POST "${base}/api/mobile/kundli" -H "Content-Type: application/json" -d '{"dob": "1995-11-23", "tob": "06:45", "latitude": 28.6139, "longitude": 77.209}'`,
      jsSnippet: `const res = await fetch('${base}/api/mobile/kundli', { method: 'POST', body: JSON.stringify({ dob: '1995-11-23', tob: '06:45', latitude: 28.6139, longitude: 77.209 }) });`,
      kotlinSnippet: `@POST("api/mobile/kundli")
suspend fun syncMobileKundli(@Body request: MobileKundliRequest): Response<MobileKundliResponse>`,
      pythonSnippet: `import requests
res = requests.post("${base}/api/mobile/kundli", json={"dob": "1995-11-23", "tob": "06:45", "latitude": 28.6139, "longitude": 77.209})`,
    },

    // -------------------------------------------------------------
    // 5. SYSTEM & BATCH OPERATIONS
    // -------------------------------------------------------------
    {
      id: 'system-horoscope-batch',
      name: 'Daily Planetary Transit Batch Processor',
      category: 'System & Batch',
      method: 'POST',
      path: '/api/horoscope/generate-daily-batch',
      badge: 'Batch Engine',
      description: 'Triggers the automated Gochara transit batch job for all active subscribers to compute personalized daily forecasts.',
      authRequired: true,
      authType: 'Bearer Admin Token',
      rateLimit: '10 req/hour',
      parameters: [
        { name: 'targetDate', in: 'body', required: false, type: 'string', description: 'YYYY-MM-DD target date', default: new Date().toISOString().split('T')[0] },
      ],
      requestBody: {
        contentType: 'application/json',
        required: false,
        schema: { type: 'object' },
        example: { targetDate: new Date().toISOString().split('T')[0], targetUsers: 'all_active' },
      },
      responses: [
        { status: 200, description: 'Batch process completed', example: { success: true, processedCount: 250 } },
      ],
      curlSnippet: `curl -X POST "${base}/api/horoscope/generate-daily-batch" -H "Content-Type: application/json" -d '{"targetDate": "2026-10-25"}'`,
      jsSnippet: `const res = await fetch('${base}/api/horoscope/generate-daily-batch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetDate: '2026-10-25' }) });`,
      kotlinSnippet: `@POST("api/horoscope/generate-daily-batch")
suspend fun triggerBatch(@Body req: BatchRequest): Response<BatchResponse>`,
      pythonSnippet: `import requests
res = requests.post("${base}/api/horoscope/generate-daily-batch", json={"targetDate": "2026-10-25"})`,
    },

    {
      id: 'system-health',
      name: 'Server Core Health & Liveness Probe',
      category: 'System & Batch',
      method: 'GET',
      path: '/api/health',
      badge: 'Liveness',
      description: 'Returns HTTP 200 OK and current server ISO timestamp if the backend service is operational.',
      authRequired: false,
      authType: 'Public',
      rateLimit: '600 req/min',
      responses: [
        { status: 200, description: 'Server operational', example: { status: 'ok', timestamp: '2026-10-25T08:00:00.000Z' } },
      ],
      curlSnippet: `curl -X GET "${base}/api/health"`,
      jsSnippet: `const res = await fetch('${base}/api/health');`,
      kotlinSnippet: `@GET("api/health")
suspend fun getHealth(): Response<HealthResponse>`,
      pythonSnippet: `import requests
res = requests.get("${base}/api/health")`,
    },
  ];

  const categories = Array.from(new Set(endpoints.map((e) => e.category)));

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    categories,
    endpoints,
  };
}

export function getOpenApiSpecification(originUrl: string) {
  const docs = getInternalApiDocs(originUrl);
  const paths: Record<string, any> = {};

  for (const ep of docs.endpoints) {
    if (!paths[ep.path]) {
      paths[ep.path] = {};
    }
    const methodLower = ep.method.toLowerCase();
    paths[ep.path][methodLower] = {
      summary: ep.name,
      description: ep.description,
      tags: [ep.category],
      parameters: (ep.parameters || []).filter((p) => p.in !== 'body').map((p) => ({
        name: p.name,
        in: p.in,
        required: p.required,
        schema: { type: p.type },
        description: p.description,
      })),
      requestBody: ep.requestBody
        ? {
            required: ep.requestBody.required,
            content: {
              'application/json': {
                schema: ep.requestBody.schema,
                example: ep.requestBody.example,
              },
            },
          }
        : undefined,
      responses: {
        '200': {
          description: ep.responses[0]?.description || 'Successful operation',
          content: {
            'application/json': {
              example: ep.responses[0]?.example || {},
            },
          },
        },
      },
    };
  }

  return {
    openapi: '3.0.0',
    info: {
      title: 'Astronava Internal & External API Platform',
      version: '1.0.0',
      description: 'Comprehensive REST API documentation generated from internal endpoints for Vedic Astrology calculations, store commerce, and admin management.',
    },
    servers: [{ url: originUrl, description: 'Astronava Live Server' }],
    paths,
  };
}
