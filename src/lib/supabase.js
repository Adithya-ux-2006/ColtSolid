import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.');
}

// Lazy singleton — client is only created on first access, not at import time.
let _client = null;

function getClient() {
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

// Proxy delegates property access to the lazily-initialized client.
// This preserves the existing `supabase.from(...)` API without breaking callers.
export const supabase = new Proxy({}, {
  get(_, prop) {
    return getClient()[prop];
  },
});
