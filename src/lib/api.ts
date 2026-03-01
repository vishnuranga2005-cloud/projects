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
 * Fetch wrapper with error handling and timeout support
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = createApiUrl(endpoint);
  const timeoutMs = import.meta.env.VITE_API_TIMEOUT ? parseInt(import.meta.env.VITE_API_TIMEOUT, 10) : 30000;
  
  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`API request timeout for ${endpoint}`);
      throw new Error(`Request to ${endpoint} timed out after ${timeoutMs}ms`);
    }
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};
