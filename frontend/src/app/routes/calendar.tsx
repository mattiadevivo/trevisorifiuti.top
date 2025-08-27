import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Suspense,
} from "solid-js";
import { create as createConfig } from "../../config";
import {
  create as createSupabase,
  getCollectionSchedulesByMunicipality,
  getMunicipalities,
  Municipality,
} from "../../supabase";
import { Select } from "@ui/select";
import { Table } from "@ui/table";
import { Spinner } from "@ui/spinner";
import { useNavigate } from "@solidjs/router";
import { TelegramNotificationBanner } from "../../features/calendar/components/telegramBanner";

export const RootPage: Component = () => {
  const navigate = useNavigate();
  const config = createConfig();
  const supabase = createSupabase(config.supabase);

  const [municipalities] = createResource(supabase, getMunicipalities);
  const [municipalityId, setMunicipalityId] = createSignal<
    Municipality["id"] | null
  >(municipalities()?.[0]?.id || null);
  const [collectionSchedules] = createResource(
    municipalityId,
    async (municipalityId) => {
      if (!municipalityId) return [];
      return await getCollectionSchedulesByMunicipality(
        supabase,
        municipalityId,
        1000,
        0
      );
    }
  );

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
        <div>
          <h1 class="text-3xl font-bold">Calendario</h1>
          <p class="opacity-60 mt-1">
            Consulta il calendario della raccolta rifiuti del tuo comune nella
            provincia di Treviso
          </p>
        </div>
        <div class="flex space-x-2">
          <Select
            variant="primary"
            value={municipalityId()}
            onChange={(value) => setMunicipalityId(value)}
          >
            <For each={municipalities()}>
              {(municipality) => (
                <option value={municipality.id}>
                  {municipality.name}{" "}
                  {municipality.area ? `(${municipality.area})` : ""}
                </option>
              )}
            </For>
          </Select>
        </div>
      </div>

      {/* Telegram Notification Banner */}
      <TelegramNotificationBanner
        onConfigureClick={handleConfigureNotifications}
      />

      <Table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Rifiuti</th>
          </tr>
        </thead>
        <tbody>
          <For each={collectionSchedules()}>
            {(schedule) => {
              return (
                <tr>
                  <td>{new Date(schedule.date).toLocaleDateString()}</td>
                  <td>{schedule.waste.join(", ")}</td>
                </tr>
              );
            }}
          </For>
        </tbody>
      </Table>
    </Suspense>
  );
};
