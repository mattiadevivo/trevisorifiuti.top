import type { User } from "@supabase/supabase-js";
import type { Client } from ".";
import type { Database } from "./database.types";

export type NotificationPreference =
	Database["tvtrash"]["Tables"]["notification_preferences"]["Row"];
export type NotificationType = Database["tvtrash"]["Tables"]["notification_types"]["Row"];

export async function getNotificationPreferenceByUserId(client: Client, userId: User["id"]) {
	const { data, error } = await client
		.schema("tvtrash")
		.from("notification_preferences")
		.select()
		.eq("user_id", userId)
		.maybeSingle();
	if (error) throw error;
	return data;
}

export async function getTelegramNotificationTypeId(client: Client) {
	const { data, error } = await client
		.schema("tvtrash")
		.from("notification_types")
		.select()
		.eq("name", "telegram")
		.maybeSingle();
	if (error) throw error;
	return data;
}

export async function saveNotificationPreference(
	client: Client,
	preference: NotificationPreference,
) {
	const { error } = await client
		.schema("tvtrash")
		.from("notification_preferences")
		.upsert(preference);
	if (error) throw error;
}

export async function deleteNotificationPreference(client: Client, userId: User["id"]) {
	const { error } = await client
		.schema("tvtrash")
		.from("notification_preferences")
		.delete()
		.eq("user_id", userId);
	if (error) throw error;
}
