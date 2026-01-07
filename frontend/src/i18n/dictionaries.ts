export const it = {
	hello: "Ciao",
	notFound: "404 | Pagina non trovata",
	auth: {
		welcomeBack: "Benvenuto",
		signIn: "Accedi",
		signInDescription: "Inserisci la tua email, riceverai un link per accedere al tuo account.",
		email: "Email",
		emailPlaceholder: "Inserisci la tua email",
		signInSuccess: "Controlla la tua casella di posta per completare il processo di accesso.",
		signInError: "Si è verificato un errore durante l'accesso.",
		sendingEmail: "Invio email...",
		accessDenied: "Accesso Negato",
		loginRequired: "Devi effettuare l'accesso per visualizzare questa pagina.",
		logout: "Esci",
		user: "Utente",
	},
	landing: {
		hero: {
			title: "Non dimenticare mai più di buttare la spazzatura!",
			description:
				"Ricevi quotidianamente un reminder su Telegram con i dettagli dei bidoni da portare in strada per la raccolta rifiuti del giorno successivo, nel tuo comune, in provincia di Treviso. Semplice, puntuale e gratuito. Nessuna installazione necessaria!",
			ctaCalendar: "Vai al Calendario",
			ctaAuth: "Accedi per configurare le notifiche",
		},
		mockup: {
			notification: {
				title: "TVTrash	",
				body: "🗑️ Promemoria: Domani raccolta Plastica e Carta.",
				time: "20:00",
			},
		},
	},
	account: {
		profile: "Profilo",
		notificationSettings: "Impostazioni Notifiche",
		errors: {
			enterChatId: "Inserisci il tuo ID Chat Telegram",
			notificationTypeNotFound: "Tipo di notifica Telegram non trovato",
			selectMunicipality: "Seleziona un comune",
			invalidChatId: "Formato ID Chat non valido. Deve essere un numero.",
			saveProfileError: "Si è verificato un errore durante il salvataggio del profilo",
			saveChatIdFirst: "Salva prima il tuo ID Chat",
			sendTestError: "Impossibile inviare la notifica di test",
			deleteError: "Impossibile eliminare la preferenza di notifica.",
		},
		success: {
			profileUpdated: "Profilo aggiornato con successo! Inizierai a ricevere notifiche presto.",
			testSent: "Notifica di test inviata! Controlla il tuo Telegram.",
			deleted: "Preferenza di notifica eliminata. Non riceverai più notifiche.",
		},
		modal: {
			deleteTitle: "Eliminare preferenza di notifica?",
			deleteMessage:
				"Sei sicuro di voler eliminare la tua preferenza di notifica? Non riceverai più notifiche.",
			cancel: "Annulla",
			delete: "Elimina",
		},
		currentSettings: {
			title: "Impostazioni Attuali",
			status: "Stato:",
			configured: "Configurato",
			notConfigured: "Non Configurato",
			municipality: "Comune:",
			notSet: "Non impostato",
			chatId: "ID Chat:",
			deletePreference: "Elimina Preferenza Notifica",
		},
		instructions: {
			title: "Come ottenere il tuo ID Chat",
			step1Title: "Apri Telegram",
			step1Desc: "Avvia l'app Telegram sul tuo dispositivo",
			step2Title: "Cerca @userinfobot",
			step2Desc: "Cerca e avvia una chat con @userinfobot",
			step3Title: "Invia /start",
			step3Desc: "Digita /start e invia il messaggio",
			step4Title: "Copia il tuo ID",
			step4Desc: "Il bot risponderà con il tuo ID Chat. Copia il numero.",
			alternativeTitle: "Metodo Alternativo",
			alternativeDesc:
				"Puoi anche inviare un messaggio a @chatidbot e risponderà con il tuo ID Chat.",
			privateTitle: "Tienilo Privato",
			privateDesc: "Non condividere mai il tuo ID Chat con fonti non attendibili.",
		},
		form: {
			title: "Notifiche Telegram",
			municipalityLabel: "Comune di Interesse",
			selectPlaceholder: "Seleziona il tuo comune",
			loading: "Caricamento...",
			municipalityHelp: "Riceverai notifiche per gli eventi in questo comune",
			chatIdLabel: "ID Chat Telegram",
			chatIdPlaceholder: "Inserisci il tuo ID Chat (es. 123456789)",
			help: "Aiuto",
			chatIdHelp: 'Non conosci il tuo ID Chat? Clicca "Aiuto" per le istruzioni',
			sendTest: "Invia Messaggio di Test",
			saving: "Salvataggio...",
			saveSettings: "Salva Impostazioni",
		},
	},
	calendar: {
		title: "Calendario",
		description:
			"Controlla il calendario della raccolta rifiuti per il tuo comune nella provincia di Treviso",
		table: {
			date: "Data",
			waste: "Rifiuti",
		},
		banner: {
			title: "Rimani aggiornato con le notifiche Telegram!",
			description:
				"Configura il tuo profilo per ricevere i promemoria giornalieri direttamente su Telegram.",
			configure: "Configura",
			cardTitle: "Notifiche Telegram",
			cardDescription: "Ricevi aggiornamenti del calendario direttamente su Telegram",
			benefits: "Vantaggi:",
			benefit1: "Notifiche istantanee per nuovi eventi",
			benefit2: "Promemoria prima delle date importanti",
			benefit3: "Aggiornamenti specifici per il comune",
			benefit4: "Riepiloghi settimanali del calendario",
			setup: "Imposta Notifiche",
			learnMore: "Scopri di più",
		},
	},
	footer: {
		madeBy: "Sviluppato con ❤️ da",
	},
	navbar: {
		calendar: "Calendario",
		signIn: "Accedi",
	},
	theme: {
		toggle: "Cambia tema colore",
		switchToDark: "Passa alla modalità scura",
		switchToLight: "Passa alla modalità chiara",
	},
	language: {
		toggle: "Toggle language",
		switchToIt: "Switch to Italian",
		switchToEn: "Switch to English",
	},
	compliance: {
		privacyPolicy: {
			title: "Privacy Policy",
			href: "https://www.iubenda.com/privacy-policy/25822999",
		},
		cookiePolicy: {
			title: "Cookie Policy",
			href: "https://www.iubenda.com/privacy-policy/25822999/cookie-policy",
		},
		termsAndConditions: {
			title: "Termini e Condizioni",
			href: "https://www.iubenda.com/termini-e-condizioni/25822999",
		},
	},
};

export const en = {
	hello: "Hello",
	notFound: "404 | Page not found",
	auth: {
		welcomeBack: "Welcome back",
		signIn: "Sign In",
		signInDescription: "Insert your email, you'll receive a link to login to your account.",
		email: "Email",
		emailPlaceholder: "Enter your email",
		signInSuccess:
			"Please check the login link in your email inbox in order to complete the sign-in process.",
		signInError: "An error occurred during sign-in.",
		sendingEmail: "Sending email...",
		accessDenied: "Access Denied",
		loginRequired: "You need to be logged in to access this page.",
		logout: "Logout",
		user: "User",
	},
	landing: {
		hero: {
			title: "Never forget to take out the trash again!",
			description:
				"Receive a notification on Telegram everyday with details about the next day's waste collection, for your municipality in Treviso province. Simple, punctual, and free. No installation required!",
			ctaCalendar: "Go to Calendar",
			ctaAuth: "Sign In for Notifications",
		},
		mockup: {
			notification: {
				title: "TVTrash",
				body: "🗑️ Reminder: Tomorrow Plastic and Paper collection.",
				time: "8:00 PM",
			},
		},
	},
	account: {
		profile: "Profile",
		notificationSettings: "Notification Settings",
		errors: {
			enterChatId: "Please enter your Telegram Chat ID",
			notificationTypeNotFound: "Telegram notification type not found",
			selectMunicipality: "Please select a municipality",
			invalidChatId: "Invalid Chat ID format. It should be a number.",
			saveProfileError: "An error occurred while saving your profile",
			saveChatIdFirst: "Please save your Chat ID first",
			sendTestError: "Failed to send test notification",
			deleteError: "Failed to delete notification preference.",
		},
		success: {
			profileUpdated: "Profile updated successfully! You will start receiving notifications soon.",
			testSent: "Test notification sent! Check your Telegram.",
			deleted: "Notification preference deleted. You will no longer receive notifications.",
		},
		modal: {
			deleteTitle: "Delete Notification Preference?",
			deleteMessage:
				"Are you sure you want to delete your notification preference? You will no longer receive notifications.",
			cancel: "Cancel",
			delete: "Delete",
		},
		currentSettings: {
			title: "Current Settings",
			status: "Status:",
			configured: "Configured",
			notConfigured: "Not Configured",
			municipality: "Municipality:",
			notSet: "Not set",
			chatId: "Chat ID:",
			deletePreference: "Delete Notification Preference",
		},
		instructions: {
			title: "How to Get Your Chat ID",
			step1Title: "Open Telegram",
			step1Desc: "Launch the Telegram app on your device",
			step2Title: "Find @userinfobot",
			step2Desc: "Search for and start a chat with @userinfobot",
			step3Title: "Send /start",
			step3Desc: "Type /start and send the message",
			step4Title: "Copy Your ID",
			step4Desc: "The bot will reply with your Chat ID. Copy the number.",
			alternativeTitle: "Alternative Method",
			alternativeDesc: "You can also message @chatidbot and it will reply with your Chat ID.",
			privateTitle: "Keep it Private",
			privateDesc: "Never share your Chat ID with untrusted sources.",
		},
		form: {
			title: "Telegram Notifications",
			municipalityLabel: "Municipality of Interest",
			selectPlaceholder: "Select your municipality",
			loading: "Loading...",
			municipalityHelp: "You'll receive notifications for events in this municipality",
			chatIdLabel: "Telegram Chat ID",
			chatIdPlaceholder: "Enter your Chat ID (e.g., 123456789)",
			help: "Help",
			chatIdHelp: 'Don\'t know your Chat ID? Click "Help" for instructions',
			sendTest: "Send Test Message",
			saving: "Saving...",
			saveSettings: "Save Settings",
		},
	},
	calendar: {
		title: "Calendar",
		description:
			"Check the waste collection calendar for your municipality in the province of Treviso",
		table: {
			date: "Date",
			waste: "Waste",
		},
		banner: {
			title: "Stay Updated with Telegram Notifications!",
			description:
				"Configure your profile to receive calendar updates and reminders directly on Telegram.",
			configure: "Configure",
			cardTitle: "Telegram Notifications",
			cardDescription: "Get calendar updates directly in Telegram",
			benefits: "Benefits:",
			benefit1: "Instant notifications for new events",
			benefit2: "Reminders before important dates",
			benefit3: "Municipality-specific updates",
			benefit4: "Weekly calendar summaries",
			setup: "Set Up Notifications",
			learnMore: "Learn More",
		},
	},
	footer: {
		madeBy: "Made with ❤️ by",
	},
	navbar: {
		calendar: "Calendar",
		signIn: "Sign in",
	},
	theme: {
		toggle: "Toggle color theme",
		switchToDark: "Switch to dark mode",
		switchToLight: "Switch to light mode",
	},
	language: {
		toggle: "Toggle language",
		switchToIt: "Switch to Italian",
		switchToEn: "Switch to English",
	},
	compliance: {
		privacyPolicy: {
			title: "Privacy Policy",
			href: "https://www.iubenda.com/privacy-policy/83700025",
		},
		cookiePolicy: {
			title: "Cookie Policy",
			href: "https://www.iubenda.com/privacy-policy/83700025/cookie-policy",
		},
		termsAndConditions: {
			title: "Terms and Conditions",
			href: "https://www.iubenda.com/terms-and-conditions/83700025",
		},
	},
};

export type Dictionary = typeof it;
