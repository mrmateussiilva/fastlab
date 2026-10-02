import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
// Supabase recentes usam PUBLISHABLE_KEY; projetos antigos usam ANON_KEY
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-anon-key';

// Client para uso no browser (componentes client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client para uso no servidor (API routes) - usa a service role key para bypass de RLS
export function getSupabaseAdmin() {
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type Project = {
  id: string;
  user_id: string;
  name: string;
  elements: unknown;
  environment: unknown;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Theme = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string | null;
  cover_image_url: string;
  gallery_images: string[];
  elements: unknown;
  environment: unknown;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};
