import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { renderWithI18n } from "../../../helpers";
import type { CollectionSchedule } from "../../../../src/supabase";
import { CalendarTable } from "../../../../src/features/calendar/components/calendarTable";

function makeSchedule(overrides: Partial<CollectionSchedule> = {}): CollectionSchedule {
	return {
		id: "1",
		municipality_id: "mun-1",
		date: "2026-03-01",
		waste: ["Umido"],
		...overrides,
	} as unknown as CollectionSchedule;
}

describe("CalendarTable", () => {
	it("renders one row per schedule", () => {
		const schedules = [makeSchedule({ id: "1" }), makeSchedule({ id: "2" }), makeSchedule({ id: "3" })];
		renderWithI18n(() => <CalendarTable schedules={schedules} />);

		// 3 data rows + 1 header row
		expect(screen.getAllByRole("row")).toHaveLength(4);
	});

	it("renders no data rows when schedules is an empty array", () => {
		renderWithI18n(() => <CalendarTable schedules={[]} />);

		// Only the header row remains
		expect(screen.getAllByRole("row")).toHaveLength(1);
	});

	it("renders no data rows when schedules is undefined", () => {
		renderWithI18n(() => <CalendarTable schedules={undefined} />);

		expect(screen.getAllByRole("row")).toHaveLength(1);
	});

	it("joins multiple waste types with ', '", () => {
		const schedules = [makeSchedule({ waste: ["Umido", "Carta", "Plastica"] })];
		renderWithI18n(() => <CalendarTable schedules={schedules} />);

		expect(screen.getByText("Umido, Carta, Plastica")).toBeInTheDocument();
	});

	it("renders a single waste type without a trailing comma", () => {
		const schedules = [makeSchedule({ waste: ["Secco"] })];
		renderWithI18n(() => <CalendarTable schedules={schedules} />);

		const cell = screen.getByText("Secco");
		expect(cell.textContent).toBe("Secco");
	});

	it("formats the schedule date using toLocaleDateString()", () => {
		const schedules = [makeSchedule({ date: "2026-03-15" })];
		renderWithI18n(() => <CalendarTable schedules={schedules} />);

		const expected = new Date("2026-03-15").toLocaleDateString();
		expect(screen.getByText(expected)).toBeInTheDocument();
	});

	it("displays a column header for date", () => {
		renderWithI18n(() => <CalendarTable schedules={[]} />);

		// Italian: "Data"
		expect(screen.getByText("Data")).toBeInTheDocument();
	});

	it("displays a column header for waste types", () => {
		renderWithI18n(() => <CalendarTable schedules={[]} />);

		// Italian: "Rifiuti"
		expect(screen.getByText("Rifiuti")).toBeInTheDocument();
	});

	it("renders all schedules in the correct order", () => {
		const schedules = [
			makeSchedule({ id: "a", date: "2026-03-01", waste: ["Umido"] }),
			makeSchedule({ id: "b", date: "2026-03-08", waste: ["Secco"] }),
		];
		renderWithI18n(() => <CalendarTable schedules={schedules} />);

		const rows = screen.getAllByRole("row").slice(1); // skip header
		expect(rows[0]).toHaveTextContent(new Date("2026-03-01").toLocaleDateString());
		expect(rows[1]).toHaveTextContent(new Date("2026-03-08").toLocaleDateString());
	});
});
