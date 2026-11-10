import { MISSIONS } from "./data";

export type FindKind = "ore" | "volatile" | "material";

export type Find = {
  id: string;
  name: string;
  kind: FindKind;
  unit: string;
  onHand: number;
  needed: number;
  whyShort: string;
};

export type KitLine = {
  resourceId: string;
  /** What the last successful run actually burned. Absent for gear that is held, not consumed. */
  burned?: number;
};

export type Kit = {
  findId: string;
  fromMission: string;
  recovered: string;
  lines: KitLine[];
};

export const FIND_KIND_LABEL: Record<FindKind, string> = {
  ore: "Ore",
  volatile: "Volatile",
  material: "Material",
};

/** What missions go out to bring back. Gear is the separate list you book to get it. */
export const FINDS: Find[] = [
  {
    id: "water-ice",
    name: "Water ice",
    kind: "volatile",
    unit: "kg",
    onHand: 140,
    needed: 400,
    whyShort: "Habitat water crosses its floor before the week-31 ship.",
  },
  {
    id: "hematite",
    name: "Hematite",
    kind: "ore",
    unit: "kg",
    onHand: 60,
    needed: 200,
    whyShort: "Denied twice. No Earth drill until week 31.",
  },
  {
    id: "subsurface-ice",
    name: "Subsurface ice",
    kind: "volatile",
    unit: "kg",
    onHand: 0,
    needed: 120,
    whyShort: "Aquifer readings are the only local source left.",
  },
  {
    id: "scrap-alloy",
    name: "Scrap alloy",
    kind: "material",
    unit: "kg",
    onHand: 18,
    needed: 40,
    whyShort: "Pipe stock is short. Last cache run recovered 6 kg.",
  },
  {
    id: "silica",
    name: "Silica",
    kind: "material",
    unit: "kg",
    onHand: 310,
    needed: 280,
    whyShort: "On hand covers the cycle. A trip is optional.",
  },
  {
    id: "regolith",
    name: "Regolith",
    kind: "material",
    unit: "kg",
    onHand: 220,
    needed: 40,
    whyShort: "Covered. Bag it only if a rover is already out.",
  },
];

export const KITS: Kit[] = [
  {
    findId: "water-ice",
    fromMission: "Ridge Survey",
    recovered: "86 kg",
    lines: [
      { resourceId: "rover-a" },
      { resourceId: "fuel", burned: 48 },
      { resourceId: "o2", burned: 12 },
      { resourceId: "eva-suit", burned: 3 },
      { resourceId: "rations", burned: 9 },
    ],
  },
  {
    findId: "hematite",
    fromMission: "Crater Sample",
    recovered: "22 kg",
    lines: [
      { resourceId: "rover-b" },
      { resourceId: "drill-1" },
      { resourceId: "fuel", burned: 62 },
      { resourceId: "o2", burned: 14 },
      { resourceId: "eva-suit", burned: 3 },
    ],
  },
  {
    findId: "subsurface-ice",
    fromMission: "Aquifer Probe",
    recovered: "none yet",
    lines: [
      { resourceId: "rover-a" },
      { resourceId: "drill-1" },
      { resourceId: "fuel", burned: 55 },
      { resourceId: "o2", burned: 10 },
    ],
  },
  {
    findId: "scrap-alloy",
    fromMission: "Pipe Repair EVA",
    recovered: "6 kg",
    lines: [
      { resourceId: "rover-b" },
      { resourceId: "fuel", burned: 28 },
      { resourceId: "o2", burned: 8 },
      { resourceId: "eva-suit", burned: 2 },
    ],
  },
  {
    findId: "silica",
    fromMission: "Basin Walk",
    recovered: "40 kg",
    lines: [
      { resourceId: "rover-b" },
      { resourceId: "fuel", burned: 30 },
    ],
  },
  {
    findId: "regolith",
    fromMission: "Standby EVA",
    recovered: "15 kg",
    lines: [
      { resourceId: "fuel", burned: 20 },
      { resourceId: "eva-suit", burned: 1 },
    ],
  },
];

export const shortfall = (find: Find): number => find.needed - find.onHand;

export const findById = (id: string): Find | undefined =>
  FINDS.find((find) => find.id === id);

export const kitFor = (findId: string): Kit | undefined =>
  KITS.find((kit) => kit.findId === findId);

export const materialsForMission = (missionId: string): string[] => {
  const mission = MISSIONS.find((item) => item.id === missionId);
  if (!mission) return [];
  return mission.findIds
    .map((id) => findById(id)?.name)
    .filter((name): name is string => Boolean(name));
};

export const materialsOnDay = (dayIndex: number): string[] => {
  const names = new Set<string>();
  for (const mission of MISSIONS) {
    if (mission.dayStart > dayIndex || mission.dayEnd < dayIndex) continue;
    for (const name of materialsForMission(mission.id)) names.add(name);
  }
  return [...names];
};
