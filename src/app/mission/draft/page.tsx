"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { usePolicy } from "@/context/PolicyContext";
import { DAYS, RESOURCES, WEEK_LABEL } from "@/lib/data";
import { evaluateClaim } from "@/lib/evaluate";
import { FINDS, kitFor, shortfall, type Find } from "@/lib/finds";
import { SITES, siteById } from "@/lib/sites";
import type { DraftClaim, PolicyVerdict } from "@/lib/policy";

const CLAIMABLE = RESOURCES.filter((item) =>
  ["rover-a", "rover-b", "drill-1", "fuel", "o2", "eva-suit", "rations"].includes(
    item.id,
  ),
);

const verdictColor: Record<PolicyVerdict, string> = {
  green: "text-signal border-signal/40 bg-signal/10",
  amber: "text-warn border-warn/40 bg-warn/10",
  red: "text-danger-bright border-danger/40 bg-danger/10",
};

type BringBack = {
  findId: string;
  amount: number;
  siteId: string;
};

const linesFor = (findIds: string[]): Map<string, number | undefined> => {
  const map = new Map<string, number | undefined>();
  for (const findId of findIds) {
    const kit = kitFor(findId);
    if (!kit) continue;
    for (const line of kit.lines) {
      const prev = map.get(line.resourceId);
      if (line.burned == null) {
        if (!map.has(line.resourceId)) map.set(line.resourceId, undefined);
      } else {
        map.set(line.resourceId, (prev ?? 0) + line.burned);
      }
    }
  }
  return map;
};

const kitState = (findIds: string[]) => {
  const map = linesFor(findIds);
  const amounts: Record<string, number> = {};
  for (const [id, burned] of map) {
    if (burned != null) amounts[id] = burned;
  }
  return { selected: [...map.keys()], amounts };
};

const INITIAL_BRING: BringBack[] = [
  { findId: "water-ice", amount: 80, siteId: "north-ridge" },
];

const MissionDraftPage = () => {
  const { rules } = usePolicy();
  const { gearOnHand, resourceOnHand } = useInventory();
  const [deployFrom, setDeployFrom] = useState("dome-2");
  const [bringBack, setBringBack] = useState<BringBack[]>(INITIAL_BRING);
  const [dayStart, setDayStart] = useState(0);
  const [dayEnd, setDayEnd] = useState(2);
  const initialKit = kitState(INITIAL_BRING.map((line) => line.findId));
  const [selected, setSelected] = useState<string[]>(initialKit.selected);
  const [amounts, setAmounts] = useState<Record<string, number>>(initialKit.amounts);
  const [submitted, setSubmitted] = useState(false);

  const findsByNeed = useMemo(() => {
    return [...FINDS].sort((a, b) => {
      const gap = (find: Find) =>
        find.needed - (resourceOnHand[find.id] ?? find.onHand);
      return gap(b) - gap(a);
    });
  }, [resourceOnHand]);

  const claims: DraftClaim[] = useMemo(() => {
    return selected.map((id) => {
      const gear = RESOURCES.find((item) => item.id === id)!;
      const amount = amounts[id];
      const evaled = evaluateClaim(
        rules,
        id,
        dayStart,
        dayEnd,
        amount,
        gearOnHand,
      );
      return {
        resourceId: id,
        resourceName: gear.name,
        dayStart,
        dayEnd,
        amount,
        ...evaled,
      };
    });
  }, [selected, amounts, dayStart, dayEnd, rules, gearOnHand]);

  const greens = claims.filter((claim) => claim.verdict === "green").length;
  const ambers = claims.filter((claim) => claim.verdict === "amber").length;
  const reds = claims.filter((claim) => claim.verdict === "red").length;
  const collisionClaim = claims.find((claim) => claim.collisionWith);
  const blockedClaim = claims.find((claim) => claim.verdict === "red");

  const applyBringBack = (next: BringBack[]) => {
    setBringBack(next);
    const kit = kitState(next.map((line) => line.findId));
    setSelected(kit.selected);
    setAmounts(kit.amounts);
    setSubmitted(false);
  };

  const handleToggleFind = (find: Find) => {
    const existing = bringBack.find((line) => line.findId === find.id);
    if (existing) {
      applyBringBack(bringBack.filter((line) => line.findId !== find.id));
      return;
    }
    const gap = Math.max(find.needed - (resourceOnHand[find.id] ?? find.onHand), 10);
    applyBringBack([
      ...bringBack,
      { findId: find.id, amount: gap, siteId: "north-ridge" },
    ]);
  };

  const handleAmount = (findId: string, amount: number) => {
    setBringBack((prev) =>
      prev.map((line) => (line.findId === findId ? { ...line, amount } : line)),
    );
  };

  const handleSite = (findId: string, siteId: string) => {
    setBringBack((prev) =>
      prev.map((line) => (line.findId === findId ? { ...line, siteId } : line)),
    );
  };

  const handleToggleGear = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
    setSubmitted(false);
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
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (reds > 0 || bringBack.length === 0) return;
    setSubmitted(true);
  };

  const depart = siteById(deployFrom);

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
          Resources are what you are going out to find. Gear is what you take
          to get them. Amounts start from the last burn, not the largest claim.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-lg text-dust-100">1 · Deploy from</h2>
            <label htmlFor="deploy-from" className="mt-3 block text-sm text-dust-400">
              Where the crew leaves the habitat
            </label>
            <select
              id="deploy-from"
              value={deployFrom}
              onChange={(event) => setDeployFrom(event.target.value)}
              className="mt-2 w-full max-w-md rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust"
            >
              {SITES.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} · {site.region}
                </option>
              ))}
            </select>
          </section>

          <section>
            <h2 className="font-display text-lg text-dust-100">
              2 · Resources to bring back
            </h2>
            <ul className="mt-3 space-y-2">
              {findsByNeed.map((find) => {
                const line = bringBack.find((item) => item.findId === find.id);
                const onHand = resourceOnHand[find.id] ?? find.onHand;
                const gap = shortfall({ ...find, onHand });
                return (
                  <li
                    key={find.id}
                    className={`rounded-md border px-4 py-3 ${
                      line
                        ? "border-dust-500 bg-dust-850"
                        : "border-dust-700/60 bg-dust-900/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleFind(find)}
                      aria-pressed={Boolean(line)}
                      className="flex w-full items-start justify-between gap-3 text-left"
                    >
                      <span>
                        <span className="font-medium text-dust-100">{find.name}</span>
                        <span className="mt-0.5 block text-xs text-dust-400">
                          {onHand} {find.unit} on hand · need {find.needed} ·{" "}
                          {gap > 0 ? `short ${gap}` : "covered"}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] uppercase text-dust-500">
                        {line ? "On list" : "Add"}
                      </span>
                    </button>
                    {line ? (
                      <div className="mt-3 flex flex-wrap items-end gap-3">
                        <div>
                          <label
                            htmlFor={`amt-${find.id}`}
                            className="font-mono text-[10px] uppercase text-dust-500"
                          >
                            Bring back ({find.unit})
                          </label>
                          <input
                            id={`amt-${find.id}`}
                            type="number"
                            min={1}
                            value={line.amount}
                            onChange={(event) =>
                              handleAmount(find.id, Number(event.target.value))
                            }
                            className="mt-1 w-28 rounded-md border border-dust-600 bg-dust-900 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust"
                          />
                        </div>
                        <div className="min-w-[14rem] flex-1">
                          <label
                            htmlFor={`site-${find.id}`}
                            className="font-mono text-[10px] uppercase text-dust-500"
                          >
                            Collect at
                          </label>
                          <select
                            id={`site-${find.id}`}
                            value={line.siteId}
                            onChange={(event) => handleSite(find.id, event.target.value)}
                            className="mt-1 w-full rounded-md border border-dust-600 bg-dust-900 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust"
                          >
                            {SITES.map((site) => (
                              <option key={site.id} value={site.id}>
                                {site.name} · {site.region}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-dust-100">3 · Window</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const inRange = day.index >= dayStart && day.index <= dayEnd;
                return (
                  <button
                    key={day.index}
                    type="button"
                    onClick={() => handleDayClick(day.index)}
                    aria-pressed={inRange}
                    className={`min-w-[3.5rem] rounded-md border px-3 py-3 text-center transition-colors ${
                      inRange
                        ? "border-rust bg-rust/20 text-dust-50"
                        : "border-dust-600 bg-dust-850 text-dust-400 hover:border-dust-500"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase">{day.short}</div>
                    <div className="font-display text-lg">{day.date}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg text-dust-100">
              4 · Gear this bring-back needs
            </h2>
            <p className="mt-1 text-sm text-dust-400">
              Loaded from the last runs that recovered{" "}
              {bringBack
                .map((line) => FINDS.find((find) => find.id === line.findId)?.name)
                .filter(Boolean)
                .join(", ") || "nothing yet"}
              . Departing {depart?.name}.
            </p>
            <ul className="mt-3 space-y-2">
              {CLAIMABLE.map((gear) => {
                const on = selected.includes(gear.id);
                const claim = claims.find((item) => item.resourceId === gear.id);
                const onHand = gearOnHand[gear.id] ?? gear.onHand;
                const isDrawn =
                  gear.class === "consumable" || gear.class === "suit";
                return (
                  <li key={gear.id}>
                    <button
                      type="button"
                      onClick={() => handleToggleGear(gear.id)}
                      aria-pressed={on}
                      className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left transition-colors ${
                        on
                          ? "border-dust-500 bg-dust-850"
                          : "border-dust-700/60 bg-dust-900/40 text-dust-400"
                      }`}
                    >
                      <span className="font-medium text-dust-100">{gear.name}</span>
                      {on && claim ? (
                        <span
                          className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase ${verdictColor[claim.verdict]}`}
                        >
                          {claim.verdict}
                        </span>
                      ) : null}
                    </button>
                    {on && isDrawn ? (
                      <div className="mt-2 flex items-center gap-3 pl-2">
                        <label htmlFor={`gear-${gear.id}`} className="text-sm text-dust-400">
                          Take ({gear.unit})
                        </label>
                        <input
                          id={`gear-${gear.id}`}
                          type="number"
                          min={1}
                          value={amounts[gear.id] ?? 1}
                          onChange={(event) =>
                            setAmounts((prev) => ({
                              ...prev,
                              [gear.id]: Number(event.target.value),
                            }))
                          }
                          className="w-24 rounded-md border border-dust-600 bg-dust-900 px-3 py-1.5 text-sm text-dust-100 outline-none focus:border-rust"
                        />
                        <span className="text-xs text-dust-500">
                          {onHand} on hand
                        </span>
                      </div>
                    ) : null}
                    {on && claim?.reason ? (
                      <p className="mt-1 pl-2 text-xs text-dust-400">{claim.reason}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-dust-700/70 bg-dust-900/70 p-5 shadow-panel">
          <h2 className="font-display text-lg text-dust-100">Bring-back list</h2>
          {bringBack.length === 0 ? (
            <p className="mt-3 text-sm text-dust-400">Nothing selected.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-dust-200">
              {bringBack.map((line) => {
                const find = FINDS.find((item) => item.id === line.findId);
                const site = siteById(line.siteId);
                return (
                  <li key={line.findId}>
                    <span className="text-dust-50">{find?.name}</span>
                    <span className="mt-0.5 block text-xs text-dust-400">
                      {line.amount} {find?.unit} from {site?.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 text-xs text-dust-500">Deploy {depart?.name}</p>

          <h2 className="mt-6 font-display text-lg text-dust-100">Policy verdict</h2>
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
              disabled={reds > 0 || selected.length === 0 || bringBack.length === 0 || submitted}
              className="w-full rounded-md bg-rust px-4 py-3 font-medium text-dust-50 disabled:opacity-40"
            >
              {submitted
                ? `${greens} gear hold${greens === 1 ? "" : "s"} confirmed`
                : "Submit green gear"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MissionDraftPage;
