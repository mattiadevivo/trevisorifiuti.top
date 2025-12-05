import type { Component } from "solid-js";
import { useI18n } from "../../../app/context/i18n";

export const InstructionsCard: Component<{ show: boolean }> = (props) => {
	const { t } = useI18n();
	return (
		<div
			class={`card bg-base-100 shadow-xl transition-all duration-300 ${
				props.show ? "ring-2 ring-primary" : ""
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
						<title>Info icon</title>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
						/>
					</svg>
					{t("account.instructions.title")}
				</h3>

				<div class="space-y-4 text-sm">
					<div class="steps steps-vertical">
						<div class="step step-primary">
							<div class="text-left">
								<div class="font-semibold">{t("account.instructions.step1Title")}</div>
								<div class="text-gray-600">{t("account.instructions.step1Desc")}</div>
							</div>
						</div>

						<div class="step step-primary">
							<div class="text-left">
								<div class="font-semibold">{t("account.instructions.step2Title")}</div>
								<div class="text-gray-600">{t("account.instructions.step2Desc")}</div>
							</div>
						</div>

						<div class="step step-primary">
							<div class="text-left">
								<div class="font-semibold">{t("account.instructions.step3Title")}</div>
								<div class="text-gray-600">{t("account.instructions.step3Desc")}</div>
							</div>
						</div>

						<div class="step step-primary">
							<div class="text-left">
								<div class="font-semibold">{t("account.instructions.step4Title")}</div>
								<div class="text-gray-600">{t("account.instructions.step4Desc")}</div>
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
							<title>Info icon</title>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
						<div>
							<div class="font-semibold">{t("account.instructions.alternativeTitle")}</div>
							<p class="text-xs mt-1">{t("account.instructions.alternativeDesc")}</p>
						</div>
					</div>

					<div class="alert alert-warning">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current shrink-0 w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
						>
							<title>Warning icon</title>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
						<div>
							<div class="font-semibold">{t("account.instructions.privateTitle")}</div>
							<p class="text-xs mt-1">{t("account.instructions.privateDesc")}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
