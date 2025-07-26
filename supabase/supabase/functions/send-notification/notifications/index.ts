import { GetSchedulesResult } from "./types.ts";
import { TelegramBot } from "../adapters/telegram.ts";
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
    schedule: GetSchedulesResult[number],
) {
    const notificationInfo = schedule.notification_info as {
        chat_id: string;
    };

    await telegramBot.api.sendMessage(
        notificationInfo.chat_id,
        createMessage(
            schedule.collection_date,
            schedule.municipality_name,
            schedule.waste,
        ),
        { parse_mode: "HTML" },
    );
}

export type NotificationSenders = {
    telegram: TelegramBot;
};

export async function sendNotification(
    notificationInfo: GetSchedulesResult[number],
    notificationSenders: NotificationSenders,
) {
    switch (notificationInfo.notification_type_name) {
        case "telegram":
            await sendTelegramNotification(
                notificationSenders.telegram,
                notificationInfo,
            );
            break;
        default:
            console.log(
                `Unknown notification type: ${notificationInfo.notification_type_name}`,
            );
            break;
    }
}
