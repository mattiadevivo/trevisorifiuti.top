import { createSignal } from "solid-js";
import { useAuth } from "../../../app/context/auth";
import { useI18n } from "../../../app/context/i18n";

interface SignInFormProps {
	onSuccess: () => void;
}

export function SignInForm(_props: SignInFormProps) {
	const [email, setEmail] = createSignal("");
	const [error, setError] = createSignal("");
	const [success, setSuccess] = createSignal("");
	const [isSubmitting, setIsSubmitting] = createSignal(false);

	const auth = useAuth();
	const { t } = useI18n();

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setIsSubmitting(true);

		try {
			await auth.signInWithMagicLink(email());
			setSuccess(t("auth.signInSuccess"));
		} catch (err: any) {
			setError(err.message || t("auth.signInError"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div class="card w-96 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title justify-center">{t("auth.signIn")}</h2>

				<p class="label-text">{t("auth.signInDescription")}</p>
				<form onSubmit={handleSubmit} class="space-y-4">
					<div class="form-control">
						<label class="label" for="email">
							<span class="label-text">{t("auth.email")}</span>
						</label>
						<input
							id="email"
							type="email"
							placeholder={t("auth.emailPlaceholder")}
							class="input input-bordered"
							value={email()}
							onInput={(e) => setEmail(e.currentTarget.value)}
							required
							disabled={isSubmitting()}
						/>
					</div>

					{error() && (
						<div class="alert alert-error">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="stroke-current shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Error icon</title>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{error()}</span>
						</div>
					)}

					{success() && (
						<div class="alert alert-success">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="stroke-current shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<title>Success icon</title>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{success()}</span>
						</div>
					)}

					<div class="form-control mt-6">
						<button type="submit" class="btn btn-primary" disabled={isSubmitting()}>
							{isSubmitting() ? (
								<>
									<span class="loading loading-spinner loading-sm"></span>
									{t("auth.sendingEmail")}
								</>
							) : (
								t("auth.signIn")
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
