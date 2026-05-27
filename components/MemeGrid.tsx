"use client";

import { motion } from "framer-motion";
import type { Meme } from "@/types";
import MemeCard from "./MemeCard";

interface Props {
  memes: Meme[];
  loading?: boolean;
}

function MemeSkeleton() {
  return (
    <div className="bg-[#0a0a0a] border border-[#222222] rounded-xl overflow-hidden animate-pulse">
      <div className="w-full bg-[#111111]" style={{ paddingBottom: "66.67%" }} />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-[#111111] rounded-full" />
          <div className="h-5 w-20 bg-[#111111] rounded-full" />
        </div>
        <div className="h-5 bg-[#111111] rounded w-3/4" />
        <div className="h-4 bg-[#111111] rounded w-1/2" />
      </div>
    </div>
  );
}

export default function MemeGrid({ memes, loading = false }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MemeSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!memes.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24"
      >
        <div className="text-6xl mb-4">😢</div>
        <p className="text-[#9ca3af] text-lg">Koi meme nahi mila</p>
        <p className="text-[#6b7280] text-sm mt-1">Pehle meme upload karo bhai!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {memes.map((meme, i) => (
        <MemeCard key={meme.id} meme={meme} index={i} />
      ))}
    </motion.div>
  );
}
