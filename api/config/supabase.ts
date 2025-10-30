import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Database {
  public: {
    Tables: {
      redirect_links: {
        Row: {
          id: string;
          service_key: string;
          quantity: number | null;
          url: string;
          description: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_key: string;
          quantity?: number | null;
          url: string;
          description?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_key?: string;
          quantity?: number | null;
          url?: string;
          description?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.warn('Supabase não configurado: SUPABASE_URL ou SUPABASE_ANON_KEY ausentes');
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  return supabaseClient;
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}