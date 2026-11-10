"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  COMMITMENTS,
  DAYS,
  MISSION_COLORS,
  RESOURCES,
  WEEK_LABEL,
} from "@/lib/data";
import {
  buildBlockSegments,
  consumableAvailable,
  consumableCommitted,
} from "@/lib/weekBoard";

const ResourceDetailPage = () => {
  const params = useParams();
  const id = String(params.id ?? "");
  const resource = RESOURCES.find((r) => r.id === id) ?? RESOURCES[0];
  const commitments = COMMITMENTS.filter((c) => c.resourceId === resource.id);
  const segments = buildBlockSegments(commitments);
  const committed = consumableCommitted(resource, commitments);
  const available = consumableAvailable(resource, commitments);
  const [comment, setComment] = useState("");
  const [thread, setThread] = useState([
    {
      author: "Victor Chen",
      text: "Can we keep Mon clear if Aquifer shifts to Wed?",
      at: "Sol 188",
    },
    {
      author: "Diego Mora",
      text: "Works if Pipe Repair doesn't need the rover Fri.",
      at: "Sol 188",
    },
  ]);

  const handlePost = () => {
    if (!comment.trim()) return;
    setThread((t) => [
      ...t,
      { author: "You", text: comment.trim(), at: "Just now" },
    ]);
    setComment("");
  };

  return (
    <div className="px-6 py-8 md:px-10">
      <Link
        href="/"
        className="font-mono text-xs text-dust-500 hover:text-dust-300"
      >
        ← Week Board
      </Link>
      <header className="mt-4 max-w-3xl animate-fade-up">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
          Shared · {resource.class} · {WEEK_LABEL}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          {resource.name}
        </h1>
        <p className="mt-2 text-dust-300">
          Answer availability for a window without asking Maya. Idle history is
          here from day one.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-4 animate-fade-up">
        {[
          { label: "On hand", value: `${resource.onHand}${resource.unit === "unit" ? "" : ` ${resource.unit}`}` },
          { label: "Committed (week)", value: `${committed}${resource.unit === "unit" ? "" : ` ${resource.unit}`}` },
          { label: "Free (week)", value: `${available}${resource.unit === "unit" ? "" : ` ${resource.unit}`}` },
          { label: "Reserve floor", value: `${resource.reserveFloor}${resource.unit === "unit" ? "" : ` ${resource.unit}`}` },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-dust-700/70 bg-dust-900/60 p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-dust-500">
              {s.label}
            </p>
            <p className="mt-1 font-display text-2xl text-dust-50">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <h2 className="font-display text-lg text-dust-100">Forward calendar</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-dust-700/70 bg-dust-900/60">
          <div className="grid grid-cols-7 border-b border-dust-800">
            {DAYS.map((d) => (
              <div
                key={d.index}
                className="px-2 py-2 text-center font-mono text-[10px] text-dust-500"
              >
                {d.short} {d.date}
              </div>
            ))}
          </div>
          <div className="relative h-16">
            {segments.map((seg) => {
              const left = (seg.dayStart / 7) * 100;
              const width = ((seg.dayEnd - seg.dayStart + 1) / 7) * 100;
              const c = seg.commitments[0];
              return (
                <div
                  key={seg.commitments.map((x) => x.id).join("-")}
                  className={`absolute top-3 h-10 overflow-hidden rounded-md px-2 text-xs leading-10 ${
                    seg.isCollision ? "bg-danger text-white" : "text-dust-50"
                  }`}
                  style={{
                    left: `${left}%`,
                    width: `calc(${width}% - 4px)`,
                    marginLeft: 2,
                    backgroundColor: seg.isCollision
                      ? undefined
                      : MISSION_COLORS[c.missionId],
                    opacity: c.kind === "in-transit" ? 0.45 : 1,
                  }}
                >
                  {c.missionName}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-lg text-dust-100">History</h2>
          <ul className="mt-3 space-y-2 text-sm text-dust-300">
            <li>Last 30 sols · used 62h · idle 38%</li>
            <li>Last reconciliation · Sol 186 · Maya Solis</li>
            <li>Past missions · Ridge Survey, Pipe Repair, Night EVA</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg text-dust-100">
            Thread · on this resource
          </h2>
          <ul className="mt-3 space-y-3">
            {thread.map((t, i) => (
              <li key={i} className="rounded-md bg-dust-850/80 px-3 py-2 text-sm">
                <p className="font-mono text-[10px] text-dust-500">
                  {t.author} · {t.at}
                </p>
                <p className="mt-1 text-dust-200">{t.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <label htmlFor="res-comment" className="sr-only">
              Comment
            </label>
            <input
              id="res-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 rounded-md border border-dust-600 bg-dust-850 px-3 py-2 text-sm outline-none focus:border-rust"
              placeholder="Negotiate here — not in a corridor"
            />
            <button
              type="button"
              onClick={handlePost}
              className="rounded-md bg-rust px-4 py-2 text-sm font-medium text-dust-50"
            >
              Post
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourceDetailPage;
