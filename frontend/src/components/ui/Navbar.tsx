import { Show, type Component } from "solid-js";
import { A } from "@solidjs/router";

import { useTheme } from "../../app/context/theme";
import { useAuth } from "../../app/context/auth";
import { UserMenu } from "../../features/auth/components/userMenu";

interface Navbar {
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export const Navbar: Component<Navbar> = (props) => {
  const auth = useAuth();
  const { theme, setTheme } = useTheme();
  return (
    <div class="navbar justify-between bg-base-100 text-base-content shadow-sm">
      <div class="flex-1">
        <A class="btn btn-ghost text-xl" href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width={1.5}
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          TVTrash
        </A>
      </div>

      <div class="flex items-center h-14 gap-2">
        <A href="/" class="btn btn-primary btn-sm">
          Calendar
        </A>
        <Show
          when={auth.user()}
          fallback={
            <>
              <A href="/auth" class="btn btn-accent btn-sm">
                Sign in
              </A>
            </>
          }
        >
          <UserMenu />
        </Show>
        <ul class="menu menu-horizontal px-1">
          <label class="toggle text-base-content justify-center">
            <input
              type="checkbox"
              value="synthwave"
              class="theme-controller"
              checked={theme() === "dark"}
              onChange={() => {
                const newTheme = theme() === "dark" ? "light" : "dark";
                setTheme(newTheme);
              }}
            />
            <svg
              aria-label="sun"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </g>
            </svg>
            <svg
              aria-label="moon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </g>
            </svg>
          </label>
        </ul>
      </div>
    </div>
  );
};
