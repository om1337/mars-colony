import type { Commitment, DayLabel, Mission, Resource } from "./types";

export const WEEK_LABEL = "Week 27 · Sol 189–195";

export const DAYS: DayLabel[] = [
  { index: 0, short: "Mon", date: "14" },
  { index: 1, short: "Tue", date: "15" },
  { index: 2, short: "Wed", date: "16" },
  { index: 3, short: "Thu", date: "17" },
  { index: 4, short: "Fri", date: "18" },
  { index: 5, short: "Sat", date: "19" },
  { index: 6, short: "Sun", date: "20" },
];

export const RESOURCES: Resource[] = [
  { id: "rover-a", name: "Rover A", class: "vehicle", unit: "unit", onHand: 1, reserveFloor: 0, capacity: 1 },
  { id: "rover-b", name: "Rover B", class: "vehicle", unit: "unit", onHand: 1, reserveFloor: 0, capacity: 1 },
  { id: "drill-1", name: "Core Drill", class: "tool", unit: "unit", onHand: 1, reserveFloor: 0, capacity: 1 },
  { id: "fuel", name: "Methane Fuel", class: "consumable", unit: "kg", onHand: 420, reserveFloor: 126, capacity: 420 },
  { id: "o2", name: "O₂ Canisters", class: "consumable", unit: "cyl", onHand: 86, reserveFloor: 26, capacity: 100 },
  { id: "rations", name: "Rations", class: "consumable", unit: "day", onHand: 312, reserveFloor: 90, capacity: 400 },
  { id: "eva-suit", name: "EVA Suit Pool", class: "suit", unit: "suit", onHand: 18, reserveFloor: 4, capacity: 20 },
  { id: "habitat-rover", name: "Habitat Rover", class: "vehicle", unit: "unit", onHand: 1, reserveFloor: 0, capacity: 1 },
];

export const MISSIONS: Mission[] = [
  { id: "m-ridge", name: "Ridge Survey", commander: "Victor Chen", crew: ["Victor Chen", "Claire Okonkwo", "Sam Ruiz"], dayStart: 0, dayEnd: 2, status: "confirmed", findIds: ["water-ice"] },
  { id: "m-crater", name: "Crater Sample", commander: "Asha Patel", crew: ["Asha Patel", "Jon Park", "Mei Lin"], dayStart: 2, dayEnd: 4, status: "confirmed", findIds: ["hematite"] },
  { id: "m-pipe", name: "Pipe Repair EVA", commander: "Victor Chen", crew: ["Victor Chen", "Claire Okonkwo"], dayStart: 4, dayEnd: 5, status: "confirmed", findIds: ["scrap-alloy"] },
  { id: "m-drill", name: "Aquifer Probe", commander: "Diego Mora", crew: ["Diego Mora", "Yuki Tanaka"], dayStart: 1, dayEnd: 3, status: "confirmed", findIds: ["subsurface-ice"] },
  { id: "m-standby", name: "Standby EVA", commander: "Asha Patel", crew: ["Asha Patel"], dayStart: 5, dayEnd: 6, status: "confirmed", findIds: ["regolith"] },
];

export const CURRENT_CREW = "Claire Okonkwo";

export const COMMITMENTS: Commitment[] = [
  { id: "c1", resourceId: "rover-a", missionId: "m-ridge", missionName: "Ridge Survey", commander: "Victor Chen", dayStart: 0, dayEnd: 2, kind: "hold" },
  { id: "c2", resourceId: "rover-a", missionId: "m-drill", missionName: "Aquifer Probe", commander: "Diego Mora", dayStart: 1, dayEnd: 3, kind: "hold" },
  { id: "c3", resourceId: "rover-b", missionId: "m-crater", missionName: "Crater Sample", commander: "Asha Patel", dayStart: 2, dayEnd: 4, kind: "hold" },
  { id: "c4", resourceId: "rover-b", missionId: "m-pipe", missionName: "Pipe Repair EVA", commander: "Victor Chen", dayStart: 5, dayEnd: 5, kind: "hold" },
  { id: "c5", resourceId: "drill-1", missionId: "m-drill", missionName: "Aquifer Probe", commander: "Diego Mora", dayStart: 1, dayEnd: 3, kind: "hold" },
  { id: "c6", resourceId: "drill-1", missionId: "m-crater", missionName: "Crater Sample", commander: "Asha Patel", dayStart: 3, dayEnd: 4, kind: "hold" },
  { id: "c7", resourceId: "fuel", missionId: "m-ridge", missionName: "Ridge Survey", commander: "Victor Chen", dayStart: 0, dayEnd: 2, amount: 48, kind: "hold" },
  { id: "c8", resourceId: "fuel", missionId: "m-crater", missionName: "Crater Sample", commander: "Asha Patel", dayStart: 2, dayEnd: 4, amount: 62, kind: "hold" },
  { id: "c9", resourceId: "fuel", missionId: "m-pipe", missionName: "Pipe Repair EVA", commander: "Victor Chen", dayStart: 4, dayEnd: 5, amount: 28, kind: "hold" },
  { id: "c10", resourceId: "o2", missionId: "m-ridge", missionName: "Ridge Survey", commander: "Victor Chen", dayStart: 0, dayEnd: 2, amount: 12, kind: "hold" },
  { id: "c11", resourceId: "o2", missionId: "m-crater", missionName: "Crater Sample", commander: "Asha Patel", dayStart: 2, dayEnd: 4, amount: 14, kind: "hold" },
  { id: "c12", resourceId: "o2", missionId: "m-pipe", missionName: "Pipe Repair EVA", commander: "Victor Chen", dayStart: 4, dayEnd: 5, amount: 8, kind: "hold" },
  { id: "c13", resourceId: "rations", missionId: "m-ridge", missionName: "Ridge Survey", commander: "Victor Chen", dayStart: 0, dayEnd: 2, amount: 9, kind: "hold" },
  { id: "c14", resourceId: "rations", missionId: "m-crater", missionName: "Crater Sample", commander: "Asha Patel", dayStart: 2, dayEnd: 4, amount: 9, kind: "hold" },
  { id: "c15", resourceId: "eva-suit", missionId: "m-ridge", missionName: "Ridge Survey", commander: "Victor Chen", dayStart: 0, dayEnd: 2, amount: 3, kind: "hold" },
  { id: "c16", resourceId: "eva-suit", missionId: "m-crater", missionName: "Crater Sample", commander: "Asha Patel", dayStart: 2, dayEnd: 4, amount: 3, kind: "hold" },
  { id: "c17", resourceId: "eva-suit", missionId: "m-pipe", missionName: "Pipe Repair EVA", commander: "Victor Chen", dayStart: 4, dayEnd: 5, amount: 2, kind: "hold" },
  { id: "c18", resourceId: "habitat-rover", missionId: "m-standby", missionName: "Standby EVA", commander: "Asha Patel", dayStart: 5, dayEnd: 6, kind: "hold" },
  { id: "c19", resourceId: "fuel", missionId: "m-prior", missionName: "Prior EVA (unreconciled)", commander: "Diego Mora", dayStart: 0, dayEnd: 0, amount: 18, kind: "unreconciled" },
  { id: "c20", resourceId: "drill-1", missionId: "earth-ship-14", missionName: "Earth cargo · Drill #2", commander: "Kai Okada", dayStart: 5, dayEnd: 6, kind: "in-transit" },
  { id: "c21", resourceId: "o2", missionId: "earth-ship-14", missionName: "Earth cargo · O₂ +40", commander: "Kai Okada", dayStart: 5, dayEnd: 6, amount: 40, kind: "in-transit" },
];

export const CLASS_LABELS: Record<string, string> = {
  all: "All classes",
  vehicle: "Vehicles",
  tool: "Tools",
  consumable: "Consumables",
  suit: "Suits",
};

export const MISSION_COLORS: Record<string, string> = {
  "m-ridge": "#c45c26",
  "m-crater": "#4a8f9e",
  "m-pipe": "#b87333",
  "m-drill": "#6b8f4a",
  "m-standby": "#8a7a64",
  "m-prior": "#5c4f3f",
  "earth-ship-14": "#5c6b8a",
};
