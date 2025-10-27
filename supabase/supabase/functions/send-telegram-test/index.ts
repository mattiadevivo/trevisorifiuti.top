import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { z } from "npm:zod";
import { create as createConfig } from "./config.ts";
import { create as createTelegram } from "../_shared/adapters/telegram.ts";
import { sendTestMessage } from "./core.ts";

const RequestBodySchema = z.object({
	chat_id: z.string(),
});

const RequestHeadersSchema = z.object({
	authorization: z.string(),
});

Deno.serve(async (req: Request) => {
	try {
		const { chat_id } = RequestBodySchema.parse(await req.json());
		const { authorization } = RequestHeadersSchema.parse(
			Object.fromEntries(req.headers.entries()),
		);

		const config = createConfig();
		const telegramBot = createTelegram(config.telegram);

		await sendTestMessage(telegramBot, chat_id);

		return new Response(JSON.stringify({ ok: true }), {
			headers: { "Content-Type": "application/json" },
			status: 200,
		});
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
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-telegram-test' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"chat_id":"123456789"}'

*/
