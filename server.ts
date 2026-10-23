import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { generateKundliAiSummary, generateFullAstrologyReportWithAi } from './src/server/geminiAstrology.ts';
import {
  generateClientSitemapXml,
  generateSitemapIndexXml,
  generateSectionSitemapXml,
  SITEMAP_SECTIONS,
} from './src/utils/sitemap.ts';
import { storeRouter, adminRouter } from './src/server/storeRoutes.ts';
import { seedStoreIfEmpty } from './src/server/storeDb.ts';
import { horoscopeRouter } from './src/server/horoscopeRoutes.ts';
import { userRouter } from './src/api/userRoutes.ts';
import { GoogleGenAI, Type } from '@google/genai';
import { generateCompleteKundli } from './src/data/vedicEphemeris.ts';
import { calculateVedAstroMatch } from './src/data/vedicMatchCalculator.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.disable('x-powered-by');

  // Security HTTP headers middleware
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=(), camera=()');
    next();
  });

  app.use(express.json({ limit: '256kb' }));

  // Lightweight sliding-window rate limiter to protect AI and transactional endpoints
  const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
  const createRateLimiter = (maxRequests: number, windowMs: number) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
      const key = `${req.baseUrl || ''}${req.path}:${ip}`;
      const now = Date.now();
      const entry = rateLimitBuckets.get(key);
      if (!entry || now > entry.resetAt) {
        rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
        return next();
      }
      if (entry.count >= maxRequests) {
        return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
      }
      entry.count += 1;
      return next();
    };
  };

  const aiRateLimiter = createRateLimiter(15, 60 * 1000); // 15 req / min per IP
  const storeActionLimiter = createRateLimiter(30, 60 * 1000); // 30 req / min per IP

  // Initialize seed data for the store
  seedStoreIfEmpty().catch((err) => {
    console.error('Initial store database seeding note:', err);
  });

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Astronava Store API Routes
  app.use('/api/store/orders', storeActionLimiter);
  app.use('/api/store/coupons', storeActionLimiter);
  app.use('/api/store', storeRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/horoscope/generate', aiRateLimiter);
  app.use('/api/horoscope', horoscopeRouter);
  app.use('/api/user', userRouter);

  // Helper to determine canonical base URL from request
  const getRequestBaseUrl = (req: express.Request) => {
    const host = req.get('host') || 'www.astronava.com';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    return host.includes('localhost') ? `${protocol}://${host}` : 'https://www.astronava.com';
  };

  // Master Sitemap Index Endpoint (sitemaps.org <sitemapindex>)
  app.get('/sitemap-index.xml', (req, res) => {
    try {
      const baseUrl = getRequestBaseUrl(req);
      const xml = generateSitemapIndexXml(baseUrl);
      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=3600');
      res.send(xml);
    } catch (error) {
      console.error('Failed to generate sitemap-index.xml:', error);
      res.status(500).send('Error generating sitemap index');
    }
  });

  // Section-Specific Sitemap Endpoints (e.g. /sitemap-tools.xml, /sitemap-store.xml)
  app.get('/sitemap-:section.xml', (req, res, next) => {
    try {
      const sectionId = req.params.section;
      const matchedSection = SITEMAP_SECTIONS.find(
        (s) => s.id === sectionId || s.filename === `sitemap-${sectionId}.xml`
      );
      if (!matchedSection) {
        return next();
      }
      const baseUrl = getRequestBaseUrl(req);
      const xml = generateSectionSitemapXml(matchedSection.id, baseUrl);
      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=3600');
      res.send(xml);
    } catch (error) {
      console.error(`Failed to generate sitemap-${req.params.section}.xml:`, error);
      res.status(500).send('Error generating section sitemap');
    }
  });

  // Comprehensive XML Sitemap Endpoint for Web Crawlers and Google Search Console
  app.get('/sitemap.xml', (req, res) => {
    try {
      const baseUrl = getRequestBaseUrl(req);
      const xml = generateClientSitemapXml(baseUrl);
      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=3600');
      res.send(xml);
    } catch (error) {
      console.error('Failed to generate sitemap.xml:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Robots.txt Directives for Google Search Console & Search Crawlers
  app.get('/robots.txt', (req, res) => {
    const baseUrl = getRequestBaseUrl(req);
    const robotsTxt = [
      '# Astronava Vedic Astrology - Search Crawler Directives',
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/',
      'Disallow: /admin',
      'Disallow: /store/admin',
      '',
      `Sitemap: ${baseUrl}/sitemap-index.xml`,
      `Sitemap: ${baseUrl}/sitemap.xml`,
      'Sitemap: https://www.astronava.com/sitemap-index.xml',
      'Sitemap: https://www.astronava.com/sitemap.xml',
    ].join('\n');
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=86400');
    res.send(robotsTxt);
  });

  // Google AdSense Authorized Digital Sellers (ads.txt)
  app.get('/ads.txt', (req, res) => {
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send('google.com, pub-2625017224504863, DIRECT, f08c47fec0942fa0\n');
  });

  // AI Kundli Summary Endpoint
  app.post('/api/ai/summarize-kundli', aiRateLimiter, async (req, res) => {
    try {
      const { kundliData, focus, depth } = req.body;
      if (!kundliData || typeof kundliData !== 'object') {
        return res.status(400).json({ error: 'Kundli data is required' });
      }

      const safeFocus = typeof focus === 'string' ? focus.slice(0, 60) : undefined;
      const safeDepth = typeof depth === 'string' ? depth.slice(0, 60) : undefined;
      const summary = await generateKundliAiSummary(kundliData, safeFocus, safeDepth);
      res.json(summary);
    } catch (error: any) {
      console.error('AI Summary generation failed:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI summary' });
    }
  });

  // Comprehensive Full Astrology Report Endpoint
  app.post('/api/ai/full-astrology-report', aiRateLimiter, async (req, res) => {
    try {
      const { kundliData, forecastYears } = req.body;
      if (!kundliData || typeof kundliData !== 'object') {
        return res.status(400).json({ error: 'Kundli data is required' });
      }

      const boundedYears = Math.min(10, Math.max(1, Number(forecastYears) || 3));
      const report = await generateFullAstrologyReportWithAi(kundliData, boundedYears as 1 | 2 | 3 | 5);
      res.json(report);
    } catch (error: any) {
      console.error('Full Astrology Report generation failed:', error);
      res.status(500).json({ error: 'Failed to generate full astrology report' });
    }
  });

  // Real-time Planet or House Insight Endpoint using Gemini
  app.post('/api/ai/planet-house-insight', aiRateLimiter, async (req, res) => {
    try {
      const { targetType, targetId, placements } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({ error: 'Gemini API key not configured' });
      }

      const safeTargetType = String(targetType || 'planet').slice(0, 30);
      const safeTargetId = String(targetId || '').slice(0, 50);
      const safePlacements = JSON.stringify(placements || {}).slice(0, 8000);

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Provide classical Vedic astrology insights for ${safeTargetType} ID "${safeTargetId}" given chart placements: ${safePlacements}. Return JSON with fields: title, subtitle, bulletPoints (array of 3 strings), remedy.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              remedy: { type: Type.STRING },
            },
            required: ['title', 'subtitle', 'bulletPoints', 'remedy'],
          },
        },
      });

      if (response.text) {
        res.json(JSON.parse(response.text.trim()));
      } else {
        res.status(500).json({ error: 'Empty AI response' });
      }
    } catch (error: any) {
      console.error('Planet/House insight generation failed:', error);
      res.status(500).json({ error: 'Failed to generate insight' });
    }
  });

  // AI Match Analysis & Synastry Endpoint using Gemini
  app.post('/api/ai/match-analysis', aiRateLimiter, async (req, res) => {
    try {
      const { matchReport, p1, p2 } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({ error: 'Gemini API key not configured' });
      }

      const safeP1Name = String(p1?.name || 'Partner 1').slice(0, 80);
      const safeP2Name = String(p2?.name || 'Partner 2').slice(0, 80);
      const safeMatchReport = JSON.stringify(matchReport || {}).slice(0, 10000);

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze the Vedic Guna Milan and synastry compatibility between ${safeP1Name} and ${safeP2Name}. 
Match Report data: ${safeMatchReport}. 
Return JSON with fields: 
- executiveSummary (string)
- synastryStrengths (array of objects with domain and description)
- potentialChallenges (array of objects with domain and advice)
- overallCompatibilityVerdict (string)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              synastryStrengths: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { domain: { type: Type.STRING }, description: { type: Type.STRING } },
                  required: ['domain', 'description'],
                },
              },
              potentialChallenges: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { domain: { type: Type.STRING }, advice: { type: Type.STRING } },
                  required: ['domain', 'advice'],
                },
              },
              overallCompatibilityVerdict: { type: Type.STRING },
            },
            required: ['executiveSummary', 'synastryStrengths', 'potentialChallenges', 'overallCompatibilityVerdict'],
          },
        },
      });

      if (response.text) {
        res.json(JSON.parse(response.text.trim()));
      } else {
        res.status(500).json({ error: 'Empty AI response' });
      }
    } catch (error: any) {
      console.error('Match analysis generation failed:', error);
      res.status(500).json({ error: 'Failed to generate match analysis' });
    }
  });

  // Mobile App API Endpoints for External App Sync
  app.post('/api/mobile/kundli', (req, res) => {
    try {
      const birthDetails = req.body;
      if (!birthDetails || !birthDetails.dob || !birthDetails.tob) {
        return res.status(400).json({ error: 'Valid birth details (dob, tob, latitude, longitude) required' });
      }
      const kundliData = generateCompleteKundli(birthDetails);
      res.json({ success: true, kundliData });
    } catch (err: any) {
      console.error('Mobile API Kundli generation failed:', err);
      res.status(500).json({ error: err.message || 'Failed to generate Kundli' });
    }
  });

  app.post('/api/mobile/match', (req, res) => {
    try {
      const { p1, p2 } = req.body;
      if (!p1 || !p2) {
        return res.status(400).json({ error: 'Both partner birth details (p1, p2) are required' });
      }
      const matchReport = calculateVedAstroMatch(p1, p2);
      res.json({ success: true, matchReport });
    } catch (err: any) {
      console.error('Mobile API Match generation failed:', err);
      res.status(500).json({ error: err.message || 'Failed to generate match report' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Astronava server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
