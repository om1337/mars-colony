"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { ROLES, visibleNav } from "@/lib/roles";

type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname();
  const { role, roleId, setRoleId } = useRole();
  const groups = visibleNav(roleId);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleId(event.target.value as typeof roleId);
  };

  if (pathname.startsWith("/checkout")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <aside
        className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-dust-700/60 bg-dust-900/80 backdrop-blur-md"
        aria-label="Colony navigation"
      >
        <div className="border-b border-dust-700/60 px-4 py-5">
          <p className="font-display text-lg font-semibold tracking-tight text-dust-50">
            Colony
          </p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-dust-400">
            Gear & resources
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Screens">
          {groups.map((group) => {
            const groupActive = group.items.some((item) => isActive(item.href));
            return (
              <div key={group.id} className="mb-5 last:mb-2">
                <p
                  id={`nav-${group.id}`}
                  className={`px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
                    groupActive ? "text-dust-200" : "text-dust-500"
                  }`}
                >
                  {group.label}
                </p>
                <ul aria-labelledby={`nav-${group.id}`} className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block rounded-md px-2 py-1.5 text-[13px] leading-5 transition-colors ${
                            active
                              ? "bg-rust/15 text-dust-50"
                              : "text-dust-300 hover:bg-dust-800 hover:text-dust-100"
                          }`}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-dust-700/60 p-3">
          <label
            htmlFor="role-switch"
            className="mb-1.5 block font-mono text-[10px] uppercase tracking-wider text-dust-400"
          >
            Viewing as
          </label>
          <select
            id="role-switch"
            value={roleId}
            onChange={handleRoleChange}
            className="w-full rounded-md border border-dust-600 bg-dust-850 px-2 py-2 text-sm text-dust-100 outline-none focus:border-rust"
            aria-label="Switch role"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.short} · {r.person.split(" ")[0]}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-dust-400">{role.name}</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
};
