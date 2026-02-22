import { describe, expect, it } from "vitest";
import type { Client } from "../../src/supabase";
import {
	deleteNotificationPreference,
	getNotificationPreferenceByUserId,
	getTelegramNotificationTypeId,
	saveNotificationPreference,
	type NotificationPreference,
} from "../../src/supabase/account";

// ---------------------------------------------------------------------------
// Mock client helpers
// ---------------------------------------------------------------------------

function selectMaybeSingleClient(result: { data: unknown; error: unknown }) {
	return {
		schema: () => ({
			from: () => ({
				select: () => ({
					eq: () => ({
						maybeSingle: () => Promise.resolve(result),
					}),
				}),
			}),
		}),
	} as unknown as Client;
}

function upsertClient(result: { error: unknown }) {
	return {
		schema: () => ({
			from: () => ({
				upsert: () => Promise.resolve(result),
			}),
		}),
	} as unknown as Client;
}

function deleteClient(result: { error: unknown }) {
	return {
		schema: () => ({
			from: () => ({
				delete: () => ({
					eq: () => Promise.resolve(result),
				}),
			}),
		}),
	} as unknown as Client;
}

const mockPreference = {
	id: "pref-1",
	user_id: "user-1",
	municipality_id: "mun-1",
	notification_type_id: "type-1",
	notification_info: { chat_id: "123456" },
} as unknown as NotificationPreference;

// ---------------------------------------------------------------------------
// getNotificationPreferenceByUserId
// ---------------------------------------------------------------------------

describe("getNotificationPreferenceByUserId", () => {
	it("returns the preference when found", async () => {
		const client = selectMaybeSingleClient({ data: mockPreference, error: null });

		const result = await getNotificationPreferenceByUserId(client, "user-1");

		expect(result).toEqual(mockPreference);
	});

	it("returns null when the user has no preference (maybeSingle semantics)", async () => {
		const client = selectMaybeSingleClient({ data: null, error: null });

		const result = await getNotificationPreferenceByUserId(client, "user-1");

		expect(result).toBeNull();
	});

	it("throws the Supabase error when the query fails", async () => {
		const supabaseError = { message: "permission denied", code: "42501" };
		const client = selectMaybeSingleClient({ data: null, error: supabaseError });

		await expect(getNotificationPreferenceByUserId(client, "user-1")).rejects.toEqual(
			supabaseError,
		);
	});
});

// ---------------------------------------------------------------------------
// getTelegramNotificationTypeId
// ---------------------------------------------------------------------------

describe("getTelegramNotificationTypeId", () => {
	it("returns the notification type when found", async () => {
		const notificationType = { id: "type-1", name: "telegram" };
		const client = selectMaybeSingleClient({ data: notificationType, error: null });

		const result = await getTelegramNotificationTypeId(client);

		expect(result).toEqual(notificationType);
	});

	it("returns null when no telegram notification type exists", async () => {
		const client = selectMaybeSingleClient({ data: null, error: null });

		const result = await getTelegramNotificationTypeId(client);

		expect(result).toBeNull();
	});

	it("throws the Supabase error when the query fails", async () => {
		const supabaseError = { message: "table not found", code: "42P01" };
		const client = selectMaybeSingleClient({ data: null, error: supabaseError });

		await expect(getTelegramNotificationTypeId(client)).rejects.toEqual(supabaseError);
	});
});

// ---------------------------------------------------------------------------
// saveNotificationPreference
// ---------------------------------------------------------------------------

describe("saveNotificationPreference", () => {
	it("resolves without error on success", async () => {
		const client = upsertClient({ error: null });

		await expect(saveNotificationPreference(client, mockPreference)).resolves.toBeUndefined();
	});

	it("throws the Supabase error when upsert fails", async () => {
		const supabaseError = { message: "duplicate key value", code: "23505" };
		const client = upsertClient({ error: supabaseError });

		await expect(saveNotificationPreference(client, mockPreference)).rejects.toEqual(supabaseError);
	});
});

// ---------------------------------------------------------------------------
// deleteNotificationPreference
// ---------------------------------------------------------------------------

describe("deleteNotificationPreference", () => {
	it("resolves without error on success", async () => {
		const client = deleteClient({ error: null });

		await expect(deleteNotificationPreference(client, "user-1")).resolves.toBeUndefined();
	});

	it("throws the Supabase error when delete fails", async () => {
		const supabaseError = { message: "row not found", code: "P0002" };
		const client = deleteClient({ error: supabaseError });

		await expect(deleteNotificationPreference(client, "user-1")).rejects.toEqual(supabaseError);
	});
});
