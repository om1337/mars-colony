"use client";

import { useMemo, useState } from "react";
import { ForageWeek } from "@/components/ForageWeek";
import { useInventory } from "@/context/InventoryContext";
import {
  CLASS_LABELS,
  COMMITMENTS,
  CURRENT_CREW,
  DAYS,
  MISSION_COLORS,
  MISSIONS,
  RESOURCES,
  WEEK_LABEL,
} from "@/lib/data";
import { materialsForMission, materialsOnDay } from "@/lib/finds";
import type { ResourceClass } from "@/lib/types";
import {
  buildBlockSegments,
  consumableAvailable,
  consumableCommitted,
} from "@/lib/weekBoard";

const CLASS_FILTERS: Array<"all" | ResourceClass> = [
  "all",
  "vehicle",
  "tool",
  "consumable",
  "suit",
];

const colSpan = (start: number, end: number): number => end - start + 1;

export const WeekBoard = () => {
  const { gearOnHand } = useInventory();
  const [classFilter, setClassFilter] = useState<"all" | ResourceClass>("all");
  const [missionFilter, setMissionFilter] = useState<string>("all");
  const [onlyMine, setOnlyMine] = useState(false);

  const gear = useMemo(
    () =>
      RESOURCES.map((item) => ({
        ...item,
        onHand: gearOnHand[item.id] ?? item.onHand,
      })),
    [gearOnHand],
  );

  const myMissionIds = useMemo(
    () =>
      new Set(
        MISSIONS.filter((m) => m.crew.includes(CURRENT_CREW)).map((m) => m.id),
      ),
    [],
  );

  const visibleGear = useMemo(() => {
    return gear.filter((r) => {
      if (classFilter !== "all" && r.class !== classFilter) return false;
      if (missionFilter === "all" && !onlyMine) return true;
      const related = COMMITMENTS.filter((c) => c.resourceId === r.id);
      if (missionFilter !== "all") {
        return related.some((c) => c.missionId === missionFilter);
      }
      if (onlyMine) {
        return related.some((c) => myMissionIds.has(c.missionId));
      }
      return true;
    });
  }, [gear, classFilter, missionFilter, onlyMine, myMissionIds]);

  const handleClassFilter = (value: "all" | ResourceClass) => {
    setClassFilter(value);
  };

  const handleMissionFilter = (value: string) => {
    setMissionFilter(value);
  };

  const handleOnlyMine = () => {
    setOnlyMine((prev) => !prev);
  };

  return (
    <section className="flex min-h-screen flex-col" aria-labelledby="week-board-title">
      <header className="relative overflow-hidden border-b border-dust-700/80 px-6 pb-6 pt-8 md:px-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 15% -10%, rgba(196,92,38,0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(184,115,51,0.12), transparent 50%), linear-gradient(180deg, #14100c 0%, #0a0806 100%)",
          }}
        />
        <div className="relative animate-fade-up">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
            Colony ledger · read universal
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                id="week-board-title"
                className="font-display text-3xl font-semibold tracking-tight text-dust-50 md:text-4xl"
              >
                Week Board
              </h1>
              <p className="mt-1.5 font-body text-sm text-dust-300 md:text-base">
                {WEEK_LABEL} — resources being foraged, and the gear held to get them.
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-dust-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-danger" /> Collision
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm border border-dashed border-dust-400 bg-dust-800/50" />{" "}
                In-transit
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm border border-dashed border-warn/70" />{" "}
                Unreconciled
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div
              className="flex flex-wrap gap-1 rounded-md border border-dust-700 bg-dust-900/80 p-1"
              role="group"
              aria-label="Filter by gear class"
            >
              {CLASS_FILTERS.map((key) => {
                const active = classFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    tabIndex={0}
                    aria-pressed={active}
                    aria-label={`Filter ${CLASS_LABELS[key]}`}
                    onClick={() => handleClassFilter(key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClassFilter(key);
                      }
                    }}
                    className={`rounded px-3 py-1.5 font-body text-xs transition ${
                      active
                        ? "bg-rust text-dust-50"
                        : "text-dust-300 hover:bg-dust-800 hover:text-dust-100"
                    }`}
                  >
                    {CLASS_LABELS[key]}
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-2 font-body text-xs text-dust-300">
              <span className="sr-only">Filter by mission</span>
              <select
                value={missionFilter}
                onChange={(e) => handleMissionFilter(e.target.value)}
                aria-label="Filter by mission"
                className="rounded-md border border-dust-700 bg-dust-900 px-3 py-2 text-dust-100 outline-none focus:border-copper"
              >
                <option value="all">All missions</option>
                {MISSIONS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                    {materialsForMission(m.id).length
                      ? ` · ${materialsForMission(m.id).join(", ")}`
                      : ""}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              tabIndex={0}
              aria-pressed={onlyMine}
              aria-label="Show only missions I am on"
              onClick={handleOnlyMine}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOnlyMine();
                }
              }}
              className={`rounded-md border px-3 py-2 font-body text-xs transition ${
                onlyMine
                  ? "border-signal/60 bg-signal/15 text-signal-bright"
                  : "border-dust-700 bg-dust-900 text-dust-300 hover:border-dust-500"
              }`}
            >
              Only what I&apos;m on
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto px-4 py-6 md:px-8">
        <ForageWeek />
        <h2 className="mb-3 font-display text-lg text-dust-50">Gear in use</h2>
        <div className="min-w-[900px] animate-fade-up rounded-lg border border-dust-700/90 bg-dust-900/60 shadow-panel">
          <div
            className="grid border-b border-dust-700"
            style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}
          >
            <div className="flex items-end px-4 pb-3 pt-4 font-mono text-[10px] uppercase tracking-widest text-dust-500">
              Gear
            </div>
            {DAYS.map((d) => {
              const sought = materialsOnDay(d.index);
              return (
                <div
                  key={d.index}
                  className="border-l border-dust-700/70 px-2 pb-3 pt-4 text-center"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-dust-500">
                    {d.short}
                  </div>
                  <div className="font-display text-lg font-medium text-dust-100">
                    {d.date}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {sought.map((name) => (
                      <div
                        key={name}
                        className="truncate font-mono text-[9px] text-copper-light"
                        title={name}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {visibleGear.map((resource) => {
            const rowCommitments = COMMITMENTS.filter(
              (c) => c.resourceId === resource.id,
            ).filter((c) => {
              if (missionFilter !== "all" && c.missionId !== missionFilter) {
                return false;
              }
              if (onlyMine && !myMissionIds.has(c.missionId) && c.kind === "hold") {
                return false;
              }
              return true;
            });

            const exclusive = resource.capacity === 1;
            const segments = buildBlockSegments(rowCommitments, exclusive);
            const isConsumable =
              resource.class === "consumable" || resource.class === "suit";
            const committed = consumableCommitted(resource, COMMITMENTS);
            const available = consumableAvailable(resource, COMMITMENTS);
            const fillPct = Math.min(
              100,
              ((resource.onHand - committed) / resource.capacity) * 100,
            );
            const floorPct = (resource.reserveFloor / resource.capacity) * 100;

            return (
              <div
                key={resource.id}
                className="grid border-b border-dust-700/60 last:border-b-0"
                style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}
              >
                <div className="flex flex-col justify-center gap-1.5 border-r border-dust-700/60 px-4 py-4">
                  <div className="font-display text-sm font-medium text-dust-50">
                    {resource.name}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-dust-500">
                    {resource.class}
                    {isConsumable ? ` · ${resource.onHand} ${resource.unit}` : null}
                  </div>
                  {isConsumable ? (
                    <div className="mt-1">
                      <div className="relative h-2 overflow-hidden rounded-sm bg-dust-800">
                        <div
                          className="absolute inset-y-0 left-0 rounded-sm bg-gradient-to-r from-copper to-rust"
                          style={{ width: `${fillPct}%` }}
                        />
                        {resource.reserveFloor > 0 ? (
                          <div
                            className="absolute inset-y-0 w-px bg-warn"
                            style={{ left: `${floorPct}%` }}
                            title={`Reserve floor ${resource.reserveFloor}`}
                          />
                        ) : null}
                      </div>
                      <div className="mt-1 flex justify-between font-mono text-[9px] text-dust-500">
                        <span>
                          free {available}
                          {resource.unit}
                        </span>
                        <span>floor {resource.reserveFloor}</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="relative col-span-7 grid grid-cols-7">
                  {DAYS.map((d) => (
                    <div
                      key={d.index}
                      className="min-h-[88px] border-l border-dust-800/80 bg-dust-950/20"
                    />
                  ))}

                  <div className="pointer-events-none absolute inset-0 p-1.5">
                    {segments.map((seg) => {
                      const c0 = seg.commitments[0];
                      const left = (seg.dayStart / 7) * 100;
                      const width = (colSpan(seg.dayStart, seg.dayEnd) / 7) * 100;
                      const color = MISSION_COLORS[c0.missionId] ?? "#8a7a64";

                      if (seg.isCollision) {
                        return (
                          <div
                            key={`col-${seg.dayStart}-${seg.dayEnd}-${c0.id}`}
                            className="pointer-events-auto absolute top-1/2 -translate-y-1/2"
                            style={{
                              left: `calc(${left}% + 2px)`,
                              width: `calc(${width}% - 4px)`,
                            }}
                          >
                            <div
                              className="animate-pulse-soft rounded border border-danger-bright/80 bg-danger/90 px-2 py-2 shadow-[0_0_20px_rgba(199,62,29,0.35)]"
                              role="status"
                              aria-label={`Collision: ${seg.commitments.map((c) => c.missionName).join(" vs ")}`}
                              title={seg.commitments
                                .map((c) => `${c.missionName} (${c.commander})`)
                                .join(" · ")}
                            >
                              <div className="font-display text-[11px] font-semibold uppercase tracking-wide text-white">
                                Collision
                              </div>
                              <div className="mt-0.5 truncate font-body text-[10px] text-dust-100/90">
                                {seg.commitments.map((c) => c.missionName).join(" × ")}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (c0.kind === "in-transit") {
                        return (
                          <div
                            key={c0.id}
                            className="pointer-events-auto absolute top-1/2 -translate-y-1/2"
                            style={{
                              left: `calc(${left}% + 2px)`,
                              width: `calc(${width}% - 4px)`,
                            }}
                          >
                            <div
                              className="rounded border border-dashed border-dust-400/50 bg-dust-800/40 px-2 py-2 opacity-70"
                              title={c0.missionName}
                            >
                              <div className="truncate font-body text-[11px] text-dust-200">
                                {c0.missionName}
                              </div>
                              <div className="font-mono text-[9px] text-dust-500">
                                ghost · arrival
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (c0.kind === "unreconciled") {
                        return (
                          <div
                            key={c0.id}
                            className="pointer-events-auto absolute top-1/2 -translate-y-1/2"
                            style={{
                              left: `calc(${left}% + 2px)`,
                              width: `calc(${width}% - 4px)`,
                            }}
                          >
                            <div
                              className="rounded border border-dashed border-warn/60 bg-warn/10 px-2 py-2"
                              title="Number not yet trustworthy"
                            >
                              <div className="truncate font-body text-[11px] text-warn-bright">
                                {c0.missionName}
                              </div>
                              <div className="font-mono text-[9px] text-warn/80">
                                unreconciled
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={c0.id}
                          className="pointer-events-auto absolute top-1/2 -translate-y-1/2"
                          style={{
                            left: `calc(${left}% + 2px)`,
                            width: `calc(${width}% - 4px)`,
                          }}
                        >
                          <div
                            className="rounded border border-white/10 px-2 py-2 shadow-sm transition hover:brightness-110"
                            style={{
                              background: `linear-gradient(135deg, ${color}cc, ${color}99)`,
                            }}
                            title={`${c0.missionName} · ${c0.commander}${c0.amount ? ` · ${c0.amount}` : ""}`}
                          >
                            <div className="truncate font-display text-[11px] font-medium text-white">
                              {materialsForMission(c0.missionId)[0] ?? c0.missionName}
                            </div>
                            <div className="truncate font-body text-[10px] text-white/75">
                              {materialsForMission(c0.missionId)[0]
                                ? c0.missionName
                                : c0.commander}
                              {c0.amount != null
                                ? ` · ${c0.amount}${resource.unit}`
                                : ""}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {visibleGear.length === 0 ? (
            <div className="px-6 py-16 text-center font-body text-sm text-dust-400">
              No gear matches these filters.
            </div>
          ) : null}
        </div>

        <p className="mt-4 max-w-2xl font-body text-xs text-dust-500">
          The top band is resources the missions are out to find. The grid is the
          gear they hold to do it. Overlapping gear renders as one red collision.
        </p>
      </div>
    </section>
  );
};
