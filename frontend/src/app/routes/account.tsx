import { Button } from "@ui/button";
import { Spinner } from "@ui/spinner";
import { createEffect, createMemo, createResource, createSignal, Show, Suspense } from "solid-js";
import { useAuth } from "../../app/context/auth";
import { useConfig } from "../../app/context/config";
import { CurrentSettingsCard } from "../../features/account/components/currentSettingsCard";
import { InstructionsCard } from "../../features/account/components/instructionsCard";
import { TelegramNotificationForm } from "../../features/account/components/telegramNotificationForm";
import { WebPushNotificationForm } from "../../features/account/components/webPushNotificationForm";
import type { TelegramNotificationInfo } from "../../features/account/schemas/notification";
import { subscribe, unsubscribe } from "../../features/account/webPush";
import { getMunicipalities, type Municipality } from "../../supabase";
import {
	deleteNotificationPreference,
	getNotificationPreferenceByUserIdAndType,
	getTelegramNotificationTypeId,
	getWebPushNotificationTypeId,
	saveNotificationPreference,
} from "../../supabase/account";
import { useI18n } from "../context/i18n";
import { useSupabase } from "../context/supabase";

export function AccountPage() {
	const supabase = useSupabase();
	const auth = useAuth();
	const config = useConfig();
	const { t } = useI18n();

	const [municipalities] = createResource(supabase, getMunicipalities);
	const [telegramNotificationType] = createResource(supabase, getTelegramNotificationTypeId);
	const [webPushNotificationType] = createResource(supabase, getWebPushNotificationTypeId);

	// ource signal ensures re-fetch when user/type resolve
	const telegramSource = () => {
		const user = auth.user();
		const type = telegramNotificationType();
		return user && type ? { userId: user.id, typeId: type.id } : null;
	};
	const [telegramPreference, { refetch: refetchTelegramPreference }] = createResource(
		telegramSource,
		(source) => getNotificationPreferenceByUserIdAndType(supabase, source.userId, source.typeId),
	);

	// Web Push preference
	const webPushSource = () => {
		const user = auth.user();
		const type = webPushNotificationType();
		return user && type ? { userId: user.id, typeId: type.id } : null;
	};
	const [webPushPreference, { refetch: refetchWebPushPreference }] = createResource(
		webPushSource,
		(source) => getNotificationPreferenceByUserIdAndType(supabase, source.userId, source.typeId),
	);

	// Modal state
	const [showDeleteModal, setShowDeleteModal] = createSignal(false);
	const [isDeleting, setIsDeleting] = createSignal(false);
	const [deleteTarget, setDeleteTarget] = createSignal<"telegram" | "web_push">("telegram");

	// Telegram form state
	const [telegramChatId, setTelegramChatId] = createSignal("");
	const [selectedMunicipality, setSelectedMunicipality] = createSignal<Municipality["id"] | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const [success, setSuccess] = createSignal("");
	const [error, setError] = createSignal("");
	const [showInstructions, setShowInstructions] = createSignal(false);

	// Web Push form state
	const [wpSelectedMunicipality, setWpSelectedMunicipality] = createSignal<
		Municipality["id"] | null
	>(null);
	const [wpIsSubmitting, setWpIsSubmitting] = createSignal(false);
	const [wpSuccess, setWpSuccess] = createSignal("");
	const [wpError, setWpError] = createSignal("");

	// Memo for config status
	const isTelegramConfigured = createMemo(
		() =>
			telegramPreference() &&
			telegramPreference()!.municipality_id &&
			(telegramPreference()!.notification_info as TelegramNotificationInfo).chat_id,
	);

	const isWebPushEnabled = createMemo(() => !!webPushPreference()?.municipality_id);

	// Populate telegram form from resource
	createEffect(() => {
		const pref = telegramPreference();
		if (pref) {
			setTelegramChatId((pref.notification_info as TelegramNotificationInfo).chat_id);
			setSelectedMunicipality(pref.municipality_id);
		}
	});

	// Populate web push form from resource
	createEffect(() => {
		const pref = webPushPreference();
		if (pref) {
			setWpSelectedMunicipality(pref.municipality_id);
		}
	});

	// Telegram form submit handler
	const handleTelegramSubmit = async (e: Event) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setIsSubmitting(true);

		try {
			if (!telegramChatId().trim()) throw new Error(t("account.errors.enterChatId"));
			if (!telegramNotificationType())
				throw new Error(t("account.errors.notificationTypeNotFound"));
			if (!selectedMunicipality()) throw new Error(t("account.errors.selectMunicipality"));
			if (!/^-?\d+$/.test(telegramChatId().trim()))
				throw new Error(t("account.errors.invalidChatId"));

			await saveNotificationPreference(supabase, {
				municipality_id: selectedMunicipality(),
				user_id: auth.user().id,
				notification_info: {
					chat_id: telegramChatId().trim(),
				} satisfies TelegramNotificationInfo,
				notification_type_id: telegramNotificationType().id,
			});

			refetchTelegramPreference();
			setSuccess(t("account.success.profileUpdated"));
		} catch (err: any) {
			setError(err.message || t("account.errors.saveProfileError"));
		} finally {
			setIsSubmitting(false);
		}
	};

	// Web Push enable handler
	const handleWebPushEnable = async (e: Event) => {
		e.preventDefault();
		setWpError("");
		setWpSuccess("");
		setWpIsSubmitting(true);

		try {
			if (!wpSelectedMunicipality()) throw new Error(t("account.errors.selectMunicipality"));
			if (!webPushNotificationType())
				throw new Error(t("account.errors.notificationTypeNotFound"));

			const subscriptionInfo = await subscribe(config.webPushNotifications.vapidPublicKey);
			if (!subscriptionInfo) {
				setWpError(t("account.webPush.permissionDenied"));
				return;
			}

			await saveNotificationPreference(supabase, {
				municipality_id: wpSelectedMunicipality(),
				user_id: auth.user().id,
				notification_info: subscriptionInfo,
				notification_type_id: webPushNotificationType().id,
			});

			refetchWebPushPreference();
			setWpSuccess(t("account.success.profileUpdated"));
		} catch (err: any) {
			setWpError(err.message || t("account.errors.saveProfileError"));
		} finally {
			setWpIsSubmitting(false);
		}
	};

	// Web Push disable handler
	const handleWebPushDisable = async () => {
		setWpError("");
		setWpSuccess("");
		setWpIsSubmitting(true);

		try {
			await unsubscribe();
			await deleteNotificationPreference(
				supabase,
				auth.user().id,
				webPushNotificationType().id,
			);
			refetchWebPushPreference();
			setWpSuccess(t("account.success.deleted"));
		} catch (err: any) {
			setWpError(err.message || t("account.errors.deleteError"));
		} finally {
			setWpIsSubmitting(false);
		}
	};

	// Delete handler (for Telegram via modal)
	const handleDelete = async () => {
		setIsDeleting(true);
		setError("");
		setSuccess("");
		try {
			if (deleteTarget() === "telegram") {
				await deleteNotificationPreference(
					supabase,
					auth.user().id,
					telegramNotificationType().id,
				);
				refetchTelegramPreference();
			}
			setSuccess(t("account.success.deleted"));
			setShowDeleteModal(false);
		} catch (err: any) {
			setError(err.message || t("account.errors.deleteError"));
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
						<li>{t("account.profile")}</li>
						<li>{t("account.notificationSettings")}</li>
					</ul>
				</div>
				<h1 class="text-3xl font-bold mb-8">{t("account.notificationSettings")}</h1>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-6">
						<TelegramNotificationForm
							municipalities={municipalities()}
							selectedMunicipality={selectedMunicipality}
							onMunicipalityChange={setSelectedMunicipality}
							isSubmitting={isSubmitting}
							telegramChatId={telegramChatId}
							onTelegramChatIdInput={(v) => setTelegramChatId(v)}
							showInstructions={showInstructions}
							onToggleInstructions={() => setShowInstructions(!showInstructions())}
							error={error}
							success={success}
							onSubmit={handleTelegramSubmit}
						/>
						<WebPushNotificationForm
							municipalities={municipalities()}
							selectedMunicipality={wpSelectedMunicipality}
							onMunicipalityChange={setWpSelectedMunicipality}
							isSubmitting={wpIsSubmitting}
							isEnabled={isWebPushEnabled}
							error={wpError}
							success={wpSuccess}
							onEnable={handleWebPushEnable}
							onDisable={handleWebPushDisable}
						/>
					</div>
					<div>
						<InstructionsCard show={showInstructions()} />
						<CurrentSettingsCard
							isConfigured={!!isTelegramConfigured()}
							notificationPreference={telegramPreference()}
							municipalities={municipalities()}
							onDelete={() => {
								setDeleteTarget("telegram");
								setShowDeleteModal(true);
							}}
						/>
					</div>
				</div>
				{/* Delete Confirmation Modal */}
				<Show when={showDeleteModal()}>
					<dialog ref={modal} class="modal modal-open">
						<div class="modal-box">
							<h3 class="text-lg font-bold">{t("account.modal.deleteTitle")}</h3>
							<p class="py-4">{t("account.modal.deleteMessage")}</p>
							<div class="modal-action">
								<Button
									intent="primary"
									onClick={() => setShowDeleteModal(false)}
									disabled={isDeleting()}
								>
									{t("account.modal.cancel")}
								</Button>
								<Button intent="danger" onClick={handleDelete} disabled={isDeleting()}>
									{isDeleting() ? <Spinner /> : t("account.modal.delete")}
								</Button>
							</div>
						</div>
					</dialog>
				</Show>
			</div>
		</Suspense>
	);
}
