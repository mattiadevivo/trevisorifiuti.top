import { describe, expect, it } from "vitest";
import type { Client } from "../../src/supabase";
import { getCollectionSchedulesByMunicipality, getMunicipalities } from "../../src/supabase";

// ---------------------------------------------------------------------------
// Mock client helpers
// ---------------------------------------------------------------------------

function municipalitiesClient(result: { data: unknown; error: unknown }) {
	return {
		schema: () => ({
			from: () => ({
				select: () => Promise.resolve(result),
			}),
		}),
	} as unknown as Client;
}

function schedulesClient(result: { data: unknown; error: unknown }) {
	const chain: Record<string, unknown> = {};
	chain.eq = () => chain;
	chain.gte = () => chain;
	chain.range = () => chain;
	chain.order = () => Promise.resolve(result);
	return {
		schema: () => ({
			from: () => ({ select: () => chain }),
		}),
	} as unknown as Client;
}

// ---------------------------------------------------------------------------
// getMunicipalities
// ---------------------------------------------------------------------------

describe("getMunicipalities", () => {
	it("returns data on success", async () => {
		const municipalities = [{ id: "1", name: "Treviso", area: null }];
		const client = municipalitiesClient({ data: municipalities, error: null });

		const result = await getMunicipalities(client);

		expect(result).toEqual(municipalities);
	});

	it("throws the Supabase error object when the query fails", async () => {
		const supabaseError = { message: "relation does not exist", code: "42P01" };
		const client = municipalitiesClient({ data: null, error: supabaseError });

		await expect(getMunicipalities(client)).rejects.toEqual(supabaseError);
	});
});

// ---------------------------------------------------------------------------
// getCollectionSchedulesByMunicipality
// ---------------------------------------------------------------------------

describe("getCollectionSchedulesByMunicipality", () => {
	const schedules = [
		{ id: "1", municipality_id: "mun-1", date: "2026-03-01", waste: ["Umido", "Secco"] },
	];

	it("returns data on success", async () => {
		const client = schedulesClient({ data: schedules, error: null });

		const result = await getCollectionSchedulesByMunicipality(client, "mun-1");

		expect(result).toEqual(schedules);
	});

	it("throws the Supabase error object when the query fails", async () => {
		const supabaseError = { message: "permission denied", code: "42501" };
		const client = schedulesClient({ data: null, error: supabaseError });

		await expect(getCollectionSchedulesByMunicipality(client, "mun-1")).rejects.toEqual(
			supabaseError,
		);
	});

	it("passes the municipality ID through the chain", async () => {
		let capturedMunicipalityId: unknown;
		const chain: Record<string, unknown> = {};
		chain.eq = (field: string, value: unknown) => {
			if (field === "municipality_id") capturedMunicipalityId = value;
			return chain;
		};
		chain.gte = () => chain;
		chain.range = () => chain;
		chain.order = () => Promise.resolve({ data: [], error: null });
		const client = {
			schema: () => ({ from: () => ({ select: () => chain }) }),
		} as unknown as Client;

		await getCollectionSchedulesByMunicipality(client, "mun-42");

		expect(capturedMunicipalityId).toBe("mun-42");
	});

	it("applies the date filter to exclude past collections", async () => {
		let capturedDateArg: unknown;
		const chain: Record<string, unknown> = {};
		chain.eq = () => chain;
		chain.gte = (_field: string, value: unknown) => {
			capturedDateArg = value;
			return chain;
		};
		chain.range = () => chain;
		chain.order = () => Promise.resolve({ data: [], error: null });
		const client = {
			schema: () => ({ from: () => ({ select: () => chain }) }),
		} as unknown as Client;

		await getCollectionSchedulesByMunicipality(client, "mun-1");

		// Should be today's date in YYYY-MM-DD format (en-CA locale produces this)
		expect(capturedDateArg).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(capturedDateArg).toBe(new Date().toLocaleDateString("en-CA"));
	});

	it("honours the limit and offset parameters via range()", async () => {
		let capturedRange: [number, number] | null = null;
		const chain: Record<string, unknown> = {};
		chain.eq = () => chain;
		chain.gte = () => chain;
		chain.range = (from: number, to: number) => {
			capturedRange = [from, to];
			return chain;
		};
		chain.order = () => Promise.resolve({ data: [], error: null });
		const client = {
			schema: () => ({ from: () => ({ select: () => chain }) }),
		} as unknown as Client;

		await getCollectionSchedulesByMunicipality(client, "mun-1", 10, 20);

		// range is zero-based inclusive: offset=20, limit=10 → [20, 29]
		expect(capturedRange).toEqual([20, 29]);
	});
});
