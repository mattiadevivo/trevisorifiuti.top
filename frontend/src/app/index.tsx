/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";

import { Route, Router } from "@solidjs/router";
import { App } from "./app";
import { NotFoundPage } from "./routes/notFound";

import { RootPage } from "./routes/calendar";
import { AccountPage } from "./routes/account";
import { AuthPage } from "./routes/auth";
import { ProtectedRoute } from "../features/auth/components/protectedRoute";
import { MunicipalitiesPage } from "./routes/municipalities";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={RootPage} />
      <Route path="/municipalities" component={MunicipalitiesPage} />
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
  root!
);
