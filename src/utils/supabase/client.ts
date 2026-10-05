import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://abclpnoierouoilfffct.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_DLWxWj_3-TuqqAxWFoQq9g_cFoqQKOZ';

export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

export const createClient = () => supabase;
