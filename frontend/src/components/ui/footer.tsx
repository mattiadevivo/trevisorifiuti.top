import type { Component } from "solid-js";
import { useI18n } from "../../app/context/i18n";

export const Footer: Component = () => {
	const { t } = useI18n();
	return (
		<footer class="footer sm:footer-horizontal bg-base-100 text-base-content items-center py-4 px-8">
			<aside class="grid-flow-col items-center justify-self-center md:justify-self-start">
				<img src="/favicon.png" alt="TVTrash logo" class="size-8" />
				<p>TVTrash -</p>
				<p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
			</aside>
			<div class="grid-flow-col justify-self-center md:justify-self-end">
				{t("footer.madeBy")} <a href="https://mattiadevivo.dev">Mattia De Vivo</a>
			</div>
		</footer>
	);
};
