"use client";

import Link from "next/link";
import { useRole } from "@/context/RoleContext";

const MyDayPage = () => {
  const { role } = useRole();

  return (
    <div className="px-6 py-8 md:px-10">
      <header className="max-w-xl animate-fade-up">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
          You · under three seconds
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          My Day
        </h1>
        <p className="mt-2 text-dust-300">
          What is true for {role.person.split(" ")[0]} right now.
        </p>
      </header>

      <div
        className="mt-8 max-w-lg rounded-lg border border-dust-700/70 bg-dust-900/70 p-6 shadow-panel animate-fade-up"
        style={{ animationDelay: "60ms" }}
      >
        <p className="font-mono text-[10px] uppercase tracking-wider text-signal">
          Status · on mission
        </p>
        <h2 className="mt-2 font-display text-3xl text-dust-50">Ridge Survey</h2>
        <p className="mt-2 text-dust-300">
          Departure window 08:40–09:10 · Dome 2 airlock
        </p>
        <div className="mt-6 border-t border-dust-800 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-dust-500">
            Allocation locked at storeroom
          </p>
          <ul className="mt-2 space-y-1 text-sm text-dust-200">
            <li>EVA Suit · confirmed</li>
            <li>O₂ ×4 · confirmed</li>
            <li>Rations 3-day · confirmed</li>
          </ul>
          <p className="mt-3 text-sm text-warn-bright">
            Change since last look: fuel top-up +4 kg added by Victor
          </p>
        </div>
        <Link
          href="/checkout"
          className="mt-6 inline-block rounded-md bg-rust px-5 py-3 font-medium text-dust-50"
        >
          Go to checkout
        </Link>
      </div>
    </div>
  );
};

export default MyDayPage;
