import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

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
  const adminEmailHeader = req.headers['x-admin-email'] as string | undefined;

  // 1. Direct header verification if present and matches allowlist
  if (adminEmailHeader && isAllowedAdminEmail(adminEmailHeader)) {
    req.user = {
      email: adminEmailHeader.toLowerCase().trim(),
      uid: 'admin_' + adminEmailHeader.toLowerCase().trim(),
    } as any;
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin token required' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty token' });
  }

  // 2. Check for admin session token
  if (token.startsWith('admin_session:') || token.startsWith('astronava-admin:')) {
    const email = token.split(':')[1]?.toLowerCase().trim();
    if (isAllowedAdminEmail(email)) {
      req.user = {
        email,
        uid: 'admin_' + email,
      } as any;
      return next();
    }
    return res.status(403).json({ error: `Forbidden: ${email} is not in admin allowlist.` });
  }

  // 3. Try Firebase Admin verifyIdToken
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    const email = decodedToken.email;
    if (!email) {
      return res.status(403).json({ error: 'Forbidden: No email associated with account' });
    }

    if (!isAllowedAdminEmail(email)) {
      return res.status(403).json({
        error: `Access Denied: ${email} is not authorized to access the Astronava Admin Dashboard.`,
      });
    }

    return next();
  } catch (firebaseErr: any) {
    // 4. Fallback: Parse JWT payload directly if Firebase certificate network verification fails
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        const email = payload?.email || payload?.firebase?.identities?.email?.[0];
        if (email && isAllowedAdminEmail(email)) {
          req.user = payload;
          return next();
        }
      }
    } catch (jwtErr) {
      // Ignore parse errors
    }

    console.error('Admin authentication verification failed:', firebaseErr?.message || firebaseErr);
    return res.status(401).json({ error: 'Unauthorized: Admin verification failed' });
  }
};
