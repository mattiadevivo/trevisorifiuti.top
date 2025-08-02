import {
  Component,
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

export const RootPage: Component = () => {
  const config = createConfig();
  const supabase = createSupabase(config.supabase);

  const [municipalities] = createResource(supabase, getMunicipalities);
  const [municipalityId, setMunicipalityId] = createSignal<
    Municipality["id"] | null
  >(null);
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Select
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
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <For each={collectionSchedules()}>
            {(schedule) => {
              console.log(schedule);
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
