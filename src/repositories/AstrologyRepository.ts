import { AstronavaApiService } from '../services/api/AstronavaApiService';
import { getCachedAstrologyData, setCachedAstrologyData } from '../lib/firebase';
import { CompleteKundliData } from '../data/vedicEphemeris';
import { notificationService } from '../services/notificationService';

export class AstrologyApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'AstrologyApiError';
  }
}

export class NetworkError extends AstrologyApiError {
  constructor(message: string = 'Network connectivity error. Please check your connection.') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AstrologyApiError {
  constructor(message: string = 'Authentication failed. Please sign in again.') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends AstrologyApiError {
  constructor(message: string = 'Invalid request parameters.') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries <= 0) {
      let finalError: AstrologyApiError;
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        finalError = new AuthenticationError(error.message);
      } else if (error.message?.includes('400') || error.message?.includes('required')) {
        finalError = new ValidationError(error.message);
      } else if (!navigator.onLine || error.message?.includes('Failed to fetch')) {
        finalError = new NetworkError(error.message);
      } else {
        finalError = new AstrologyApiError(error.message);
      }
      notificationService.error(finalError.message);
      throw finalError;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return withRetry(fn, retries - 1, delayMs * 2);
  }
}

export interface BirthDetailsPayload {
  name: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  tob: string;
  city: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
}

export interface MatchCompatibilityPayload {
  p1: BirthDetailsPayload;
  p2: BirthDetailsPayload;
}

/**
 * AstrologyRepository handles data fetching, caching, retry mechanisms, and custom error classes for
 * astrological reports (Kundli & Match Compatibility) using AstronavaApiService.
 */
export const AstrologyRepository = {
  /**
   * Fetches complete Kundli report with local caching and retry mechanism.
   */
  async getKundliReport(birthDetails: BirthDetailsPayload, token?: string): Promise<CompleteKundliData> {
    const cacheKey = `kundli_${birthDetails.dob}_${birthDetails.tob}_${birthDetails.latitude}_${birthDetails.longitude}`;
    
    const cached = getCachedAstrologyData<CompleteKundliData>(cacheKey);
    if (cached) {
      return cached;
    }

    return withRetry(async () => {
      const response = await AstronavaApiService.post<{ success: boolean; kundliData: CompleteKundliData }>(
        '/api/mobile/kundli',
        birthDetails,
        token
      );

      if (response && response.kundliData) {
        setCachedAstrologyData(cacheKey, response.kundliData);
        return response.kundliData;
      }

      throw new AstrologyApiError('Invalid response structure received from Kundli API');
    });
  },

  /**
   * Fetches 36 Guna Match Compatibility report with local caching and retry mechanism.
   */
  async getMatchCompatibility(p1: BirthDetailsPayload, p2: BirthDetailsPayload, token?: string): Promise<any> {
    const cacheKey = `match_${p1.dob}_${p1.tob}_vs_${p2.dob}_${p2.tob}`;

    const cached = getCachedAstrologyData<any>(cacheKey);
    if (cached) {
      return cached;
    }

    return withRetry(async () => {
      const response = await AstronavaApiService.post<{ success: boolean; matchReport: any }>(
        '/api/mobile/match',
        { p1, p2 },
        token
      );

      if (response && response.matchReport) {
        setCachedAstrologyData(cacheKey, response.matchReport);
        return response.matchReport;
      }

      throw new AstrologyApiError('Invalid response structure received from Match API');
    });
  },
};
