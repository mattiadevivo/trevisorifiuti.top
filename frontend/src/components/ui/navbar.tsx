import { A } from "@solidjs/router";
import { type Component, Show } from "solid-js";
import { useAuth } from "../../app/context/auth";
import { UserMenu } from "../../features/auth/components/userMenu";

interface Navbar {
	currentUser?: { name: string; email: string } | null;
	onLogout?: () => void;
}

export const Navbar: Component<Navbar> = (_props) => {
	const auth = useAuth();
	return (
		<div class="navbar justify-between bg-base-100 text-base-content shadow-sm">
			<div class="flex-1">
				<A class="btn btn-ghost text-xl" href="/">
					<img src="/favicon.png" alt="TVTrash logo" class="size-8" />
					TVTrash
				</A>
			</div>

			<div class="flex items-center h-14 gap-2">
				<A href="/" class="btn btn-primary btn-sm">
					Calendar
				</A>
				<Show
					when={auth.user()}
					fallback={
						<A href="/auth" class="btn btn-accent btn-sm">
							Sign in
						</A>
					}
				>
					<UserMenu />
				</Show>
			</div>
		</div>
	);
};

