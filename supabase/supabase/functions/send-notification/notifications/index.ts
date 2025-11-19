import type { Logger } from "../../_shared/adapters/logger.ts";
import type { TelegramBot } from "../../_shared/adapters/telegram.ts";
import type {
	GetSchedulesForDateResult,
	NotificationSenders,
	TelegramNotificationInfo,
} from "./types.ts";

function createMessage(
	scheduleDate: string,
	municipalityName: string,
	wastes: string[],
) {
	return `Ciao 👋
Domani <b>${scheduleDate}</b> a <b>${municipalityName}</b> verranno raccolti i seguenti rifiuti:
<b>${wastes.join("\n")}</b>`;
}
async function sendTelegramNotification(
	telegramBot: TelegramBot,
	schedule: GetSchedulesForDateResult[number],
	logger: Logger,
) {
	const notificationInfo =
		schedule.notification_info as TelegramNotificationInfo;
	logger.debug(
		{
			user_id: schedule.user_id,
		},
		"Sending telegram notification",
	);
	const messageSent = await telegramBot.api.sendMessage(
		notificationInfo.chat_id,
		createMessage(
			schedule.collection_date,
			schedule.municipality_name,
			schedule.waste,
		),
		{ parse_mode: "HTML" },
	);
	logger.debug(
		{
			user_id: schedule.user_id,
			message_sent: messageSent,
		},
		"Telegram notification sent",
	);
}

export async function sendNotification(
	notificationInfo: GetSchedulesForDateResult[number],
	notificationSenders: NotificationSenders,
	logger: Logger,
) {
	switch (notificationInfo.notification_type_name) {
		case "telegram":
			await sendTelegramNotification(
				notificationSenders.telegram,
				notificationInfo,
				logger,
			);
			break;
		default:
			logger.warn(
				{
					notification_type: notificationInfo.notification_type_name,
				},
				"Unknown notification type",
			);
			break;
	}
}
