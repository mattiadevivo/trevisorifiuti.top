import { z } from "zod";

export const TelegramNotificationInfo = z.object({
  chat_id: z.string({}),
});

export type TelegramNotificationInfo = z.infer<typeof TelegramNotificationInfo>;
