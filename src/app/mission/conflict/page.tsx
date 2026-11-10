"use client";

import Link from "next/link";
import { useState } from "react";

const MOVES = [
  {
    id: "shift",
    title: "Shift this window",
    detail: "Nearest conflict-free slot: Thu–Sat (17–19)",
  },
  {
    id: "split",
    title: "Split the resource",
    detail: "Keep Mon for Ridge Survey; Aquifer Probe takes Wed–Thu only",
  },
  {
    id: "negotiate",
    title: "Open negotiation",
    detail: "Thread on Rover A, visible to both commanders — trade is recorded",
  },
] as const;

const ConflictPage = () => {
  const [chosen, setChosen] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!chosen) return;
    setConfirmed(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 md:px-10">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-danger-bright">
          Collision · still cheap to fix
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          Conflict Resolution
        </h1>
        <p className="mt-3 text-dust-300">
          <span className="text-dust-100">Rover A</span> is held by{" "}
          <strong className="font-medium text-dust-50">Ridge Survey</strong>{" "}
          (Victor, Mon–Wed) and your draft{" "}
          <strong className="font-medium text-dust-50">Aquifer Probe</strong>{" "}
          (Tue–Thu). Overlap: Tue–Wed.
        </p>
      </header>

      <div className="mt-6 overflow-hidden rounded-lg border border-danger/40 bg-danger/10 p-4">
        <div className="grid grid-cols-7 gap-1 font-mono text-[10px] text-dust-400">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>
        <div className="relative mt-2 h-10">
          <div
            className="absolute top-0 h-4 rounded-sm bg-rust/80"
            style={{ left: "0%", width: "42%" }}
          />
          <div
            className="absolute bottom-0 h-4 rounded-sm bg-[#6b8f4a]/80"
            style={{ left: "14%", width: "42%" }}
          />
          <div
            className="absolute inset-y-0 rounded-sm bg-danger/50 ring-1 ring-danger-bright"
            style={{ left: "14%", width: "28%" }}
          />
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {MOVES.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setChosen(m.id)}
              aria-pressed={chosen === m.id}
              className={`w-full rounded-lg border px-4 py-4 text-left transition-colors ${
                chosen === m.id
                  ? "border-rust bg-rust/15"
                  : "border-dust-700 bg-dust-900/50 hover:border-dust-500"
              }`}
            >
              <div className="font-display text-dust-50">{m.title}</div>
              <p className="mt-1 text-sm text-dust-400">{m.detail}</p>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!chosen || confirmed}
          className="rounded-md bg-rust px-5 py-3 font-medium text-dust-50 disabled:opacity-40"
        >
          {confirmed ? "Move recorded" : "Confirm move"}
        </button>
        <Link
          href="/mission/draft"
          className="rounded-md border border-dust-600 px-5 py-3 text-dust-300"
        >
          Back to draft
        </Link>
        {chosen === "negotiate" && confirmed ? (
          <Link
            href="/resource/rover-a"
            className="rounded-md border border-signal/40 px-5 py-3 text-signal"
          >
            Open Rover A thread →
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default ConflictPage;
