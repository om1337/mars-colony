"use client";

import { useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import { COMMITMENTS, RESOURCES } from "@/lib/data";
import { FINDS } from "@/lib/finds";

const daysHeld = (gearId: string): number => {
  const days = new Set<number>();
  for (const hold of COMMITMENTS) {
    if (hold.resourceId !== gearId || hold.kind !== "hold") continue;
    for (let day = hold.dayStart; day <= hold.dayEnd; day += 1) days.add(day);
  }
  return days.size;
};

const UtilizationPage = () => {
  const { gearOnHand, resourceOnHand } = useInventory();

  const gearRows = useMemo(() => {
    return RESOURCES.map((gear) => {
      const held = gear.capacity === 1 ? daysHeld(gear.id) : 0;
      const idle =
        gear.capacity === 1 ? Math.round(((7 - held) / 7) * 100) : null;
      const onHand = gearOnHand[gear.id] ?? gear.onHand;
      return { ...gear, onHand, held, idle };
    }).sort((a, b) => (b.idle ?? 0) - (a.idle ?? 0));
  }, [gearOnHand]);

  const resourceRows = useMemo(() => {
    return FINDS.map((find) => {
      const onHand = resourceOnHand[find.id] ?? find.onHand;
      return { ...find, onHand, gap: find.needed - onHand };
    }).sort((a, b) => b.gap - a.gap);
  }, [resourceOnHand]);

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
          Tracking · gear idle, resource shortfall
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          Utilization
        </h1>
        <p className="mt-2 text-dust-300">
          A gear that sat idle with nothing sought against it is not a shortage.
          A resource with a long gap is why the next mission gets drafted.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-lg text-dust-100">Gear idle this week</h2>
          <ul className="mt-3 space-y-2">
            {gearRows.map((gear) => (
              <li
                key={gear.id}
                className="flex items-center justify-between rounded-md border border-dust-700/70 bg-dust-900/50 px-4 py-3"
              >
                <span className="text-sm text-dust-100">{gear.name}</span>
                <span className="font-mono text-xs text-dust-300">
                  {gear.idle == null
                    ? `${gear.onHand} ${gear.unit} on hand`
                    : `${gear.idle}% idle · held ${gear.held}/7 days`}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-lg text-dust-100">Resource shortfall</h2>
          <ul className="mt-3 space-y-2">
            {resourceRows.map((find) => (
              <li
                key={find.id}
                className="flex items-center justify-between rounded-md border border-dust-700/70 bg-dust-900/50 px-4 py-3"
              >
                <span className="text-sm text-dust-100">{find.name}</span>
                <span
                  className={`font-mono text-xs ${find.gap > 0 ? "text-warn-bright" : "text-signal"}`}
                >
                  {find.gap > 0
                    ? `short ${find.gap} ${find.unit}`
                    : `${find.onHand} ${find.unit} covers need`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default UtilizationPage;
