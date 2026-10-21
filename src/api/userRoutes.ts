import { Router } from 'express';
import { verifyFirebaseToken, AuthenticatedRequest } from '../services/api/auth.ts';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { generateCompleteKundli } from '../data/vedicEphemeris.ts';

export const userRouter = Router();

const db = getFirestore();

// GET /api/user/kundli - Fetch authenticated user's birth details and calculated kundli
userRouter.get('/kundli', verifyFirebaseToken, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized user ID' });
    }

    const userDocRef = db.collection('users').doc(uid);
    const userSnap = await userDocRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'User profile or birth details not found in database' });
    }

    const userData = userSnap.data();
    const birthDetails = userData?.birthDetails;

    if (!birthDetails) {
      return res.status(404).json({ error: 'Birth details not configured for this user' });
    }

    const kundliData = generateCompleteKundli(birthDetails);
    res.json({ success: true, birthDetails, kundliData });
  } catch (error: any) {
    console.error('Failed to fetch user kundli via API:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/user/birth-details - Save or update authenticated user's birth details
userRouter.post('/birth-details', verifyFirebaseToken, async (req: AuthenticatedRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized user ID' });
    }

    const raw = req.body;
    if (!raw || typeof raw !== 'object' || typeof raw.dob !== 'string' || typeof raw.tob !== 'string') {
      return res.status(400).json({ error: 'Valid birth details (dob, tob, latitude, longitude) required' });
    }

    const lat = Number(raw.latitude);
    const lon = Number(raw.longitude);
    const tz = Number(raw.timezoneOffset ?? 5.5);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
      return res.status(400).json({ error: 'Latitude and longitude must be valid geographic coordinates' });
    }

    const birthDetails = {
      name: String(raw.name || 'Native').slice(0, 100),
      dob: String(raw.dob).slice(0, 10),
      tob: String(raw.tob).slice(0, 10),
      birthPlace: String(raw.birthPlace || raw.city || '').slice(0, 150),
      city: String(raw.city || raw.birthPlace || '').slice(0, 150),
      latitude: lat,
      longitude: lon,
      timezoneOffset: Number.isFinite(tz) && tz >= -14 && tz <= 14 ? tz : 5.5,
      gender: raw.gender === 'female' || raw.gender === 'other' ? raw.gender : 'male',
      isTobUnknown: Boolean(raw.isTobUnknown),
    };

    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.set(
      {
        birthDetails,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const kundliData = generateCompleteKundli(birthDetails as any);
    res.json({ success: true, message: 'Birth details saved successfully', birthDetails, kundliData });
  } catch (error: any) {
    console.error('Failed to save user birth details via API:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});
