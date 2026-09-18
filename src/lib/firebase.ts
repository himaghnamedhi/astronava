import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  collection, 
  where, 
  orderBy, 
  deleteDoc, 
  serverTimestamp, 
  Timestamp,
  getDocFromServer,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Connect to the specific firestoreDatabaseId from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot as required by Firebase skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Match Submission Data Types
export interface PartnerData {
  name: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  tob: string;
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
  city: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
}

export interface StoredMatchSubmission {
  id: string;
  partner1: PartnerData;
  partner2: PartnerData;
  ashtakootaScore: number;
  maximumScore: number;
  compatibilityVerdict: string;
  createdAt: any;
  expiresAt: any;
  sessionId: string;
}

// Generate or retrieve persistent browser session ID
export function getSessionId(): string {
  const KEY = 'jyotish_match_session_id';
  let sid = localStorage.getItem(KEY);
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem(KEY, sid);
  }
  return sid;
}

/**
 * Save a Match Finder calculation submission to Firestore.
 * Strictly enforces 24-hour expiration window (TTL).
 */
export async function saveMatchSubmission(data: {
  id: string;
  partner1: PartnerData;
  partner2: PartnerData;
  ashtakootaScore: number;
  maximumScore: number;
  compatibilityVerdict: string;
}): Promise<{ id: string; expiresAtDate: Date }> {
  const path = `matchSubmissions/${data.id}`;
  const now = Date.now();
  // Exactly 24 hours from now
  const expiresAtDate = new Date(now + 24 * 60 * 60 * 1000);
  const expiresAtTimestamp = Timestamp.fromDate(expiresAtDate);
  const sessionId = getSessionId();

  const payload = {
    id: data.id,
    partner1: {
      name: data.partner1.name || 'Partner 1',
      gender: data.partner1.gender,
      dob: data.partner1.dob,
      tob: data.partner1.tob,
      hour: data.partner1.hour,
      minute: data.partner1.minute,
      period: data.partner1.period,
      city: data.partner1.city,
      latitude: Number(data.partner1.latitude) || 0,
      longitude: Number(data.partner1.longitude) || 0,
      timezoneOffset: Number(data.partner1.timezoneOffset) || 5.5,
    },
    partner2: {
      name: data.partner2.name || 'Partner 2',
      gender: data.partner2.gender,
      dob: data.partner2.dob,
      tob: data.partner2.tob,
      hour: data.partner2.hour,
      minute: data.partner2.minute,
      period: data.partner2.period,
      city: data.partner2.city,
      latitude: Number(data.partner2.latitude) || 0,
      longitude: Number(data.partner2.longitude) || 0,
      timezoneOffset: Number(data.partner2.timezoneOffset) || 5.5,
    },
    ashtakootaScore: Number(data.ashtakootaScore) || 0,
    maximumScore: 36,
    compatibilityVerdict: String(data.compatibilityVerdict || '').substring(0, 200),
    createdAt: serverTimestamp(),
    expiresAt: expiresAtTimestamp,
    sessionId: sessionId
  };

  try {
    await setDoc(doc(db, 'matchSubmissions', data.id), payload);
    return { id: data.id, expiresAtDate };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Fetch active matches saved in the last 24 hours for this session.
 * Filters out any expired documents.
 */
export async function getSessionMatches(): Promise<StoredMatchSubmission[]> {
  const sessionId = getSessionId();
  const path = 'matchSubmissions';
  const nowTimestamp = Timestamp.now();

  try {
    const q = query(
      collection(db, path),
      where('sessionId', '==', sessionId),
      where('expiresAt', '>', nowTimestamp),
      orderBy('expiresAt', 'desc')
    );
    const snap = await getDocs(q);
    const list: StoredMatchSubmission[] = [];
    snap.forEach((d) => {
      const item = d.data() as StoredMatchSubmission;
      list.push(item);
    });
    return list;
  } catch (error) {
    console.warn('Could not query session matches:', error);
    return [];
  }
}

/**
 * Delete a match submission manually from the database.
 */
export async function deleteMatchSubmission(id: string): Promise<void> {
  const path = `matchSubmissions/${id}`;
  try {
    await deleteDoc(doc(db, 'matchSubmissions', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// AI Summary & User Profile interfaces
export interface StoredAiSummary {
  id: string;
  userId: string;
  nativeName: string;
  lagnaSign?: string;
  summaryData: any;
  createdAt: any;
}

export interface UserProfileData {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt?: any;
}

/**
 * Sync user profile to Firestore on login
 */
export async function syncUserProfile(user: { 
  uid: string; 
  email: string | null; 
  displayName: string | null; 
  photoURL: string | null;
  phoneNumber?: string | null;
}): Promise<void> {
  if (!user || !user.uid || !user.email) return;
  const path = `users/${user.uid}`;
  const data: UserProfileData = {
    id: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0] || 'Vedic Seeker',
    photoURL: user.photoURL || '',
    ...(user.phoneNumber ? { phoneNumber: user.phoneNumber } : {}),
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', user.uid), data, { merge: true });
  } catch (error) {
    console.warn('Could not sync user profile:', error);
  }
}

/**
 * Save an AI Astrological Summary to the user's subcollection
 */
export async function saveAiSummary(data: {
  id: string;
  userId: string;
  nativeName: string;
  lagnaSign?: string;
  summaryData: any;
}): Promise<string> {
  const path = `users/${data.userId}/aiSummaries/${data.id}`;
  const payload = {
    id: data.id,
    userId: data.userId,
    nativeName: data.nativeName || 'Chart Native',
    lagnaSign: data.lagnaSign || '',
    summaryData: data.summaryData,
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', data.userId, 'aiSummaries', data.id), payload);
    return data.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Retrieve all saved AI summaries for the authenticated user
 */
export async function getUserAiSummaries(userId: string): Promise<StoredAiSummary[]> {
  const path = `users/${userId}/aiSummaries`;
  try {
    const q = query(collection(db, 'users', userId, 'aiSummaries'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: StoredAiSummary[] = [];
    snap.forEach((d) => {
      list.push(d.data() as StoredAiSummary);
    });
    return list;
  } catch (error) {
    console.warn('Could not fetch user AI summaries:', error);
    return [];
  }
}

/**
 * Delete a saved AI summary
 */
export async function deleteAiSummary(userId: string, summaryId: string): Promise<void> {
  const path = `users/${userId}/aiSummaries/${summaryId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'aiSummaries', summaryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// =============================================================
// WISHLIST INTERFACES & FIREBASE METHODS
// =============================================================

export interface FirebaseWishlistItem {
  id: string; // product id as string
  userId: string;
  productId: number;
  productSlug: string;
  name: string;
  price: number;
  salePrice?: number | null;
  imageUrl?: string;
  categoryName?: string;
  inStock?: boolean;
  createdAt: any;
}

/**
 * Save an item to the user's wishlist in Firestore
 */
export async function saveWishlistItemToFirestore(
  userId: string,
  item: {
    productId: number;
    productSlug: string;
    name: string;
    price: number;
    salePrice?: number | null;
    imageUrl?: string;
    categoryName?: string;
    inStock?: boolean;
  }
): Promise<void> {
  const itemId = String(item.productId);
  const path = `users/${userId}/wishlist/${itemId}`;
  const payload: any = {
    id: itemId,
    userId,
    productId: item.productId,
    productSlug: String(item.productSlug || '').substring(0, 150),
    name: String(item.name || 'Store Item').substring(0, 200),
    price: Number(item.price) || 0,
    createdAt: serverTimestamp(),
  };

  if (item.salePrice !== undefined && item.salePrice !== null) {
    payload.salePrice = Number(item.salePrice);
  }
  if (item.imageUrl) {
    payload.imageUrl = String(item.imageUrl).substring(0, 500);
  }
  if (item.categoryName) {
    payload.categoryName = String(item.categoryName).substring(0, 100);
  }
  if (item.inStock !== undefined) {
    payload.inStock = Boolean(item.inStock);
  }

  try {
    await setDoc(doc(db, 'users', userId, 'wishlist', itemId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Remove an item from the user's wishlist in Firestore
 */
export async function removeWishlistItemFromFirestore(userId: string, productId: number | string): Promise<void> {
  const itemId = String(productId);
  const path = `users/${userId}/wishlist/${itemId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'wishlist', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Fetch all items in user's wishlist from Firestore
 */
export async function getUserWishlistFromFirestore(userId: string): Promise<FirebaseWishlistItem[]> {
  const path = `users/${userId}/wishlist`;
  try {
    const q = query(collection(db, 'users', userId, 'wishlist'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const items: FirebaseWishlistItem[] = [];
    snap.forEach((d) => {
      items.push(d.data() as FirebaseWishlistItem);
    });
    return items;
  } catch (error) {
    console.warn('Could not fetch user wishlist:', error);
    return [];
  }
}

/**
 * Real-time listener for user wishlist
 */
export function subscribeUserWishlist(
  userId: string,
  onUpdate: (items: FirebaseWishlistItem[]) => void,
  onError?: (error: any) => void
): () => void {
  const path = `users/${userId}/wishlist`;
  const q = query(collection(db, 'users', userId, 'wishlist'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snap) => {
      const items: FirebaseWishlistItem[] = [];
      snap.forEach((d) => {
        items.push(d.data() as FirebaseWishlistItem);
      });
      onUpdate(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// =============================================================
// USER ORDERS MIRRORING & TRACKING IN FIRESTORE
// =============================================================

export interface FirebaseUserOrder {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  orderStatus: string;
  itemCount: number;
  items?: any[];
  createdAt: any;
}

/**
 * Save user order to Firestore for real-time tracking
 */
export async function saveUserOrderToFirestore(
  userId: string,
  order: {
    id: number | string;
    orderNumber: string;
    totalAmount: number | string;
    orderStatus: string;
    items?: any[];
  }
): Promise<void> {
  const orderId = String(order.id);
  const path = `users/${userId}/orders/${orderId}`;
  const totalAmountNum = typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount;
  const items = (order.items || []).slice(0, 50).map((it) => ({
    productId: it.productId,
    productName: String(it.productName || it.name || '').substring(0, 150),
    quantity: Number(it.quantity) || 1,
    price: Number(it.price) || 0,
    imageUrl: it.imageUrl ? String(it.imageUrl).substring(0, 500) : null,
  }));

  const payload: any = {
    id: orderId,
    userId,
    orderNumber: String(order.orderNumber).substring(0, 64),
    totalAmount: isNaN(totalAmountNum) ? 0 : totalAmountNum,
    orderStatus: String(order.orderStatus || 'Confirmed').substring(0, 50),
    itemCount: items.reduce((acc, it) => acc + (it.quantity || 1), 0),
    items,
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', userId, 'orders', orderId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Fetch all past orders from user subcollection in Firestore
 */
export async function getUserOrdersFromFirestore(userId: string): Promise<FirebaseUserOrder[]> {
  const path = `users/${userId}/orders`;
  try {
    const q = query(collection(db, 'users', userId, 'orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: FirebaseUserOrder[] = [];
    snap.forEach((d) => {
      list.push(d.data() as FirebaseUserOrder);
    });
    return list;
  } catch (error) {
    console.warn('Could not fetch user orders from firestore:', error);
    return [];
  }
}


