/* @refresh reload */
import "solid-devtools";
import "./index.css";

import { MetaProvider } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";
import { ProtectedRoute } from "../features/auth/components/protectedRoute";
import { App } from "./app";
import { AccountPage } from "./routes/account";
import { AuthPage } from "./routes/auth";
import { RootPage } from "./routes/calendar";
import { LandingPage } from "./routes/landing";
import { NotFoundPage } from "./routes/notFound";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		"Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
	);
}

render(
	() => (
		<Router root={App}>
			<Route path="/" component={LandingPage} />
			<Route path="/calendar" component={RootPage} />
			<Route
				path="/account"
				component={() => (
					<ProtectedRoute>
						<AccountPage />
					</ProtectedRoute>
				)}
			/>
			<Route path="/auth" component={AuthPage} />
			<Route path="*paramName" component={NotFoundPage} />
		</Router>
	),
	root,
);
