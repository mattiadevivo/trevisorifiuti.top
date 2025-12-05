import { Button } from "@ui/button";
import { Spinner } from "@ui/spinner";
import { createEffect, createMemo, createResource, createSignal, Show, Suspense } from "solid-js";
import { useAuth } from "../../app/context/auth";
import { useSupabase } from "../context/supabase";
import { useI18n } from "../context/i18n";
import type { TelegramNotificationInfo } from "../../features/account/schemas/notification";
import { getMunicipalities, type Municipality } from "../../supabase";
import {
	deleteNotificationPreference,
	getNotificationPreferenceByUserId,
	getTelegramNotificationTypeId,
	type NotificationPreference,
	saveNotificationPreference,
	sendTestMessage,
} from "../../supabase/account";
import { TelegramNotificationForm } from "../../features/account/components/telegramNotificationForm";
import { InstructionsCard } from "../../features/account/components/instructionsCard";
import { CurrentSettingsCard } from "../../features/account/components/currentSettingsCard";

export function AccountPage() {
	const supabase = useSupabase();
	const auth = useAuth();
	const { t } = useI18n();

	const [municipalities] = createResource(supabase, getMunicipalities);
	const [telegramNotificationType] = createResource(supabase, getTelegramNotificationTypeId);
	const [notificationPreference, { refetch: refetchNotificationPreference }] =
		createResource<NotificationPreference>(async () => {
			if (auth.user()) {
				return await getNotificationPreferenceByUserId(supabase, auth.user().id);
			}
			return null;
		});
	// Modal state
	const [showDeleteModal, setShowDeleteModal] = createSignal(false);
	const [isDeleting, setIsDeleting] = createSignal(false);

	// Form state
	const [telegramChatId, setTelegramChatId] = createSignal("");
	const [selectedMunicipality, setSelectedMunicipality] = createSignal<Municipality["id"] | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = createSignal(false);
	const [success, setSuccess] = createSignal("");
	const [error, setError] = createSignal("");
	const [showInstructions, setShowInstructions] = createSignal(false);

	// Memo for config status
	const isNotificationPreferenceConfigured = createMemo(
		() =>
			notificationPreference() &&
			notificationPreference()!.municipality_id &&
			(notificationPreference()!.notification_info as TelegramNotificationInfo).chat_id,
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

			refetchNotificationPreference();
			setSuccess(t("account.success.profileUpdated"));
		} catch (err: any) {
			setError(err.message || t("account.errors.saveProfileError"));
		} finally {
			setIsSubmitting(false);
		}
	};

	// Test notification handler
	const testNotification = async () => {
		if (!telegramChatId().trim()) {
			setError(t("account.errors.saveChatIdFirst"));
			return;
		}
		try {
			await sendTestMessage(
				supabase,
				(await auth.getSession()).access_token,
				telegramChatId().trim(),
			);
			setSuccess(t("account.success.testSent"));
		} catch {
			setError(t("account.errors.sendTestError"));
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
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div>
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
							onTestNotification={testNotification}
							onSubmit={handleSubmit}
						/>
					</div>
					<div>
						<InstructionsCard show={showInstructions()} />
						<CurrentSettingsCard
							isConfigured={!!isNotificationPreferenceConfigured()}
							notificationPreference={notificationPreference()}
							municipalities={municipalities()}
							onDelete={() => {
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
