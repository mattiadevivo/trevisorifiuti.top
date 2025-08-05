import { z } from "zod";

const EnvSchema = z.object({
  VITE_SUPABASE_URL: z.string(),
  VITE_SUPABASE_ANON_KEY: z.string(),
});

export function create() {
  console.log(import.meta.env);
  const envSchema = EnvSchema.parse(import.meta.env);

  return {
    supabase: {
      url: envSchema.VITE_SUPABASE_URL,
      anonKey: envSchema.VITE_SUPABASE_ANON_KEY,
    },
  };
}

export type Config = ReturnType<typeof create>;
