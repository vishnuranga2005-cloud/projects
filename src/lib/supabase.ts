import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: fetch,
    headers: {
      'X-Client-Info': 'supabase-js/2.0',
    },
  },
});

// Helper function to handle errors with user-friendly messages
export const handleDatabaseError = (error: any): { message: string; isNetworkError: boolean } => {
  const errorMessage = error?.message || String(error);
  
  // Check for network-related errors
  if (
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('NetworkError') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('The operation timed out')
  ) {
    return {
      message: 'Unable to connect to the server. Please check your internet connection or try again later.',
      isNetworkError: true,
    };
  }
  
  // Check for Supabase service issues
  if (errorMessage.includes('503') || errorMessage.includes('502') || errorMessage.includes('service unavailable')) {
    return {
      message: 'The service is temporarily unavailable. Your Supabase project may be paused. Please check your Supabase dashboard.',
      isNetworkError: true,
    };
  }
  
  if (errorMessage.includes('invalid API key')) {
    return {
      message: 'Invalid authentication credentials. Please check your environment variables.',
      isNetworkError: false,
    };
  }

  return {
    message: errorMessage,
    isNetworkError: false,
  };
};

// Retry logic for transient failures
const retryWithExponentialBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      const { isNetworkError } = handleDatabaseError(error);
      
      // Only retry on network errors
      if (!isNetworkError || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// SELECT - Get all records from a table
export const getAll = async <T>(table: string): Promise<T[]> => {
  return retryWithExponentialBackoff(async () => {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data as T[];
  });
};

// SELECT with filter - Get records matching a condition
export const getByField = async <T>(table: string, field: string, value: any): Promise<T[]> => {
  return retryWithExponentialBackoff(async () => {
    const { data, error } = await supabase.from(table).select('*').eq(field, value);
    if (error) throw error;
    return data as T[];
  });
};

// SELECT single - Get one record by ID
export const getById = async <T>(table: string, id: string | number): Promise<T | null> => {
  return retryWithExponentialBackoff(async () => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return data as T;
  });
};

// INSERT - Create a new record
export const insert = async <T>(table: string, record: Partial<T>): Promise<T> => {
  return retryWithExponentialBackoff(async () => {
    const { data, error } = await supabase.from(table).insert([record]).select().single();
    if (error) throw error;
    return data as T;
  });
};

// INSERT multiple - Create multiple records
export const insertMany = async <T>(table: string, records: Partial<T>[]): Promise<T[]> => {
  return retryWithExponentialBackoff(async () => {
    const { data, error } = await supabase.from(table).insert(records).select();
    if (error) throw error;
    return data as T[];
  });
};

// UPDATE - Update a record by ID
export const update = async <T>(table: string, id: string | number, updates: Partial<T>): Promise<T> => {
  return retryWithExponentialBackoff(async () => {
    const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as T;
  });
};

// DELETE - Delete a record by ID
export const remove = async (table: string, id: string | number): Promise<void> => {
  return retryWithExponentialBackoff(async () => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  });
};
