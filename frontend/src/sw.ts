/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

const navigationRoute = new NavigationRoute(createHandlerBoundToURL("index.html"), {
	denylist: [/^\/robots\.txt$/, /^\/sitemap\.xml$/, /\.png$/, /\.ico$/],
});
registerRoute(navigationRoute);

self.addEventListener("push", (event) => {
	if (!event.data) return;

	const payload = event.data.json();
	const title = payload.title ?? "trevisorifiuti";
	const options: NotificationOptions = {
		body: payload.body ?? "",
		icon: "/pwa-192x192.png",
		badge: "/pwa-64x64.png",
		data: { url: payload.url ?? "/calendar" },
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const url = event.notification.data?.url ?? "/calendar";
	event.waitUntil(self.clients.openWindow(url));
});
