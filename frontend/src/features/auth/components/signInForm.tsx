import { createSignal } from "solid-js";
import { useAuth } from "../../../app/context/auth";

interface SignInFormProps {
	onSuccess: () => void;
}

export function SignInForm(_props: SignInFormProps) {
	const [email, setEmail] = createSignal("");
	const [error, setError] = createSignal("");
	const [success, setSuccess] = createSignal("");
	const [isSubmitting, setIsSubmitting] = createSignal(false);

	const auth = useAuth();

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setIsSubmitting(true);

		try {
			await auth.signInWithMagicLink(email());
			setSuccess(
				"Please check the login link in your email inbox in order to complete the sign-in process.",
			);
		} catch (err: any) {
			setError(err.message || "An error occurred during sign-in.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div class="card w-96 bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title justify-center">Sign In</h2>

				<p class="label-text">Insert your email, you'll receive a link that will be used as OTP</p>
				<form onSubmit={handleSubmit} class="space-y-4">
					<div class="form-control">
						<label class="label" for="email">
							<span class="label-text">Email</span>
						</label>
						<input
							id="email"
							type="email"
							placeholder="Enter your email"
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
									Sending email...
								</>
							) : (
								"Sign In"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
