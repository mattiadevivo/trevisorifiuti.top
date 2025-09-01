import {
  createSignal,
  createResource,
  Show,
  For,
  Suspense,
  createEffect,
  createMemo,
  Component,
} from "solid-js";
import { useAuth } from "../../app/context/auth";
import { create as createConfig } from "../../config";
import {
  create as createSupabase,
  getMunicipalities,
  Municipality,
} from "../../supabase";
import { Select } from "@ui/select";
import {
  deleteNotificationPreference,
  getNotificationPreferenceByUserId,
  getTelegramNotificationTypeId,
  NotificationPreference,
  saveNotificationPreference,
} from "../../supabase/account";
import { TelegramNotificationInfo } from "../../features/account/schemas/notification";
import { Spinner } from "@ui/spinner";
import { Button } from "@ui/Button";
import { set } from "zod";

// --- Instructions Card ---
const InstructionsCard: Component<{ show: boolean }> = (props) => (
  <div
    class={`card bg-base-100 shadow-xl transition-all duration-300 ${props.show ? "ring-2 ring-primary" : ""
      }`}
  >
    <div class="card-body">
      <h3 class="card-title text-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
        How to Get Your Chat ID
      </h3>

      <div class="space-y-4 text-sm">
        <div class="steps steps-vertical">
          <div class="step step-primary">
            <div class="text-left">
              <div class="font-semibold">Open Telegram</div>
              <div class="text-gray-600">
                Launch the Telegram app on your device
              </div>
            </div>
          </div>

          <div class="step step-primary">
            <div class="text-left">
              <div class="font-semibold">Find @userinfobot</div>
              <div class="text-gray-600">
                Search for and start a chat with @userinfobot
              </div>
            </div>
          </div>

          <div class="step step-primary">
            <div class="text-left">
              <div class="font-semibold">Send /start</div>
              <div class="text-gray-600">
                Type /start and send the message
              </div>
            </div>
          </div>

          <div class="step step-primary">
            <div class="text-left">
              <div class="font-semibold">Copy Your ID</div>
              <div class="text-gray-600">
                The bot will reply with your Chat ID. Copy the number.
              </div>
            </div>
          </div>
        </div>

        <div class="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-current shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <div class="font-semibold">Alternative Method</div>
            <p class="text-xs mt-1">
              You can also message @chatidbot and it will reply with
              your Chat ID.
            </p>
          </div>
        </div>

        <div class="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <div class="font-semibold">Keep it Private</div>
            <p class="text-xs mt-1">
              Never share your Chat ID with untrusted sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Current Settings Card ---
const CurrentSettingsCard: Component<{
  isConfigured: boolean;
  notificationPreference: NotificationPreference | null | undefined;
  municipalities: Municipality[] | undefined;
  onDelete: () => void;
}> = (props) => (
  <div class="card bg-base-100 shadow-xl mt-6">
    <div class="card-body">
      <h3 class="card-title text-lg">Current Settings</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Status:</span>
          <div class="badge badge-outline">
            {props.isConfigured ? "Configured" : "Not Configured"}
          </div>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Municipality:</span>
          <span class="font-medium">
            {props.isConfigured && props.notificationPreference?.municipality_id && props.municipalities
              ? props.municipalities.find(
                (m) => m.id === props.notificationPreference?.municipality_id
              )?.name
              : "Not set"}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Chat ID:</span>
          <span class="font-mono text-xs">
            {props.isConfigured && props.notificationPreference?.notification_info
              ? "***" +
              ((props.notificationPreference.notification_info as TelegramNotificationInfo).chat_id ?? "").slice(-4)
              : "Not set"}
          </span>
        </div>
        <Show when={props.isConfigured}>
          <Button
            intent="danger"
            onClick={props.onDelete}
          >
            Delete Notification Preference
          </Button>
        </Show>
      </div>
    </div>
  </div>
);

export function AccountPage() {
  const config = createConfig();
  const supabase = createSupabase(config.supabase);
  const auth = useAuth();

  const [municipalities] = createResource(supabase, getMunicipalities);
  const [telegramNotificationType] = createResource(supabase, getTelegramNotificationTypeId);
  const [notificationPreference, { refetch: refetchNotificationPreference }] = createResource<NotificationPreference>(
    async () => {
      if (auth.user()) {
        return await getNotificationPreferenceByUserId(supabase, auth.user().id);
      }
      return null;
    }
  );
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);

  // Form state
  const [telegramChatId, setTelegramChatId] = createSignal("");
  const [selectedMunicipality, setSelectedMunicipality] = createSignal<Municipality["id"] | null>(null);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [success, setSuccess] = createSignal("");
  const [error, setError] = createSignal("");
  const [showInstructions, setShowInstructions] = createSignal(false);

  // Memo for config status
  const isNotificationPreferenceConfigured = createMemo(() =>
    notificationPreference() &&
    notificationPreference()!.municipality_id &&
    (notificationPreference()!.notification_info as TelegramNotificationInfo).chat_id
  );

  // Populate form from resource
  createEffect(() => {
    const pref = notificationPreference();
    if (pref) {
      setTelegramChatId((pref.notification_info as TelegramNotificationInfo).chat_id);
      setSelectedMunicipality(pref.municipality_id);
    }
  });

  // Form submit handler
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (!telegramChatId().trim()) throw new Error("Please enter your Telegram Chat ID");
      if (!telegramNotificationType()) throw new Error("Telegram notification type not found");
      if (!selectedMunicipality()) throw new Error("Please select a municipality");
      if (!/^-?\d+$/.test(telegramChatId().trim())) throw new Error("Invalid Chat ID format. It should be a number.");

      await saveNotificationPreference(supabase, {
        municipality_id: selectedMunicipality(),
        user_id: auth.user().id,
        notification_info: { chat_id: telegramChatId().trim() } satisfies TelegramNotificationInfo,
        notification_type_id: telegramNotificationType().id,
      });

      refetchNotificationPreference();
      setSuccess("Profile updated successfully! You will start receiving notifications soon.");
    } catch (err: any) {
      setError(err.message || "An error occurred while saving your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test notification handler
  const testNotification = async () => {
    if (!telegramChatId().trim()) {
      setError("Please save your Chat ID first");
      return;
    }
    try {
      // await fetch('/api/telegram/test', { ... })
      setSuccess("Test notification sent! Check your Telegram.");
    } catch {
      setError("Failed to send test notification");
    }
  };

  // Delete notificationPreference handler
  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    setSuccess("");
    try {
      await deleteNotificationPreference(supabase, auth.user().id);
      refetchNotificationPreference();
      setSuccess("Notification preference deleted. You will no longer receive notifications.");
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to delete notification preference.");
    } finally {
      setIsDeleting(false);
    }
  };

  let modal!: HTMLDialogElement;


  return (
    <Suspense fallback={<Spinner />}>
      <div class="min-h-screen">
        <div class="breadcrumbs text-sm mb-6">
          <ul>
            <li>Profile</li>
            <li>Notification Settings</li>
          </ul>
        </div>
        <h1 class="text-3xl font-bold mb-8">Notification Settings</h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="size-6 text-blue-500">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Telegram Notifications
                </h2>
                <form onSubmit={handleSubmit} class="space-y-6">
                  {/* Municipality Selection */}
                  <div>
                    <label class="label">
                      <span class="label-text font-semibold">Municipality of Interest</span>
                      <span class="label-text-alt text-error">*</span>
                    </label>
                    <Show when={municipalities()}>
                      <Select
                        width="full"
                        value={selectedMunicipality()}
                        required
                        onChange={(value: Municipality["id"]) => setSelectedMunicipality(value)}
                        disabled={isSubmitting()}
                      >
                        <option value={null}>Select your municipality</option>
                        <For each={municipalities()}>
                          {(municipality) => (
                            <option value={municipality.id}>
                              {municipality.name}{" "}
                              {municipality.area ? `(${municipality.area})` : ""}
                            </option>
                          )}
                        </For>
                      </Select>
                    </Show>
                    <Show when={!municipalities()}>
                      <Select width="full" disabled onChange={() => { }}>
                        <option>Loading...</option>
                      </Select>
                    </Show>
                    <label>
                      <span class="text-sm text-base-content">
                        You'll receive notifications for events in this municipality
                      </span>
                    </label>
                  </div>
                  {/* Telegram Chat ID */}
                  <div>
                    <label class="label">
                      <span class="label-text font-semibold">Telegram Chat ID</span>
                      <span class="label-text-alt text-error">*</span>
                    </label>
                    <div class="input-group">
                      <input
                        id="telegram-chat-id"
                        type="text"
                        placeholder="Enter your Chat ID (e.g., 123456789)"
                        class="input input-bordered flex-1"
                        value={telegramChatId()}
                        onInput={(e) => setTelegramChatId(e.currentTarget.value)}
                        required
                        disabled={isSubmitting()}
                      />
                      <button
                        type="button"
                        class="btn btn-outline"
                        onClick={() => setShowInstructions(!showInstructions())}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
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
                  <Show when={error()}>
                    <div class="alert alert-error">
                      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error()}</span>
                    </div>
                  </Show>
                  <Show when={success()}>
                    <div class="alert alert-success">
                      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{success()}</span>
                    </div>
                  </Show>
                  {/* Action Buttons */}
                  <div class="card-actions justify-between">
                    <button
                      type="button"
                      class="btn btn-outline"
                      onClick={testNotification}
                      disabled={isSubmitting() || !telegramChatId().trim()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                      Send Test Message
                    </button>
                    <button
                      type="submit"
                      class="btn btn-primary"
                      disabled={isSubmitting()}
                    >
                      {isSubmitting() ? (
                        <>
                          <span class="loading loading-spinner loading-sm"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-2">
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
          </div>
          <div>
            <InstructionsCard show={showInstructions()} />
            <CurrentSettingsCard
              isConfigured={!!isNotificationPreferenceConfigured()}
              notificationPreference={notificationPreference()}
              municipalities={municipalities()}
              onDelete={() => {
                setShowDeleteModal(true)
              }}
            />
          </div>
        </div>
        {/* Delete Confirmation Modal */}
        <Show when={showDeleteModal()}>
          <dialog ref={modal} class="modal modal-open">
            <div class="modal-box">
              <h3 class="text-lg font-bold">Delete Notification Preference?</h3>
              <p class="py-4">Are you sure you want to delete your notification preference? You will no longer receive notifications.</p>
              <div class="modal-action">
                <Button
                  intent="primary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting()}
                >
                  Cancel
                </Button>
                <Button
                  intent="danger"
                  onClick={handleDelete}
                  disabled={isDeleting()}
                >
                  {isDeleting() ? (
                    <Spinner/>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          </dialog>

        </Show>

      </div>

    </Suspense>
  );
}