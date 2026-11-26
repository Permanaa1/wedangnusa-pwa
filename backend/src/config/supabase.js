import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const rawUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_ANON_KEY?.trim();

if (!rawUrl || !supabaseKey) {
  throw new Error(
    "SUPABASE_URL dan SUPABASE_ANON_KEY wajib diisi pada file .env atau Environment Variables"
  );
}

const supabaseUrl = rawUrl.replace(/\/+$/, "");

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function checkSupabaseConnection() {
  const start = Date.now();
  const { error } = await supabase
    .from("drinks")
    .select("id", { head: true, count: "exact" });

  if (error) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      message: error.message,
      code: error.code || null,
    };
  }

  return {
    connected: true,
    latencyMs: Date.now() - start,
    message: "Koneksi Supabase aktif",
  };
}