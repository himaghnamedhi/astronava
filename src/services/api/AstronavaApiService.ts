/**
 * AstronavaApiService handles raw HTTP communication with the backend API endpoints
 * supporting both web and mobile app clients.
 */
export const AstronavaApiService = {
  async post<T>(endpoint: string, payload: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      console.error(`API Error [POST ${endpoint}]:`, error);
      throw error;
    }
  },

  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      console.error(`API Error [GET ${endpoint}]:`, error);
      throw error;
    }
  },
};
