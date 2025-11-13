import { Bot } from "grammy";

export type Config = {
	botToken: string;
};

export function create(config: Config) {
	return new Bot(config.botToken);
}
export type TelegramBot = ReturnType<typeof create>;
