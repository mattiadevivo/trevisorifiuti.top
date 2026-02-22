import type { Component } from "solid-js";
import { useI18n } from "../../app/context/i18n";
import { siGithub } from "simple-icons";

export const Footer: Component = () => {
	const { t } = useI18n();
	return (
		<footer class="footer sm:footer-horizontal bg-base-100 text-base-content items-center py-4 px-8">
			<aside class="grid-flow-col items-center justify-self-center md:justify-self-start">
				<a
					href="https://github.com/mattiadevivo/TVTrash"
					target="_blank"
					rel="noreferrer"
					class="btn btn-ghost btn-circle btn-sm"
					aria-label="GitHub"
				>
					<svg viewBox="0 0 24 24" role="img" class="fill-current">
						<title>GitHub</title>
						<path d={siGithub.path} />
					</svg>
				</a>
			</aside>
			<aside class="grid-flow-col justify-self-center">
				<a
					class="link text-center"
					href={t("compliance.privacyPolicy.href")}
					title={t("compliance.privacyPolicy.title")}
				>
					{t("compliance.privacyPolicy.title")}
				</a>
				<a
					class="link text-center"
					href={t("compliance.cookiePolicy.href")}
					title={t("compliance.cookiePolicy.title")}
				>
					{t("compliance.cookiePolicy.title")}
				</a>
				<a
					class="link text-center"
					href={t("compliance.termsAndConditions.href")}
					title={t("compliance.termsAndConditions.title")}
				>
					{t("compliance.termsAndConditions.title")}
				</a>
			</aside>
			<aside class="grid-flow-col justify-self-center md:justify-self-end items-center">
				<span>{t("footer.madeBy")} <a href="https://mattiadevivo.dev" target="_blank" rel="noreferrer">Mattia De Vivo</a></span>
			</aside>
		</footer>
	);
};
