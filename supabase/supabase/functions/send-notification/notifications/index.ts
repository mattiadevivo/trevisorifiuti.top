import type { Logger } from "../../_shared/adapters/logger.ts";
import type { TelegramBot } from "../../_shared/adapters/telegram.ts";
import type { WebPushSender } from "../../_shared/adapters/webpush.ts";
import type {
	GetSchedulesForDateResult,
	NotificationSenders,
	TelegramNotificationInfo,
	WebPushNotificationInfo,
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

function createPlainMessage(
	scheduleDate: string,
	municipalityName: string,
	wastes: string[],
) {
	return `Domani ${scheduleDate} a ${municipalityName}: ${wastes.join(", ")}`;
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

async function sendWebPushNotification(
	webPushSender: WebPushSender,
	schedule: GetSchedulesForDateResult[number],
	logger: Logger,
) {
	const notificationInfo =
		schedule.notification_info as WebPushNotificationInfo;
	logger.debug(
		{ user_id: schedule.user_id },
		"Sending web push notification",
	);
	await webPushSender.sendNotification(
		{
			endpoint: notificationInfo.endpoint,
			p256dh: notificationInfo.p256dh,
			auth: notificationInfo.auth,
		},
		{
			title: "trevisorifiuti",
			body: createPlainMessage(
				schedule.collection_date,
				schedule.municipality_name,
				schedule.waste,
			),
			url: "/calendar",
		},
	);
	logger.debug(
		{ user_id: schedule.user_id },
		"Web push notification sent",
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
		case "web_push":
			await sendWebPushNotification(
				notificationSenders.webPush,
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
