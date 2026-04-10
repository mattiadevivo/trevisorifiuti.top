import { z } from "npm:zod";

const EnvSchema = z.object({
	SUPABASE_URL: z.string(),
	SUPABASE_SERVICE_ROLE_KEY: z.string(),
	TELEGRAM_BOT_TOKEN: z
		.string({
			error: "TELEGRAM_BOT_TOKEN is required",
		})
		.min(1),
	VAPID_PUBLIC_KEY: z.string({ error: "VAPID_PUBLIC_KEY is required" }).min(1),
	VAPID_PRIVATE_KEY: z
		.string({ error: "VAPID_PRIVATE_KEY is required" })
		.min(1),
	VAPID_SUBJECT: z
		.string()
		.default("mailto:noreply@trevisorifiuti.top"),
});

export function create() {
	const envSchema = EnvSchema.parse(Deno.env.toObject());

	return {
		supabase: {
			url: envSchema.SUPABASE_URL,
			key: envSchema.SUPABASE_SERVICE_ROLE_KEY,
		},
		telegram: {
			botToken: envSchema.TELEGRAM_BOT_TOKEN,
		},
		webPush: {
			vapidPublicKey: envSchema.VAPID_PUBLIC_KEY,
			vapidPrivateKey: envSchema.VAPID_PRIVATE_KEY,
			vapidSubject: envSchema.VAPID_SUBJECT,
		},
	};
}

export type Config = ReturnType<typeof create>;
