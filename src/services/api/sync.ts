import { db, getCachedAstrologyData, setCachedAstrologyData } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface UserSyncPayload {
  birthDetails?: any;
  preferences?: any;
  wishlist?: any[];
  orders?: any[];
  lastUpdated?: number;
}

/**
 * Service to sync user data between local cache (localStorage) and Firestore,
 * ensuring consistency across the website and mobile app.
 */
export const syncService = {
  /**
   * Compares local cached user data with Firestore.
   * Returns conflict status and latest payload.
   */
  async compareLocalWithCloud(userId: string, localData: UserSyncPayload): Promise<{
    hasConflict: boolean;
    latestData: UserSyncPayload | null;
    source: 'local' | 'cloud' | 'synced';
  }> {
    try {
      const cacheKey = `user_sync_${userId}`;
      const cloudRef = doc(db, 'users', userId);
      const cloudSnap = await getDoc(cloudRef);

      if (!cloudSnap.exists()) {
        // Cloud has no data, push local to cloud
        await this.syncToCloud(userId, localData);
        return { hasConflict: false, latestData: localData, source: 'local' };
      }

      const cloudData = cloudSnap.data() as UserSyncPayload;
      const localTimestamp = localData.lastUpdated || 0;
      const cloudTimestamp = cloudData.lastUpdated ? (typeof cloudData.lastUpdated === 'number' ? cloudData.lastUpdated : (cloudData.lastUpdated as any).toMillis?.() || 0) : 0;

      if (localTimestamp > cloudTimestamp) {
        // Local is newer, sync to cloud
        await this.syncToCloud(userId, localData);
        return { hasConflict: false, latestData: localData, source: 'local' };
      } else if (cloudTimestamp > localTimestamp) {
        // Cloud is newer, update local cache
        setCachedAstrologyData(cacheKey, cloudData);
        return { hasConflict: false, latestData: cloudData, source: 'cloud' };
      }

      return { hasConflict: false, latestData: cloudData, source: 'synced' };
    } catch (error) {
      console.error('Failed to compare local with cloud data:', error);
      return { hasConflict: true, latestData: localData, source: 'local' };
    }
  },

  /**
   * Pushes local user data changes to Firestore and updates local cache.
   */
  async syncToCloud(userId: string, localData: UserSyncPayload): Promise<void> {
    const cacheKey = `user_sync_${userId}`;
    const payload = {
      ...localData,
      lastUpdated: serverTimestamp(),
    };

    try {
      const cloudRef = doc(db, 'users', userId);
      await setDoc(cloudRef, payload, { merge: true });

      // Update local cache with numeric timestamp for comparison
      setCachedAstrologyData(cacheKey, {
        ...localData,
        lastUpdated: Date.now(),
      });
    } catch (error) {
      console.error('Failed to sync data to cloud:', error);
      throw error;
    }
  },

  /**
   * Fetches latest user data from Firestore and caches it locally.
   */
  async syncFromCloud(userId: string): Promise<UserSyncPayload | null> {
    const cacheKey = `user_sync_${userId}`;
    try {
      const cloudRef = doc(db, 'users', userId);
      const cloudSnap = await getDoc(cloudRef);

      if (!cloudSnap.exists()) return null;

      const cloudData = cloudSnap.data() as UserSyncPayload;
      setCachedAstrologyData(cacheKey, cloudData);
      return cloudData;
    } catch (error) {
      console.error('Failed to sync data from cloud:', error);
      return getCachedAstrologyData<UserSyncPayload>(cacheKey);
    }
  },
};
