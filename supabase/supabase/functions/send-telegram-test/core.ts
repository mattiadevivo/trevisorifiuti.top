import type { TelegramBot } from "../_shared/adapters/telegram.ts";

function createMessage() {
	return `Ciao 👋, questo è un messaggio di prova.`;
}

export async function sendTestMessage(
	telegramBot: TelegramBot,
	chatId: string,
) {
	const response = await telegramBot.api.sendMessage(chatId, createMessage(), {
		parse_mode: "HTML",
	});
	return response;
}
