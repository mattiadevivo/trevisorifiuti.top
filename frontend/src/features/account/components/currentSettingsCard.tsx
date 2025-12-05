import { Button } from "@ui/button";
import { type Component, Show } from "solid-js";
import { useI18n } from "../../../app/context/i18n";
import type { Municipality } from "../../../supabase";
import type { NotificationPreference } from "../../../supabase/account";
import type { TelegramNotificationInfo } from "../schemas/notification";

interface Props {
	isConfigured: boolean;
	notificationPreference: NotificationPreference | null | undefined;
	municipalities: Municipality[] | undefined;
	onDelete: () => void;
}

export const CurrentSettingsCard: Component<Props> = (props) => {
	const { t } = useI18n();
	return (
		<div class="card bg-base-100 shadow-xl mt-6 transition-all duration-300">
			<div class="card-body">
				<h3 class="card-title text-lg">{t("account.currentSettings.title")}</h3>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-gray-600">{t("account.currentSettings.status")}</span>
						<div class="badge badge-outline">
							{props.isConfigured
								? t("account.currentSettings.configured")
								: t("account.currentSettings.notConfigured")}
						</div>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">{t("account.currentSettings.municipality")}</span>
						<span class="font-medium">
							{props.isConfigured &&
							props.notificationPreference?.municipality_id &&
							props.municipalities
								? props.municipalities.find(
										(m) => m.id === props.notificationPreference?.municipality_id,
									)?.name
								: t("account.currentSettings.notSet")}
						</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">{t("account.currentSettings.chatId")}</span>
						<span class="font-mono text-xs">
							{props.isConfigured && props.notificationPreference?.notification_info
								? "***" +
									(
										(props.notificationPreference.notification_info as TelegramNotificationInfo)
											.chat_id ?? ""
									).slice(-4)
								: t("account.currentSettings.notSet")}
						</span>
					</div>
					<Show when={props.isConfigured}>
						<Button intent="danger" onClick={props.onDelete}>
							{t("account.currentSettings.deletePreference")}
						</Button>
					</Show>
				</div>
			</div>
		</div>
	);
};
