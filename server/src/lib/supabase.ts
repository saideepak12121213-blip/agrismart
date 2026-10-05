import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://abclpnoierouoilfffct.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_DLWxWj_3-TuqqAxWFoQq9g_cFoqQKOZ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
