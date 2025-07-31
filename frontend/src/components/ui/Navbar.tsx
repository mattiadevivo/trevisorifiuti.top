import { type Component } from "solid-js";
import { A } from "@solidjs/router";

import { Calendar, Settings, LogOut, Trash2 } from "lucide-solid";

interface NavigationProps {
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export const Navigation: Component<NavigationProps> = (props) => {
  return (
    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <Trash2 class="h-8 w-8 text-primary-600" />
              <span class="ml-2 text-xl font-bold text-gray-900">TVTrash</span>
            </div>

            <div class="hidden sm:ml-8 sm:flex sm:space-x-8">
              <A
                href="/"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-primary-300 transition-colors"
                activeClass="border-primary-500 text-primary-600"
              >
                <Calendar class="h-4 w-4 mr-2" />
                Dashboard
              </A>
              <A
                href="/settings"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:border-primary-300 hover:text-gray-700 transition-colors"
                activeClass="border-primary-500 text-primary-600"
              >
                <Settings class="h-4 w-4 mr-2" />
                Settings
              </A>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            {props.currentUser ? (
              <>
                <span class="text-sm text-gray-700">
                  {props.currentUser.name}
                </span>
                <button
                  onClick={props.onLogout}
                  class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <LogOut class="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <A
                href="/login"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Login
              </A>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
