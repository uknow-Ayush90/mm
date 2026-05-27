"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, RefreshCw, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { timeAgo } from "@/lib/utils";

interface AdminMeme {
  id: string;
  title: string;
  imageUrl: string;
  isRemoved: boolean;
  score: number;
  createdAt: string;
  author: { username: string; displayName: string };
  _count: { comments: number; votes: number };
}

interface Props {
  adminKey: string;
}

export default function AdminPanel({ adminKey }: Props) {
  const [memes, setMemes] = useState<AdminMeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  async function fetchMemes() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error();
      setMemes(await res.json());
    } catch {
      toast.error("Memes load nahi hue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin", {
          headers: { "x-admin-key": adminKey },
        });
        if (!res.ok) throw new Error();
        setMemes(await res.json());
      } catch {
        toast.error("Memes load nahi hue");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [adminKey]);

  async function toggleRemove(meme: AdminMeme) {
    try {
      const res = await fetch(`/api/memes/${meme.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ isRemoved: !meme.isRemoved }),
      });
      if (!res.ok) throw new Error();
      setMemes((prev) => prev.map((m) => m.id === meme.id ? { ...m, isRemoved: !m.isRemoved } : m));
      toast.success(meme.isRemoved ? "Meme restore ho gaya" : "Meme remove ho gaya");
    } catch {
      toast.error("Action fail ho gaya");
    }
  }

  async function resetSession() {
    if (!confirm("Sach mein sab reset karna hai? Sare votes aur comments delete ho jayenge!")) return;
    setResetting(true);
    try {
      const res = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error();
      toast.success("Session reset ho gaya! 🔄");
      fetchMemes();
    } catch {
      toast.error("Reset fail ho gaya");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <p className="text-[#9ca3af] text-sm">{memes.length} total memes</p>
          </div>
        </div>
        <button
          onClick={resetSession}
          disabled={resetting}
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={resetting ? "animate-spin" : ""} />
          Reset Session
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-[#9ca3af]">Loading...</div>
      ) : (
        <div className="space-y-2">
          {memes.map((meme) => (
            <div
              key={meme.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                meme.isRemoved
                  ? "bg-red-500/5 border-red-500/20 opacity-60"
                  : "bg-[#0a0a0a] border-[#222222]"
              }`}
            >
              <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-[#111111]">
                <Image src={meme.imageUrl} alt={meme.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{meme.title}</p>
                <p className="text-[#9ca3af] text-xs">
                  @{meme.author.username} · {timeAgo(meme.createdAt)} ·{" "}
                  {meme._count.votes} votes · {meme._count.comments} comments
                </p>
              </div>
              <span className={`text-sm font-bold ${meme.score >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                {meme.score > 0 ? `+${meme.score}` : meme.score}
              </span>
              <button
                onClick={() => toggleRemove(meme)}
                className={`p-2 rounded-lg transition-colors ${
                  meme.isRemoved
                    ? "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                    : "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                }`}
                title={meme.isRemoved ? "Restore" : "Remove"}
              >
                {meme.isRemoved ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
