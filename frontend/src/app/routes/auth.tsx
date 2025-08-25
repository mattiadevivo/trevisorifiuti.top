import { createSignal, Show } from "solid-js";
import {
  LoginForm,
  SignupForm,
} from "../../features/auth/components/loginForm";
import { useAuth } from "../context/auth";
import { useNavigate } from "@solidjs/router";

export function AuthPage() {
  const redirectPage = "/";

  const [isLoggedIn, setIsLoggedIn] = createSignal<boolean>(true);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate(redirectPage);
  };

  // Redirect if already authenticated
  if (auth.user()) {
    navigate(redirectPage);
    return null;
  }

  return (
    <div class="min-h-screen max-w-screen flex items-center justify-center p-4">
      <Show
        when={isLoggedIn()}
        fallback={
          <SignupForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignup={() => setIsLoggedIn(true)}
          />
        }
      >
        <LoginForm
          onSuccess={handleAuthSuccess}
          onSwitchToSignup={() => setIsLoggedIn(false)}
        />
      </Show>
    </div>
  );
}
