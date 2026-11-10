"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useInventory } from "@/context/InventoryContext";
import { useRole } from "@/context/RoleContext";
import { COMMITMENTS, RESOURCES } from "@/lib/data";
import { FINDS, FIND_KIND_LABEL } from "@/lib/finds";
import { WEEK_FORAGE } from "@/lib/sites";
import { consumableCommitted } from "@/lib/weekBoard";

const ExceptionsPage = () => {
  const { roleId } = useRole();
  const { gearOnHand, resourceOnHand, priorEvaOpen, corrections } = useInventory();
  const canWrite = roleId === "supply";

  const gearRows = useMemo(() => {
    return RESOURCES.map((gear) => {
      const onHand = gearOnHand[gear.id] ?? gear.onHand;
      const live = { ...gear, onHand };
      const committed = consumableCommitted(live, COMMITMENTS);
      const free = Math.max(0, onHand - committed - gear.reserveFloor);
      const aboveFloor = onHand - committed - gear.reserveFloor;
      return { ...live, committed, free, aboveFloor };
    });
  }, [gearOnHand]);

  const floorQueue = gearRows.filter(
    (gear) => gear.reserveFloor > 0 && gear.aboveFloor < gear.reserveFloor * 0.25,
  );

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
          Maya · inventory, not an inbox
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          Supply Exceptions
        </h1>
        <p className="mt-2 text-dust-300">
          Gear is what the colony holds. Resources are what missions bring back.
          This screen lists what is wrong with either count.
        </p>
        {!canWrite ? (
          <p className="mt-2 text-sm text-dust-500">
            Read only. Maya is the one who corrects a count.
          </p>
        ) : null}
      </header>

      <section className="mt-8">
        <h2 className="font-display text-lg text-dust-100">Gear on hand</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-dust-700/70">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-dust-900/80 font-mono text-[10px] uppercase tracking-wider text-dust-500">
              <tr>
                <th className="px-3 py-2 font-normal">Gear</th>
                <th className="px-3 py-2 font-normal">On hand</th>
                <th className="px-3 py-2 font-normal">Committed</th>
                <th className="px-3 py-2 font-normal">Free above floor</th>
                <th className="px-3 py-2 font-normal">Floor</th>
              </tr>
            </thead>
            <tbody>
              {gearRows.map((gear) => (
                <tr key={gear.id} className="border-t border-dust-800">
                  <td className="px-3 py-2 text-dust-100">{gear.name}</td>
                  <td className="px-3 py-2 font-mono text-dust-200">
                    {gear.onHand} {gear.unit === "unit" ? "" : gear.unit}
                  </td>
                  <td className="px-3 py-2 font-mono text-dust-300">{gear.committed}</td>
                  <td
                    className={`px-3 py-2 font-mono ${gear.aboveFloor < 0 ? "text-danger-bright" : "text-dust-200"}`}
                  >
                    {gear.aboveFloor}
                  </td>
                  <td className="px-3 py-2 font-mono text-dust-400">{gear.reserveFloor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg text-dust-100">Resource stock</h2>
        <p className="mt-1 text-sm text-dust-400">
          Recovered material. A shortfall is why a commander drafts a mission.
        </p>
        <div className="mt-3 overflow-x-auto rounded-lg border border-dust-700/70">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-dust-900/80 font-mono text-[10px] uppercase tracking-wider text-dust-500">
              <tr>
                <th className="px-3 py-2 font-normal">Resource</th>
                <th className="px-3 py-2 font-normal">Kind</th>
                <th className="px-3 py-2 font-normal">On hand</th>
                <th className="px-3 py-2 font-normal">Needed</th>
                <th className="px-3 py-2 font-normal">This week</th>
              </tr>
            </thead>
            <tbody>
              {FINDS.map((find) => {
                const onHand = resourceOnHand[find.id] ?? find.onHand;
                const gap = find.needed - onHand;
                const sought = WEEK_FORAGE.filter((target) => target.findId === find.id).reduce(
                  (sum, target) => sum + target.amount,
                  0,
                );
                return (
                  <tr key={find.id} className="border-t border-dust-800">
                    <td className="px-3 py-2 text-dust-100">{find.name}</td>
                    <td className="px-3 py-2 text-dust-400">{FIND_KIND_LABEL[find.kind]}</td>
                    <td className="px-3 py-2 font-mono text-dust-200">
                      {onHand} {find.unit}
                    </td>
                    <td className={`px-3 py-2 font-mono ${gap > 0 ? "text-warn-bright" : "text-signal"}`}>
                      {gap > 0 ? `short ${gap}` : "covered"}
                    </td>
                    <td className="px-3 py-2 font-mono text-dust-300">
                      {sought > 0 ? `seeking ${sought}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Queue
          title="Reserve floors"
          empty="No floor is breached or within a quarter of its margin."
          rows={floorQueue.map((gear) => ({
            id: gear.id,
            title: gear.name,
            detail:
              gear.aboveFloor < 0
                ? `Under the floor by ${Math.abs(gear.aboveFloor)} ${gear.unit}`
                : `${gear.aboveFloor} ${gear.unit} of margin left`,
            href: `/supply/correction?kind=gear&item=${gear.id}`,
            action: canWrite ? "Correct count" : "View",
          }))}
        />
        <Queue
          title="Unreconciled missions"
          empty="Every closed mission has been trued up."
          rows={
            priorEvaOpen
              ? [
                  {
                    id: "m-prior",
                    title: "Prior EVA",
                    detail: "18 kg fuel still untrusted. Recovered water ice is not on the stock yet.",
                    href: "/reconcile",
                    action: canWrite ? "Close it" : "View",
                  },
                ]
              : []
          }
        />
        <Queue
          title="Draws outside an allocation"
          empty="No out-of-allocation draws logged."
          rows={[
            {
              id: "extra-filter",
              title: "Water filter cartridge",
              detail: "Taken at Dome 2 checkout. Recorded, not blocked. Not on Ridge Survey's allocation.",
              href: "/supply/correction?kind=gear&item=rations",
              action: canWrite ? "Set the shelf" : "View",
            },
          ]}
        />
        <Queue
          title="Plan versus actual"
          empty="No variance over the threshold."
          rows={[
            {
              id: "ridge-fuel",
              title: "Ridge Survey · methane",
              detail: "Plan 48 kg. Burn log 61 kg. Ledger still shows the plan.",
              href: "/reconcile",
              action: "Reconcile",
            },
          ]}
        />
      </section>

      {corrections.length > 0 ? (
        <p className="mt-6 text-sm text-dust-400">
          {corrections.length} correction{corrections.length === 1 ? "" : "s"} logged
          this session. They are on the correction screen.
        </p>
      ) : null}
    </div>
  );
};

type QueueRow = {
  id: string;
  title: string;
  detail: string;
  href: string;
  action: string;
};

const Queue = ({
  title,
  empty,
  rows,
}: {
  title: string;
  empty: string;
  rows: QueueRow[];
}) => (
  <div className="rounded-lg border border-dust-700/70 bg-dust-900/60 p-4">
    <h3 className="font-display text-dust-50">{title}</h3>
    {rows.length === 0 ? (
      <p className="mt-2 text-sm text-dust-500">{empty}</p>
    ) : (
      <ul className="mt-3 space-y-3">
        {rows.map((row) => (
          <li key={row.id} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-dust-100">{row.title}</p>
              <p className="mt-0.5 text-xs text-dust-400">{row.detail}</p>
            </div>
            <Link
              href={row.href}
              className="shrink-0 rounded-md border border-dust-600 px-2 py-1 text-xs text-dust-200 hover:border-dust-400"
            >
              {row.action}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ExceptionsPage;
