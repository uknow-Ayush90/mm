"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import type { Meme } from "@/types";
import { timeAgo } from "@/lib/utils";
import VoteButtons from "./VoteButtons";
import UserAvatar from "./UserAvatar";
import { useUser } from "@/context/UserContext";

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

function MemeSlide({ meme }: { meme: Meme }) {
  const { user } = useUser();
  const isVideo = meme.imageUrl.includes("/video/");
  const userVote = user
    ? (meme.votes?.find((v) => v.userId === user.id)?.type ?? null)
    : null;

  return (
    <div className="w-full h-full flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-lg flex flex-col bg-[#0a0a0a] border border-[#222222] rounded-2xl overflow-hidden">
        {/* Media */}
        <Link href={`/meme/${meme.id}`} className="block relative bg-black flex-shrink-0">
          <div className="relative w-full" style={{ paddingBottom: "66.67%" }}>
            {isVideo ? (
              <video
                src={meme.imageUrl}
                loop
                playsInline
                controls
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <Image
                src={meme.imageUrl}
                alt={meme.title}
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-contain"
                priority
              />
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3">
          {meme.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {meme.tags.slice(0, 4).map(({ tag }) => (
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

          <Link href={`/meme/${meme.id}`}>
            <h2 className="text-white font-semibold text-base leading-snug hover:text-[#8b5cf6] transition-colors">
              {meme.title}
            </h2>
          </Link>

          <div className="flex items-center justify-between">
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
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <UserAvatar user={meme.author} size="sm" />
              <div className="text-right">
                <p className="text-xs text-white font-medium leading-none">{meme.author.displayName}</p>
                <p className="text-xs text-[#6b7280] leading-none mt-0.5">{timeAgo(meme.createdAt)}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemeSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-lg bg-[#0a0a0a] border border-[#222222] rounded-2xl overflow-hidden animate-pulse">
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
    </div>
  );
}

interface Props {
  memes: Meme[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function MemeFeed({ memes, loading = false, onLoadMore, hasMore = false }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Trigger load more when last item enters view
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;
    const container = scrollRef.current;
    if (!container) return;

    const lastChild = container.lastElementChild as HTMLElement | null;
    if (!lastChild) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { root: container, threshold: 0.5 }
    );

    observer.observe(lastChild);
    return () => observer.disconnect();
  }, [memes.length, hasMore, onLoadMore]);

  if (loading && !memes.length) {
    return (
      <div
        className="h-full overflow-y-scroll"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ scrollSnapAlign: "start", height: "100%" }}>
            <MemeSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!memes.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-4">😢</div>
        <p className="text-[#9ca3af] text-lg">Koi meme nahi mila</p>
        <p className="text-[#6b7280] text-sm mt-1">Pehle meme upload karo bhai!</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-scroll"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {memes.map((meme) => (
        <div
          key={meme.id}
          style={{ scrollSnapAlign: "start", height: "100%" }}
        >
          <MemeSlide meme={meme} />
        </div>
      ))}

      {hasMore && (
        <div style={{ scrollSnapAlign: "start", height: "100%" }}>
          <MemeSkeleton />
        </div>
      )}
    </div>
  );
}
