"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { useUser } from "@/context/UserContext";
import type { Comment } from "@/types";
import UserAvatar from "./UserAvatar";
import { timeAgo } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  memeId: string;
  initialComments: Comment[];
}

export default function CommentSection({ memeId, initialComments }: Props) {
  const { user, setShowOnboarding } = useUser();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setShowOnboarding(true); return; }
    if (!body.trim()) return;

    setPosting(true);
    try {
      const res = await fetch(`/api/memes/${memeId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ body: body.trim() }),
      });

      if (!res.ok) throw new Error();
      const comment = await res.json();
      setComments((prev) => [comment, ...prev]);
      setBody("");
    } catch {
      toast.error("Comment nahi gaya!");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div id="comments" className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Comments ({comments.length})
      </h3>

      {/* Input */}
      <form onSubmit={postComment} className="flex gap-3">
        {user && <UserAvatar user={user} size="sm" />}
        <div className="flex-1 flex gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onFocus={() => { if (!user) setShowOnboarding(true); }}
            placeholder={user ? "Kuch bol yaar..." : "Comment karne ke liye naam batao"}
            maxLength={500}
            className="flex-1 bg-[#111111] border border-[#222222] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#6b7280] focus:outline-none focus:border-[#7c3aed] transition-colors"
          />
          <button
            type="submit"
            disabled={posting || !body.trim()}
            className="bg-[#7c3aed] hover:bg-[#8b5cf6] disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-3">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <UserAvatar user={comment.author} size="sm" />
              <div className="flex-1 bg-[#111111] rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">
                    {comment.author.displayName}
                  </span>
                  <span className="text-xs text-[#6b7280]">
                    @{comment.author.username}
                  </span>
                  <span className="text-xs text-[#6b7280] ml-auto">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-[#d1d5db] leading-relaxed">{comment.body}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {comments.length === 0 && (
          <p className="text-center text-[#6b7280] text-sm py-8">
            Pehle comment karo! 💬
          </p>
        )}
      </div>
    </div>
  );
}
