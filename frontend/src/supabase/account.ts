import { User } from "@supabase/supabase-js";
import { Client } from ".";
import { Database } from "./database.types";

export type NotificationPreference =
  Database["tvtrash"]["Tables"]["notification_preferences"]["Row"];
export type NotificationType =
  Database["tvtrash"]["Tables"]["notification_types"]["Row"];

export async function getNotificationPreferenceByUserId(
  client: Client,
  userId: User["id"]
) {
  const { data } = await client
    .schema("tvtrash")
    .from("notification_preferences")
    .select()
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function getTelegramNotificationTypeId(client: Client) {
  const { data } = await client
    .schema("tvtrash")
    .from("notification_types")
    .select()
    .eq("name", "telegram")
    .maybeSingle();
  return data;
}

export async function saveNotificationPreference(
  client: Client,
  preference: NotificationPreference
) {
  const { data } = await client
    .schema("tvtrash")
    .from("notification_preferences")
    .upsert(preference);
  return data;
}

export async function deleteNotificationPreference(
  client: Client,
  userId: User["id"]
) {
  const { data } = await client
    .schema("tvtrash")
    .from("notification_preferences")
    .delete()
    .eq("user_id", userId);
  return data;
}
