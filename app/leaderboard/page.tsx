import type { Metadata } from "next";
import LeaderboardClient from "@/components/LeaderboardClient";
import type { Meme } from "@/types";

export const metadata: Metadata = {
  title: "Leaderboard — Team Ashoka Memes",
};

async function getTopMemes(): Promise<Meme[]> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/leaderboard`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function LeaderboardPage() {
  const memes = await getTopMemes();
  return <LeaderboardClient initialMemes={memes} />;
}
