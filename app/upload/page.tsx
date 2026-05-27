import type { Metadata } from "next";
import { Upload } from "lucide-react";
import UploadForm from "@/components/UploadForm";

export const metadata: Metadata = {
  title: "Upload Meme — Team Ashoka Memes",
};

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#7c3aed]/20 rounded-2xl flex items-center justify-center">
          <Upload size={22} className="text-[#7c3aed]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Meme Upload Karo</h1>
          <p className="text-[#9ca3af] text-sm">Team ko hasao, leaderboard mein chadhao</p>
        </div>
      </div>
      <UploadForm />
    </div>
  );
}
