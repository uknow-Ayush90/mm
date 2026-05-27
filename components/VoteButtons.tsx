"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useVote } from "@/hooks/useVote";
import { cn } from "@/lib/utils";

interface Props {
  memeId: string;
  upvotes: number;
  downvotes: number;
  score: number;
  userVote: "UPVOTE" | "DOWNVOTE" | null;
  compact?: boolean;
}

export default function VoteButtons({
  memeId,
  upvotes,
  downvotes,
  score,
  userVote: initialVote,
  compact = false,
}: Props) {
  const { upvotes: u, downvotes: d, score: s, userVote, vote, isLoading } = useVote(memeId, {
    upvotes,
    downvotes,
    score,
    userVote: initialVote,
  });

  const btnBase = cn(
    "flex items-center gap-1.5 rounded-lg font-semibold transition-all duration-150 select-none",
    compact ? "px-2.5 py-1.5 text-sm" : "px-3 py-2 text-sm",
    isLoading && "opacity-60 pointer-events-none"
  );

  return (
    <div className={cn("flex items-center gap-2", compact && "gap-1.5")}>
      {/* Upvote */}
      <button
        onClick={() => vote("UPVOTE")}
        className={cn(
          btnBase,
          userVote === "UPVOTE"
            ? "bg-[#10b981]/20 text-[#10b981] ring-1 ring-[#10b981]/40"
            : "bg-[#111111] text-[#9ca3af] hover:text-[#10b981] hover:bg-[#10b981]/10"
        )}
        title="Upvote"
      >
        <ArrowUp size={compact ? 14 : 16} />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={u}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {u}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Score */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={s}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "font-bold tabular-nums min-w-[2ch] text-center",
            compact ? "text-sm" : "text-base",
            s > 0 ? "text-[#10b981]" : s < 0 ? "text-[#ef4444]" : "text-[#9ca3af]"
          )}
        >
          {s > 0 ? `+${s}` : s}
        </motion.span>
      </AnimatePresence>

      {/* Downvote */}
      <button
        onClick={() => vote("DOWNVOTE")}
        className={cn(
          btnBase,
          userVote === "DOWNVOTE"
            ? "bg-[#ef4444]/20 text-[#ef4444] ring-1 ring-[#ef4444]/40"
            : "bg-[#111111] text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#ef4444]/10"
        )}
        title="Downvote"
      >
        <ArrowDown size={compact ? 14 : 16} />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={d}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {d}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
