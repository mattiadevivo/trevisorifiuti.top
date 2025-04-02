import { EntityId } from "./common";

export type Waste = "Vegetale" | "Secco" | "Umido" | "VPL" | "Carta";

export type Municipality = {
  id: EntityId;
  name: string;
  zone: string;
  area: string;
  created_at: Date;
  updated_at: Date;
};

export type WasteCollection = {
  id: EntityId;
  date: Date;
  waste: Waste;
  created_at: Date;
  updated_at: Date;
  municipality_id: EntityId;
};
