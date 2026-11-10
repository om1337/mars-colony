export type ResourceClass = "vehicle" | "tool" | "consumable" | "suit";

export type Resource = {
  id: string;
  name: string;
  class: ResourceClass;
  unit: string;
  onHand: number;
  reserveFloor: number;
  capacity: number;
};

export type Commitment = {
  id: string;
  resourceId: string;
  missionId: string;
  missionName: string;
  commander: string;
  dayStart: number;
  dayEnd: number;
  amount?: number;
  kind: "hold" | "in-transit" | "unreconciled";
};

export type Mission = {
  id: string;
  name: string;
  commander: string;
  crew: string[];
  dayStart: number;
  dayEnd: number;
  status: "draft" | "confirmed" | "active" | "closed";
  /** Materials this mission is out to recover. Gear is what it takes to get them. */
  findIds: string[];
};

export type DayLabel = {
  index: number;
  short: string;
  date: string;
};
