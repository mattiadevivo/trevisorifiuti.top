import { Show, type Component } from "solid-js";
import type { Municipality } from "../../../supabase";
import type { NotificationPreference } from "../../../supabase/account";
import type { TelegramNotificationInfo } from "../schemas/notification";
import { Button } from "@ui/button";

interface Props {
  isConfigured: boolean;
  notificationPreference: NotificationPreference | null | undefined;
  municipalities: Municipality[] | undefined;
  onDelete: () => void;
}

export const CurrentSettingsCard: Component<Props> = (props) => (
  <div class="card bg-base-100 shadow-xl mt-6 transition-all duration-300">
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
            {props.isConfigured &&
            props.notificationPreference?.municipality_id &&
            props.municipalities
              ? props.municipalities.find(
                  (m) => m.id === props.notificationPreference?.municipality_id,
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
          <Button intent="danger" onClick={props.onDelete}>
            Delete Notification Preference
          </Button>
        </Show>
      </div>
    </div>
  </div>
);
