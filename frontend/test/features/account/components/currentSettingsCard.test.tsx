import { screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "../../../helpers";
import type { Municipality } from "../../../../src/supabase";
import type { NotificationPreference } from "../../../../src/supabase/account";
import { CurrentSettingsCard } from "../../../../src/features/account/components/currentSettingsCard";

const municipalities: Municipality[] = [
	{ id: "mun-1", name: "Treviso", area: null } as unknown as Municipality,
	{ id: "mun-2", name: "Conegliano", area: "Centro" } as unknown as Municipality,
];

const configuredPreference = {
	id: "pref-1",
	user_id: "user-1",
	municipality_id: "mun-1",
	notification_type_id: "type-1",
	notification_info: { chat_id: "987654321" },
} as unknown as NotificationPreference;

describe("CurrentSettingsCard — not configured", () => {
	it("shows the 'Not Configured' badge", () => {
		renderWithI18n(() => (
			<CurrentSettingsCard
				isConfigured={false}
				notificationPreference={null}
				municipalities={municipalities}
				onDelete={vi.fn()}
			/>
		));

		expect(screen.getByText("Non Configurato")).toBeInTheDocument();
	});

	it("shows 'Not set' for the municipality field", () => {
		renderWithI18n(() => (
			<CurrentSettingsCard
				isConfigured={false}
				notificationPreference={null}
				municipalities={municipalities}
				onDelete={vi.fn()}
			/>
		));

		// Both municipality and chat ID show "Non impostato"
		expect(screen.getAllByText("Non impostato")).toHaveLength(2);
	});

	it("does not render the delete button", () => {
		renderWithI18n(() => (
			<CurrentSettingsCard
				isConfigured={false}
				notificationPreference={null}
				municipalities={municipalities}
				onDelete={vi.fn()}
			/>
		));

		expect(
			screen.queryByRole("button", { name: /elimina preferenza/i }),
		).not.toBeInTheDocument();
	});
});

describe("CurrentSettingsCard — configured", () => {
	it("shows the 'Configured' badge", () => {
		renderWithI18n(() => (
			<CurrentSettingsCard
				isConfigured={true}
				notificationPreference={configuredPreference}
				municipalities={municipalities}
				onDelete={vi.fn()}
			/>
		));

		expect(screen.getByText("Configurato")).toBeInTheDocument();
	});

	it("shows the municipality name", () => {
		renderWithI18n(() => (
			<CurrentSettingsCard
				isConfigured={true}
				notificationPreference={configuredPreference}
				municipalities={municipalities}
				onDelete={vi.fn()}
			/>
		));

		expect(screen.getByText("Treviso")).toBeInTheDocument();
	});

	it("masks the chat ID, showing only the last 4 digits", () => {
		renderWithI18n(() => (
			<CurrentSettingsCard
				isConfigured={true}
				notificationPreference={configuredPreference}
				municipalities={municipalities}
				onDelete={vi.fn()}
			/>
		));

		// chat_id "987654321" → masked as "***4321"
		expect(screen.getByText("***4321")).toBeInTheDocument();
	});

	it("does not expose the full chat ID", () => {
		renderWithI18n(() => (
			<CurrentSettingsCard
				isConfigured={true}
				notificationPreference={configuredPreference}
				municipalities={municipalities}
				onDelete={vi.fn()}
			/>
		));

		expect(screen.queryByText("987654321")).not.toBeInTheDocument();
	});

	it("renders the delete button", () => {
		renderWithI18n(() => (
			<CurrentSettingsCard
				isConfigured={true}
				notificationPreference={configuredPreference}
				municipalities={municipalities}
				onDelete={vi.fn()}
			/>
		));

		expect(
			screen.getByRole("button", { name: /elimina preferenza/i }),
		).toBeInTheDocument();
	});

	it("calls onDelete when the delete button is clicked", async () => {
		const user = userEvent.setup();
		const onDelete = vi.fn();
		renderWithI18n(() => (
			<CurrentSettingsCard
				isConfigured={true}
				notificationPreference={configuredPreference}
				municipalities={municipalities}
				onDelete={onDelete}
			/>
		));

		await user.click(screen.getByRole("button", { name: /elimina preferenza/i }));

		expect(onDelete).toHaveBeenCalledOnce();
	});

	it("resolves the municipality name by ID from the municipalities list", () => {
		const preferenceForMun2 = { ...configuredPreference, municipality_id: "mun-2" };
		renderWithI18n(() => (
			<CurrentSettingsCard
				isConfigured={true}
				notificationPreference={preferenceForMun2 as unknown as NotificationPreference}
				municipalities={municipalities}
				onDelete={vi.fn()}
			/>
		));

		expect(screen.getByText("Conegliano")).toBeInTheDocument();
	});
});
