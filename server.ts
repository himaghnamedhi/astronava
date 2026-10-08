import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { generateKundliAiSummary, generateFullAstrologyReportWithAi } from './src/server/geminiAstrology';
import { generateClientSitemapXml } from './src/utils/sitemap';
import { storeRouter, adminRouter } from './src/server/storeRoutes.ts';
import { seedStoreIfEmpty } from './src/server/storeDb.ts';
import { horoscopeRouter } from './src/server/horoscopeRoutes';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize seed data for the store
  seedStoreIfEmpty().catch((err) => {
    console.error('Initial store database seeding note:', err);
  });

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Astronava Store API Routes
  app.use('/api/store', storeRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/horoscope', horoscopeRouter);

  // Dynamic XML Sitemap Endpoint for Web Crawlers and Search Engines
  app.get('/sitemap.xml', (req, res) => {
    try {
      const xml = generateClientSitemapXml();
      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.send(xml);
    } catch (error) {
      console.error('Failed to generate sitemap.xml:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Google AdSense Authorized Digital Sellers (ads.txt)
  app.get('/ads.txt', (req, res) => {
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send('google.com, pub-2625017224504863, DIRECT, f08c47fec0942fa0\n');
  });

  // AI Kundli Summary Endpoint
  app.post('/api/ai/summarize-kundli', async (req, res) => {
    try {
      const { kundliData, focus, depth } = req.body;
      if (!kundliData) {
        return res.status(400).json({ error: 'Kundli data is required' });
      }

      const summary = await generateKundliAiSummary(kundliData, focus, depth);
      res.json(summary);
    } catch (error: any) {
      console.error('AI Summary generation failed:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI summary' });
    }
  });

  // Comprehensive Full Astrology Report Endpoint
  app.post('/api/ai/full-astrology-report', async (req, res) => {
    try {
      const { kundliData, forecastYears } = req.body;
      if (!kundliData) {
        return res.status(400).json({ error: 'Kundli data is required' });
      }

      const report = await generateFullAstrologyReportWithAi(kundliData, forecastYears || 3);
      res.json(report);
    } catch (error: any) {
      console.error('Full Astrology Report generation failed:', error);
      res.status(500).json({ error: error.message || 'Failed to generate full astrology report' });
    }
  });

  // Real-time Planet or House Insight Endpoint using Gemini
  app.post('/api/ai/planet-house-insight', async (req, res) => {
    try {
      const { targetType, targetId, placements } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({ error: 'Gemini API key not configured' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Provide classical Vedic astrology insights for ${targetType} ID "${targetId}" given chart placements: ${JSON.stringify(placements)}. Return JSON with fields: title, subtitle, bulletPoints (array of 3 strings), remedy.`;

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
      res.status(500).json({ error: error.message || 'Failed to generate insight' });
    }
  });

  // AI Match Analysis & Synastry Endpoint using Gemini
  app.post('/api/ai/match-analysis', async (req, res) => {
    try {
      const { matchReport, p1, p2 } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({ error: 'Gemini API key not configured' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze the Vedic Guna Milan and synastry compatibility between ${p1?.name || 'Partner 1'} and ${p2?.name || 'Partner 2'}. 
Match Report data: ${JSON.stringify(matchReport)}. 
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
      res.status(500).json({ error: error.message || 'Failed to generate match analysis' });
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
