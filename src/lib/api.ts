/**
 * API Configuration
 * Handles API base URL for different environments
 */

export const getApiBaseUrl = (): string => {
  // In production (Vercel), use the VITE_API_BASE_URL environment variable
  if (import.meta.env.PROD && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // In development, use localhost
  if (import.meta.env.DEV) {
    return `http://localhost:${import.meta.env.VITE_API_PORT || 3001}`;
  }

  // Fallback to current origin
  return window.location.origin;
};

export const createApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Fetch wrapper with error handling
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = createApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};
