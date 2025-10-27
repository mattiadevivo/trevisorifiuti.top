import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { TestRequestSchema, sendTestMessage, type Deps } from "./core.ts";

function createMockTelegramBot() {
	const calls: Array<{ chatId: string; text: string }> = [];
	return {
		api: {
			sendMessage: async (chatId: string, text: string) => {
				calls.push({ chatId, text });
				return { ok: true };
			},
		},
		__calls: calls,
	};
}

Deno.test("TestRequestSchema requires either chat_id or user_id", () => {
	const res = TestRequestSchema.safeParse({ message: "hello" });
	assertEquals(res.success, false);
});

Deno.test("sendTestMessage sends to provided chat_id", async () => {
	const bot = createMockTelegramBot();
	const deps: Deps = {
		// @ts-ignore - minimal mock compatible with our usage
		telegramBot: bot,
		getChatIdForUser: async () => "should-not-be-called",
	};
	await sendTestMessage(deps, { chat_id: "123", message: "hi there" });
	assertEquals(bot.__calls.length, 1);
	assertEquals(bot.__calls[0], { chatId: "123", text: "hi there" });
});

Deno.test("sendTestMessage resolves chat id via user_id when chat_id not provided", async () => {
	const bot = createMockTelegramBot();
	const deps: Deps = {
		// @ts-ignore - minimal mock compatible with our usage
		telegramBot: bot,
		getChatIdForUser: async (userId: string) => {
			assertEquals(userId, "550e8400-e29b-41d4-a716-446655440000");
			return "999";
		},
	};
	await sendTestMessage(deps, {
		user_id: "550e8400-e29b-41d4-a716-446655440000",
		message: "from user",
	});
	assertEquals(bot.__calls.length, 1);
	assertEquals(bot.__calls[0], { chatId: "999", text: "from user" });
});

Deno.test("sendTestMessage propagates getChatIdForUser errors", async () => {
	const bot = createMockTelegramBot();
	const deps: Deps = {
		// @ts-ignore - minimal mock compatible with our usage
		telegramBot: bot,
		getChatIdForUser: async () => { throw new Error("no chat id"); },
	};
	await assertRejects(() => sendTestMessage(deps, {
		user_id: "550e8400-e29b-41d4-a716-446655440000",
		message: "x",
	}));
	assertEquals(bot.__calls.length, 0);
});
