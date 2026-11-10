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

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "today",
    label: "Today",
    items: [
      { href: "/", label: "Week board", roles: "all" },
      { href: "/my-day", label: "My day", roles: "all" },
      { href: "/resource/rover-a", label: "Gear", roles: "all" },
      { href: "/live-burn", label: "Live burn", roles: ["crew", "commander"] },
    ],
  },
  {
    id: "missions",
    label: "Missions",
    items: [
      { href: "/mission/draft", label: "Draft", roles: ["commander"] },
      { href: "/mission/conflict", label: "Conflict", roles: ["commander"] },
      { href: "/mission/blocked", label: "Blocked", roles: ["commander", "ops"] },
    ],
  },
  {
    id: "policy",
    label: "Policy",
    items: [
      { href: "/policy", label: "Editor", roles: ["ops"] },
      {
        href: "/exception/request",
        label: "Request",
        roles: ["commander", "supply"],
      },
      {
        href: "/exception/queue",
        label: "Queue",
        roles: ["ops", "commander", "supply"],
      },
      { href: "/decisions", label: "Decisions", roles: "all" },
    ],
  },
  {
    id: "storeroom",
    label: "Storeroom",
    items: [
      {
        href: "/checkout",
        label: "Checkout",
        roles: ["crew", "commander", "supply"],
      },
      {
        href: "/reconcile",
        label: "Return",
        roles: ["crew", "commander", "supply"],
      },
      {
        href: "/supply/exceptions",
        label: "Exceptions",
        roles: ["supply", "ops"],
      },
      {
        href: "/supply/correction",
        label: "Correction",
        roles: ["supply", "ops"],
      },
      {
        href: "/utilization",
        label: "Utilization",
        roles: ["commander", "supply", "ops"],
      },
    ],
  },
  {
    id: "earth",
    label: "Earth",
    items: [
      {
        href: "/earth/order",
        label: "Order",
        roles: ["commander", "supply", "ops"],
      },
      {
        href: "/earth/pipeline",
        label: "In transit",
        roles: ["commander", "supply", "ops"],
      },
    ],
  },
];

export const canSeeNav = (item: NavItem, role: RoleId): boolean =>
  item.roles === "all" || item.roles.includes(role);

export const visibleNav = (role: RoleId): NavGroup[] =>
  NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => canSeeNav(item, role)),
  })).filter((group) => group.items.length > 0);
