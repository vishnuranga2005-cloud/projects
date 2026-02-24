import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common database operations

// SELECT - Get all records from a table
export const getAll = async <T>(table: string): Promise<T[]> => {
  const { data, error } = await supabase.from(table).select('*');
  if (error) throw error;
  return data as T[];
};

// SELECT with filter - Get records matching a condition
export const getByField = async <T>(table: string, field: string, value: any): Promise<T[]> => {
  const { data, error } = await supabase.from(table).select('*').eq(field, value);
  if (error) throw error;
  return data as T[];
};

// SELECT single - Get one record by ID
export const getById = async <T>(table: string, id: string | number): Promise<T | null> => {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) throw error;
  return data as T;
};

// INSERT - Create a new record
export const insert = async <T>(table: string, record: Partial<T>): Promise<T> => {
  const { data, error } = await supabase.from(table).insert([record]).select().single();
  if (error) throw error;
  return data as T;
};

// INSERT multiple - Create multiple records
export const insertMany = async <T>(table: string, records: Partial<T>[]): Promise<T[]> => {
  const { data, error } = await supabase.from(table).insert(records).select();
  if (error) throw error;
  return data as T[];
};

// UPDATE - Update a record by ID
export const update = async <T>(table: string, id: string | number, updates: Partial<T>): Promise<T> => {
  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as T;
};

// DELETE - Delete a record by ID
export const remove = async (table: string, id: string | number): Promise<void> => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
};
