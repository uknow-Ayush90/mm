export const TAGS = [
  { name: "Debugging", slug: "debugging" },
  { name: "AI/ML", slug: "ai-ml" },
  { name: "Placements", slug: "placements" },
  { name: "DevOps", slug: "devops" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "Frontend", slug: "frontend" },
  { name: "Backend", slug: "backend" },
  { name: "Git", slug: "git" },
  { name: "Leetcode", slug: "leetcode" },
  { name: "Startup Life", slug: "startup-life" },
  { name: "Coffee & Code", slug: "coffee-code" },
  { name: "Meetings", slug: "meetings" },
] as const;

export type TagSlug = (typeof TAGS)[number]["slug"];
