import { type Component, Show } from "solid-js";
import { useTheme } from "../../../app/context/theme";
import { useI18n } from "../../../app/context/i18n";
import { Button } from "@ui/button";

export const ThemeFloatButton: Component = () => {
	const { theme, setTheme } = useTheme();
	const { t } = useI18n();

	const toggle = () => {
		setTheme(theme() === "dark" ? "light" : "dark");
	};

	return (
		<Button aria-label={t("theme.toggle")} size="lg" onClick={toggle} shape="circle" shadow="lg">
			<Show
				when={theme() === "dark"}
				fallback={
					/* Light theme currently active -> show moon to indicate switching to dark */
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						class="size-5"
					>
						<title>{t("theme.switchToDark")}</title>
						<g
							stroke-linejoin="round"
							stroke-linecap="round"
							stroke-width="2"
							fill="none"
							stroke="currentColor"
						>
							<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
						</g>
					</svg>
				}
			>
				{/* Dark theme currently active -> show sun to indicate switching to light */}
				<svg
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					class="size-5"
				>
					<title>{t("theme.switchToLight")}</title>
					<g
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke-width="2"
						fill="none"
						stroke="currentColor"
					>
						<circle cx="12" cy="12" r="4"></circle>
						<path d="M12 2v2"></path>
						<path d="M12 20v2"></path>
						<path d="m4.93 4.93 1.41 1.41"></path>
						<path d="m17.66 17.66 1.41 1.41"></path>
						<path d="M2 12h2"></path>
						<path d="M20 12h2"></path>
						<path d="m6.34 17.66-1.41 1.41"></path>
						<path d="m19.07 4.93-1.41 1.41"></path>
					</g>
				</svg>
			</Show>
		</Button>
	);
};
