/// <reference types="vitest" />
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import Sitemap from "vite-plugin-sitemap";
import { VitePWA } from "vite-plugin-pwa";

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
					disallow: ["/account/notifications", "/login"],
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
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png", "maskable-icon-512x512.png"],
			workbox: {
				navigateFallbackDenylist: [/^\/robots\.txt$/, /^\/sitemap\.xml$/, /\.png$/, /\.ico$/],
			},
			manifest: {
				name: "trevisorifiuti",
				short_name: "tvtrash",
				start_url: "/calendar",
				description: "trevisorifiuti - never miss a garbage collection again",
				display: "standalone",
				theme_color: "#ffffff",
				icons: [
					{
						src: "/pwa-64x64.png",
						sizes: "64x64",
						type: "image/png",
					},
					{
						src: "/pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
	server: {
		host: "0.0.0.0",
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
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./test/setup.ts"],
	},
});
