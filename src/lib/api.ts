/**
 * API Configuration for Next.js
 * Handles API base URL for different environments
 */

export const getApiBaseUrl = (): string => {
  // Use Next.js public environment variable
  if (typeof window !== 'undefined') {
    // Client-side
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (apiUrl) {
      return apiUrl;
    }
    // Fallback to current origin
    return window.location.origin;
  }
  
  // Server-side
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
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
  const timeoutMs = process.env.NEXT_PUBLIC_API_TIMEOUT 
    ? parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT, 10) 
    : 30000;
  
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
