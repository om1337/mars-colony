export type RoleId = "crew" | "commander" | "supply" | "ops";

export type Role = {
  id: RoleId;
  name: string;
  person: string;
  short: string;
};

export const ROLES: Role[] = [
  { id: "crew", name: "Crew", person: "Claire Okonkwo", short: "Crew" },
  {
    id: "commander",
    name: "Mission Commander",
    person: "Victor Chen",
    short: "Commander",
  },
  { id: "supply", name: "Supply Lead", person: "Maya Solis", short: "Supply" },
  { id: "ops", name: "Ops Lead", person: "Kai Okada", short: "Ops" },
];

export type NavItem = {
  href: string;
  label: string;
  roles: RoleId[] | "all";
};

export const NAV: NavItem[] = [
  { href: "/", label: "Week Board", roles: "all" },
  { href: "/resource/rover-a", label: "Resource Detail", roles: "all" },
  { href: "/my-day", label: "My Day", roles: "all" },
  { href: "/mission/draft", label: "Mission Draft", roles: ["commander"] },
  {
    href: "/mission/conflict",
    label: "Conflict Resolution",
    roles: ["commander"],
  },
  { href: "/mission/blocked", label: "Blocked by Policy", roles: "all" },
  {
    href: "/exception/request",
    label: "Exception Request",
    roles: ["commander", "supply"],
  },
  { href: "/policy", label: "Policy Editor", roles: "all" },
  {
    href: "/exception/queue",
    label: "Exception Queue",
    roles: ["ops", "commander", "supply"],
  },
  { href: "/decisions", label: "Decision Log", roles: "all" },
  {
    href: "/checkout",
    label: "Storeroom Checkout",
    roles: ["crew", "commander", "supply"],
  },
  { href: "/live-burn", label: "Live Burn", roles: "all" },
  { href: "/reconcile", label: "Return Reconciliation", roles: "all" },
  {
    href: "/supply/exceptions",
    label: "Supply Exceptions",
    roles: ["supply", "ops"],
  },
  {
    href: "/supply/correction",
    label: "Ledger Correction",
    roles: ["supply", "ops"],
  },
  { href: "/utilization", label: "Utilization & Denied", roles: "all" },
  { href: "/earth/order", label: "Earth Order Builder", roles: "all" },
  { href: "/earth/pipeline", label: "In-Transit Pipeline", roles: "all" },
];

export const canSeeNav = (item: NavItem, role: RoleId): boolean =>
  item.roles === "all" || item.roles.includes(role);
