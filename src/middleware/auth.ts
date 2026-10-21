import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db/index.ts';
import { sellers } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireSeller = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // First, authenticate the user
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty token' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (!decodedToken.email_verified) {
      return res.status(403).json({ error: 'Forbidden: Verified email required' });
    }
    req.user = decodedToken;

    // Check if seller
    const s = await db.select().from(sellers).where(eq(sellers.userId, decodedToken.uid)).limit(1);
    if (s.length === 0 || s[0].status !== 'approved') {
      return res.status(403).json({ error: 'Forbidden: Seller not approved' });
    }

    // Attach seller info to request
    (req as any).seller = s[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Configured admin email allowlist
export const ADMIN_EMAILS: string[] = [
  'himaghnamedhi1@gmail.com',
  ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase()) : []),
];

export const isAllowedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty token' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin token required' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty token' });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    const email = decodedToken.email;
    if (!email || !decodedToken.email_verified) {
      return res.status(403).json({ error: 'Forbidden: Verified administrator email required' });
    }

    if (!isAllowedAdminEmail(email)) {
      return res.status(403).json({
        error: `Access Denied: ${email} is not authorized to access the Astronava Admin Dashboard.`,
      });
    }

    return next();
  } catch (firebaseErr: any) {
    console.error('Admin authentication verification failed:', firebaseErr?.message || firebaseErr);
    return res.status(401).json({ error: 'Unauthorized: Admin verification failed' });
  }
};
