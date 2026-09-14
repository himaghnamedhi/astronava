import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { generateKundliAiSummary } from './src/server/geminiAstrology';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
