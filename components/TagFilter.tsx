"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TAGS } from "@/lib/tags";
import { cn } from "@/lib/utils";

export default function TagFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  function setTag(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("tag", slug);
    } else {
      params.delete("tag");
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#222222]">
      <button
        onClick={() => setTag(null)}
        className={cn(
          "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
          !activeTag
            ? "bg-[#7c3aed] text-white"
            : "bg-[#111111] text-[#9ca3af] hover:text-white hover:bg-[#222222]"
        )}
      >
        All
      </button>
      {TAGS.map((tag) => (
        <button
          key={tag.slug}
          onClick={() => setTag(tag.slug)}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            activeTag === tag.slug
              ? "bg-[#7c3aed] text-white"
              : "bg-[#111111] text-[#9ca3af] hover:text-white hover:bg-[#222222]"
          )}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
