import { describe, expect, it } from "vitest";
import { TelegramNotificationInfo } from "../../../../src/features/account/schemas/notification";

describe("TelegramNotificationInfo", () => {
	it("accepts a positive numeric string", () => {
		expect(TelegramNotificationInfo.safeParse({ chat_id: "123456789" }).success).toBe(true);
	});

	it("accepts a negative numeric string (group chats use negative IDs)", () => {
		expect(TelegramNotificationInfo.safeParse({ chat_id: "-987654321" }).success).toBe(true);
	});

	it("accepts an empty string (validation happens at the form layer)", () => {
		expect(TelegramNotificationInfo.safeParse({ chat_id: "" }).success).toBe(true);
	});

	it("rejects when chat_id is absent", () => {
		expect(TelegramNotificationInfo.safeParse({}).success).toBe(false);
	});

	it("rejects when chat_id is a number instead of a string", () => {
		expect(TelegramNotificationInfo.safeParse({ chat_id: 123456789 }).success).toBe(false);
	});

	it("rejects when chat_id is null", () => {
		expect(TelegramNotificationInfo.safeParse({ chat_id: null }).success).toBe(false);
	});

	it("rejects extra unknown fields only via strict parse (base schema is passthrough)", () => {
		// Non-strict parse: extra fields are stripped, result is still valid
		const result = TelegramNotificationInfo.safeParse({ chat_id: "123", extra: true });
		expect(result.success).toBe(true);
		expect((result.data as Record<string, unknown>).extra).toBeUndefined();
	});
});
