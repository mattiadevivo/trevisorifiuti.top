import { SignInForm } from "../../features/auth/components/signInForm";
import { useAuth } from "../context/auth";
import { useNavigate } from "@solidjs/router";

export function AuthPage() {
  const redirectPage = "/";

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
      <SignInForm onSuccess={handleAuthSuccess} />
    </div>
  );
}
