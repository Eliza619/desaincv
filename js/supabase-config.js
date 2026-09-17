
const SUPABASE_URL = "https://jfpysizxnyiygqlcrbrw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_XERfz3luALK6kIhTF9TjKA_MNc7dyrB";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
