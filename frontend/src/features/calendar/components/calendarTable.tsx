import { Table } from "@ui/table";
import { type Component, For } from "solid-js";
import { useI18n } from "../../../app/context/i18n";
import type { CollectionSchedule } from "../../../supabase";

interface Props {
	schedules: CollectionSchedule[] | undefined;
}

export const CalendarTable: Component<Props> = (props) => {
	const { t } = useI18n();
	return (
		<Table>
			<thead>
				<tr>
					<th>{t("calendar.table.date")}</th>
					<th>{t("calendar.table.waste")}</th>
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
