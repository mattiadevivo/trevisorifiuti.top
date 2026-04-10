import type { WebPushNotificationInfo } from "./schemas/notification";

function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function isWebPushSupported(): boolean {
	return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function askPermissions(): Promise<NotificationPermission> {
	const permissionsResult = await Notification.requestPermission();
	return permissionsResult;
}

export function getPermissionState(): NotificationPermission {
	return Notification.permission;
}

/**
 * Subscribe the browser to web push notifications.
 *
 * This function should:
 * 1. Request notification permission from the user
 * 2. Get the active service worker registration
 * 3. Subscribe via pushManager.subscribe() using the VAPID public key
 * 4. Extract and return the subscription keys as WebPushNotificationInfo
 *
 * Returns null if the user denies permission.
 */
export async function subscribe(vapidPublicKey: string): Promise<WebPushNotificationInfo | null> {
	if (!isWebPushSupported()) {
		return null
	}
	const permissionsResult = await askPermissions();
	if (permissionsResult !== "granted") {
		return null
	}
	const registration = await navigator.serviceWorker.ready;
	const subscriptionInfo = await registration.pushManager.subscribe({
		userVisibleOnly: true, // only ones supported by Chrome
		applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
	})
	// the two following info are cryptographic keys to be stored in db and later used to send messages
	const p256dh = subscriptionInfo.getKey("p256dh"); // is the client's public key for message encryption
	const auth = subscriptionInfo.getKey("auth"); // shared authentication secret
	if (!p256dh || !auth) {
		return null;
	}
	return {
		endpoint: subscriptionInfo.endpoint,
		p256dh: arrayBufferToBase64(p256dh),
		auth: arrayBufferToBase64(auth),
	};
}

export async function unsubscribe(): Promise<void> {
	const registration = await navigator.serviceWorker.ready;
	const subscription = await registration.pushManager.getSubscription();
	if (subscription) {
		await subscription.unsubscribe();
	}
}
