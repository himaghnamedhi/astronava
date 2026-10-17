import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import firebaseConfig from '../../../firebase-applet-config.json';

const firebaseAdminInstance = (admin as any).default || admin;

if (!firebaseAdminInstance.apps || firebaseAdminInstance.apps.length === 0) {
  firebaseAdminInstance.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Express middleware to verify Firebase ID tokens passed in the Authorization Bearer header.
 * Secures API endpoints for both the website and mobile app.
 */
export async function verifyFirebaseToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await firebaseAdminInstance.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error: any) {
    console.error('Firebase token verification failed:', error);
    return res.status(403).json({ error: 'Forbidden: Invalid or expired Firebase ID token' });
  }
}
