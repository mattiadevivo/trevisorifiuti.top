import { Bot } from "npm:grammy@^1.37.0";

export type Config = {
	botToken: string;
};

export function create(config: Config) {
	return new Bot(config.botToken);
}
export type TelegramBot = ReturnType<typeof create>;
