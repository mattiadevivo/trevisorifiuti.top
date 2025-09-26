// components/TelegramNotificationBanner.tsx
import { createSignal, Show } from "solid-js";

interface TelegramNotificationBannerProps {
	onConfigureClick?: () => void;
}

export function TelegramNotificationBanner(props: TelegramNotificationBannerProps) {
	return (
		<div class="alert alert-info shadow-lg mb-6">
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
			<div class="flex-1">
				<h3 class="font-bold">Stay Updated with Telegram Notifications!</h3>
				<div class="text-sm opacity-75 mt-1">
					Configure your profile to receive calendar updates and reminders directly on Telegram.
				</div>
			</div>
			<div class="flex-none space-x-2">
				<button
					class="btn btn-sm btn-primary"
					type="button"
					onClick={() => props.onConfigureClick?.()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-4 h-4 mr-1"
					>
						<title>Settings icon</title>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					Configure
				</button>
			</div>
		</div>
	);
}

// Enhanced version with more features
export function TelegramNotificationCard() {
	const [isExpanded, setIsExpanded] = createSignal(false);

	return (
		<div class="card bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 shadow-md">
			<div class="card-body">
				<div class="flex items-start justify-between">
					<div class="flex items-center space-x-3">
						<div class="avatar placeholder">
							<div class="bg-blue-500 text-white rounded-full w-12 h-12">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 24 24"
									class="w-6 h-6"
								>
									<title>Info logo</title>
									<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
								</svg>
							</div>
						</div>
						<div>
							<h3 class="card-title text-lg">Telegram Notifications</h3>
							<p class="text-sm text-gray-600">Get calendar updates directly in Telegram</p>
						</div>
					</div>
					<button
						class="btn btn-circle btn-ghost btn-sm"
						type="button"
						onClick={() => setIsExpanded(!isExpanded())}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class={`w-4 h-4 transition-transform ${isExpanded() ? "rotate-180" : ""}`}
						>
							<title>Settings icon</title>
							<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
						</svg>
					</button>
				</div>

				<Show when={isExpanded()}>
					<div class="mt-4 space-y-3">
						<div class="bg-white p-3 rounded-lg border">
							<h4 class="font-semibold text-sm mb-2">Benefits:</h4>
							<ul class="text-sm space-y-1 text-gray-600">
								<li class="flex items-center space-x-2">
									<div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
									<span>Instant notifications for new events</span>
								</li>
								<li class="flex items-center space-x-2">
									<div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
									<span>Reminders before important dates</span>
								</li>
								<li class="flex items-center space-x-2">
									<div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
									<span>Municipality-specific updates</span>
								</li>
								<li class="flex items-center space-x-2">
									<div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
									<span>Weekly calendar summaries</span>
								</li>
							</ul>
						</div>

						<div class="card-actions">
							<a href="/account" class="btn btn-primary btn-sm">
								Set Up Notifications
							</a>
							<button type="button" class="btn btn-ghost btn-sm">
								Learn More
							</button>
						</div>
					</div>
				</Show>
			</div>
		</div>
	);
}
