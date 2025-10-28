import { Table } from "@ui/table";
import { type Component, createResource, For, Match, Show, Switch } from "solid-js";
import { useSupabase } from "../../../app/context/supabase";
import { getMunicipalities } from "../../../supabase";

export const Municipalities: Component = () => {
	const supabase = useSupabase();

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
						<Table>
							{/* head */}
							<thead>
								<tr>
									<th>Municipality</th>
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
						</Table>
					</div>
				</Match>
			</Switch>
		</>
	);
};
