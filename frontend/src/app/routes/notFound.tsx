import type { Component } from "solid-js";
import { useI18n } from "../context/i18n";

export const NotFoundPage: Component = () => {
	const { t } = useI18n();
	return <h1 class="text-3xl text-blue-700 text-center py-20">{t("notFound")}</h1>;
};
