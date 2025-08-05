import {
  Component,
  ComponentProps,
  createResource,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";
import { create as createConfig } from "../../../config";
import {
  create as createSupabase,
  getMunicipalities,
  Municipality,
} from "../../../supabase";

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
          <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table class="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Area</th>
                  <th>Zone</th>
                </tr>
              </thead>
              <tbody>
                <For each={municipalities()}>
                  {(municipality) => (
                    <tr>
                      <td>{municipality.name}</td>
                      <td>{municipality.area}</td>
                      <td>{municipality.zone}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Match>
      </Switch>
    </>
  );
};
