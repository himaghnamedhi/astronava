import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

export const getUserProfile = functions.https.onRequest(async (req, res) => {
  // CORS handling
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.status(204).send('');
    return;
  }

  // Authentication check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Fetch user profile from Firestore
    const userSnap = await db.doc(`users/${uid}`).get();

    if (!userSnap.exists) {
      res.status(404).send({ error: 'User profile not found' });
      return;
    }

    res.status(200).send(userSnap.data());
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});
