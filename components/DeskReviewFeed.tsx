"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import type { DeskReview } from "@/types";
import { timeAgo } from "@/lib/utils";
import DeskReviewVoteButtons from "./DeskReviewVoteButtons";
import UserAvatar from "./UserAvatar";
import { useUser } from "@/context/UserContext";

const DESK_TAG_COLORS: Record<string, string> = {
  "monitor-setup": "bg-blue-900/40 text-blue-300",
  "cable-management": "bg-gray-800 text-gray-300",
  peripherals: "bg-purple-900/40 text-purple-300",
  ergonomics: "bg-green-900/40 text-green-300",
  "budget-setup": "bg-yellow-900/40 text-yellow-300",
  "gaming-setup": "bg-red-900/40 text-red-300",
  "minimal-setup": "bg-slate-800 text-slate-300",
  "dual-monitor": "bg-cyan-900/40 text-cyan-300",
  "standing-desk": "bg-teal-900/40 text-teal-300",
  rgb: "bg-pink-900/40 text-pink-300",
  "home-office": "bg-orange-900/40 text-orange-300",
  "work-setup": "bg-indigo-900/40 text-indigo-300",
};

function DeskSlide({ review }: { review: DeskReview }) {
  const { user } = useUser();
  const userVote = user
    ? (review.votes?.find((v) => v.userId === user.id)?.type ?? null)
    : null;

  return (
    <div className="w-full h-full flex items-center justify-center py-4 px-4">
      <div className="w-full max-w-lg flex flex-col bg-[#0a0a0a] border border-[#222222] rounded-2xl overflow-hidden">
        <Link href={`/desk-review/${review.id}`} className="block relative bg-black flex-shrink-0">
          <div className="relative w-full" style={{ paddingBottom: "66.67%" }}>
            <Image
              src={review.imageUrl}
              alt={review.title}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="p-4 flex flex-col gap-3">
          {review.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {review.tags.slice(0, 4).map(({ tag }) => (
                <Link
                  key={tag.slug}
                  href={`/?tab=desk&tag=${tag.slug}`}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    DESK_TAG_COLORS[tag.slug] ?? "bg-[#222222] text-[#9ca3af]"
                  } hover:opacity-80 transition-opacity`}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          <Link href={`/desk-review/${review.id}`}>
            <h2 className="text-white font-semibold text-base leading-snug hover:text-[#7c3aed] transition-colors">
              {review.title}
            </h2>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DeskReviewVoteButtons
                reviewId={review.id}
                upvotes={review.upvotes}
                downvotes={review.downvotes}
                score={review.score}
                userVote={userVote}
                compact
              />
              <Link
                href={`/desk-review/${review.id}#comments`}
                className="flex items-center gap-1.5 text-xs text-[#9ca3af] hover:text-white transition-colors bg-[#111111] px-2.5 py-1.5 rounded-lg"
              >
                <MessageSquare size={13} />
                {review._count?.comments ?? 0}
              </Link>
            </div>

            <Link
              href={`/profile/${review.author.username}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <UserAvatar user={review.author} size="sm" />
              <div className="text-right">
                <p className="text-xs text-white font-medium leading-none">{review.author.displayName}</p>
                <p className="text-xs text-[#6b7280] leading-none mt-0.5">{timeAgo(review.createdAt)}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeskSkeleton() {
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
  reviews: DeskReview[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function DeskReviewFeed({ reviews, loading = false, onLoadMore, hasMore = false }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
  }, [reviews.length, hasMore, onLoadMore]);

  if (loading && !reviews.length) {
    return (
      <div className="h-full overflow-y-scroll" style={{ scrollSnapType: "y mandatory" }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ scrollSnapAlign: "start", height: "100%" }}>
            <DeskSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-4">🖥️</div>
        <p className="text-[#9ca3af] text-lg">Koi desk review nahi mila</p>
        <p className="text-[#6b7280] text-sm mt-1">Apna setup upload karo bhai!</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-scroll"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {reviews.map((review) => (
        <div key={review.id} style={{ scrollSnapAlign: "start", height: "100%" }}>
          <DeskSlide review={review} />
        </div>
      ))}

      {hasMore && (
        <div style={{ scrollSnapAlign: "start", height: "100%" }}>
          <DeskSkeleton />
        </div>
      )}
    </div>
  );
}
