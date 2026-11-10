"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePolicy } from "@/context/PolicyContext";
import { useRole } from "@/context/RoleContext";
import { RESOURCES } from "@/lib/data";
import { tallyRules, withDraftRule } from "@/lib/evaluate";
import {
  POLICY_KIND_LABEL,
  statementFor,
  type PolicyKind,
  type PolicyRule,
} from "@/lib/policy";

const KINDS: PolicyKind[] = [
  "reserve_floor",
  "draw_allowance",
  "duration_cap",
  "draw_rights",
];

const TARGET_AUTO = 0.85;

const PolicyPage = () => {
  const { roleId } = useRole();
  const { rules, publishRule } = usePolicy();
  const canWrite = roleId === "ops";

  const [kind, setKind] = useState<PolicyKind>("reserve_floor");
  const [resourceId, setResourceId] = useState("fuel");
  const [value, setValue] = useState(30);
  const [unit, setUnit] = useState("%");
  const [customStatement, setCustomStatement] = useState("");
  const [statementLocked, setStatementLocked] = useState(false);
  const [publishedNote, setPublishedNote] = useState("");

  const gear = RESOURCES.find((item) => item.id === resourceId) ?? RESOURCES[0];
  const suggested = statementFor(kind, gear.name, value, unit);
  const statement = statementLocked ? customStatement : suggested;

  const draftRule: PolicyRule = useMemo(
    () => ({
      id: `draft-${kind}-${resourceId}`,
      kind,
      resourceId,
      statement,
      author: "Kai Okada",
      publishedAt: "2026-11-10",
      value,
      unit: unit || undefined,
    }),
    [kind, resourceId, statement, value, unit],
  );

  const publishedTally = useMemo(() => tallyRules(rules), [rules]);
  const draftTally = useMemo(
    () => tallyRules(withDraftRule(rules, draftRule)),
    [rules, draftRule],
  );
  const tally = canWrite ? draftTally : publishedTally;
  const autoRate = tally.total === 0 ? 0 : tally.auto / tally.total;
  const exceptions = tally.samples.filter((sample) => sample.outcome !== "auto");

  const handleSelectRule = (rule: PolicyRule) => {
    setKind(rule.kind);
    setResourceId(rule.resourceId ?? "fuel");
    setValue(rule.value);
    setUnit(rule.unit ?? "");
    setCustomStatement(rule.statement);
    setStatementLocked(true);
    setPublishedNote("");
  };

  const handleNewRule = () => {
    setKind("reserve_floor");
    setResourceId("fuel");
    setValue(30);
    setUnit("%");
    setCustomStatement("");
    setStatementLocked(false);
    setPublishedNote("");
  };

  const handleKind = (next: PolicyKind) => {
    setKind(next);
    if (next === "reserve_floor" && resourceId === "fuel") setUnit("%");
    if (next === "duration_cap") setUnit("days");
    if (next === "draw_allowance") {
      const match = RESOURCES.find((item) => item.id === resourceId);
      setUnit(match?.unit ?? "");
    }
    if (next === "draw_rights") setUnit("");
    setPublishedNote("");
  };

  const handleGear = (id: string) => {
    setResourceId(id);
    const match = RESOURCES.find((item) => item.id === id);
    if (kind === "reserve_floor") setUnit(id === "fuel" ? "%" : match?.unit ?? "");
    if (kind === "draw_allowance") setUnit(match?.unit ?? "");
    setPublishedNote("");
  };

  const handleStatement = (text: string) => {
    setStatementLocked(true);
    setCustomStatement(text);
  };

  const handleUseGenerated = () => {
    setStatementLocked(false);
    setCustomStatement("");
  };

  const handlePublish = () => {
    if (!canWrite || !statement.trim() || Number.isNaN(value)) return;
    publishRule({
      ...draftRule,
      id: `p-${kind}-${resourceId}`,
      author: "Kai Okada",
      publishedAt: "2026-11-10",
      statement: statement.trim(),
    });
    setPublishedNote("Published. Blocked by Policy will cite this sentence.");
    setStatementLocked(true);
    setCustomStatement(statement.trim());
  };

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="max-w-3xl animate-fade-up">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
          8 · Approve · {canWrite ? "Ops Lead writes" : "everyone reads"}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          Policy Editor
        </h1>
        <p className="mt-2 text-dust-300">
          Standing constraints, written in advance, in a sentence anyone can
          cite. The draft scores against whatever is published here.
        </p>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-display text-lg text-dust-100">Published rules</h2>
            {canWrite ? (
              <button
                type="button"
                onClick={handleNewRule}
                className="rounded-md border border-dust-600 px-3 py-1.5 text-sm text-dust-200 hover:border-dust-400"
              >
                New rule
              </button>
            ) : (
              <p className="font-mono text-[10px] uppercase tracking-wider text-dust-500">
                Read only
              </p>
            )}
          </div>
          <ul className="space-y-2">
            {rules.map((rule) => {
              const gearName =
                RESOURCES.find((item) => item.id === rule.resourceId)?.name ??
                "Colony";
              const active =
                rule.kind === kind && rule.resourceId === resourceId;
              return (
                <li key={rule.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectRule(rule)}
                    aria-pressed={active}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-rust bg-rust/10"
                        : "border-dust-700/70 bg-dust-900/60 hover:border-dust-500"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-copper-light">
                        {POLICY_KIND_LABEL[rule.kind]}
                      </span>
                      <span className="font-mono text-[10px] text-dust-500">
                        {gearName}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-dust-100">{rule.statement}</p>
                    <p className="mt-1 font-mono text-[10px] text-dust-500">
                      {rule.author} · {rule.publishedAt}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-lg border border-dust-700/70 bg-dust-900/70 p-5 shadow-panel">
          <h2 className="font-display text-lg text-dust-100">
            {canWrite ? "Draft a rule" : "This rule"}
          </h2>
          {!canWrite ? (
            <p className="mt-2 text-sm text-dust-400">
              Only Kai can publish. You are reading the rule he already set.
            </p>
          ) : null}

          <div className="mt-4 space-y-4">
            <label className="block text-sm text-dust-300" htmlFor="rule-kind">
              Kind
            </label>
            <select
              id="rule-kind"
              value={kind}
              disabled={!canWrite}
              onChange={(event) => handleKind(event.target.value as PolicyKind)}
              className="w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust disabled:opacity-70"
            >
              {KINDS.map((item) => (
                <option key={item} value={item}>
                  {POLICY_KIND_LABEL[item]}
                </option>
              ))}
            </select>

            <label className="block text-sm text-dust-300" htmlFor="rule-gear">
              Gear
            </label>
            <select
              id="rule-gear"
              value={resourceId}
              disabled={!canWrite}
              onChange={(event) => handleGear(event.target.value)}
              className="w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust disabled:opacity-70"
            >
              {RESOURCES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            {kind !== "draw_rights" ? (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-dust-300" htmlFor="rule-value">
                    Value
                  </label>
                  <input
                    id="rule-value"
                    type="number"
                    min={0}
                    value={value}
                    disabled={!canWrite}
                    onChange={(event) => {
                      setValue(Number(event.target.value));
                      setPublishedNote("");
                    }}
                    className="mt-1 w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust disabled:opacity-70"
                  />
                </div>
                <div className="w-28">
                  <label className="block text-sm text-dust-300" htmlFor="rule-unit">
                    Unit
                  </label>
                  <input
                    id="rule-unit"
                    value={unit}
                    disabled={!canWrite}
                    onChange={(event) => {
                      setUnit(event.target.value);
                      setPublishedNote("");
                    }}
                    className="mt-1 w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust disabled:opacity-70"
                  />
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-sm text-dust-300" htmlFor="rule-statement">
                Sentence Blocked by Policy will cite
              </label>
              <textarea
                id="rule-statement"
                rows={3}
                value={statement}
                disabled={!canWrite}
                onChange={(event) => handleStatement(event.target.value)}
                className="mt-1 w-full rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm text-dust-100 outline-none focus:border-rust disabled:opacity-70"
              />
              {canWrite && statementLocked ? (
                <button
                  type="button"
                  onClick={handleUseGenerated}
                  className="mt-2 text-xs text-dust-400 hover:text-dust-200"
                >
                  Use the generated sentence
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-6 rounded-md border border-dust-700 bg-dust-850/80 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-dust-500">
              Backtest · last four weeks
            </p>
            <p className="mt-2 font-display text-2xl text-dust-50">
              <span className={autoRate >= TARGET_AUTO ? "text-signal" : "text-warn-bright"}>
                {Math.round(autoRate * 100)}%
              </span>{" "}
              <span className="text-base text-dust-300">auto-decided</span>
            </p>
            <p className="mt-1 text-sm text-dust-300">
              Would have auto-approved {tally.auto} of {tally.total}, blocked{" "}
              {tally.blocked}, queued {tally.queued}.
            </p>
            {canWrite &&
            (draftTally.auto !== publishedTally.auto ||
              draftTally.blocked !== publishedTally.blocked ||
              draftTally.queued !== publishedTally.queued) ? (
              <p className="mt-1 font-mono text-[10px] text-dust-500">
                Published now: {publishedTally.auto} auto · {publishedTally.blocked}{" "}
                blocked · {publishedTally.queued} queued
              </p>
            ) : null}
            <p className="mt-2 font-mono text-[10px] text-dust-500">
              Target is above 85%. A healthy rule set shrinks the Monday queue.
            </p>
            {exceptions.length > 0 ? (
              <ul className="mt-3 space-y-1">
                {exceptions.slice(0, 6).map((sample) => (
                  <li
                    key={sample.name}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-dust-200">{sample.name}</span>
                    <span
                      className={`font-mono text-[10px] uppercase ${
                        sample.outcome === "blocked"
                          ? "text-danger-bright"
                          : "text-warn-bright"
                      }`}
                    >
                      {sample.outcome}
                    </span>
                  </li>
                ))}
                {exceptions.length > 6 ? (
                  <li className="text-xs text-dust-500">
                    and {exceptions.length - 6} more
                  </li>
                ) : null}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-signal">
                Nothing in the last four weeks would have stopped.
              </p>
            )}
          </div>

          {canWrite ? (
            <button
              type="button"
              onClick={handlePublish}
              disabled={!statement.trim()}
              className="mt-4 w-full rounded-md bg-rust px-4 py-3 font-medium text-dust-50 disabled:opacity-40"
            >
              Publish rule
            </button>
          ) : null}
          {publishedNote ? (
            <p className="mt-3 text-sm text-signal">{publishedNote}</p>
          ) : null}
          <Link
            href="/mission/blocked"
            className="mt-4 inline-block text-sm text-dust-400 hover:text-dust-200"
          >
            See the sentence on a denial →
          </Link>
        </section>
      </div>
    </div>
  );
};

export default PolicyPage;
