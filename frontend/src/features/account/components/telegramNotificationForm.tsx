import { For, Show, type Component } from "solid-js";
import { Select } from "@ui/select";
import type { Municipality } from "../../../supabase";

interface Props {
  municipalities: Municipality[] | undefined;
  selectedMunicipality: () => Municipality["id"] | null;
  onMunicipalityChange: (value: Municipality["id"]) => void;
  isSubmitting: () => boolean;

  telegramChatId: () => string;
  onTelegramChatIdInput: (value: string) => void;

  showInstructions: () => boolean;
  onToggleInstructions: () => void;

  error: () => string;
  success: () => string;

  onTestNotification: () => void;
  onSubmit: (e: Event) => void;
}

export const TelegramNotificationForm: Component<Props> = (props) => {
  return (
    <div class="card bg-base-100 shadow-xl transition-all duration-300">
      <div class="card-body">
        <h2 class="card-title mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="size-6 text-blue-500"
          >
            <title>Telegram logo</title>
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Telegram Notifications
        </h2>
        <form onSubmit={props.onSubmit} class="space-y-6">
          {/* Municipality Selection */}
          <div>
            <label class="label" for="municipality">
              <span class="label-text font-semibold">Municipality of Interest</span>
              <span class="label-text-alt text-error">*</span>
            </label>
            <Show when={props.municipalities}>
              <Select
                id="municipality"
                width="full"
                value={props.selectedMunicipality()}
                required
                onChange={(value: Municipality["id"]) => props.onMunicipalityChange(value)}
                disabled={props.isSubmitting()}
              >
                <option value={null}>Select your municipality</option>
                <For each={props.municipalities}>
                  {(municipality) => (
                    <option value={municipality.id}>
                      {municipality.name} {municipality.area ? `(${municipality.area})` : ""}
                    </option>
                  )}
                </For>
              </Select>
            </Show>
            <Show when={!props.municipalities}>
              <Select width="full" disabled onChange={() => {}}>
                <option>Loading...</option>
              </Select>
            </Show>
            <span class="text-sm text-base-content">
              You'll receive notifications for events in this municipality
            </span>
          </div>

          {/* Telegram Chat ID */}
          <div>
            <label class="label" for="telegram-chat-id">
              <span class="label-text font-semibold">Telegram Chat ID</span>
              <span class="label-text-alt text-error">*</span>
            </label>
            <div class="input-group">
              <input
                id="telegram-chat-id"
                type="text"
                placeholder="Enter your Chat ID (e.g., 123456789)"
                class="input input-bordered flex-1"
                value={props.telegramChatId()}
                onInput={(e) => props.onTelegramChatIdInput(e.currentTarget.value)}
                required
                disabled={props.isSubmitting()}
              />
              <button
                type="button"
                class="btn btn-outline"
                onClick={props.onToggleInstructions}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <title>Question mark logo</title>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
                Help
              </button>
            </div>
            <label for="telegram-chat-id">
              <span class="text-sm text-base-content">
                Don't know your Chat ID? Click "Help" for instructions
              </span>
            </label>
          </div>

          {/* Error/Success Messages */}
          <Show when={props.error()}>
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
              <span>{props.error()}</span>
            </div>
          </Show>
          <Show when={props.success()}>
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
              <span>{props.success()}</span>
            </div>
          </Show>

          {/* Action Buttons */}
          <div class="card-actions justify-between">
            <button
              type="button"
              class="btn btn-outline"
              onClick={props.onTestNotification}
              disabled={props.isSubmitting() || !props.telegramChatId().trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4 mr-2"
              >
                <title>Send icon</title>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
              Send Test Message
            </button>
            <button type="submit" class="btn btn-primary" disabled={props.isSubmitting()}>
              {props.isSubmitting() ? (
                <>
                  <span class="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-4 mr-2"
                  >
                    <title>Save icon</title>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
