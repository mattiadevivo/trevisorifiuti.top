import { MetaProvider } from "@solidjs/meta";
import { Button } from "@ui/button";
import { Footer } from "../components/layout/footer";
import { Navbar } from "../components/layout/navbar";
import { Settings } from "lucide-solid";
import { type Component, ErrorBoundary, type ParentProps } from "solid-js";
import { FloatingActionButtons } from "../components/layout/floatingActionButtons";
import { Seo } from "../components/seo";
import { LanguageFloatButton } from "../features/language/components/languageSwitcher";
import { ThemeFloatButton } from "../features/theme/components/themeFloatButton";
import { AuthProvider } from "./context/auth";
import { ConfigProvider } from "./context/config";
import { I18nProvider } from "./context/i18n";
import { SupabaseProvider } from "./context/supabase";
import { ThemeProvider } from "./context/theme";

interface Props extends ParentProps {}

export const App: Component<Props> = (props) => {
	return (
		<ThemeProvider>
			<I18nProvider>
				<ConfigProvider>
					<SupabaseProvider>
						<AuthProvider>
							<MetaProvider>
								<Seo />
								<Navbar />
								<ErrorBoundary
									fallback={(error, reset) => (
										<div>
											<p>Something went wrong: {error.message}</p>
											<Button type="button" onClick={reset}>
												Try again
											</Button>
										</div>
									)}
								>
									<main class="px-2 py-5 bg-base-200 md:px-40">{props.children}</main>
								</ErrorBoundary>
								<Footer />
								<FloatingActionButtons buttonContent={<Settings />}>
									<LanguageFloatButton />
									<ThemeFloatButton />
								</FloatingActionButtons>
							</MetaProvider>
						</AuthProvider>
					</SupabaseProvider>
				</ConfigProvider>
			</I18nProvider>
		</ThemeProvider>
	);
};
