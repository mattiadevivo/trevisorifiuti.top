import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
	plugins: [
		solidPlugin(),
		tailwindcss(),
		devtools({
			autoname: true, // e.g. enable autoname
		}),
		Sitemap({
			hostname: "https://trevisorifiuti.top",
			outDir: "dist",
			generateRobotsTxt: true,
			robots: [
				{
					userAgent: "*",
					allow: ["/"],
					disallow: ["/account"],
				},
				// Specific bots
				{
					userAgent: "Googlebot",
					allow: ["/"],
					crawlDelay: 1,
				},
				{
					userAgent: "BingBot",
					allow: ["/"],
					crawlDelay: 1,
				},
				// Bad bots
				{
					userAgent: "AhrefsBot",
					disallow: ["/"],
				},
				{
					userAgent: "SemrushBot",
					disallow: ["/"],
				},
			],
		}),
	],
	server: {
		host: "127.0.0.1",
		port: 3000,
	},
	build: {
		target: "esnext",
	},
	resolve: {
		alias: {
			"@ui": path.resolve(__dirname, "./src/components/ui"),
		},
	},
});
