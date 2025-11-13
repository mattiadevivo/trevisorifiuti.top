// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { DateTime } from "luxon";
import { z } from "zod";
import {
	create as createSupabase,
	getSchedulesForDate,
} from "./adapters/supabase.ts";
import { create as createTelegram } from "../_shared/adapters/telegram.ts";
import { create as createConfig } from "./config.ts";
import { logger } from "../_shared/adapters/logger.ts";
import { sendNotification } from "./notifications/index.ts";
import type { NotificationSenders } from "./notifications/types.ts";

const RequestBodySchema = z.object({
	user_id: z.uuid().optional(),
});
const RequestHeadersSchema = z.object({
	authorization: z.string(),
});

Deno.serve(async (req: Request) => {
	const { user_id } = RequestBodySchema.parse(await req.json());
	const { authorization } = RequestHeadersSchema.parse(
		Object.fromEntries(req.headers),
	);
	try {
		const config = createConfig();
		const supabase = createSupabase(config.supabase, authorization);
		const telegramBot = createTelegram(config.telegram);

		const notificationSenders: NotificationSenders = {
			telegram: telegramBot,
		};
		const tomorrow = DateTime.now().plus({ days: 1 });
		console.log("getting collection schedules for date");
		logger.info({ date: tomorrow }, "getting collection schedules for date");
		const schedules = await getSchedulesForDate(supabase, tomorrow, user_id);
		logger.debug(
			{ schedule_number: schedules.length },
			"got collection schedules for date",
		);
		await Promise.allSettled(
			schedules.map((schedule) =>
				sendNotification(schedule, notificationSenders, logger),
			),
		);
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(
				JSON.stringify({ message: err?.message ?? err, issues: err.issues }),
				{
					headers: { "Content-Type": "application/json" },
					status: 422,
				},
			);
		}
		const error: Error = err as Error;
		return new Response(JSON.stringify({ message: error?.message ?? error }), {
			headers: { "Content-Type": "application/json" },
			status: 500,
		});
	}

	return new Response(null, {
		headers: { "Content-Type": "application/json" },
		status: 204,
	});
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-notification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
