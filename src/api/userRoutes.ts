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

    const birthDetails = req.body;
    if (!birthDetails || !birthDetails.dob || !birthDetails.tob) {
      return res.status(400).json({ error: 'Valid birth details (dob, tob, latitude, longitude) required' });
    }

    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.set(
      {
        birthDetails,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const kundliData = generateCompleteKundli(birthDetails);
    res.json({ success: true, message: 'Birth details saved successfully', birthDetails, kundliData });
  } catch (error: any) {
    console.error('Failed to save user birth details via API:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});
