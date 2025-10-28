import { Table } from "@ui/table";
import { For, type Component } from "solid-js";
import type { CollectionSchedule } from "../../../supabase";

interface Props {
  schedules: CollectionSchedule[] | undefined;
}

export const CalendarTable: Component<Props> = (props) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Waste</th>
        </tr>
      </thead>
      <tbody>
        <For each={props.schedules}>
          {(schedule) => (
            <tr>
              <td>{new Date(schedule.date).toLocaleDateString()}</td>
              <td>{schedule.waste.join(", ")}</td>
            </tr>
          )}
        </For>
      </tbody>
    </Table>
  );
};
