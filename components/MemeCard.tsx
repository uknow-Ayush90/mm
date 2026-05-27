"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageSquare, Tag } from "lucide-react";
import type { Meme } from "@/types";
import { timeAgo } from "@/lib/utils";
import VoteButtons from "./VoteButtons";
import UserAvatar from "./UserAvatar";
import { useUser } from "@/context/UserContext";

interface Props {
  meme: Meme;
  index?: number;
}

const TAG_COLORS: Record<string, string> = {
  debugging: "bg-red-900/40 text-red-300",
  "ai-ml": "bg-purple-900/40 text-purple-300",
  placements: "bg-yellow-900/40 text-yellow-300",
  devops: "bg-blue-900/40 text-blue-300",
  cybersecurity: "bg-green-900/40 text-green-300",
  frontend: "bg-pink-900/40 text-pink-300",
  backend: "bg-orange-900/40 text-orange-300",
  git: "bg-orange-900/40 text-orange-200",
  leetcode: "bg-teal-900/40 text-teal-300",
  "startup-life": "bg-indigo-900/40 text-indigo-300",
  "coffee-code": "bg-amber-900/40 text-amber-300",
  meetings: "bg-gray-800 text-gray-300",
};

export default function MemeCard({ meme, index = 0 }: Props) {
  const { user } = useUser();
  const userVote =
    user
      ? (meme.votes?.find((v) => v.userId === user.id)?.type ?? null)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-[#0a0a0a] border border-[#222222] rounded-xl overflow-hidden hover:border-[#333333] transition-all duration-200 group hover:shadow-lg hover:shadow-[#7c3aed]/5 flex flex-col"
    >
      {/* Image or Video */}
      <Link href={`/meme/${meme.id}`} className="block relative overflow-hidden bg-[#000000]">
        <div className="relative w-full" style={{ paddingBottom: "66.67%" }}>
          {meme.imageUrl.includes("/video/") ? (
            <video
              src={meme.imageUrl}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <Image
              src={meme.imageUrl}
              alt={meme.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Tags */}
        {meme.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {meme.tags.slice(0, 3).map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/?tag=${tag.slug}`}
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  TAG_COLORS[tag.slug] ?? "bg-[#222222] text-[#9ca3af]"
                } hover:opacity-80 transition-opacity`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/meme/${meme.id}`}>
          <h3 className="text-white font-semibold leading-snug hover:text-[#8b5cf6] transition-colors line-clamp-2">
            {meme.title}
          </h3>
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-2">
            <VoteButtons
              memeId={meme.id}
              upvotes={meme.upvotes}
              downvotes={meme.downvotes}
              score={meme.score}
              userVote={userVote}
              compact
            />
            <Link
              href={`/meme/${meme.id}#comments`}
              className="flex items-center gap-1.5 text-xs text-[#9ca3af] hover:text-white transition-colors bg-[#111111] px-2.5 py-1.5 rounded-lg"
            >
              <MessageSquare size={13} />
              {meme._count?.comments ?? 0}
            </Link>
          </div>

          <Link
            href={`/profile/${meme.author.username}`}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <UserAvatar user={meme.author} size="sm" />
            <div className="hidden xs:block">
              <p className="text-xs text-[#9ca3af] leading-none">{timeAgo(meme.createdAt)}</p>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
