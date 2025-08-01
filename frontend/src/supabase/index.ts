import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

type Config = {
  url: string;
  anonKey: string;
};

export function create(config: Config) {
  return createClient<Database>(config.url, config.anonKey);
}

export type Client = ReturnType<typeof create>;

export type Municipality =
  Database["tvtrash"]["Tables"]["municipalities"]["Row"];

export type CollectionSchedule =
  Database["tvtrash"]["Tables"]["waste_collections"]["Row"];

export async function getMunicipalities(client: Client) {
  const { data } = await client
    .schema("tvtrash")
    .from("municipalities")
    .select();
  return data;
}

export async function getCollectionSchedulesByMunicipality(
  client: Client,
  limit: number,
  offset: number
) {
  const { data } = await client
    .schema("tvtrash")
    .from("waste_collections")
    .select()
    .range(offset, offset + limit);
  return data;
}
