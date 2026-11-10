"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { COMMITMENTS, DAYS, RESOURCES, WEEK_LABEL } from "@/lib/data";
import { rangesOverlapSafe } from "@/lib/overlap";
import {
  POLICY_RULES,
  type DraftClaim,
  type PolicyVerdict,
} from "@/lib/policy";

const CLAIMABLE = RESOURCES.filter((r) =>
  ["rover-a", "rover-b", "drill-1", "fuel", "o2", "eva-suit"].includes(r.id),
);

const verdictColor: Record<PolicyVerdict, string> = {
  green: "text-signal border-signal/40 bg-signal/10",
  amber: "text-warn border-warn/40 bg-warn/10",
  red: "text-danger-bright border-danger/40 bg-danger/10",
};

const evaluateClaim = (
  resourceId: string,
  dayStart: number,
  dayEnd: number,
  amount?: number,
): Omit<
  DraftClaim,
  "resourceId" | "resourceName" | "dayStart" | "dayEnd" | "amount"
> => {
  const resource = RESOURCES.find((r) => r.id === resourceId);
  if (!resource) return { verdict: "red", reason: "Unknown resource" };

  const duration = dayEnd - dayStart + 1;
  const cap = POLICY_RULES.find(
    (p) => p.kind === "duration_cap" && p.resourceId === resourceId,
  );
  if (cap && duration > cap.value) {
    return {
      verdict: "amber",
      ruleId: cap.id,
      reason: `Exceeds ${cap.value}-day duration cap by ${duration - cap.value}`,
    };
  }

  if (resource.class === "consumable" || resource.class === "suit") {
    const floor = POLICY_RULES.find(
      (p) => p.kind === "reserve_floor" && p.resourceId === resourceId,
    );
    if (floor && amount !== undefined) {
      const committed = COMMITMENTS.filter(
        (c) => c.resourceId === resourceId && c.kind === "hold",
      ).reduce((s, c) => s + (c.amount ?? 0), 0);
      const remaining = resource.onHand - committed - amount;
      const floorAbs =
        floor.unit === "%"
          ? (floor.value / 100) * resource.capacity
          : floor.value;
      if (remaining < floorAbs) {
        const over = Math.ceil(floorAbs - remaining);
        return {
          verdict: "red",
          ruleId: floor.id,
          reason: `Breaches reserve floor by ${over}${resource.unit}`,
        };
      }
    }
  }

  const collision = COMMITMENTS.find(
    (c) =>
      c.resourceId === resourceId &&
      c.kind === "hold" &&
      resource.capacity === 1 &&
      rangesOverlapSafe(c.dayStart, c.dayEnd, dayStart, dayEnd),
  );
  if (collision) {
    return {
      verdict: "amber",
      reason: `Overlaps ${collision.missionName}`,
      collisionWith: collision.missionName,
    };
  }

  return { verdict: "green", reason: "Auto-approves under published policy" };
};

const MissionDraftPage = () => {
  const [dayStart, setDayStart] = useState(0);
  const [dayEnd, setDayEnd] = useState(2);
  const [selected, setSelected] = useState<string[]>(["rover-a", "fuel"]);
  const [fuelAmt, setFuelAmt] = useState(90);
  const [submitted, setSubmitted] = useState(false);

  const claims: DraftClaim[] = useMemo(() => {
    return selected.map((id) => {
      const resource = RESOURCES.find((r) => r.id === id)!;
      const amount =
        id === "fuel"
          ? fuelAmt
          : id === "o2"
            ? 10
            : id === "eva-suit"
              ? 3
              : undefined;
      const evaled = evaluateClaim(id, dayStart, dayEnd, amount);
      return {
        resourceId: id,
        resourceName: resource.name,
        dayStart,
        dayEnd,
        amount,
        ...evaled,
      };
    });
  }, [selected, dayStart, dayEnd, fuelAmt]);

  const greens = claims.filter((c) => c.verdict === "green").length;
  const ambers = claims.filter((c) => c.verdict === "amber").length;
  const reds = claims.filter((c) => c.verdict === "red").length;
  const collisionClaim = claims.find((c) => c.collisionWith);
  const blockedClaim = claims.find((c) => c.verdict === "red");

  const handleToggleResource = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleDayClick = (index: number) => {
    if (index < dayStart) setDayStart(index);
    else if (index > dayEnd) setDayEnd(index);
    else if (index === dayStart && dayStart < dayEnd) setDayStart(index + 1);
    else if (index === dayEnd && dayEnd > dayStart) setDayEnd(index - 1);
    else {
      setDayStart(index);
      setDayEnd(index);
    }
  };

  const handleSubmit = () => {
    if (reds > 0) return;
    setSubmitted(true);
  };

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="mb-8 max-w-3xl animate-fade-up">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
          Plan · Commander · {WEEK_LABEL}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          Mission Draft
        </h1>
        <p className="mt-2 text-dust-300">
          Window first, then resources. Availability recalculates against that
          window — not a global count.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-lg text-dust-100">1 · Window</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {DAYS.map((d) => {
                const inRange = d.index >= dayStart && d.index <= dayEnd;
                return (
                  <button
                    key={d.index}
                    type="button"
                    onClick={() => handleDayClick(d.index)}
                    aria-pressed={inRange}
                    className={`min-w-[3.5rem] rounded-md border px-3 py-3 text-center transition-colors ${
                      inRange
                        ? "border-rust bg-rust/20 text-dust-50"
                        : "border-dust-600 bg-dust-850 text-dust-400 hover:border-dust-500"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase">
                      {d.short}
                    </div>
                    <div className="font-display text-lg">{d.date}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg text-dust-100">2 · Resources</h2>
            <ul className="mt-3 space-y-2">
              {CLAIMABLE.map((r) => {
                const on = selected.includes(r.id);
                const claim = claims.find((c) => c.resourceId === r.id);
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => handleToggleResource(r.id)}
                      aria-pressed={on}
                      className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left transition-colors ${
                        on
                          ? "border-dust-500 bg-dust-850"
                          : "border-dust-700/60 bg-dust-900/40 text-dust-400"
                      }`}
                    >
                      <span className="font-medium text-dust-100">{r.name}</span>
                      {on && claim ? (
                        <span
                          className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase ${verdictColor[claim.verdict]}`}
                        >
                          {claim.verdict}
                        </span>
                      ) : null}
                    </button>
                    {on && r.id === "fuel" ? (
                      <div className="mt-2 flex items-center gap-3 pl-2">
                        <label
                          htmlFor="fuel-amt"
                          className="text-sm text-dust-400"
                        >
                          Claim (kg)
                        </label>
                        <input
                          id="fuel-amt"
                          type="range"
                          min={20}
                          max={120}
                          value={fuelAmt}
                          onChange={(e) => setFuelAmt(Number(e.target.value))}
                          className="w-40 accent-rust"
                        />
                        <span className="font-mono text-sm text-dust-200">
                          {fuelAmt}
                        </span>
                      </div>
                    ) : null}
                    {on && claim?.reason ? (
                      <p className="mt-1 pl-2 text-xs text-dust-400">
                        {claim.reason}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-dust-700/70 bg-dust-900/70 p-5 shadow-panel">
          <h2 className="font-display text-lg text-dust-100">Policy verdict</h2>
          <dl className="mt-4 space-y-2 font-mono text-sm">
            <div className="flex justify-between text-signal">
              <dt>Auto-approve</dt>
              <dd>{greens}</dd>
            </div>
            <div className="flex justify-between text-warn">
              <dt>Needs resolve</dt>
              <dd>{ambers}</dd>
            </div>
            <div className="flex justify-between text-danger-bright">
              <dt>Floor forbids</dt>
              <dd>{reds}</dd>
            </div>
          </dl>
          <div className="mt-6 space-y-2">
            {collisionClaim ? (
              <Link
                href="/mission/conflict"
                className="block rounded-md border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn-bright"
              >
                Resolve collision →
              </Link>
            ) : null}
            {blockedClaim ? (
              <Link
                href="/mission/blocked"
                className="block rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger-bright"
              >
                View blocked by policy →
              </Link>
            ) : null}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={reds > 0 || selected.length === 0 || submitted}
              className="w-full rounded-md bg-rust px-4 py-3 font-medium text-dust-50 disabled:opacity-40"
            >
              {submitted
                ? `${greens} hold${greens === 1 ? "" : "s"} confirmed`
                : "Submit green lines"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MissionDraftPage;
