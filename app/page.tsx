"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Flame, Sparkles, TrendingUp, Upload, Monitor } from "lucide-react";
import Link from "next/link";
import type { Meme, DeskReview, SortMode } from "@/types";
import MemeFeed from "@/components/MemeFeed";
import DeskReviewFeed from "@/components/DeskReviewFeed";
import TagFilter from "@/components/TagFilter";
import DeskTagFilter from "@/components/DeskTagFilter";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { value: SortMode; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { value: "hot", label: "Hot", icon: Flame },
  { value: "new", label: "New", icon: Sparkles },
  { value: "top", label: "Top", icon: TrendingUp },
];

function HomeFeed() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") ?? "memes";
  const sort = (searchParams.get("sort") as SortMode) ?? "hot";
  const tag = searchParams.get("tag") ?? undefined;

  const [memes, setMemes] = useState<Meme[]>([]);
  const [reviews, setReviews] = useState<DeskReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setMemes([]);
    setReviews([]);
    setPage(1);
    setLoading(true);

    const params = new URLSearchParams({ sort, page: "1" });
    if (tag) params.set("tag", tag);

    const endpoint = tab === "desk" ? "/api/desk-reviews" : "/api/memes";

    fetch(`${endpoint}?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (tab === "desk") {
          setReviews(data.reviews ?? []);
        } else {
          setMemes(data.memes ?? []);
        }
        setHasMore((data.page ?? 1) < (data.totalPages ?? 1));
      })
      .finally(() => setLoading(false));
  }, [sort, tag, tab]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    const params = new URLSearchParams({ sort, page: String(nextPage) });
    if (tag) params.set("tag", tag);

    const endpoint = tab === "desk" ? "/api/desk-reviews" : "/api/memes";

    fetch(`${endpoint}?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (tab === "desk") {
          setReviews((prev) => [...prev, ...(data.reviews ?? [])]);
        } else {
          setMemes((prev) => [...prev, ...(data.memes ?? [])]);
        }
        setPage(nextPage);
        setHasMore(nextPage < (data.totalPages ?? 1));
      })
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, page, sort, tag, tab]);

  function setSort(s: SortMode) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", s);
    params.delete("page");
    router.push(`/?${params.toString()}`);
  }

  function setTab(t: string) {
    const params = new URLSearchParams();
    params.set("tab", t);
    params.set("sort", sort);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Tab switcher */}
      <div className="flex-shrink-0 px-4 pt-3 pb-0 flex gap-1 border-b border-[#111111]">
        <button
          onClick={() => setTab("memes")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border-b-2 transition-all -mb-px",
            tab !== "desk"
              ? "border-[#7c3aed] text-white"
              : "border-transparent text-[#6b7280] hover:text-[#9ca3af]"
          )}
        >
          🔥 Memes
        </button>
        <button
          onClick={() => setTab("desk")}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border-b-2 transition-all -mb-px",
            tab === "desk"
              ? "border-[#7c3aed] text-white"
              : "border-transparent text-[#6b7280] hover:text-[#9ca3af]"
          )}
        >
          <Monitor size={14} />
          Desk Reviews
        </button>
      </div>

      {/* Sort + filter + upload bar */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 flex flex-col sm:flex-row gap-2 sm:items-center border-b border-[#111111]">
        <div className="flex items-center gap-2 flex-shrink-0">
          {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSort(value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                sort === value
                  ? "bg-[#7c3aed] text-white"
                  : "bg-[#111111] text-[#9ca3af] hover:text-white hover:bg-[#222222]"
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto">
          {tab === "desk" ? <DeskTagFilter /> : <TagFilter />}
        </div>

        <Link
          href={`/upload${tab === "desk" ? "?type=desk" : ""}`}
          className="flex items-center gap-1.5 bg-[#7c3aed] hover:bg-[#8b5cf6] text-white px-4 py-1.5 rounded-lg font-semibold text-sm transition-colors flex-shrink-0 self-start"
        >
          <Upload size={14} />
          Upload
        </Link>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-hidden">
        {tab === "desk" ? (
          <DeskReviewFeed
            reviews={reviews}
            loading={loading}
            onLoadMore={loadMore}
            hasMore={hasMore}
          />
        ) : (
          <MemeFeed
            memes={memes}
            loading={loading}
            onLoadMore={loadMore}
            hasMore={hasMore}
          />
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeFeed />
    </Suspense>
  );
}
