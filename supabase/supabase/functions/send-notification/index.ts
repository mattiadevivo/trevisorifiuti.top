// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// @deno-types="npm:@types/luxon@^3.6.2"
import { DateTime } from "npm:luxon@^3.7.1";

import { create as createConfig } from "./config.ts";
import {
  NotificationSenders,
  sendNotification,
} from "./notifications/index.ts";
import {
  create as createSupabase,
  getSchedulesForDate,
} from "./adapters/supabase.ts";
import { create as createTelegram } from "./adapters/telegram.ts";
import z from "npm:zod";

Deno.serve(async (req: Request) => {
  let processedRows: number = 0;
  try {
    const config = createConfig();
    const supabase = createSupabase(
      config.supabase,
      req.headers.get("Authorization")!,
    );
    const telegramBot = createTelegram(config.telegram);

    const notificationSenders: NotificationSenders = {
      telegram: telegramBot,
    };
    const tomorrow = DateTime.now().plus({ days: 1 });
    const schedules = await getSchedulesForDate(
      supabase,
      tomorrow,
    );
    for (const schedule of schedules) {
      await sendNotification(schedule, notificationSenders);
      processedRows++;
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      err.issues;
      return new Response(
        JSON.stringify({ message: err?.message ?? err, issues: err.issues }),
        {
          headers: { "Content-Type": "application/json" },
          status: 422,
        },
      );
    }
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
