import { render } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { I18nProvider } from "../src/app/context/i18n";

/**
 * Renders a SolidJS component wrapped in the I18nProvider (Italian locale by default).
 * Use this for any component that calls useI18n().
 */
export function renderWithI18n(ui: () => JSX.Element) {
	return render(() => <I18nProvider>{ui()}</I18nProvider>);
}
