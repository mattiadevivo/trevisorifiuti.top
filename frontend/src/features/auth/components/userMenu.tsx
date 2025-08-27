import { Show } from "solid-js";
import { useAuth } from "../../../app/context/auth";
import { A } from "@solidjs/router";

export function UserMenu() {
  const auth = useAuth();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Show when={auth.user()}>
      <div class="dropdown dropdown-end">
        <div
          tabindex="0"
          role="button"
          class="flex flex-row items-center gap-2 btn btn-ghost p-0"
        >
          <span
            class="avatar bg-accent items-center justify-center overflow-hidden text-xs rounded-md hover:border-transparent h-8 w-8"
            data-state="closed"
          >
            <span class="items-center justify-center">
              {auth.user()?.email?.charAt(0).toUpperCase()}
            </span>
          </span>
          <div class="hidden md:flex">
            <p class="min-w-0 max-w-48 truncate">
              {auth.user()?.email || "User"}
            </p>
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <A href="/account">Notification Settings</A>
          </li>
          <li>
            <button onClick={handleSignOut}>Logout</button>
          </li>
        </ul>
      </div>
    </Show>
  );
}
