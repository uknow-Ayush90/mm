"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

export function useDeskReviewVote(
  reviewId: string,
  initial: { upvotes: number; downvotes: number; score: number; userVote: "UPVOTE" | "DOWNVOTE" | null }
) {
  const { user, setShowOnboarding } = useUser();
  const [state, setState] = useState(initial);
  const [isLoading, setIsLoading] = useState(false);

  async function vote(type: "UPVOTE" | "DOWNVOTE") {
    if (!user) {
      setShowOnboarding(true);
      return;
    }
    if (isLoading) return;

    const prev = { ...state };

    const isSameVote = state.userVote === type;
    const delta = isSameVote ? -1 : 1;
    setState((s) => ({
      upvotes: type === "UPVOTE" ? s.upvotes + delta : s.upvotes + (s.userVote === "UPVOTE" ? -1 : 0),
      downvotes: type === "DOWNVOTE" ? s.downvotes + delta : s.downvotes + (s.userVote === "DOWNVOTE" ? -1 : 0),
      score: s.score + (type === "UPVOTE" ? delta : -delta) + (s.userVote === "UPVOTE" && type !== "UPVOTE" ? -1 : 0) + (s.userVote === "DOWNVOTE" && type !== "DOWNVOTE" ? 1 : 0),
      userVote: isSameVote ? null : type,
    }));

    setIsLoading(true);
    try {
      const res = await fetch(`/api/desk-reviews/${reviewId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ type }),
      });

      if (!res.ok) throw new Error("Vote failed");

      const data = await res.json();
      setState({
        upvotes: data.upvotes,
        downvotes: data.downvotes,
        score: data.score,
        userVote: data.userVote,
      });
    } catch {
      setState(prev);
      toast.error("Vote nahi gaya, try again!");
    } finally {
      setIsLoading(false);
    }
  }

  return { ...state, vote, isLoading };
}
