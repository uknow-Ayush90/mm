export const DESK_TAGS = [
  { name: "Monitor Setup", slug: "monitor-setup" },
  { name: "Cable Management", slug: "cable-management" },
  { name: "Peripherals", slug: "peripherals" },
  { name: "Ergonomics", slug: "ergonomics" },
  { name: "Budget Setup", slug: "budget-setup" },
  { name: "Gaming Setup", slug: "gaming-setup" },
  { name: "Minimal Setup", slug: "minimal-setup" },
  { name: "Dual Monitor", slug: "dual-monitor" },
  { name: "Standing Desk", slug: "standing-desk" },
  { name: "RGB", slug: "rgb" },
  { name: "Home Office", slug: "home-office" },
  { name: "Work Setup", slug: "work-setup" },
] as const;

export type DeskTagSlug = (typeof DESK_TAGS)[number]["slug"];
