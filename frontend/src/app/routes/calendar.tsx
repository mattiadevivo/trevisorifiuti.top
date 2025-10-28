import { useNavigate } from "@solidjs/router";
import { Select } from "@ui/select";
import { Spinner } from "@ui/spinner";
import {
	type Component,
	createEffect,
	createResource,
	createSignal,
	For,
	Suspense,
} from "solid-js";
import { useSupabase } from "../context/supabase";
import { TelegramNotificationBanner } from "../../features/calendar/components/telegramBanner";
import { CalendarTable } from "../../features/calendar/components/calendarTable";
import {
	getCollectionSchedulesByMunicipality,
	getMunicipalities,
	type Municipality,
} from "../../supabase";

export const RootPage: Component = () => {
	const navigate = useNavigate();
	const supabase = useSupabase();

	const [municipalities] = createResource(supabase, getMunicipalities);
	const [municipalityId, setMunicipalityId] = createSignal<Municipality["id"] | null>(
		municipalities()?.[0]?.id || null,
	);
	const [collectionSchedules] = createResource(municipalityId, async (municipalityId) => {
		if (!municipalityId) return [];
		return await getCollectionSchedulesByMunicipality(supabase, municipalityId);
	});

	const handleConfigureNotifications = () => {
		navigate("/account");
	};

	createEffect(() => {
		// Set the first municipality as default when none is selected
		if (municipalities() && municipalities().length > 0 && !municipalityId()) {
			setMunicipalityId(municipalities()[0].id);
		}
	});

	return (
		<Suspense fallback={<Spinner />}>
			{/* Calendar Header */}
			<div class="flex justify-between items-center mb-6">
				<div class="w-2/3">
					<h1 class="text-3xl font-bold">Calendar</h1>
					<p class="opacity-60 mt-1">
						Check the waste collection calendar for your municipality in the province of Treviso
					</p>
				</div>
				<div class="w-1/3 flex justify-end">
					<Select
						intent="primary"
						width="full"
						value={municipalityId()}
						onChange={(value) => setMunicipalityId(value)}
					>
						<For each={municipalities()}>
							{(municipality) => (
								<option value={municipality.id}>
									{municipality.name} {municipality.area ? `(${municipality.area})` : ""}
								</option>
							)}
						</For>
					</Select>
				</div>
			</div>
			<TelegramNotificationBanner onConfigureClick={handleConfigureNotifications} />
			<CalendarTable schedules={collectionSchedules()} />
		</Suspense>
	);
};
