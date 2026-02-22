import { screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "../../../helpers";
import { ProtectedRoute } from "../../../../src/features/auth/components/protectedRoute";

// vi.mock is hoisted above imports; the factory must be self-contained.
vi.mock("../../../../src/app/context/auth", () => ({
	useAuth: vi.fn(),
}));

// Pull the mocked version AFTER the vi.mock declaration.
import { useAuth } from "../../../../src/app/context/auth";
import type { User } from "@supabase/supabase-js";

const mockUser = { id: "user-1", email: "test@example.com" } as unknown as User;

function setAuthState({ user, loading }: { user: User | null; loading: boolean }) {
	vi.mocked(useAuth).mockReturnValue({
		user: () => user,
		loading: () => loading,
		signInWithMagicLink: vi.fn(),
		signOut: vi.fn(),
		getSession: vi.fn(),
	});
}

describe("ProtectedRoute", () => {
	it("shows a loading indicator while auth is initialising", () => {
		setAuthState({ user: null, loading: true });
		renderWithI18n(() => (
			<ProtectedRoute>
				<p>Secret content</p>
			</ProtectedRoute>
		));

		// The spinner class is rendered; content is hidden
		expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
		expect(document.querySelector(".loading")).toBeInTheDocument();
	});

	it("does not render children while loading", () => {
		setAuthState({ user: null, loading: true });
		renderWithI18n(() => (
			<ProtectedRoute>
				<p>Secret content</p>
			</ProtectedRoute>
		));

		expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
	});

	it("shows an access denied message when loading is done and there is no user", () => {
		setAuthState({ user: null, loading: false });
		renderWithI18n(() => (
			<ProtectedRoute>
				<p>Secret content</p>
			</ProtectedRoute>
		));

		// Italian: "Accesso Negato"
		expect(screen.getByText("Accesso Negato")).toBeInTheDocument();
	});

	it("shows a sign-in link on the access denied screen", () => {
		setAuthState({ user: null, loading: false });
		renderWithI18n(() => (
			<ProtectedRoute>
				<p>Secret content</p>
			</ProtectedRoute>
		));

		const link = screen.getByRole("link", { name: /accedi/i });
		expect(link).toHaveAttribute("href", "/login");
	});

	it("does not render children when not authenticated", () => {
		setAuthState({ user: null, loading: false });
		renderWithI18n(() => (
			<ProtectedRoute>
				<p>Secret content</p>
			</ProtectedRoute>
		));

		expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
	});

	it("renders children when the user is authenticated", () => {
		setAuthState({ user: mockUser, loading: false });
		renderWithI18n(() => (
			<ProtectedRoute>
				<p>Secret content</p>
			</ProtectedRoute>
		));

		expect(screen.getByText("Secret content")).toBeInTheDocument();
	});

	it("does not show the access denied screen when authenticated", () => {
		setAuthState({ user: mockUser, loading: false });
		renderWithI18n(() => (
			<ProtectedRoute>
				<p>Secret content</p>
			</ProtectedRoute>
		));

		expect(screen.queryByText("Accesso Negato")).not.toBeInTheDocument();
	});
});
