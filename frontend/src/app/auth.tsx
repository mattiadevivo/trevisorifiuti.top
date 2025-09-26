import { createSignal } from "solid-js";
import { create as createConfig } from "../config";
import { create as createSupabase } from "../supabase";
import { useAuth } from "./context/auth";

export default function Auth() {
	const [loading, setLoading] = createSignal(false);
	const [email, setEmail] = createSignal("");
	const authContext = useAuth();
	const config = createConfig();
	const supabase = createSupabase(config.supabase);

	const handleLogin = async (e: SubmitEvent) => {
		e.preventDefault();

		try {
			setLoading(true);
			authContext.signInWithMagicLink(email());
			const { error } = await supabase.auth.signInWithOtp({
				email: email(),
				options: { emailRedirectTo: config.login.rediectUrl },
			});
			if (error) throw error;
			alert("Check your email for the login link!");
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div class="row flex-center flex">
			<div class="col-6 form-widget" aria-live="polite">
				<h1 class="header">Supabase + SolidJS</h1>
				<p class="description">Sign in via magic link with your email below</p>
				<form class="form-widget" onSubmit={handleLogin}>
					<div>
						<label for="email">Email</label>
						<input
							id="email"
							class="inputField"
							type="email"
							placeholder="Your email"
							value={email()}
							onChange={(e) => setEmail(e.currentTarget.value)}
						/>
					</div>
					<div>
						<button type="submit" class="button block" aria-live="polite">
							{loading() ? <span>Loading</span> : <span>Send magic link</span>}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
