import { screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "../../../helpers";
import type { Municipality } from "../../../../src/supabase";
import { TelegramNotificationForm } from "../../../../src/features/account/components/telegramNotificationForm";

const municipalities: Municipality[] = [
	{ id: "mun-1", name: "Treviso", area: null } as unknown as Municipality,
	{ id: "mun-2", name: "Conegliano", area: "Centro" } as unknown as Municipality,
];

function defaultProps(overrides: Record<string, unknown> = {}) {
	return {
		municipalities,
		selectedMunicipality: () => "mun-1" as Municipality["id"] | null,
		onMunicipalityChange: vi.fn(),
		isSubmitting: () => false,
		telegramChatId: () => "",
		onTelegramChatIdInput: vi.fn(),
		showInstructions: () => false,
		onToggleInstructions: vi.fn(),
		error: () => "",
		success: () => "",
		onSubmit: vi.fn((e: Event) => e.preventDefault()),
		...overrides,
	};
}

describe("TelegramNotificationForm — municipality select", () => {
	it("renders all municipality options when municipalities are loaded", () => {
		renderWithI18n(() => <TelegramNotificationForm {...defaultProps()} />);

		expect(screen.getByRole("option", { name: "Treviso" })).toBeInTheDocument();
		expect(screen.getByRole("option", { name: /Conegliano/ })).toBeInTheDocument();
	});

	it("renders a loading select when municipalities is undefined", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ municipalities: undefined })} />
		));

		// Italian: "Caricamento..."
		expect(screen.getByText("Caricamento...")).toBeInTheDocument();
	});

	it("select is disabled while submitting", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ isSubmitting: () => true })} />
		));

		const select = screen.getByRole("combobox");
		expect(select).toBeDisabled();
	});

	it("calls onMunicipalityChange when a different option is selected", async () => {
		const user = userEvent.setup();
		const onMunicipalityChange = vi.fn();
		renderWithI18n(() => (
			<TelegramNotificationForm
				{...defaultProps({
					selectedMunicipality: () => "mun-1",
					onMunicipalityChange,
				})}
			/>
		));

		await user.selectOptions(screen.getByRole("combobox"), "mun-2");

		expect(onMunicipalityChange).toHaveBeenCalledWith("mun-2");
	});
});

describe("TelegramNotificationForm — chat ID input", () => {
	it("reflects the current telegramChatId value", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ telegramChatId: () => "123456" })} />
		));

		expect(screen.getByRole("textbox")).toHaveValue("123456");
	});

	it("calls onTelegramChatIdInput on each keystroke with the full current value", async () => {
		const user = userEvent.setup();
		const onTelegramChatIdInput = vi.fn();
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ onTelegramChatIdInput })} />
		));

		await user.type(screen.getByRole("textbox"), "42");

		// onInput passes e.currentTarget.value — the full accumulated text, not just the last key
		expect(onTelegramChatIdInput).toHaveBeenCalledTimes(2);
		expect(onTelegramChatIdInput).toHaveBeenNthCalledWith(1, "4");
		expect(onTelegramChatIdInput).toHaveBeenNthCalledWith(2, "42");
	});

	it("input is disabled while submitting", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ isSubmitting: () => true })} />
		));

		expect(screen.getByRole("textbox")).toBeDisabled();
	});
});

describe("TelegramNotificationForm — help button", () => {
	it("calls onToggleInstructions when the help button is clicked", async () => {
		const user = userEvent.setup();
		const onToggleInstructions = vi.fn();
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ onToggleInstructions })} />
		));

		await user.click(screen.getByRole("button", { name: /aiuto/i }));

		expect(onToggleInstructions).toHaveBeenCalledOnce();
	});
});

describe("TelegramNotificationForm — error and success messages", () => {
	it("shows the error message when the error prop is non-empty", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm
				{...defaultProps({ error: () => "Inserisci il tuo ID Chat" })}
			/>
		));

		expect(screen.getByText("Inserisci il tuo ID Chat")).toBeInTheDocument();
	});

	it("hides the error alert when the error prop is empty", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ error: () => "" })} />
		));

		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("shows the success message when the success prop is non-empty", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm
				{...defaultProps({ success: () => "Profilo aggiornato!" })}
			/>
		));

		expect(screen.getByText("Profilo aggiornato!")).toBeInTheDocument();
	});

	it("hides the success alert when the success prop is empty", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ success: () => "" })} />
		));

		expect(screen.queryByText("Profilo aggiornato!")).not.toBeInTheDocument();
	});
});

describe("TelegramNotificationForm — submit button", () => {
	it("is enabled when not submitting", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ isSubmitting: () => false })} />
		));

		expect(screen.getByRole("button", { name: /salva impostazioni/i })).toBeEnabled();
	});

	it("is disabled while submitting", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ isSubmitting: () => true })} />
		));

		expect(screen.getByRole("button", { name: /salvataggio/i })).toBeDisabled();
	});

	it("shows a saving label while submitting", () => {
		renderWithI18n(() => (
			<TelegramNotificationForm {...defaultProps({ isSubmitting: () => true })} />
		));

		// Italian: "Salvataggio..."
		expect(screen.getByText("Salvataggio...")).toBeInTheDocument();
	});

	it("calls onSubmit when the form is submitted", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn((e: Event) => e.preventDefault());
		// Provide a non-empty chat ID so the native `required` validation doesn't block submission
		renderWithI18n(() => (
			<TelegramNotificationForm
				{...defaultProps({ onSubmit, telegramChatId: () => "123456789" })}
			/>
		));

		await user.click(screen.getByRole("button", { name: /salva impostazioni/i }));

		expect(onSubmit).toHaveBeenCalledOnce();
	});
});
