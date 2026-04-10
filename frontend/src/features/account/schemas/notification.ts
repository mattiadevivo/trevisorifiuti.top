import { z } from "zod";

export const TelegramNotificationInfo = z.object({
	chat_id: z.string({}),
});

export type TelegramNotificationInfo = z.infer<typeof TelegramNotificationInfo>;

export const WebPushNotificationInfo = z.object({
	endpoint: z.string(),
	p256dh: z.string(),
	auth: z.string(),
});

export type WebPushNotificationInfo = z.infer<typeof WebPushNotificationInfo>;
