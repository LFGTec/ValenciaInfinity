import { createClient } from "@supabase/supabase-js";

/* Variables de entorno */

// Tus variables de entorno en .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)