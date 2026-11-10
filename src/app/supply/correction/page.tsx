"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInventory, type CorrectionCause } from "@/context/InventoryContext";
import { useRole } from "@/context/RoleContext";
import { RESOURCES } from "@/lib/data";
import { FINDS } from "@/lib/finds";

const CAUSES: CorrectionCause[] = [
  "miscount",
  "spoilage",
  "damage",
  "unrecorded draw",
  "found stock",
];

const CorrectionScreen = () => {
  const params = useSearchParams();
  const { roleId } = useRole();
  const { gearOnHand, resourceOnHand, corrections, correctCount } = useInventory();
  const canWrite = roleId === "supply";

  const initialKind = params.get("kind") === "resource" ? "resource" : "gear";
  const initialItem = params.get("item") ?? (initialKind === "gear" ? "fuel" : "water-ice");

  const [kind, setKind] = useState<"gear" | "resource">(initialKind);
  const [itemId, setItemId] = useState(initialItem);
  const [cause, setCause] = useState<CorrectionCause>("miscount");
  const [reason, setReason] = useState("");
  const [shelf, setShelf] = useState<number | null>(null);

  const options = kind === "gear" ? RESOURCES : FINDS;
  const current = useMemo(() => {
    if (kind === "gear") {
      const gear = RESOURCES.find((item) => item.id === itemId) ?? RESOURCES[3];
      return {
        name: gear.name,
        unit: gear.unit,
        screen: gearOnHand[gear.id] ?? gear.onHand,
      };
    }
    const find = FINDS.find((item) => item.id === itemId) ?? FINDS[0];
    return {
      name: find.name,
      unit: find.unit,
      screen: resourceOnHand[find.id] ?? find.onHand,
    };
  }, [kind, itemId, gearOnHand, resourceOnHand]);

  const nextCount = shelf ?? current.screen;
  const delta = Math.abs(nextCount - current.screen);
  const notifiesKai = delta >= 20 || (current.screen > 0 && delta / current.screen >= 0.1);

  const handleKind = (value: "gear" | "resource") => {
    setKind(value);
    setItemId(value === "gear" ? "fuel" : "water-ice");
    setShelf(null);
  };

  const handleSubmit = () => {
    if (!canWrite || !reason.trim()) return;
    correctCount({
      kind,
      itemId,
      to: nextCount,
      cause,
      reason,
    });
    setReason("");
    setShelf(null);
  };

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
          Maya only · the shelf wins
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          Ledger Correction
        </h1>
        <p className="mt-2 text-dust-300">
          Set a gear count or a resource stock to what is physically there. The
          change is logged. A large gap notifies Kai.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
        <form
          className="space-y-4 rounded-lg border border-dust-700/70 bg-dust-900/70 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex gap-2" role="group" aria-label="What you are counting">
            {(["gear", "resource"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={kind === value}
                disabled={!canWrite}
                onClick={() => handleKind(value)}
                className={`rounded-md border px-3 py-2 text-sm capitalize ${
                  kind === value
                    ? "border-rust bg-rust/20 text-dust-50"
                    : "border-dust-600 text-dust-300"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <label className="block text-sm text-dust-300" htmlFor="count-item">
            {kind === "gear" ? "Gear" : "Resource"}
          </label>
          <select
            id="count-item"
            value={itemId}
            disabled={!canWrite}
            onChange={(event) => {
              setItemId(event.target.value);
              setShelf(null);
            }}
            className="w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust disabled:opacity-60"
          >
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <p className="text-sm text-dust-400">
            Screen says{" "}
            <span className="font-mono text-dust-100">
              {current.screen} {current.unit}
            </span>
          </p>

          <label className="block text-sm text-dust-300" htmlFor="shelf-count">
            Shelf count
          </label>
          <input
            id="shelf-count"
            type="number"
            min={0}
            disabled={!canWrite}
            value={nextCount}
            onChange={(event) => setShelf(Number(event.target.value))}
            className="w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust disabled:opacity-60"
          />

          <label className="block text-sm text-dust-300" htmlFor="cause">
            Cause
          </label>
          <select
            id="cause"
            value={cause}
            disabled={!canWrite}
            onChange={(event) => setCause(event.target.value as CorrectionCause)}
            className="w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm capitalize text-dust-100 outline-none focus:border-rust disabled:opacity-60"
          >
            {CAUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label className="block text-sm text-dust-300" htmlFor="why">
            Reason
          </label>
          <textarea
            id="why"
            rows={3}
            value={reason}
            disabled={!canWrite}
            onChange={(event) => setReason(event.target.value)}
            className="w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust disabled:opacity-60"
          />

          {notifiesKai && nextCount !== current.screen ? (
            <p className="text-sm text-warn-bright">
              This gap notifies Kai. A persistent shelf-versus-screen difference is a policy problem.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!canWrite || !reason.trim() || nextCount === current.screen}
            className="w-full rounded-md bg-rust px-4 py-3 font-medium text-dust-50 disabled:opacity-40"
          >
            {canWrite ? "Log correction" : "Only Maya can write a count"}
          </button>
        </form>

        <section>
          <h2 className="font-display text-lg text-dust-100">Logged corrections</h2>
          {corrections.length === 0 ? (
            <p className="mt-3 text-sm text-dust-500">None this session.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {corrections.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-md border border-dust-700/70 bg-dust-900/50 px-4 py-3"
                >
                  <p className="text-sm text-dust-100">
                    {entry.itemName} · {entry.from} → {entry.to} {entry.unit}
                  </p>
                  <p className="mt-1 text-xs capitalize text-dust-400">
                    {entry.cause} · {entry.reason}
                  </p>
                  {entry.notifiedKai ? (
                    <p className="mt-1 font-mono text-[10px] uppercase text-warn-bright">
                      Kai notified
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={null}>
    <CorrectionScreen />
  </Suspense>
);

export default Page;
