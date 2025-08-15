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
        config.key,
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
    user_id?: string,
) {
    if (user_id) {
        // If a user_id is provided, we call the RPC to get schedules for that user
        const { data, error } = await supabase
            .schema("tvtrash")
            .rpc("get_schedule_for_user", {
                target_date: date.toJSDate().toLocaleDateString("en-CA"),
                target_user: user_id,
            });
        if (error) {
            throw error;
        }
        return data;
    }
    const { data, error } = await supabase.schema("tvtrash")
        .rpc("get_schedules_for_date", {
            target_date: date.toJSDate().toLocaleDateString("en-CA"),
        });
    if (error) {
        console.error("Error fetching schedules:", error);
        throw error;
    }

    return data;
}
