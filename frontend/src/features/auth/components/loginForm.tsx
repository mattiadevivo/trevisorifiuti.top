import { createSignal } from "solid-js";
import { useAuth } from "../../../app/context/auth";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export function LoginForm(props: LoginFormProps) {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const auth = useAuth();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await auth.signIn(email(), password());
      props.onSuccess?.();
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center">Sign In</h2>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              class="input input-bordered"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              required
              disabled={isSubmitting()}
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              class="input input-bordered"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
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

          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary"
              disabled={isSubmitting()}
            >
              {isSubmitting() ? (
                <>
                  <span class="loading loading-spinner loading-sm"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div class="divider">OR</div>

        <div class="text-center space-y-2">
          <button
            class="btn btn-ghost btn-sm"
            onClick={() => props.onSwitchToSignup?.()}
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export function SignupForm(props: LoginFormProps) {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const auth = useAuth();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (password() !== confirmPassword()) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (password().length < 6) {
      setError("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      await auth.signUp(email(), password());
      setSuccess(
        "Account created successfully! Please check your email to confirm your account."
      );
    } catch (err: any) {
      if (err.message.includes("email")) {
        setSuccess("Please check your email to confirm your account.");
      } else {
        setError(err.message || "An error occurred during signup");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center">Sign Up</h2>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              class="input input-bordered"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              required
              disabled={isSubmitting()}
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              class="input input-bordered"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              required
              disabled={isSubmitting()}
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              class="input input-bordered"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
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
            <button
              type="submit"
              class="btn btn-primary"
              disabled={isSubmitting()}
            >
              {isSubmitting() ? (
                <>
                  <span class="loading loading-spinner loading-sm"></span>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        <div class="divider">OR</div>

        <div class="text-center space-y-2">
          <button
            class="btn btn-ghost btn-sm"
            onClick={() => props.onSwitchToSignup?.()}
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
