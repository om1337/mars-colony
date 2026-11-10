export type PolicyKind =
  | "reserve_floor"
  | "draw_allowance"
  | "duration_cap"
  | "draw_rights";

export type PolicyRule = {
  id: string;
  kind: PolicyKind;
  resourceId?: string;
  statement: string;
  author: string;
  publishedAt: string;
  value: number;
  unit?: string;
};

export type PolicyVerdict = "green" | "amber" | "red";

export type DraftClaim = {
  resourceId: string;
  resourceName: string;
  dayStart: number;
  dayEnd: number;
  amount?: number;
  verdict: PolicyVerdict;
  ruleId?: string;
  reason?: string;
  collisionWith?: string;
};

export const POLICY_RULES: PolicyRule[] = [
  {
    id: "p-fuel-floor",
    kind: "reserve_floor",
    resourceId: "fuel",
    statement: "Methane fuel never below 30% of capacity.",
    author: "Kai Okada",
    publishedAt: "2026-03-14",
    value: 30,
    unit: "%",
  },
  {
    id: "p-o2-floor",
    kind: "reserve_floor",
    resourceId: "o2",
    statement: "O₂ canister reserve floor is 26 cylinders.",
    author: "Kai Okada",
    publishedAt: "2026-03-14",
    value: 26,
    unit: "cyl",
  },
  {
    id: "p-rover-cap",
    kind: "duration_cap",
    resourceId: "rover-a",
    statement: "Rover held at most 3 consecutive days per mission.",
    author: "Kai Okada",
    publishedAt: "2026-02-01",
    value: 3,
    unit: "days",
  },
  {
    id: "p-rover-b-cap",
    kind: "duration_cap",
    resourceId: "rover-b",
    statement: "Rover held at most 3 consecutive days per mission.",
    author: "Kai Okada",
    publishedAt: "2026-02-01",
    value: 3,
    unit: "days",
  },
  {
    id: "p-rations",
    kind: "draw_allowance",
    resourceId: "rations",
    statement:
      "Any crew on an assigned mission may take 3 days of rations and one EVA suit.",
    author: "Kai Okada",
    publishedAt: "2026-01-20",
    value: 3,
    unit: "days",
  },
  {
    id: "p-eva",
    kind: "draw_rights",
    resourceId: "eva-suit",
    statement:
      "EVA suits may only be drawn by crew listed on a confirmed mission.",
    author: "Kai Okada",
    publishedAt: "2026-01-20",
    value: 1,
  },
];

export type ExceptionItem = {
  id: string;
  missionName: string;
  requester: string;
  resourceName: string;
  ruleId: string;
  reason: string;
  competing: string;
  denialCost: string;
  patternHint?: string;
  status: "queued" | "approved" | "denied";
};

export const EXCEPTION_QUEUE: ExceptionItem[] = [
  {
    id: "ex-1",
    missionName: "Ridge Survey extension",
    requester: "Victor Chen",
    resourceName: "Rover A",
    ruleId: "p-rover-cap",
    reason:
      "Dust storm delayed sample return; need one extra day on Rover A to finish the ridge transect.",
    competing: "Aquifer Probe holds Tue–Thu",
    denialCost: "Incomplete survey; reschedule costs 4 crew-days",
    patternHint: "Fourth request over the 3-day rover cap this month",
    status: "queued",
  },
  {
    id: "ex-2",
    missionName: "Crater Sample",
    requester: "Asha Patel",
    resourceName: "Methane Fuel",
    ruleId: "p-fuel-floor",
    reason:
      "Extended traverse to south crater rim — 18 points over floor for a 2-sol window.",
    competing: "Pipe Repair EVA also draws fuel Fri–Sat",
    denialCost: "Mission aborts; samples already staged",
    status: "queued",
  },
  {
    id: "ex-3",
    missionName: "Pipe Repair EVA",
    requester: "Victor Chen",
    resourceName: "O₂ Canisters",
    ruleId: "p-o2-floor",
    reason: "Two-person EVA with contingency cylinder after last week's leak.",
    competing: "Ridge Survey draw Mon–Wed",
    denialCost: "Repair slips; habitat pipe stays degraded",
    status: "queued",
  },
];

export const BACKTEST = {
  autoApproved: 27,
  blocked: 2,
  queued: 2,
  total: 31,
  samples: [
    { name: "Night EVA fuel", outcome: "blocked" as const },
    { name: "Rover 4-day hold", outcome: "queued" as const },
    { name: "Standard suit draw", outcome: "auto" as const },
  ],
};
