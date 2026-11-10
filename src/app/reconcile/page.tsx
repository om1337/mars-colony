"use client";

import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { useRole } from "@/context/RoleContext";
import { FINDS } from "@/lib/finds";

const ReconcilePage = () => {
  const { roleId } = useRole();
  const { priorEvaOpen, closePriorEva, resourceOnHand } = useInventory();
  const canClose = roleId === "supply";
  const [burnActual, setBurnActual] = useState(61);
  const [condition, setCondition] = useState("dust-scored");
  const [hours, setHours] = useState(14);
  const [ice, setIce] = useState(12);
  const [filed, setFiled] = useState(false);

  const handleClose = () => {
    if (!canClose || !priorEvaOpen) return;
    closePriorEva([{ findId: "water-ice", amount: ice }]);
  };

  const iceStock = resourceOnHand["water-ice"] ?? 0;

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
          Crew files · Maya closes
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          Return Reconciliation
        </h1>
        <p className="mt-2 text-dust-300">
          Prior EVA is still open. Burned gear, gear that came back, and the
          resources they recovered. Closing it puts the water ice on the stock.
        </p>
      </header>

      {!priorEvaOpen ? (
        <p className="mt-8 rounded-lg border border-signal/40 bg-signal/10 px-4 py-4 text-signal">
          Prior EVA is closed. Water ice stock is now {iceStock} kg.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-lg border border-dust-700/70 bg-dust-900/60 p-4">
            <h2 className="font-display text-dust-50">Burned</h2>
            <p className="mt-1 text-xs text-dust-400">Gear consumed against the plan.</p>
            <p className="mt-4 text-sm text-dust-300">
              Methane plan <span className="font-mono text-dust-100">48 kg</span>
            </p>
            <label htmlFor="burn" className="mt-3 block text-sm text-dust-300">
              Actual burn (kg)
            </label>
            <input
              id="burn"
              type="number"
              min={0}
              value={burnActual}
              onChange={(event) => setBurnActual(Number(event.target.value))}
              className="mt-1 w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm outline-none focus:border-rust"
            />
            <p
              className={`mt-2 text-sm ${burnActual === 48 ? "text-signal" : "text-warn-bright"}`}
            >
              {burnActual === 48
                ? "Matches the plan."
                : `Variance ${burnActual - 48} kg. Highlighted until Maya closes.`}
            </p>
          </section>

          <section className="rounded-lg border border-dust-700/70 bg-dust-900/60 p-4">
            <h2 className="font-display text-dust-50">Returned gear</h2>
            <p className="mt-1 text-xs text-dust-400">Assets back, with hours and condition.</p>
            <label htmlFor="hours" className="mt-4 block text-sm text-dust-300">
              Rover A hours
            </label>
            <input
              id="hours"
              type="number"
              min={0}
              value={hours}
              onChange={(event) => setHours(Number(event.target.value))}
              className="mt-1 w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm outline-none focus:border-rust"
            />
            <label htmlFor="condition" className="mt-3 block text-sm text-dust-300">
              Condition
            </label>
            <select
              id="condition"
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
              className="mt-1 w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm outline-none focus:border-rust"
            >
              <option value="serviceable">Serviceable</option>
              <option value="dust-scored">Dust scored</option>
              <option value="down">Down for repair</option>
            </select>
          </section>

          <section className="rounded-lg border border-dust-700/70 bg-dust-900/60 p-4">
            <h2 className="font-display text-dust-50">Recovered resources</h2>
            <p className="mt-1 text-xs text-dust-400">
              What they brought back. This is the stock commanders draft against.
            </p>
            <label htmlFor="ice" className="mt-4 block text-sm text-dust-300">
              Water ice (kg)
            </label>
            <input
              id="ice"
              type="number"
              min={0}
              value={ice}
              onChange={(event) => setIce(Number(event.target.value))}
              className="mt-1 w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm outline-none focus:border-rust"
            />
            <p className="mt-2 text-xs text-dust-500">
              {FINDS.find((find) => find.id === "water-ice")?.name} on hand before close:{" "}
              {iceStock} kg
            </p>
          </section>
        </div>
      )}

      {priorEvaOpen ? (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFiled(true)}
            disabled={filed}
            className="rounded-md border border-dust-600 px-4 py-3 text-sm text-dust-200 disabled:opacity-50"
          >
            {filed ? "Crew return filed" : "File return"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={!canClose}
            className="rounded-md bg-rust px-4 py-3 text-sm font-medium text-dust-50 disabled:opacity-40"
          >
            {canClose ? "Close ledger" : "Only Maya closes the ledger"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ReconcilePage;
