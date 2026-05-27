"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, ArrowUp, MessageSquare } from "lucide-react";
import type { Meme } from "@/types";
import UserAvatar from "./UserAvatar";
import { timeAgo } from "@/lib/utils";

interface Props {
  memes: Meme[];
}

const rankIcons = [
  { icon: Trophy, color: "#f59e0b" },
  { icon: Medal, color: "#9ca3af" },
  { icon: Award, color: "#cd7c32" },
];

const rankBgs = [
  "bg-yellow-500/10 border-yellow-500/30",
  "bg-gray-500/10 border-gray-500/30",
  "bg-orange-500/10 border-orange-500/30",
];

export default function LeaderboardTable({ memes }: Props) {
  return (
    <div className="space-y-3">
      {memes.map((meme, i) => {
        const isTop3 = i < 3;
        const rank = rankIcons[i];

        return (
          <motion.div
            key={meme.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              href={`/meme/${meme.id}`}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                isTop3
                  ? `${rankBgs[i]} border`
                  : "bg-[#0a0a0a] border-[#222222] hover:border-[#333333]"
              }`}
            >
              {/* Rank */}
              <div className="w-10 flex items-center justify-center flex-shrink-0">
                {isTop3 ? (
                  <rank.icon size={24} color={rank.color} />
                ) : (
                  <span className="text-[#6b7280] font-bold text-sm">#{i + 1}</span>
                )}
              </div>

              {/* Thumbnail */}
              <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0 bg-[#111111]">
                <Image
                  src={meme.imageUrl}
                  alt={meme.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{meme.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <UserAvatar user={meme.author} size="sm" />
                  <span className="text-[#9ca3af] text-xs truncate">
                    {meme.author.displayName}
                  </span>
                  <span className="text-[#6b7280] text-xs hidden sm:inline">
                    · {timeAgo(meme.createdAt)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center gap-3 text-[#9ca3af] text-sm">
                <span className="flex items-center gap-1">
                  <MessageSquare size={13} />
                  {meme._count?.comments ?? 0}
                </span>
              </div>

              {/* Score */}
              <div className="text-right flex-shrink-0">
                <p
                  className={`font-bold text-lg flex items-center gap-1 ${
                    meme.score > 0
                      ? "text-[#10b981]"
                      : meme.score < 0
                      ? "text-[#ef4444]"
                      : "text-[#9ca3af]"
                  }`}
                >
                  <ArrowUp size={16} />
                  {meme.score}
                </p>
                <p className="text-[#6b7280] text-xs">score</p>
              </div>
            </Link>
          </motion.div>
        );
      })}

      {memes.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-[#9ca3af]">Leaderboard abhi khali hai</p>
          <p className="text-[#6b7280] text-sm mt-1">Meme upload karo aur votes lo!</p>
        </div>
      )}
    </div>
  );
}
