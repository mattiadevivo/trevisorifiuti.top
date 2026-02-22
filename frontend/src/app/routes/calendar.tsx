import { useNavigate } from "@solidjs/router";
import { Select } from "@ui/select";
import { Spinner } from "@ui/spinner";
import {
	type Component,
	createMemo,
	createResource,
	createSignal,
	For,
	Suspense,
} from "solid-js";
import { CalendarTable } from "../../features/calendar/components/calendarTable";
import { TelegramNotificationBanner } from "../../features/calendar/components/telegramBanner";
import {
	getCollectionSchedulesByMunicipality,
	getMunicipalities,
	type Municipality,
} from "../../supabase";
import { useI18n } from "../context/i18n";
import { useSupabase } from "../context/supabase";

export const RootPage: Component = () => {
	const navigate = useNavigate();
	const supabase = useSupabase();
	const { t } = useI18n();

	const [municipalities] = createResource(supabase, getMunicipalities);
	const [overrideMunicipalityId, setMunicipalityId] = createSignal<Municipality["id"] | null>(null);
	const municipalityId = createMemo(() => overrideMunicipalityId() ?? municipalities()?.[0]?.id ?? null);
	const [collectionSchedules] = createResource(municipalityId, async (municipalityId) => {
		if (!municipalityId) return [];
		return await getCollectionSchedulesByMunicipality(supabase, municipalityId);
	});

	const handleConfigureNotifications = () => {
		navigate("/account/notifications");
	};

	return (
		<Suspense fallback={<Spinner />}>
			{/* Calendar Header */}
			<div class="flex justify-between items-center mb-6">
				<div class="w-2/3">
					<h1 class="text-3xl font-bold">{t("calendar.title")}</h1>
					<p class="opacity-60 mt-1">{t("calendar.description")}</p>
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
