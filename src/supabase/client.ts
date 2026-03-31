import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://bluyxbxurarhhztifrbr.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_qrbC3hDdSQvhOnr4Kc2WZQ_ZViEmB-q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
