/* @refresh reload */
import "solid-devtools";
import "./index.css";

import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";
import { ProtectedRoute } from "../features/auth/components/protectedRoute";
import { App } from "./app";
import { AccountPage } from "./routes/account";
import { RootPage } from "./routes/calendar";
import { LandingPage } from "./routes/landing";
import { AuthPage } from "./routes/login";
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
				component={(props) => <ProtectedRoute>{props.children}</ProtectedRoute>}
			>
				{/*<Route path="/" c></Route>*/}
				<Route path="/notifications" component={AccountPage} />
			</Route>
			<Route path="/login" component={AuthPage} />
		</Router>
	),
	root,
);
