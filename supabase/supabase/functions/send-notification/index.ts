// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js@2";
// @deno-types="npm:@types/luxon@^3.6.2"
import { DateTime } from "npm:luxon@^3.7.1";
import { Database } from "../database.types.ts";

import { Bot } from "npm:grammy@^1.37.0";

type GetSchedulesResult =
  Database["tvtrash"]["Functions"]["get_schedules_for_date"]["Returns"];

async function getSchedulesForDate(
  supabase: SupabaseClient<Database>,
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

function createMessage(
  scheduleDate: string,
  municipalityName: string,
  wastes: string[],
) {
  return `Ciao 👋
Domani <b>${scheduleDate}</b> a <b>${municipalityName}</b> verranno raccolti i seguenti rifiuti:
<b>${wastes.join("\n")}</b>`;
}

const telegramBot = new Bot(
  Deno.env.get("TELEGRAM_BOT_TOKEN") ??
    "",
);
async function sendTelegramNotification(schedule: GetSchedulesResult[number]) {
  const notificationInfo = schedule.notification_info as {
    chat_id: string;
  };

  await telegramBot.api.sendMessage(
    notificationInfo.chat_id,
    createMessage(
      schedule.collection_date,
      schedule.municipality_name,
      schedule.waste,
    ),
    { parse_mode: "HTML" },
  );
}

async function sendNotification(notificationInfo: GetSchedulesResult[number]) {
  switch (notificationInfo.notification_type_name) {
    case "telegram":
      await sendTelegramNotification(notificationInfo);
      break;
    default:
      console.log(
        `Unknown notification type: ${notificationInfo.notification_type_name}`,
      );
      break;
  }
}

Deno.serve(async (req: Request) => {
  let processedRows: number = 0;
  try {
    const supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321",
      Deno.env.get("SUPABASE_ANON_KEY") ??
        "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );
    const tomorrow = DateTime.now().plus({ days: 1 });
    const schedules = await getSchedulesForDate(
      supabase,
      tomorrow,
    );
    for (const schedule of schedules) {
      // send notification
      await sendNotification(schedule);
      processedRows++;
    }
  } catch (err) {
    return new Response(JSON.stringify({ message: err?.message ?? err }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      processed_rows: processedRows,
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-notification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
