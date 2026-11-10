"use client";

import Link from "next/link";
import { useState } from "react";

type Item = {
  id: string;
  name: string;
  qty: string;
  taken: boolean;
};

const INITIAL: Item[] = [
  { id: "1", name: "EVA Suit · Claire", qty: "1 suit", taken: false },
  { id: "2", name: "O₂ Canisters", qty: "4 cyl", taken: false },
  { id: "3", name: "Rations · 3-day", qty: "3 day", taken: false },
  { id: "4", name: "Methane Fuel top-up", qty: "12 kg", taken: false },
];

const CheckoutPage = () => {
  const [items, setItems] = useState(INITIAL);
  const [badgeIn, setBadgeIn] = useState(false);
  const [extraLogged, setExtraLogged] = useState(false);

  const allTaken = items.every((i) => i.taken);

  const handleTake = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, taken: true } : i)),
    );
  };

  const handleKeyTake = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTake(id);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-dust-950 text-dust-50">
      <div className="border-b-4 border-rust bg-dust-900 px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-copper-light">
              Storeroom terminal · Dome 2
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Checkout
            </h1>
          </div>
          <Link
            href="/"
            className="font-mono text-xs text-dust-500 hover:text-dust-300"
          >
            Exit to ledger
          </Link>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8 md:px-10">
        {!badgeIn ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            <p className="max-w-md text-center text-xl text-dust-300">
              Tap your badge. Allocation for today&apos;s mission appears — no
              sign-in, no form.
            </p>
            <button
              type="button"
              onClick={() => setBadgeIn(true)}
              aria-label="Simulate badge tap"
              className="h-40 w-40 rounded-full border-4 border-rust bg-rust/20 font-display text-xl font-semibold text-dust-50 shadow-glow transition-transform active:scale-95"
            >
              TAP
              <span className="mt-1 block font-mono text-[10px] font-normal uppercase tracking-widest text-dust-400">
                Badge
              </span>
            </button>
            <p className="font-mono text-xs text-dust-500">
              Glove-sized target · high contrast · no hover · no typing
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6 rounded-lg border border-dust-700 bg-dust-900/80 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-dust-500">
                Claire Okonkwo · Ridge Survey · Departure 08:40
              </p>
              <p className="mt-1 font-display text-2xl text-dust-50">
                Approved allocation
              </p>
            </div>

            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleTake(item.id)}
                    onKeyDown={(e) => handleKeyTake(e, item.id)}
                    disabled={item.taken}
                    tabIndex={0}
                    aria-label={`${item.taken ? "Taken" : "Take"} ${item.name}`}
                    className={`flex min-h-[5.5rem] w-full items-center justify-between rounded-xl border-2 px-6 text-left transition-all active:scale-[0.99] ${
                      item.taken
                        ? "border-signal/50 bg-signal/15 text-signal"
                        : "border-dust-500 bg-dust-850 text-dust-50 hover:border-rust"
                    }`}
                  >
                    <span>
                      <span className="block font-display text-2xl font-medium">
                        {item.name}
                      </span>
                      <span className="mt-1 block font-mono text-sm text-dust-400">
                        {item.qty}
                      </span>
                    </span>
                    <span className="font-display text-xl">
                      {item.taken ? "TAKEN" : "TAKE"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-dust-800 pt-6">
              <button
                type="button"
                onClick={() => setExtraLogged(true)}
                disabled={extraLogged}
                className="min-h-[4rem] w-full rounded-xl border-2 border-dashed border-dust-600 px-6 text-left text-dust-300 hover:border-warn hover:text-warn-bright disabled:opacity-60"
              >
                {extraLogged
                  ? "Extra draw flagged to Maya · not blocked"
                  : "Taking something else? Tap to log — recorded, not blocked"}
              </button>
            </div>

            {allTaken ? (
              <p className="mt-8 text-center font-display text-2xl text-signal">
                Clear · go
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
