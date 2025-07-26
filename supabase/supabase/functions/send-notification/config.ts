import { z } from "npm:zod";

const EnvSchema = z.object({
    SUPABASE_URL: z.string().default("http://127.0.0.1:54321"),
    SUPABASE_ANON_KEY: z.string().default(
        "",
    ),
    TELEGRAM_BOT_TOKEN: z.string({
        error: "TELEGRAM_BOT_TOKEN is required",
    }).min(1),
});

export function create() {
    const envSchema = EnvSchema.parse(Deno.env.toObject());

    return {
        supabase: {
            url: envSchema.SUPABASE_URL,
            anonKey: envSchema.SUPABASE_ANON_KEY,
        },
        telegram: {
            botToken: envSchema.TELEGRAM_BOT_TOKEN,
        },
    };
}

export type Config = ReturnType<typeof create>;
