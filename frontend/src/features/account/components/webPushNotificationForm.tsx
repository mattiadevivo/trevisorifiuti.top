import { Button } from "@ui/button";
import { Select } from "@ui/select";
import { type Component, For, Show } from "solid-js";
import { useI18n } from "../../../app/context/i18n";
import type { Municipality } from "../../../supabase";
import { getPermissionState, isWebPushSupported } from "../webPush";

interface Props {
	municipalities: Municipality[] | undefined;
	selectedMunicipality: () => Municipality["id"] | null;
	onMunicipalityChange: (value: Municipality["id"]) => void;
	isSubmitting: () => boolean;
	isEnabled: () => boolean;

	error: () => string;
	success: () => string;

	onEnable: (e: Event) => void;
	onDisable: () => void;
}

export const WebPushNotificationForm: Component<Props> = (props) => {
	const { t } = useI18n();
	const supported = isWebPushSupported();
	const permissionDenied = () => getPermissionState() === "denied";

	return (
		<div class="card bg-base-100 shadow-xl transition-all duration-300">
			<div class="card-body">
				<h2 class="card-title mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6 text-purple-500"
					>
						<title>Push notification icon</title>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
						/>
					</svg>
					{t("account.webPush.title")}
				</h2>

				<p class="text-sm text-base-content/70 mb-4">{t("account.webPush.description")}</p>

				<Show when={!supported}>
					<div class="alert alert-warning">{t("account.webPush.notSupported")}</div>
				</Show>

				<Show when={supported && permissionDenied()}>
					<div class="alert alert-warning">{t("account.webPush.permissionDenied")}</div>
				</Show>

				<Show when={supported && !permissionDenied()}>
					<form onSubmit={props.onEnable} class="space-y-6">
						{/* Municipality Selection */}
						<div>
							<label class="label" for="wp-municipality">
								<span class="label-text font-semibold">
									{t("account.form.municipalityLabel")}
								</span>
								<span class="label-text-alt text-error">*</span>
							</label>
							<Show when={props.municipalities}>
								<Select
									id="wp-municipality"
									width="full"
									value={props.selectedMunicipality()}
									required
									onChange={(value: Municipality["id"]) =>
										props.onMunicipalityChange(value)
									}
									disabled={props.isSubmitting()}
								>
									<option value={null}>{t("account.form.selectPlaceholder")}</option>
									<For each={props.municipalities}>
										{(municipality) => (
											<option value={municipality.id}>
												{municipality.name}{" "}
												{municipality.area ? `(${municipality.area})` : ""}
											</option>
										)}
									</For>
								</Select>
							</Show>
							<Show when={!props.municipalities}>
								<Select width="full" disabled onChange={() => {}}>
									<option>{t("account.form.loading")}</option>
								</Select>
							</Show>
						</div>

						{/* Status Badge */}
						<div class="flex items-center gap-2">
							<span class="text-sm text-base-content/70">
								{t("account.currentSettings.status")}
							</span>
							<div
								class={`badge ${props.isEnabled() ? "badge-success" : "badge-ghost"}`}
							>
								{props.isEnabled()
									? t("account.webPush.enabled")
									: t("account.webPush.disabled")}
							</div>
						</div>

						{/* Error/Success Messages */}
						<Show when={props.error()}>
							<div class="alert alert-error">
								<span>{props.error()}</span>
							</div>
						</Show>
						<Show when={props.success()}>
							<div class="alert alert-success">
								<span>{props.success()}</span>
							</div>
						</Show>

						{/* Action Buttons */}
						<div class="card-actions justify-between">
							<button
								type="submit"
								class="btn btn-primary"
								disabled={props.isSubmitting() || props.isEnabled()}
							>
								{props.isSubmitting() ? (
									<>
										<span class="loading loading-spinner loading-sm" />
										{t("account.form.saving")}
									</>
								) : (
									t("account.webPush.enable")
								)}
							</button>
							<Show when={props.isEnabled()}>
								<Button
									intent="danger"
									onClick={props.onDisable}
									disabled={props.isSubmitting()}
								>
									{t("account.webPush.disable")}
								</Button>
							</Show>
						</div>
					</form>
				</Show>
			</div>
		</div>
	);
};
