import { z } from "zod";

const EnvSchema = z.object({
	VITE_SUPABASE_URL: z.string(),
	VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string(),
	VITE_LOGIN_REDIRECT_URL: z.string(),
});

export function create() {
	const envSchema = EnvSchema.parse(import.meta.env);

	return {
		supabase: {
			url: envSchema.VITE_SUPABASE_URL,
			anonKey: envSchema.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
		},
		login: {
			rediectUrl: envSchema.VITE_LOGIN_REDIRECT_URL,
		},
	};
}

export type Config = ReturnType<typeof create>;
