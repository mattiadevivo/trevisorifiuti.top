import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";
import type { Config as RootConfig } from "../config.ts";

export type Client = SupabaseClient;

export function create(
	config: RootConfig["supabase"],
	authorizationHeader: string,
): Client {
	return createClient(config.url, config.key, {
		global: {
			headers: { Authorization: authorizationHeader },
		},
	});
}
