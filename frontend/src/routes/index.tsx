import { createFileRoute } from "@tanstack/react-router";
import { EntityId } from "src/entities/common";
import { Municipality, WasteCollection } from "src/entities/waste";
import { Table } from "src/shadcdn/components/ui/table";

export const Route = createFileRoute("/")({
  component: Index,
});

let id = 0;
function* generateId(): Generator<number, never, void> {
  while (true) {
    yield id++;
  }
}

function Index() {
  const now = new Date();
  const municipalities: Municipality[] = [
    {
      id: generateId().next().value,
      name: "Treviso",
      area: "Area 1",
      zone: "B",
      created_at: now,
      updated_at: now,
    },
  ];

  const wasteCollections: WasteCollection[] = [];
  for (let i = 0; i < 10; i++) {
    wasteCollections.push({
      id: generateId().next().value,
      date: now,
      created_at: now,
      updated_at: now,
      waste: "Carta",
      municipality_id: municipalities[0].id,
    });
  }

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <div className="m-2">
        <Table>
          <th>
            <td>Waste Collection Id</td>
            <td>Municipality Id</td>
            <td>Date</td>
            <td>Waste</td>
          </th>
          {wasteCollections.map((c) => (
            <tr>
              <td>{c.id}</td>
              <td>
                {municipalities.find((m) => m.id == c.municipality_id)?.id}
              </td>
              <td>{c.date.toISOString()}</td>
              <td>{c.waste}</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
