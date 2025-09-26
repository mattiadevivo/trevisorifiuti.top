import { Footer } from "@ui/footer";

import { Navbar } from "@ui/navbar";
import { type Component, ErrorBoundary, type ParentProps } from "solid-js";
import { AuthProvider } from "./context/auth";
import { ThemeProvider } from "./context/theme";

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
							<button type="button" onClick={reset}>
								Try Again
							</button>
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
