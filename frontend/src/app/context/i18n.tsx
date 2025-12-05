import {
	createContext,
	useContext,
	createSignal,
	createMemo,
	type Accessor,
	type JSX,
} from "solid-js";
import { flatten, translator, resolveTemplate, type Flatten } from "@solid-primitives/i18n";
import { en, it, type Dictionary } from "../../i18n/dictionaries";

const dicts = {
	en,
	it,
};

export type Locale = keyof typeof dicts;

export interface I18nContextInterface {
	t: ReturnType<typeof translator<Flatten<Dictionary>>>;
	locale: Accessor<Locale>;
	setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextInterface>();

export function I18nProvider(props: { children: JSX.Element }) {
	const [locale, setLocale] = createSignal<Locale>("it");

	const dict = createMemo(() => flatten(dicts[locale()]));

	// @ts-ignore - types mismatch between dictionary and flattened dictionary in the library types but it works at runtime
	const t = translator(dict, resolveTemplate);

	return (
		<I18nContext.Provider value={{ t, locale, setLocale }}>{props.children}</I18nContext.Provider>
	);
}

export function useI18n() {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error("useI18n must be used within an I18nProvider");
	}
	return context;
}
