import { Router, Response } from 'express';
import { requireAdmin, AuthRequest } from '../middleware/auth.ts';
import {
  getAllApiKeys,
  createApiKey,
  toggleApiKeyStatus,
  deleteApiKey,
  queryApiLogs,
  clearAllApiLogs,
  getApiMetricsSummary,
} from './apiKeyStore.ts';
import { getInternalApiDocs, getOpenApiSpecification } from './apiDocumentationGenerator.ts';

export const adminApiRouter = Router();

// Strict Admin Gate: Only authenticated admin users (himaghnamedhi1@gmail.com) can access
adminApiRouter.use(requireAdmin);

/**
 * GET /api/admin/api-keys
 * List all configured API keys (masked tokens)
 */
adminApiRouter.get('/keys', (req: AuthRequest, res: Response) => {
  try {
    const keys = getAllApiKeys();
    res.json({ success: true, keys, total: keys.length });
  } catch (error: any) {
    console.error('Failed to list API keys:', error);
    res.status(500).json({ error: error.message || 'Failed to list API keys' });
  }
});

/**
 * POST /api/admin/api-keys
 * Provision a new API Key for Android/client integrations.
 * Returns the plaintext key token ONCE.
 */
adminApiRouter.post('/keys', (req: AuthRequest, res: Response) => {
  try {
    const { name, environment, rateLimit, allowedScopes, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Key name is required' });
    }

    const env = environment === 'sandbox' ? 'sandbox' : 'production';
    const limitNum = Number(rateLimit) > 0 ? Number(rateLimit) : 120;
    const scopes = Array.isArray(allowedScopes) && allowedScopes.length > 0 ? allowedScopes : ['*'];

    const { keyRecord, secretKey } = createApiKey({
      name,
      environment: env,
      rateLimit: limitNum,
      allowedScopes: scopes,
      description,
    });

    res.status(201).json({
      success: true,
      key: keyRecord,
      secretKey,
      warning: 'This is the only time the full secret key is displayed. Store it securely in your client repository or secrets manager.',
    });
  } catch (error: any) {
    console.error('Failed to create API key:', error);
    res.status(500).json({ error: error.message || 'Failed to generate API key' });
  }
});

/**
 * PATCH /api/admin/api-keys/:id/toggle
 * Revoke or reactivate an API key
 */
adminApiRouter.patch('/keys/:id/toggle', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = toggleApiKeyStatus(id);

    if (!updated) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({
      success: true,
      key: updated,
      message: `API key ${updated.status === 'active' ? 'activated' : 'revoked'} successfully`,
    });
  } catch (error: any) {
    console.error('Failed to toggle API key:', error);
    res.status(500).json({ error: error.message || 'Failed to update API key status' });
  }
});

/**
 * DELETE /api/admin/api-keys/:id
 * Permanently delete an API key
 */
adminApiRouter.delete('/keys/:id', (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = deleteApiKey(id);

    if (!deleted) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({ success: true, message: 'API key permanently removed' });
  } catch (error: any) {
    console.error('Failed to delete API key:', error);
    res.status(500).json({ error: error.message || 'Failed to delete API key' });
  }
});

/**
 * GET /api/admin/api-logs
 * Fetch real-time audit logs with filtering and pagination
 */
adminApiRouter.get('/logs', (req: AuthRequest, res: Response) => {
  try {
    const { search, endpoint, statusCode, keyId, limit, offset } = req.query;

    const result = queryApiLogs({
      search: search as string,
      endpoint: endpoint as string,
      statusCode: statusCode ? Number(statusCode) : undefined,
      keyId: keyId as string,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
    });

    res.json({
      success: true,
      logs: result.logs,
      total: result.total,
    });
  } catch (error: any) {
    console.error('Failed to query API logs:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve usage logs' });
  }
});

/**
 * DELETE /api/admin/api-logs
 * Clear log ring buffer
 */
adminApiRouter.delete('/logs', (req: AuthRequest, res: Response) => {
  try {
    clearAllApiLogs();
    res.json({ success: true, message: 'Audit telemetry log cleared' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to clear logs' });
  }
});

/**
 * GET /api/admin/api-metrics
 * Aggregated telemetry metrics for admin dashboard
 */
adminApiRouter.get('/metrics', (_req: AuthRequest, res: Response) => {
  try {
    const metrics = getApiMetricsSummary();
    res.json({ success: true, metrics });
  } catch (error: any) {
    console.error('Failed to get API metrics:', error);
    res.status(500).json({ error: error.message || 'Failed to compute API metrics' });
  }
});

/**
 * GET /api/admin/api/docs
 * Programmatically generates and serves internal endpoint API documentation
 * and OpenAPI 3.0 specifications for authenticated admins only.
 */
adminApiRouter.get('/docs', (req: AuthRequest, res: Response) => {
  try {
    const origin = `${req.protocol}://${req.get('host') || 'www.astronava.com'}`;
    const format = req.query.format;
    if (format === 'openapi' || format === 'swagger') {
      const openApiSpec = getOpenApiSpecification(origin);
      return res.json(openApiSpec);
    }
    const docs = getInternalApiDocs(origin);
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      serverVersion: '1.0.0',
      totalEndpoints: docs.endpoints.length,
      categories: docs.categories,
      endpoints: docs.endpoints,
    });
  } catch (error: any) {
    console.error('Failed to generate API docs:', error);
    res.status(500).json({ error: error.message || 'Failed to generate API documentation' });
  }
});

