import { Link, Meta, Title } from "@solidjs/meta";
import { type Component, mergeProps } from "solid-js";

interface Props {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	type?: string;
	keywords?: Record<string, string[]>;
}

export const Seo: Component<Props> = (props) => {
	const defaultProps = {
		title:
			"TVTrash | Rimani aggiornato sul calendario  della raccolta rifiuti Contarina del tuo comune in provincia di Treviso",
		description:
			"Consulta il calendario rifiuti Contarina del tuo comune in provincia di Treviso. Attiva le notifiche Telegram per sapere sempre quale bidone esporre il giorno dopo.",
		image: "/og-image.png",
		url: "https://trevisorifiuti.top",
		type: "website",
		keywords: {
			primary: ["treviso ecocalendario", "contarina ecocalendario", "contarina calendario"],
			secondary: [
				"treviso ecocalendario contarina",
				"treviso ecocalendario rifiuti",
				"contarina ecocalendario raccolta",
				"contarina calendario rifiuti",
				"contarina calendario raccolta",
			],
			longTail: ["", "next.js seo best practices 2024"],
			location: ["react seo nigeria", "next.js developer lagos"],
		},
	};

	const merged = mergeProps(defaultProps, props);

	return (
		<>
			{/* Core SEO */}
			<Title>{merged.title}</Title>
			<Meta name="description" content={merged.description} />
			<Meta name="author" content="Mattia De Vivo" />
			<Meta name="keywords" content={Object.values(merged.keywords).flat().join(", ")} />
			<Meta
				name="robots"
				content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
			/>

			{/* Open Graph */}
			<Meta property="og:type" content={merged.type} />
			<Meta property="og:title" content={merged.title} />
			<Meta property="og:description" content={merged.description} />
			<Meta property="og:image" content={merged.image} />
			<Meta property="og:image:width" content="1200" />
			<Meta property="og:image:height" content="630" />
			<Meta property="og:image:alt" content="TvTrash garbage bin" />
			<Meta property="og:url" content={merged.url} />
			<Meta property="og:site_name" content="TVTrash" />

			{/* Twitter */}
			<Meta name="twitter:card" content="summary_large_image" />
			<Meta name="twitter:title" content={merged.title} />
			<Meta name="twitter:description" content={merged.description} />
			<Meta name="twitter:image" content={merged.image} />
			<Meta name="twitter:image:alt" content="TvTrash garbage bin" />

			{/* Canonical */}
			<Link rel="canonical" href={merged.url} />

			{/* Alternate Language Versions */}
			<Link rel="alternate" hreflang="en" href={merged.url} />
			<Link rel="alternate" hreflang="it" href={merged.url} />
			<Link rel="alternate" hreflang="x-default" href={merged.url} />
		</>
	);
};
