import webpush from "web-push";

export type WebPushConfig = {
	vapidPublicKey: string;
	vapidPrivateKey: string;
	vapidSubject: string;
};

export type WebPushSubscription = {
	endpoint: string;
	p256dh: string;
	auth: string;
};

export type WebPushPayload = {
	title: string;
	body: string;
	url?: string;
};

export function create(config: WebPushConfig) {
	webpush.setVapidDetails(
		config.vapidSubject,
		config.vapidPublicKey,
		config.vapidPrivateKey,
	);
	return {
		sendNotification(
			subscription: WebPushSubscription,
			payload: WebPushPayload,
		) {
			return webpush.sendNotification(
				{
					endpoint: subscription.endpoint,
					keys: {
						p256dh: subscription.p256dh,
						auth: subscription.auth,
					},
				},
				JSON.stringify(payload),
			);
		},
	};
}

export type WebPushSender = ReturnType<typeof create>;
