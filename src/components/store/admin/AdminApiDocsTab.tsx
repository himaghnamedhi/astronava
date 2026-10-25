import React, { useState, useEffect } from 'react';
import {
  Code2,
  Terminal,
  Smartphone,
  Copy,
  Check,
  Play,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Layers,
  FileJson,
  Cpu,
  BookOpen,
  Send,
  Zap,
  Globe,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface EndpointSpec {
  id: string;
  name: string;
  toolName: string;
  method: 'POST' | 'GET';
  path: string;
  badge: string;
  description: string;
  androidUseCase: string;
  defaultPayload?: any;
  defaultQueryParams?: Record<string, string>;
  kotlinSnippet: string;
  javaSnippet: string;
  curlSnippet: (baseUrl: string) => string;
}

export const AdminApiDocsTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'explorer' | 'android-sdk' | 'security'>('explorer');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('kundli');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Live Sandbox state
  const [sandboxPayload, setSandboxPayload] = useState<string>('');
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState<boolean>(false);
  const [sandboxStatus, setSandboxStatus] = useState<number | null>(null);
  const [sandboxLatency, setSandboxLatency] = useState<number | null>(null);
  const [codeLanguage, setCodeLanguage] = useState<'kotlin' | 'java' | 'curl'>('kotlin');

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.astronava.com';
  const apiBaseUrl = `${originUrl}/api/v1`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const ENDPOINTS: EndpointSpec[] = [
    {
      id: 'kundli',
      name: 'Janam Kundli & Birth Chart Calculation',
      toolName: 'Kundli Maker & Visualizer',
      method: 'POST',
      path: '/api/v1/kundli/calculate',
      badge: 'Core Calculation',
      description: 'Generates complete Vedic Janam Kundli with Lagna (Ascendant), all 9 planetary positions (sign, degree, retrogradation, combustion, dignity), 12 Bhava (houses) with occupant planets, Vimshottari Mahadasha/Antardasha periods, divisional charts (D1, D9 Navamsha, D10 Dashamsha), Yogas, and Doshas.',
      androidUseCase: 'Power the primary Kundli chart screen in Android. Render North/South Indian charts natively using Android Canvas or Jetpack Compose Path/DrawScope.',
      defaultPayload: {
        name: 'Arjun Sharma',
        gender: 'male',
        dob: '1995-11-23',
        tob: '06:45',
        latitude: 28.6139,
        longitude: 77.2090,
        timezoneOffset: 5.5,
        isTobUnknown: false,
        ayanamsha: 'lahiri'
      },
      kotlinSnippet: `// Retrofit 2 Interface
@POST("api/v1/kundli/calculate")
suspend fun calculateKundli(
    @Body request: KundliRequest
): Response<KundliApiResponse>

// Usage inside Android ViewModel / Coroutine Scope:
viewModelScope.launch {
    try {
        val request = KundliRequest(
            name = "Arjun Sharma",
            gender = "male",
            dob = "1995-11-23",
            tob = "06:45",
            latitude = 28.6139,
            longitude = 77.2090,
            timezoneOffset = 5.5
        )
        val response = astronavaApi.calculateKundli(request)
        if (response.isSuccessful && response.body()?.success == true) {
            val kundliData = response.body()!!.data
            _chartState.value = ChartUiState.Success(kundliData)
        }
    } catch (e: Exception) {
        _chartState.value = ChartUiState.Error(e.localizedMessage)
    }
}`,
      javaSnippet: `// OkHttp3 Call
MediaType JSON = MediaType.get("application/json; charset=utf-8");
String jsonBody = "{\\"name\\":\\"Arjun Sharma\\",\\"dob\\":\\"1995-11-23\\",\\"tob\\":\\"06:45\\",\\"latitude\\":28.6139,\\"longitude\\":77.2090,\\"timezoneOffset\\":5.5}";

RequestBody body = RequestBody.create(jsonBody, JSON);
Request request = new Request.Builder()
    .url("${originUrl}/api/v1/kundli/calculate")
    .post(body)
    .addHeader("Content-Type", "application/json")
    .build();

client.newCall(request).enqueue(new Callback() {
    @Override
    public void onResponse(Call call, Response response) throws IOException {
        String responseData = response.body().string();
        // Parse JSON using Gson or Moshi
    }
    @Override
    public void onFailure(Call call, IOException e) {
        e.printStackTrace();
    }
});`,
      curlSnippet: (baseUrl) => `curl -X POST "${baseUrl}/kundli/calculate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Arjun Sharma",
    "gender": "male",
    "dob": "1995-11-23",
    "tob": "06:45",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezoneOffset": 5.5
  }'`
    },
    {
      id: 'horoscope',
      name: 'Daily Horoscope & Transit Analysis',
      toolName: 'Daily Horoscope Engine',
      method: 'POST',
      path: '/api/v1/horoscope/daily',
      badge: 'Daily Feed',
      description: 'Calculates personalized daily predictions based on user birth coordinates and current Gochara planetary transits. Delivers overall score, domain-wise scores (career, love, finance, health, family, spirituality), auspicious hours, lucky colors/numbers, and Vedic remedies.',
      androidUseCase: 'Daily push notifications, Android Home Screen App Widget (Glance / RemoteViews), and Daily Horoscope Feed tab.',
      defaultPayload: {
        name: 'Priya Sharma',
        dob: '1998-04-12',
        tob: '08:30',
        latitude: 28.6139,
        longitude: 77.2090,
        timezoneOffset: 5.5,
        targetDate: new Date().toISOString().split('T')[0]
      },
      kotlinSnippet: `// Retrofit Interface
@POST("api/v1/horoscope/daily")
suspend fun getDailyHoroscope(
    @Body request: HoroscopeRequest
): Response<HoroscopeApiResponse>

// Android Widget / Foreground Sync
suspend fun updateDailyWidget(context: Context) {
    val request = HoroscopeRequest(
        name = userProfile.name,
        dob = userProfile.dob,
        tob = userProfile.tob,
        latitude = userProfile.latitude,
        longitude = userProfile.longitude,
        targetDate = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
    )
    val response = astronavaApi.getDailyHoroscope(request)
    if (response.isSuccessful) {
        val horoscope = response.body()?.data
        // Update App Widget UI with overallScore and luckyNumber
    }
}`,
      javaSnippet: `// Java Retrofit Call
Call<HoroscopeResponse> call = apiService.getDailyHoroscope(horoscopeRequest);
call.enqueue(new Callback<HoroscopeResponse>() {
    @Override
    public void onResponse(Call<HoroscopeResponse> call, Response<HoroscopeResponse> res) {
        if (res.isSuccessful()) {
            HoroscopeData data = res.body().getData();
            // Display daily score and opportunities
        }
    }
    @Override
    public void onFailure(Call<HoroscopeResponse> call, Throwable t) {
        // Handle failure
    }
});`,
      curlSnippet: (baseUrl) => `curl -X POST "${baseUrl}/horoscope/daily" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Priya Sharma",
    "dob": "1998-04-12",
    "tob": "08:30",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezoneOffset": 5.5,
    "targetDate": "${new Date().toISOString().split('T')[0]}"
  }'`
    },
    {
      id: 'gemstones',
      name: 'Vedic Gemstone & Ratna Recommendation',
      toolName: 'Gemstone Recommender',
      method: 'POST',
      path: '/api/v1/gemstones/recommend',
      badge: 'Vedic Remedies',
      description: 'Calculates authentic classical Vedic Ratna prescriptions based on Lagna Lord, 9th Lord (Bhagya), 5th Lord (Punya), and Yogakaraka planets. Returns body weight ratti calculations, ideal metals, fingers, beej mantras, and strictly prohibited gems (Maraka/Shatru).',
      androidUseCase: 'Powers the Gemstone Recommender tool and connects directly to in-app certified gemstone purchasing from the store.',
      defaultPayload: {
        dob: '1995-11-23',
        tob: '06:45',
        latitude: 28.6139,
        longitude: 77.2090,
        timezoneOffset: 5.5,
        weightKg: 68,
        lifeGoal: 'wealth_career'
      },
      kotlinSnippet: `// Retrofit Interface
@POST("api/v1/gemstones/recommend")
suspend fun getGemstoneRecommendations(
    @Body request: GemstoneRequest
): Response<GemstoneApiResponse>

// Example invocation
val req = GemstoneRequest(
    dob = "1995-11-23",
    tob = "06:45",
    latitude = 28.6139,
    longitude = 77.2090,
    weightKg = 68,
    lifeGoal = "wealth_career"
)
val result = apiService.getGemstoneRecommendations(req)`,
      javaSnippet: `// Java OkHttp implementation
RequestBody body = RequestBody.create(
    "{\\"dob\\":\\"1995-11-23\\",\\"tob\\":\\"06:45\\",\\"weightKg\\":68}",
    MediaType.get("application/json")
);
Request request = new Request.Builder()
    .url("${originUrl}/api/v1/gemstones/recommend")
    .post(body)
    .build();`,
      curlSnippet: (baseUrl) => `curl -X POST "${baseUrl}/gemstones/recommend" \\
  -H "Content-Type: application/json" \\
  -d '{
    "dob": "1995-11-23",
    "tob": "06:45",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "weightKg": 68,
    "lifeGoal": "wealth_career"
  }'`
    },
    {
      id: 'match',
      name: 'Ashtakoota 36-Guna Kundli Milan',
      toolName: 'Kundli Milan / Matchmaking',
      method: 'POST',
      path: '/api/v1/match/compatibility',
      badge: 'Relationship Synastry',
      description: 'Calculates the full Ashtakoota 36-Guna compatibility score across Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), and Nadi (8). Checks Manglik Dosha for both partners with classical Vedic cancellation rules, and delivers a definitive verdict.',
      androidUseCase: 'Powers the partner horoscope matching screen in Android with interactive 36-point progress rings and dosha cancellation reports.',
      defaultPayload: {
        p1: {
          name: 'Rohan Verma',
          gender: 'male',
          dob: '1994-08-15',
          tob: '14:20',
          latitude: 28.6139,
          longitude: 77.2090,
          timezoneOffset: 5.5
        },
        p2: {
          name: 'Ananya Sen',
          gender: 'female',
          dob: '1996-03-22',
          tob: '09:15',
          latitude: 19.0760,
          longitude: 72.8777,
          timezoneOffset: 5.5
        }
      },
      kotlinSnippet: `// Retrofit Interface
@POST("api/v1/match/compatibility")
suspend fun calculateMatchCompatibility(
    @Body request: MatchRequest
): Response<MatchApiResponse>

// Calling from Android MatchViewModel
val matchRequest = MatchRequest(
    p1 = partnerOneProfile,
    p2 = partnerTwoProfile
)
val response = astronavaApi.calculateMatchCompatibility(matchRequest)
val totalScore = response.body()?.data?.totalScore // e.g. 28 / 36`,
      javaSnippet: `// Java Match calculation call
Call<MatchApiResponse> call = apiService.calculateMatch(matchRequest);
Response<MatchApiResponse> response = call.execute();
if (response.isSuccessful()) {
    MatchData data = response.body().getData();
    int score = data.getTotalScore();
    String verdict = data.getVerdict();
}`,
      curlSnippet: (baseUrl) => `curl -X POST "${baseUrl}/match/compatibility" \\
  -H "Content-Type: application/json" \\
  -d '{
    "p1": {
      "name": "Rohan Verma",
      "gender": "male",
      "dob": "1994-08-15",
      "tob": "14:20",
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "p2": {
      "name": "Ananya Sen",
      "gender": "female",
      "dob": "1996-03-22",
      "tob": "09:15",
      "latitude": 19.0760,
      "longitude": 72.8777
    }
  }'`
    },
    {
      id: 'numerology',
      name: 'Vedic & Pythagorean Numerology Calculator',
      toolName: 'Numerology Calculator',
      method: 'POST',
      path: '/api/v1/numerology/calculate',
      badge: 'Vibrational Math',
      description: 'Calculates Mulank (Driver/Psychic Number), Bhagyank (Conductor/Destiny Number), Driver-Conductor planetary harmony relationship (Mitra, Sama, Shatru), full Lo Shu 3x3 Grid planes (Mental, Emotional, Practical, Thought, Will, Action), and Personal Year forecast.',
      androidUseCase: 'Powers the Numerology tab, Personal Year timeline cards, and daily lucky numbers in Android.',
      defaultPayload: {
        name: 'Devendra Patel',
        day: 17,
        month: 9,
        year: 1985,
        system: 'chaldean'
      },
      kotlinSnippet: `// Retrofit Interface
@POST("api/v1/numerology/calculate")
suspend fun calculateNumerology(
    @Body request: NumerologyRequest
): Response<NumerologyApiResponse>

// Execution
val response = astronavaApi.calculateNumerology(
    NumerologyRequest(name = "Devendra Patel", day = 17, month = 9, year = 1985)
)
val mulank = response.body()?.data?.coreNumbers?.mulank?.number // 8
val bhagyank = response.body()?.data?.coreNumbers?.bhagyank?.number // 4`,
      javaSnippet: `// Java Numerology request
NumerologyRequest req = new NumerologyRequest("Devendra Patel", 17, 9, 1985, "chaldean");
apiService.calculateNumerology(req).enqueue(new Callback<NumerologyResponse>() {
    @Override
    public void onResponse(Call<NumerologyResponse> call, Response<NumerologyResponse> res) {
        // Display Mulank, Bhagyank, LoShu Grid
    }
    @Override
    public void onFailure(Call<NumerologyResponse> call, Throwable t) {}
});`,
      curlSnippet: (baseUrl) => `curl -X POST "${baseUrl}/numerology/calculate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Devendra Patel",
    "day": 17,
    "month": 9,
    "year": 1985,
    "system": "chaldean"
  }'`
    },
    {
      id: 'name-correction',
      name: 'Vedic Name Correction & Spelling Harmonizer',
      toolName: 'Name Correction & Tuning',
      method: 'POST',
      path: '/api/v1/name-correction/tune',
      badge: 'Spelling Tuning',
      description: 'Calculates name compound vibration using Chaldean and Pythagorean sound values, compares it against the seeker’s Mulank and Bhagyank, and returns algorithmic spelling corrections that elevate the name to auspicious compound numbers (such as 14, 15, 19, 21, 23, 24, 27, 32, 37, 41).',
      androidUseCase: 'Instant live typing feedback in Android EditText/TextField, showing real-time compound score changes and recommended tuned variations.',
      defaultPayload: {
        currentName: 'Amit Shah',
        targetMulank: 1,
        targetBhagyank: 5,
        system: 'chaldean'
      },
      kotlinSnippet: `// Retrofit Interface
@POST("api/v1/name-correction/tune")
suspend fun tuneNameSpelling(
    @Body request: NameTuningRequest
): Response<NameTuningApiResponse>

// Android Coroutines live flow
val tunedResponse = astronavaApi.tuneNameSpelling(
    NameTuningRequest(currentName = "Amit Shah", targetMulank = 1, targetBhagyank = 5)
)`,
      javaSnippet: `// Java Name tuning call
NameTuningRequest req = new NameTuningRequest("Amit Shah", 1, 5, "chaldean");
Response<NameTuningResponse> res = apiService.tuneName(req).execute();`,
      curlSnippet: (baseUrl) => `curl -X POST "${baseUrl}/name-correction/tune" \\
  -H "Content-Type: application/json" \\
  -d '{
    "currentName": "Amit Shah",
    "targetMulank": 1,
    "targetBhagyank": 5,
    "system": "chaldean"
  }'`
    },
    {
      id: 'ai-summary',
      name: 'AI Kundli Summary & Executive Consultation',
      toolName: 'AI Consultation Layer',
      method: 'POST',
      path: '/api/v1/ai/summary',
      badge: 'Gemini AI',
      description: 'Generates synthesized natural-language astrological consultation summaries from calculated chart data. Provides focused advice for career, marriage, health, and personalized spiritual remedies.',
      androidUseCase: 'Powers the "Executive Summary" and "Ask Vedic Scholar" expandable cards in the mobile app.',
      defaultPayload: {
        focus: 'career_wealth',
        depth: 'comprehensive',
        kundliData: {
          ascendant: { signName: 'Scorpio', signNumber: 8, lord: 'Mars' },
          planets: [
            { id: 'sun', signName: 'Scorpio', house: 1, isExalted: false, isDebilitated: false },
            { id: 'jupiter', signName: 'Cancer', house: 9, isExalted: true, isDebilitated: false }
          ]
        }
      },
      kotlinSnippet: `// Retrofit Interface
@POST("api/v1/ai/summary")
suspend fun getAiKundliSummary(
    @Body request: AiSummaryRequest
): Response<AiSummaryApiResponse>`,
      javaSnippet: `// Java OkHttp call for AI summary
RequestBody body = RequestBody.create(jsonPayload, MediaType.get("application/json"));
Request request = new Request.Builder()
    .url("${originUrl}/api/v1/ai/summary")
    .post(body)
    .build();`,
      curlSnippet: (baseUrl) => `curl -X POST "${baseUrl}/ai/summary" \\
  -H "Content-Type: application/json" \\
  -d '{
    "focus": "career_wealth",
    "kundliData": { "ascendant": { "signName": "Scorpio" } }
  }'`
    },
    {
      id: 'store-products',
      name: 'Sacred Store Products & Catalog Feed',
      toolName: 'Astronava Store & Remedies',
      method: 'GET',
      path: '/api/store/products',
      badge: 'E-Commerce Feed',
      description: 'Returns certified natural gemstones, energized Nepali Rudrakshas, sacred Yantras, and astrological crystals. Supports filtering by planetary association, zodiac sign, certification type, and price range.',
      androidUseCase: 'Powers the native Android Store catalog, product detail sheets, and remedy recommendation shopping cards.',
      defaultQueryParams: {
        limit: '10',
        page: '1',
        categorySlug: 'gemstones'
      },
      kotlinSnippet: `// Retrofit Interface
@GET("api/store/products")
suspend fun getStoreProducts(
    @Query("categorySlug") category: String? = null,
    @Query("planet") planet: String? = null,
    @Query("limit") limit: Int = 20
): Response<ProductListResponse>`,
      javaSnippet: `// Java Retrofit call
Call<ProductListResponse> call = apiService.getProducts("gemstones", null, 20);
Response<ProductListResponse> res = call.execute();`,
      curlSnippet: (baseUrl) => `curl -X GET "${baseUrl.replace('/api/v1', '/api')}/store/products?limit=10&page=1"`
    }
  ];

  const currentEndpoint = ENDPOINTS.find((e) => e.id === selectedEndpointId) || ENDPOINTS[0];

  // Initialize sandbox payload when selected endpoint changes
  useEffect(() => {
    if (currentEndpoint.defaultPayload) {
      setSandboxPayload(JSON.stringify(currentEndpoint.defaultPayload, null, 2));
    } else {
      setSandboxPayload('');
    }
    setSandboxResponse(null);
    setSandboxStatus(null);
    setSandboxLatency(null);
  }, [selectedEndpointId]);

  // Execute live sandbox request
  const handleExecuteSandbox = async () => {
    setSandboxLoading(true);
    setSandboxResponse(null);
    setSandboxStatus(null);
    const startTime = performance.now();

    try {
      const url = currentEndpoint.method === 'GET'
        ? (currentEndpoint.path.startsWith('/api/v1') ? `${originUrl}${currentEndpoint.path}` : `${originUrl}${currentEndpoint.path}`)
        : (currentEndpoint.path.startsWith('/api/v1') ? `${originUrl}${currentEndpoint.path}` : `${originUrl}${currentEndpoint.path}`);

      let bodyData: any = undefined;
      if (currentEndpoint.method === 'POST') {
        try {
          bodyData = sandboxPayload ? JSON.parse(sandboxPayload) : {};
        } catch (e: any) {
          setSandboxLoading(false);
          setSandboxStatus(400);
          setSandboxResponse(JSON.stringify({ error: 'Malformed JSON payload: ' + e.message }, null, 2));
          return;
        }
      }

      const res = await fetch(url, {
        method: currentEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'X-Astronava-Client': 'android-admin-sandbox'
        },
        body: currentEndpoint.method === 'POST' ? JSON.stringify(bodyData) : undefined
      });

      const latency = Math.round(performance.now() - startTime);
      setSandboxLatency(latency);
      setSandboxStatus(res.status);

      const data = await res.json();
      setSandboxResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      const latency = Math.round(performance.now() - startTime);
      setSandboxLatency(latency);
      setSandboxStatus(500);
      setSandboxResponse(JSON.stringify({ error: err.message || 'Network error executing sandbox request' }, null, 2));
    } finally {
      setSandboxLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-stone-900 via-amber-950 to-stone-950 text-white shadow-xl relative overflow-hidden border border-amber-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-stone-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider border border-amber-500/30">
                Admin Console Only
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                REST v1.0 Production
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-vedic text-amber-100 tracking-wide">
              Astronava Mobile REST APIs &amp; Android SDK
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              High-precision Vedic calculation engine exposed via standardized JSON endpoints. Designed specifically so your native Android app can execute all astrological, gemstone, numerology, and Kundli computations server-side.
            </p>
          </div>

          {/* Quick Base URL Card */}
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full lg:w-auto shrink-0 space-y-2">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
              <span>Server API Base URL</span>
              <span className="text-emerald-400 font-mono text-[10px]">CORS Enabled</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-2 rounded-xl border border-stone-800">
              <code className="text-xs font-mono text-amber-300 select-all truncate max-w-[280px]">
                {apiBaseUrl}
              </code>
              <button
                onClick={() => handleCopy(apiBaseUrl, 'baseUrl')}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer shrink-0"
                title="Copy Base URL"
              >
                {copiedKey === 'baseUrl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[10px] text-stone-400 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Average calculation latency: &lt; 35ms</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs inside API section */}
        <div className="relative z-10 flex gap-2 pt-6 mt-6 border-t border-white/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('explorer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'explorer'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-stone-300'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Interactive API Explorer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('android-sdk')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'android-sdk'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-stone-300'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android Architecture &amp; Retrofit Guide</span>
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'security'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-stone-300'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Auth &amp; Production Security</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: Interactive API Explorer */}
      {activeSubTab === 'explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Endpoint List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Astrological Tool Endpoints ({ENDPOINTS.length})
              </h3>
            </div>

            <div className="space-y-2">
              {ENDPOINTS.map((endpoint) => {
                const isSelected = endpoint.id === selectedEndpointId;
                return (
                  <button
                    key={endpoint.id}
                    onClick={() => setSelectedEndpointId(endpoint.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-white border-amber-600 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-white/70 hover:bg-white border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        {endpoint.toolName}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                        {endpoint.method}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                      {endpoint.name}
                    </h4>

                    <div className="font-mono text-[10px] text-stone-500 truncate">
                      {endpoint.path}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Endpoint Documentation & Interactive Sandbox */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              {/* Endpoint Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-extrabold bg-emerald-100 text-emerald-800">
                      {currentEndpoint.method}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                      {currentEndpoint.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold font-vedic text-stone-900">
                    {currentEndpoint.name}
                  </h3>
                  <code className="text-xs font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md inline-block">
                    {currentEndpoint.path}
                  </code>
                </div>

                <button
                  onClick={() => handleCopy(`${originUrl}${currentEndpoint.path}`, 'epUrl')}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  {copiedKey === 'epUrl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                  <span>Copy URL</span>
                </button>
              </div>

              {/* Description & Android Use Case */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {currentEndpoint.description}
                </p>

                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                  <Smartphone className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div className="text-xs text-stone-800">
                    <strong className="text-amber-950 font-semibold">Android Implementation Note: </strong>
                    {currentEndpoint.androidUseCase}
                  </div>
                </div>
              </div>

              {/* Multi-language code snippets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-amber-600" />
                    <span>Client Code Snippets</span>
                  </h4>

                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setCodeLanguage('kotlin')}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                        codeLanguage === 'kotlin' ? 'bg-amber-900 text-amber-50 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Kotlin (Retrofit)
                    </button>
                    <button
                      onClick={() => setCodeLanguage('java')}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                        codeLanguage === 'java' ? 'bg-amber-900 text-amber-50 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Java (OkHttp)
                    </button>
                    <button
                      onClick={() => setCodeLanguage('curl')}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                        codeLanguage === 'curl' ? 'bg-amber-900 text-amber-50 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      cURL
                    </button>
                  </div>
                </div>

                <div className="relative rounded-2xl bg-stone-950 p-4 border border-stone-800 text-white font-mono text-xs overflow-x-auto shadow-inner">
                  <button
                    onClick={() => {
                      const snippet =
                        codeLanguage === 'kotlin'
                          ? currentEndpoint.kotlinSnippet
                          : codeLanguage === 'java'
                          ? currentEndpoint.javaSnippet
                          : currentEndpoint.curlSnippet(apiBaseUrl);
                      handleCopy(snippet, 'codeSnippet');
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                    title="Copy Code"
                  >
                    {copiedKey === 'codeSnippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <pre className="pr-10 leading-relaxed text-stone-200">
                    {codeLanguage === 'kotlin' && currentEndpoint.kotlinSnippet}
                    {codeLanguage === 'java' && currentEndpoint.javaSnippet}
                    {codeLanguage === 'curl' && currentEndpoint.curlSnippet(apiBaseUrl)}
                  </pre>
                </div>
              </div>

              {/* LIVE SANDBOX: Test Endpoint Right in Admin */}
              <div className="pt-4 border-t border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Live Test Sandbox
                    </h4>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    Test live calculations against the local / production server
                  </span>
                </div>

                {currentEndpoint.method === 'POST' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 flex items-center justify-between">
                      <span>Request Payload (JSON)</span>
                      <button
                        onClick={() => setSandboxPayload(JSON.stringify(currentEndpoint.defaultPayload, null, 2))}
                        className="text-[11px] text-amber-700 hover:underline cursor-pointer"
                      >
                        Reset to default payload
                      </button>
                    </label>
                    <textarea
                      rows={7}
                      value={sandboxPayload}
                      onChange={(e) => setSandboxPayload(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-300 font-mono text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExecuteSandbox}
                    disabled={sandboxLoading}
                    className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-50 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {sandboxLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Calculating On Server...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Send Live Request</span>
                      </>
                    )}
                  </button>

                  {sandboxStatus !== null && (
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold ${
                          sandboxStatus === 200
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        HTTP {sandboxStatus}
                      </span>
                      {sandboxLatency !== null && (
                        <span className="text-stone-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {sandboxLatency} ms
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Response Output */}
                {sandboxResponse && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-stone-700">
                        Server JSON Response
                      </label>
                      <button
                        onClick={() => handleCopy(sandboxResponse, 'sandboxRes')}
                        className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'sandboxRes' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Response</span>
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto rounded-2xl bg-stone-950 p-4 border border-stone-800 text-stone-200 font-mono text-xs shadow-inner">
                      <pre>{sandboxResponse}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Android SDK & Architecture Guide */}
      {activeSubTab === 'android-sdk' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Official Android Architecture Blueprint
              </span>
              <h3 className="text-2xl font-bold font-vedic text-stone-900">
                Building the Server-Based Android App
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Follow this recommended production pattern using Retrofit 2, OkHttp, Kotlin Coroutines, and MVVM / MVI architecture. This keeps the Android APK lightweight (~5-8 MB) while delegating all astronomical ephemeris and astrological math to the Astronava backend.
              </p>
            </div>

            {/* Step 1: build.gradle.kts */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-extrabold">1</span>
                <span>Gradle Dependencies (`app/build.gradle.kts`)</span>
              </h4>
              <div className="rounded-2xl bg-stone-950 p-4 font-mono text-xs text-stone-200 relative overflow-x-auto">
                <button
                  onClick={() =>
                    handleCopy(
                      `dependencies {
    // Retrofit & Networking
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.2")

    // Jetpack Compose & Material 3
    implementation("androidx.compose.material3:material3:1.2.1")
}`,
                      'gradle'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  {copiedKey === 'gradle' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre>{`dependencies {
    // Retrofit & Networking
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.2")

    // Jetpack Compose & Material 3
    implementation("androidx.compose.material3:material3:1.2.1")
}`}</pre>
              </div>
            </div>

            {/* Step 2: Retrofit Client Builder */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-extrabold">2</span>
                <span>Network Client Builder (`NetworkModule.kt`)</span>
              </h4>
              <div className="rounded-2xl bg-stone-950 p-4 font-mono text-xs text-stone-200 relative overflow-x-auto">
                <button
                  onClick={() =>
                    handleCopy(
                      `object NetworkModule {
    private const val BASE_URL = "${apiBaseUrl}/"

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(20, TimeUnit.SECONDS)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("X-Astronava-Client", "android-native-app")
                .addHeader("Accept", "application/json")
                .build()
            chain.proceed(request)
        }
        .build()

    val apiService: AstronavaApiService = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(AstronavaApiService::class.java)
}`,
                      'netmod'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  {copiedKey === 'netmod' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre>{`object NetworkModule {
    private const val BASE_URL = "${apiBaseUrl}/"

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(20, TimeUnit.SECONDS)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("X-Astronava-Client", "android-native-app")
                .addHeader("Accept", "application/json")
                .build()
            chain.proceed(request)
        }
        .build()

    val apiService: AstronavaApiService = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(AstronavaApiService::class.java)
}`}</pre>
              </div>
            </div>

            {/* Step 3: Complete AstronavaApiService.kt */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-extrabold">3</span>
                <span>Complete Retrofit API Interface (`AstronavaApiService.kt`)</span>
              </h4>
              <div className="rounded-2xl bg-stone-950 p-4 font-mono text-xs text-stone-200 relative overflow-x-auto">
                <button
                  onClick={() =>
                    handleCopy(
                      `interface AstronavaApiService {
    // 1. Kundli Generator
    @POST("kundli/calculate")
    suspend fun calculateKundli(@Body request: KundliRequest): Response<KundliApiResponse>

    // 2. Daily Horoscope & Transits
    @POST("horoscope/daily")
    suspend fun getDailyHoroscope(@Body request: HoroscopeRequest): Response<HoroscopeApiResponse>

    // 3. Gemstone Recommender
    @POST("gemstones/recommend")
    suspend fun getGemstoneRecommendations(@Body request: GemstoneRequest): Response<GemstoneApiResponse>

    // 4. Kundli Milan (Matchmaking)
    @POST("match/compatibility")
    suspend fun calculateMatch(@Body request: MatchRequest): Response<MatchApiResponse>

    // 5. Numerology Calculator
    @POST("numerology/calculate")
    suspend fun calculateNumerology(@Body request: NumerologyRequest): Response<NumerologyApiResponse>

    // 6. Name Correction & Harmonizer
    @POST("name-correction/tune")
    suspend fun tuneName(@Body request: NameTuningRequest): Response<NameTuningApiResponse>

    // 7. AI Consultation & Summary
    @POST("ai/summary")
    suspend fun getAiSummary(@Body request: AiSummaryRequest): Response<AiSummaryApiResponse>
}`,
                      'apiInt'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  {copiedKey === 'apiInt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre>{`interface AstronavaApiService {
    // 1. Kundli Generator
    @POST("kundli/calculate")
    suspend fun calculateKundli(@Body request: KundliRequest): Response<KundliApiResponse>

    // 2. Daily Horoscope & Transits
    @POST("horoscope/daily")
    suspend fun getDailyHoroscope(@Body request: HoroscopeRequest): Response<HoroscopeApiResponse>

    // 3. Gemstone Recommender
    @POST("gemstones/recommend")
    suspend fun getGemstoneRecommendations(@Body request: GemstoneRequest): Response<GemstoneApiResponse>

    // 4. Kundli Milan (Matchmaking)
    @POST("match/compatibility")
    suspend fun calculateMatch(@Body request: MatchRequest): Response<MatchApiResponse>

    // 5. Numerology Calculator
    @POST("numerology/calculate")
    suspend fun calculateNumerology(@Body request: NumerologyRequest): Response<NumerologyApiResponse>

    // 6. Name Correction & Harmonizer
    @POST("name-correction/tune")
    suspend fun tuneName(@Body request: NameTuningRequest): Response<NameTuningApiResponse>

    // 7. AI Consultation & Summary
    @POST("ai/summary")
    suspend fun getAiSummary(@Body request: AiSummaryRequest): Response<AiSummaryApiResponse>
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Auth & Production Security */}
      {activeSubTab === 'security' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              Security &amp; Best Practices
            </span>
            <h3 className="text-2xl font-bold font-vedic text-stone-900">
              Authentication &amp; Production Hardening
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              When releasing your Android app on Google Play, follow these guidelines to protect your server resources and ensure seamless user privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1. Client Header Identification</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Send <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">X-Astronava-Client: android-release-1.0</code> with every request. This allows admin telemetry to track mobile user adoption and filter server logs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>2. User Account Authentication</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                For authenticated users, pass Firebase ID Tokens in the header:
                <code className="block mt-1 bg-stone-200 p-1.5 rounded text-[11px] font-mono">Authorization: Bearer &lt;idToken&gt;</code>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3. Offline Caching with Room DB</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Store the generated Kundli response in an Android Room database table. Seeker charts don’t change (birth time is fixed), so you only need to call <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">/kundli/calculate</code> once per profile!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>4. Background Sync via WorkManager</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Schedule a daily WorkManager job at 6:00 AM to fetch <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">/horoscope/daily</code>. This powers the notification and Glance Widget without draining user battery.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
