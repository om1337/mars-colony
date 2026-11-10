import { COMMITMENTS, RESOURCES } from "./data";
import { PAST_REQUESTS, type PastRequest } from "./history";
import { rangesOverlapSafe } from "./overlap";
import type { PolicyRule, PolicyVerdict } from "./policy";
import type { Resource } from "./types";

export type ClaimEvaluation = {
  verdict: PolicyVerdict;
  ruleId?: string;
  reason?: string;
  collisionWith?: string;
};

export type BacktestOutcome = "auto" | "blocked" | "queued";

export type BacktestTally = {
  auto: number;
  blocked: number;
  queued: number;
  total: number;
  samples: { name: string; outcome: BacktestOutcome }[];
};

export const floorAbsolute = (rule: PolicyRule, resource: Resource): number =>
  rule.unit === "%" ? (rule.value / 100) * resource.capacity : rule.value;

export const evaluateClaim = (
  rules: PolicyRule[],
  resourceId: string,
  dayStart: number,
  dayEnd: number,
  amount?: number,
  onHandById?: Record<string, number>,
): ClaimEvaluation => {
  const base = RESOURCES.find((item) => item.id === resourceId);
  if (!base) return { verdict: "red", reason: "Unknown gear" };
  const resource =
    onHandById && onHandById[resourceId] !== undefined
      ? { ...base, onHand: onHandById[resourceId] }
      : base;

  const duration = dayEnd - dayStart + 1;
  let verdict: PolicyVerdict = "green";
  let ruleId: string | undefined;
  let reason = "Auto-approves under published policy";

  const cap = rules.find(
    (rule) => rule.kind === "duration_cap" && rule.resourceId === resourceId,
  );
  if (cap && duration > cap.value) {
    verdict = "amber";
    ruleId = cap.id;
    reason = `Exceeds ${cap.value}-day duration cap by ${duration - cap.value}`;
  }

  const allowance = rules.find(
    (rule) => rule.kind === "draw_allowance" && rule.resourceId === resourceId,
  );
  if (allowance && amount !== undefined && amount > allowance.value && verdict !== "red") {
    verdict = "amber";
    ruleId = allowance.id;
    reason = `Draw ${amount} ${resource.unit} exceeds the ${allowance.value} ${allowance.unit ?? resource.unit} allowance`;
  }

  if (resource.class === "consumable" || resource.class === "suit") {
    const floor = rules.find(
      (rule) => rule.kind === "reserve_floor" && rule.resourceId === resourceId,
    );
    if (floor && amount !== undefined) {
      const committed = COMMITMENTS.filter(
        (item) => item.resourceId === resourceId && item.kind === "hold",
      ).reduce((sum, item) => sum + (item.amount ?? 0), 0);
      const remaining = resource.onHand - committed - amount;
      const floorAbs = floorAbsolute(floor, resource);
      if (remaining < floorAbs) {
        const over = Math.ceil(floorAbs - remaining);
        verdict = "red";
        ruleId = floor.id;
        reason = `Breaches reserve floor by ${over}${resource.unit === "unit" ? "" : resource.unit}`;
      }
    }
  }

  const collision = COMMITMENTS.find(
    (item) =>
      item.resourceId === resourceId &&
      item.kind === "hold" &&
      resource.capacity === 1 &&
      rangesOverlapSafe(item.dayStart, item.dayEnd, dayStart, dayEnd),
  );

  if (collision) {
    if (verdict === "green") {
      verdict = "amber";
      ruleId = undefined;
      reason = `Overlaps ${collision.missionName}`;
    }
    return {
      verdict,
      ruleId,
      reason,
      collisionWith: collision.missionName,
    };
  }

  return { verdict, ruleId, reason };
};

const classifyPast = (
  request: PastRequest,
  rules: PolicyRule[],
): BacktestOutcome => {
  const resource = RESOURCES.find((item) => item.id === request.resourceId);
  if (!resource) return "auto";

  const floor = rules.find(
    (rule) => rule.kind === "reserve_floor" && rule.resourceId === request.resourceId,
  );
  if (
    floor &&
    request.remainingAfter !== undefined &&
    request.remainingAfter < floorAbsolute(floor, resource)
  ) {
    return "blocked";
  }

  const rights = rules.find(
    (rule) => rule.kind === "draw_rights" && rule.resourceId === request.resourceId,
  );
  if (rights && request.offMission) return "blocked";

  const cap = rules.find(
    (rule) => rule.kind === "duration_cap" && rule.resourceId === request.resourceId,
  );
  if (cap && request.durationDays > cap.value) return "queued";

  const allowance = rules.find(
    (rule) => rule.kind === "draw_allowance" && rule.resourceId === request.resourceId,
  );
  if (
    allowance &&
    request.amount !== undefined &&
    request.amount > allowance.value
  ) {
    return "queued";
  }

  if (request.overlaps && resource.capacity === 1) return "queued";
  return "auto";
};

export const tallyRules = (rules: PolicyRule[]): BacktestTally => {
  const samples: BacktestTally["samples"] = [];
  let auto = 0;
  let blocked = 0;
  let queued = 0;

  for (const request of PAST_REQUESTS) {
    const outcome = classifyPast(request, rules);
    if (outcome === "auto") auto += 1;
    else if (outcome === "blocked") blocked += 1;
    else queued += 1;
    samples.push({ name: request.name, outcome });
  }

  return { auto, blocked, queued, total: PAST_REQUESTS.length, samples };
};

/** One rule per kind + gear. A draft replaces the published rule it would supersede. */
export const withDraftRule = (
  rules: PolicyRule[],
  draft: PolicyRule,
): PolicyRule[] => {
  const index = rules.findIndex(
    (rule) => rule.kind === draft.kind && rule.resourceId === draft.resourceId,
  );
  if (index === -1) return [...rules, draft];
  const next = rules.slice();
  next[index] = { ...draft, id: rules[index].id };
  return next;
};
