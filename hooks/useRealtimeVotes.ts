"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface RealtimeMemePayload {
  id: string;
  upvotes: number;
  downvotes: number;
  score: number;
}

export function useRealtimeVotes(
  memeId: string,
  initial: { upvotes: number; downvotes: number; score: number }
) {
  const [counts, setCounts] = useState(initial);

  useEffect(() => {
    const channel = supabase
      .channel(`meme-votes-${memeId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Meme",
          filter: `id=eq.${memeId}`,
        },
        (payload) => {
          const row = payload.new as RealtimeMemePayload;
          setCounts({
            upvotes: row.upvotes,
            downvotes: row.downvotes,
            score: row.score,
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [memeId]);

  return counts;
}
