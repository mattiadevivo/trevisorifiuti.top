import { type Component } from "solid-js";
import { useI18n } from "../../../app/context/i18n";
import { Button } from "@ui/button";

export const LanguageFloatButton: Component = () => {
	const { locale, setLocale, t } = useI18n();

	const toggle = () => {
		setLocale(locale() === "it" ? "en" : "it");
	};

	return (
		<Button aria-label={t("language.toggle")} size="lg" onClick={toggle} shape="circle" shadow="lg">{locale() === "it" ? "🇮🇹" : "🇬🇧"}</Button>
	);
};
