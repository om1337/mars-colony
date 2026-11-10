"use client";

import { DAYS, MISSION_COLORS, MISSIONS } from "@/lib/data";
import { FIND_KIND_LABEL, findById } from "@/lib/finds";
import { WEEK_FORAGE, siteById } from "@/lib/sites";
import { useInventory } from "@/context/InventoryContext";

const colSpan = (start: number, end: number): number => end - start + 1;

export const ForageWeek = () => {
  const { resourceOnHand } = useInventory();
  const findIds = [...new Set(WEEK_FORAGE.map((target) => target.findId))];

  return (
    <section aria-labelledby="forage-title" className="mb-8">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="forage-title" className="font-display text-lg text-dust-50">
            Resources being foraged
          </h2>
          <p className="mt-1 text-sm text-dust-400">
            What each mission is out to bring back, and where on Mars they collect it.
          </p>
        </div>
      </div>
      <div className="min-w-[900px] overflow-hidden rounded-lg border border-dust-700/90 bg-dust-900/60 shadow-panel">
        <div
          className="grid border-b border-dust-700"
          style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}
        >
          <div className="flex items-end px-4 pb-3 pt-4 font-mono text-[10px] uppercase tracking-widest text-dust-500">
            Resource
          </div>
          {DAYS.map((day) => (
            <div
              key={day.index}
              className="border-l border-dust-700/70 px-2 pb-3 pt-4 text-center"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-dust-500">
                {day.short}
              </div>
              <div className="font-display text-lg font-medium text-dust-100">
                {day.date}
              </div>
            </div>
          ))}
        </div>
        {findIds.map((findId) => {
          const find = findById(findId);
          if (!find) return null;
          const onHand = resourceOnHand[findId] ?? find.onHand;
          const gap = find.needed - onHand;
          const targets = WEEK_FORAGE.filter((target) => target.findId === findId);
          return (
            <div
              key={findId}
              className="grid border-b border-dust-700/60 last:border-b-0"
              style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}
            >
              <div className="flex flex-col justify-center border-r border-dust-700/60 px-4 py-3">
                <div className="font-display text-sm font-medium text-dust-50">
                  {find.name}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-dust-500">
                  {FIND_KIND_LABEL[find.kind]} · {onHand} {find.unit} on hand
                </div>
                <div
                  className={`mt-1 font-mono text-[10px] ${gap > 0 ? "text-warn-bright" : "text-signal"}`}
                >
                  {gap > 0 ? `short ${gap} ${find.unit}` : "covered"}
                </div>
              </div>
              <div className="relative col-span-7 grid grid-cols-7">
                {DAYS.map((day) => (
                  <div
                    key={day.index}
                    className="min-h-[72px] border-l border-dust-800/80"
                  />
                ))}
                <div className="pointer-events-none absolute inset-0 p-1.5">
                  {targets.map((target) => {
                    const mission = MISSIONS.find((item) => item.id === target.missionId);
                    if (!mission) return null;
                    const site = siteById(target.siteId);
                    const left = (mission.dayStart / 7) * 100;
                    const width = (colSpan(mission.dayStart, mission.dayEnd) / 7) * 100;
                    const color = MISSION_COLORS[mission.id] ?? "#8a7a64";
                    return (
                      <div
                        key={target.missionId}
                        className="pointer-events-auto absolute top-1/2 -translate-y-1/2"
                        style={{
                          left: `calc(${left}% + 2px)`,
                          width: `calc(${width}% - 4px)`,
                        }}
                      >
                        <div
                          className="rounded border border-white/10 px-2 py-1.5"
                          style={{ background: `linear-gradient(135deg, ${color}cc, ${color}99)` }}
                          title={`${mission.name} collects ${target.amount} ${find.unit} at ${site?.name ?? "site"}`}
                        >
                          <div className="truncate font-display text-[11px] font-medium text-white">
                            {mission.name}
                          </div>
                          <div className="truncate font-body text-[10px] text-white/80">
                            {target.amount} {find.unit} · {site?.name}
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
      </div>
    </section>
  );
};
