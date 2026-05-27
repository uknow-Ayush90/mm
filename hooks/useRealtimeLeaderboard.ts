"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Meme } from "@/types";

export function useRealtimeLeaderboard(initial: Meme[]) {
  const [memes, setMemes] = useState<Meme[]>(initial);

  useEffect(() => {
    async function refresh() {
      const res = await fetch("/api/leaderboard");
      if (res.ok) setMemes(await res.json());
    }

    const channel = supabase
      .channel("leaderboard-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Meme" },
        () => { refresh(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return memes;
}
