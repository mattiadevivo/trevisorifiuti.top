import { type Component } from "solid-js";
import { A } from "@solidjs/router";

import { Calendar, Settings, LogOut, Trash2 } from "lucide-solid";
import { useTheme } from "../../context/theme";

interface Navbar {
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export const Navbar: Component<Navbar> = (props) => {
  const { theme, setTheme } = useTheme();
  return (
    <div class="navbar bg-base-100 shadow-sm">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">TVTrash</a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <A href="/municipalities">Calendar</A>
          </li>
          <label class="toggle text-base-content">
            <input
              type="checkbox"
              value="synthwave"
              class="theme-controller"
              checked={theme() === "halloween"}
              onChange={() => {
                const newTheme =
                  theme() === "halloween" ? "emerald" : "halloween";
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
          <li>
            <details>
              <summary>Parent</summary>
              <ul class="bg-base-100 rounded-t-none p-2">
                <li>
                  <a>Link 1</a>
                </li>
                <li>
                  <a>Link 2</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};
