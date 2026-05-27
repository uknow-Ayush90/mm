"use client";

import { Trophy } from "lucide-react";
import { useRealtimeLeaderboard } from "@/hooks/useRealtimeLeaderboard";
import LeaderboardTable from "@/components/LeaderboardTable";
import type { Meme } from "@/types";

interface Props {
  initialMemes: Meme[];
}

export default function LeaderboardClient({ initialMemes }: Props) {
  const memes = useRealtimeLeaderboard(initialMemes);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
          <Trophy size={24} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Top Memes 🏆</h1>
          <p className="text-[#9ca3af] text-sm flex items-center gap-2">
            Sabse zyada upvoted memes
            <span className="inline-flex items-center gap-1 text-[#10b981] text-xs">
              <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse" />
              Live
            </span>
          </p>
        </div>
      </div>

      <LeaderboardTable memes={memes} />
    </div>
  );
}
