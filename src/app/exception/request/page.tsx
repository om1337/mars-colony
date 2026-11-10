"use client";

import Link from "next/link";
import { useState } from "react";

const ExceptionRequestPage = () => {
  const [why, setWhy] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!why.trim()) return;
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-8 md:px-10">
      <header className="animate-fade-up">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
          Exception · thirty seconds for Kai
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          Exception Request
        </h1>
      </header>

      <div className="mt-6 space-y-4 rounded-lg border border-dust-700/70 bg-dust-900/70 p-5 animate-fade-up">
        <p className="text-sm text-dust-400">Prefills from blocked claim</p>
        <p className="font-display text-xl text-dust-50">
          Fuel · 90 kg · 18 pts over 30% floor
        </p>
        <p className="text-sm text-dust-300">
          Competing: Pipe Repair EVA Fri–Sat · your exception history: 1 this
          quarter
        </p>
        <label htmlFor="why" className="block text-sm text-dust-300">
          Why this mission needs it (only field you fill)
        </label>
        <textarea
          id="why"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm outline-none focus:border-rust"
          placeholder="Stated cost of denial…"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!why.trim() || sent}
          className="rounded-md bg-rust px-5 py-3 font-medium text-dust-50 disabled:opacity-40"
        >
          {sent ? "In Monday queue" : "Submit to queue"}
        </button>
      </div>

      <Link href="/exception/queue" className="mt-6 inline-block text-sm text-dust-400 hover:text-dust-200">
        View exception queue →
      </Link>
    </div>
  );
};

export default ExceptionRequestPage;
