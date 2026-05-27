"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useUser, generateUserId, generateAvatarColor } from "@/context/UserContext";

export default function OnboardingModal() {
  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !displayName.trim()) return;

    const cleaned = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (cleaned.length < 3) {
      toast.error("Username kam se kam 3 characters ka hona chahiye");
      return;
    }

    setLoading(true);
    try {
      const id = generateUserId();
      const avatarColor = generateAvatarColor(cleaned);

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, username: cleaned, displayName: displayName.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Error ho gaya, try again");
        return;
      }

      setUser({ id, username: cleaned, displayName: displayName.trim(), avatarColor });
      toast.success(`Welcome, ${displayName.trim()}! 🔥`);
    } catch {
      toast.error("Network error, try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔥</div>
          <h2 className="text-2xl font-bold text-white mb-1">Join Team Ashoka</h2>
          <p className="text-[#9ca3af] text-sm">
            Ek username choose karo and meme game shuru karo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Rahul Sharma"
              maxLength={30}
              className="w-full bg-[#111111] border border-[#222222] rounded-lg px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#7c3aed] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="rahul_dev"
                maxLength={20}
                className="w-full bg-[#111111] border border-[#222222] rounded-lg pl-8 pr-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#7c3aed] transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim() || !displayName.trim()}
            className="mt-2 bg-[#7c3aed] hover:bg-[#8b5cf6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Creating..." : "Let's Go! 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
