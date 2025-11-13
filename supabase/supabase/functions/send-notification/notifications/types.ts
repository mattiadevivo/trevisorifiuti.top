import type { TelegramBot } from "../../_shared/adapters/telegram.ts";
import type { Database } from "../../_shared/database.types.ts";

export type GetSchedulesForDateResult =
	Database["tvtrash"]["Functions"]["get_schedules_for_date"]["Returns"];

export type TelegramNotificationInfo = {
	chat_id: string;
};

export type NotificationSenders = {
	telegram: TelegramBot;
};
