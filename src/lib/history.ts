export type PastRequest = {
  id: string;
  name: string;
  resourceId: string;
  durationDays: number;
  amount?: number;
  /** On hand left after the claim, in the gear's own unit. Used for reserve floors. */
  remainingAfter?: number;
  overlaps: boolean;
  offMission: boolean;
};

const past = (
  id: string,
  name: string,
  resourceId: string,
  extra: Partial<PastRequest> = {},
): PastRequest => ({
  id,
  name,
  resourceId,
  durationDays: 2,
  overlaps: false,
  offMission: false,
  ...extra,
});

/** Last four weeks of real requests. Seed rules auto-approve 27, block 2, queue 2. */
export const PAST_REQUESTS: PastRequest[] = [
  past("h1", "Night EVA fuel", "fuel", { remainingAfter: 80, amount: 90 }),
  past("h2", "South crater fuel", "fuel", { remainingAfter: 40, amount: 110 }),
  past("h3", "Rover 4-day hold", "rover-a", { durationDays: 4 }),
  past("h4", "Rover B extended traverse", "rover-b", { durationDays: 4 }),
  past("h5", "Off-mission fuel siphon", "fuel", {
    remainingAfter: 300,
    amount: 20,
    offMission: true,
    durationDays: 1,
  }),
  past("h6", "Ridge rover", "rover-a", { durationDays: 3 }),
  past("h7", "Crater rover", "rover-b", { durationDays: 3 }),
  past("h8", "Pipe rover", "rover-b", { durationDays: 3 }),
  past("h9", "Aquifer rover", "rover-a", { durationDays: 3 }),
  past("h10", "Basin rover", "rover-b", { durationDays: 3 }),
  past("h11", "Standby rover", "rover-a", { durationDays: 3 }),
  past("h12", "Standard fuel draw", "fuel", { remainingAfter: 200, amount: 48 }),
  past("h13", "Crater fuel draw", "fuel", { remainingAfter: 180, amount: 62 }),
  past("h14", "O₂ ridge", "o2", { remainingAfter: 48, amount: 12 }),
  past("h15", "O₂ crater", "o2", { remainingAfter: 44, amount: 14 }),
  past("h16", "O₂ pipe", "o2", { remainingAfter: 40, amount: 8 }),
  past("h17", "O₂ standby", "o2", { remainingAfter: 52, amount: 4 }),
  past("h18", "O₂ night", "o2", { remainingAfter: 36, amount: 6 }),
  past("h19", "Rations ridge", "rations", { amount: 3, durationDays: 3 }),
  past("h20", "Rations crater", "rations", { amount: 3, durationDays: 3 }),
  past("h21", "Rations pipe", "rations", { amount: 3, durationDays: 2 }),
  past("h22", "Rations aquifer", "rations", { amount: 3, durationDays: 3 }),
  past("h23", "Rations basin", "rations", { amount: 3, durationDays: 2 }),
  past("h24", "Rations standby", "rations", { amount: 3, durationDays: 1 }),
  past("h25", "Suit ridge", "eva-suit", { amount: 3 }),
  past("h26", "Suit crater", "eva-suit", { amount: 3 }),
  past("h27", "Suit pipe", "eva-suit", { amount: 2 }),
  past("h28", "Suit standby", "eva-suit", { amount: 1 }),
  past("h29", "Drill aquifer", "drill-1", { durationDays: 2 }),
  past("h30", "Drill crater", "drill-1", { durationDays: 2 }),
  past("h31", "Drill basin", "drill-1", { durationDays: 1 }),
];
