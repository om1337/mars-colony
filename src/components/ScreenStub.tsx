import Link from "next/link";

type ScreenStubProps = {
  eyebrow: string;
  title: string;
  job: string;
  fidelity: "high" | "medium" | "wireframe" | "listed";
  bullets: string[];
  nextHref?: string;
  nextLabel?: string;
};

export const ScreenStub = ({
  eyebrow,
  title,
  job,
  fidelity,
  bullets,
  nextHref,
  nextLabel,
}: ScreenStubProps) => {
  return (
    <div className="px-6 py-8 md:px-10">
      <header className="max-w-2xl animate-fade-up">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-copper-light">
            {eyebrow}
          </p>
          <span className="rounded border border-dust-600 px-2 py-0.5 font-mono text-[10px] uppercase text-dust-500">
            {fidelity}
          </span>
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold text-dust-50">
          {title}
        </h1>
        <p className="mt-2 text-dust-300">{job}</p>
      </header>

      <ul className="mt-8 max-w-xl space-y-3 animate-fade-up" style={{ animationDelay: "60ms" }}>
        {bullets.map((b) => (
          <li
            key={b}
            className="border-l-2 border-dust-600 pl-4 text-sm text-dust-300"
          >
            {b}
          </li>
        ))}
      </ul>

      {nextHref && nextLabel ? (
        <Link
          href={nextHref}
          className="mt-8 inline-block rounded-md border border-dust-600 px-4 py-2 text-sm text-dust-300 hover:border-dust-400"
        >
          {nextLabel}
        </Link>
      ) : null}
    </div>
  );
};
