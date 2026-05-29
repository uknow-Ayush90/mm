"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Upload, Monitor } from "lucide-react";
import Link from "next/link";
import UploadForm from "@/components/UploadForm";
import DeskReviewUploadForm from "@/components/DeskReviewUploadForm";
import { cn } from "@/lib/utils";

function UploadPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "meme";
  const isDeskReview = type === "desk";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#7c3aed]/20 rounded-2xl flex items-center justify-center">
          {isDeskReview ? (
            <Monitor size={22} className="text-[#7c3aed]" />
          ) : (
            <Upload size={22} className="text-[#7c3aed]" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isDeskReview ? "Desk Setup Upload Karo" : "Meme Upload Karo"}
          </h1>
          <p className="text-[#9ca3af] text-sm">
            {isDeskReview
              ? "Apna setup dikhao, votes lo"
              : "Team ko hasao, leaderboard mein chadhao"}
          </p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-[#111111] p-1 rounded-xl">
        <Link
          href="/upload"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all",
            !isDeskReview
              ? "bg-[#7c3aed] text-white"
              : "text-[#6b7280] hover:text-white"
          )}
        >
          <Upload size={14} />
          Meme
        </Link>
        <Link
          href="/upload?type=desk"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all",
            isDeskReview
              ? "bg-[#7c3aed] text-white"
              : "text-[#6b7280] hover:text-white"
          )}
        >
          <Monitor size={14} />
          Desk Review
        </Link>
      </div>

      {isDeskReview ? <DeskReviewUploadForm /> : <UploadForm />}
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense>
      <UploadPageContent />
    </Suspense>
  );
}
