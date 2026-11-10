import Link from "next/link";
import { POLICY_RULES } from "@/lib/policy";

const rule = POLICY_RULES.find((r) => r.id === "p-fuel-floor")!;

const BlockedPage = () => {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8 md:px-10">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-danger-bright">
          Denial · citable in seconds
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          Blocked by Policy
        </h1>
        <p className="mt-2 text-dust-300">
          The no arrives from a published rule with its arithmetic shown — not
          from Kai&apos;s judgment on a Tuesday.
        </p>
      </header>

      <div className="mt-8 space-y-6 rounded-lg border border-dust-700/70 bg-dust-900/70 p-6 shadow-panel">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-dust-500">
            Requested
          </p>
          <p className="mt-1 font-display text-xl text-dust-50">
            Methane Fuel · 90 kg · Crater Sample (Wed–Fri)
          </p>
        </div>
        <div className="border-t border-dust-800 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-dust-500">
            Rule that stopped it
          </p>
          <p className="mt-1 text-lg text-dust-100">{rule.statement}</p>
          <p className="mt-2 font-mono text-xs text-dust-400">
            Set by {rule.author} · {rule.publishedAt}
          </p>
        </div>
        <div className="border-t border-dust-800 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-dust-500">
            Arithmetic
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md bg-dust-850 px-3 py-3">
              <div className="font-mono text-[10px] text-dust-500">Floor</div>
              <div className="font-display text-2xl text-warn">30%</div>
            </div>
            <div className="rounded-md bg-dust-850 px-3 py-3">
              <div className="font-mono text-[10px] text-dust-500">After claim</div>
              <div className="font-display text-2xl text-danger-bright">12%</div>
            </div>
            <div className="rounded-md bg-dust-850 px-3 py-3">
              <div className="font-mono text-[10px] text-dust-500">Over by</div>
              <div className="font-display text-2xl text-dust-50">18 pts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/exception/request"
          className="rounded-md bg-rust px-5 py-3 font-medium text-dust-50"
        >
          Request exception
        </Link>
        <Link
          href="/policy"
          className="rounded-md border border-dust-600 px-5 py-3 text-dust-300"
        >
          Open rule in Policy Editor
        </Link>
        <Link
          href="/mission/draft"
          className="rounded-md border border-dust-700 px-5 py-3 text-dust-500"
        >
          Back to draft
        </Link>
      </div>
    </div>
  );
};

export default BlockedPage;
