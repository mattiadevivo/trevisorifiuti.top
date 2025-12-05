import { useNavigate } from "@solidjs/router";
import type { Session, User } from "@supabase/supabase-js";
import {
	createContext,
	createSignal,
	onCleanup,
	onMount,
	type ParentComponent,
	useContext,
} from "solid-js";
import { useConfig } from "./config";
import { useSupabase } from "./supabase";

interface AuthContextType {
	user: () => User | null;
	loading: () => boolean;
	signInWithMagicLink: (email: string) => Promise<void>;
	signOut: () => Promise<void>;
	getSession: () => Promise<Session | null>;
}

const AuthContext = createContext<AuthContextType>();

// Dependencies are provided via context providers

export const AuthProvider: ParentComponent = (props) => {
	const config = useConfig();
	const supabase = useSupabase();
	const [user, setUser] = createSignal<User | null>(null);
	const [loading, setLoading] = createSignal(true);
	const navigate = useNavigate();

	const redirectPage = "/";

	// Initialize auth state
	onMount(async () => {
		try {
			// Get initial session
			const {
				data: { session },
			} = await supabase.auth.getSession();
			setUser(session?.user ?? null);
		} catch (error) {
			console.error("Error getting session:", error);
		} finally {
			setLoading(false);
		}

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		onCleanup(() => {
			subscription.unsubscribe();
		});
	});

	const signInWithMagicLink = async (email: string) => {
		setLoading(true);
		try {
			const { data, error } = await supabase.auth.signInWithOtp({
				email: email,
				options: {
					// set this to false if you do not want the user to be automatically signed up
					shouldCreateUser: true,
					emailRedirectTo: config.login.rediectUrl,
				},
			});

			if (error) throw error;

			// If email confirmation is required, show message
			if (data.user && !data.session) {
				throw new Error("Please check your email to log in!");
			}
		} finally {
			setLoading(false);
		}
	};

	const signOut = async () => {
		setLoading(true);
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} finally {
			setLoading(false);
			navigate(redirectPage);
		}
	};

	const getSession = async () => {
		const { data, error } = await supabase.auth.getSession();
		if (error) throw error;
		return data.session;
	};

	const value = {
		user,
		loading,
		signInWithMagicLink,
		signOut,
		getSession,
	};

	return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
