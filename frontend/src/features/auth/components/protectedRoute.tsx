import { Show } from "solid-js";
import { useAuth } from "../../../app/context/auth";

interface Props {
  children: any;
}

export function ProtectedRoute(props: Props) {
  const auth = useAuth();

  return (
    <Show
      when={!auth.loading()}
      fallback={
        <div class="min-h-screen bg-base-200 flex items-center justify-center">
          <div class="loading loading-spinner loading-lg"></div>
        </div>
      }
    >
      <Show
        when={auth.user()}
        fallback={
          <div class="min-h-screen bg-base-200 flex items-center justify-center">
            <div class="card w-96 bg-base-100 shadow-xl">
              <div class="card-body text-center">
                <h2 class="card-title justify-center">Access Denied</h2>
                <p>You need to be logged in to access this page.</p>
                <div class="card-actions justify-center">
                  <a href="/auth" class="btn btn-primary">
                    Sign In
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
      >
        {props.children}
      </Show>
    </Show>
  );
}
