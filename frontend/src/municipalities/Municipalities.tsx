import {
  Component,
  ComponentProps,
  createResource,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";
import { create as createConfig } from "../config";
import {
  create as createSupabase,
  getMunicipalities,
  Municipality,
} from "../supabase";

interface MunicipalityProps {
  value: Municipality;
}
const MunicipalityComp: Component<MunicipalityProps> = (props) => {
  return (
    <table class="border-collapse border border-gray-400">
      <thead>
        <tr>
          <th class="border border-gray-300 ...">Name</th>
          <th class="border border-gray-300 ...">Area</th>
          <th class="border border-gray-300 ...">Zone</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border border-gray-300 ...">{props.value.name}</td>
          <td class="border border-gray-300 ...">{props.value.area}</td>
          <td class="border border-gray-300 ...">{props.value.zone}</td>
        </tr>
      </tbody>
    </table>
  );
};

export const Municipalities: Component = () => {
  const config = createConfig();
  const supabase = createSupabase(config.supabase);

  const [municipalities] = createResource(supabase, getMunicipalities);

  return (
    <>
      <Show when={municipalities.loading}>
        <p>Loading...</p>
      </Show>
      <Switch>
        <Match when={municipalities.error}>
          <span>Error: {municipalities.error}</span>
        </Match>
        <Match when={municipalities()}>
          <For each={municipalities()}>
            {(municipality) => <MunicipalityComp value={municipality} />}
          </For>
        </Match>
      </Switch>
    </>
  );
};
