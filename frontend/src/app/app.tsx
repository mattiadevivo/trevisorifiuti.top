import { ErrorBoundary, ParentProps, type Component } from "solid-js";

import { Navbar } from "@ui/navbar";
import { ThemeProvider } from "./context/theme";
import { Footer } from "@ui/footer";
import { AuthProvider } from "./context/auth";

interface Props extends ParentProps {}

export const App: Component<Props> = (props) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        <ErrorBoundary
          fallback={(error, reset) => (
            <div>
              <p>Something went wrong: {error.message}</p>
              <button onClick={reset}>Try Again</button>
            </div>
          )}
        >
          <main class="px-2 py-5 bg-base-200 sm:px-40">{props.children}</main>
        </ErrorBoundary>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  );
};
