import { Button } from "@ui/button";
import { Spinner } from "@ui/spinner";
import { createEffect, createMemo, createResource, createSignal, Show, Suspense } from "solid-js";
import { useAuth } from "../../app/context/auth";
import { useSupabase } from "../context/supabase";
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
			if (!telegramChatId().trim()) throw new Error("Please enter your Telegram Chat ID");
			if (!telegramNotificationType()) throw new Error("Telegram notification type not found");
			if (!selectedMunicipality()) throw new Error("Please select a municipality");
			if (!/^-?\d+$/.test(telegramChatId().trim()))
				throw new Error("Invalid Chat ID format. It should be a number.");

			await saveNotificationPreference(supabase, {
				municipality_id: selectedMunicipality(),
				user_id: auth.user().id,
				notification_info: {
					chat_id: telegramChatId().trim(),
				} satisfies TelegramNotificationInfo,
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
			await sendTestMessage(
				supabase,
				(await auth.getSession()).access_token,
				telegramChatId().trim(),
			);
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
							<h3 class="text-lg font-bold">Delete Notification Preference?</h3>
							<p class="py-4">
								Are you sure you want to delete your notification preference? You will no longer
								receive notifications.
							</p>
							<div class="modal-action">
								<Button
									intent="primary"
									onClick={() => setShowDeleteModal(false)}
									disabled={isDeleting()}
								>
									Cancel
								</Button>
								<Button intent="danger" onClick={handleDelete} disabled={isDeleting()}>
									{isDeleting() ? <Spinner /> : "Delete"}
								</Button>
							</div>
						</div>
					</dialog>
				</Show>
			</div>
		</Suspense>
	);
}
