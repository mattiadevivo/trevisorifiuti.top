import { type JSX, Show } from "solid-js";
import { useAuth } from "../../../app/context/auth";
import { useI18n } from "../../../app/context/i18n";

interface Props {
	children: JSX.Element;
}

export function ProtectedRoute(props: Props) {
	const auth = useAuth();
	const { t } = useI18n();

	return (
		<Show
			when={!auth.loading()}
			fallback={
				<div class="min-h-screen bg-base-200 flex items-center justify-center">
					<div class="loading loading-spinner loading-lg"></div>
				</div>
			}
		>
			<Show
				when={auth.user()}
				fallback={
					<div class="min-h-screen bg-base-200 flex items-center justify-center">
						<div class="card w-96 bg-base-100 shadow-xl">
							<div class="card-body text-center">
								<h2 class="card-title justify-center">{t("auth.accessDenied")}</h2>
								<p>{t("auth.loginRequired")}</p>
								<div class="card-actions justify-center">
									<a href="/auth" class="btn btn-primary">
										{t("auth.signIn")}
									</a>
								</div>
							</div>
						</div>
					</div>
				}
			>
				{props.children}
			</Show>
		</Show>
	);
}
