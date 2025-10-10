import { Bot } from "npm:grammy@^1.37.0";
import type { Config as RootConfig } from "../config.ts";

export function create(config: RootConfig["telegram"]) {
	return new Bot(config.botToken);
}
export type TelegramBot = ReturnType<typeof create>;
