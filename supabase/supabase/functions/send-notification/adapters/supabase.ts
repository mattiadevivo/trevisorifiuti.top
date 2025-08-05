import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../database.types.ts";
import { Config as RootConfig } from "../config.ts";
import { DateTime } from "npm:luxon@^3.7.1";

export type Client = SupabaseClient<Database>;

export function create(
    config: RootConfig["supabase"],
    authorizationHeader: string,
): Client {
    return createClient<Database>(
        config.url,
        config.anonKey,
        {
            global: {
                headers: { Authorization: authorizationHeader },
            },
        },
    );
}

export async function getSchedulesForDate(
    supabase: Client,
    date: DateTime,
) {
    const { data, error } = await supabase.schema("tvtrash")
        .rpc("get_schedules_for_date", {
            target_date: `${date.year}-${date.month}-${date.day}`,
        });
    if (error) {
        throw error;
    }

    return data;
}
