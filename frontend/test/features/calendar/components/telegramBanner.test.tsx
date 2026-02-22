import { screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithI18n } from "../../../helpers";
import { TelegramNotificationBanner } from "../../../../src/features/calendar/components/telegramBanner";

describe("TelegramNotificationBanner", () => {
	it("renders the configure button", () => {
		renderWithI18n(() => <TelegramNotificationBanner />);

		// Italian: "Configura"
		expect(screen.getByRole("button", { name: /configura/i })).toBeInTheDocument();
	});

	it("calls onConfigureClick when the configure button is clicked", async () => {
		const user = userEvent.setup();
		const onConfigureClick = vi.fn();
		renderWithI18n(() => <TelegramNotificationBanner onConfigureClick={onConfigureClick} />);

		await user.click(screen.getByRole("button", { name: /configura/i }));

		expect(onConfigureClick).toHaveBeenCalledOnce();
	});

	it("does not throw when onConfigureClick is not provided", async () => {
		const user = userEvent.setup();
		renderWithI18n(() => <TelegramNotificationBanner />);

		await expect(
			user.click(screen.getByRole("button", { name: /configura/i })),
		).resolves.not.toThrow();
	});

	it("does not call onConfigureClick more than once per click", async () => {
		const user = userEvent.setup();
		const onConfigureClick = vi.fn();
		renderWithI18n(() => <TelegramNotificationBanner onConfigureClick={onConfigureClick} />);

		await user.click(screen.getByRole("button", { name: /configura/i }));
		await user.click(screen.getByRole("button", { name: /configura/i }));

		expect(onConfigureClick).toHaveBeenCalledTimes(2);
	});
});
