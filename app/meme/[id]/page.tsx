import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import VoteButtons from "@/components/VoteButtons";
import CommentSection from "@/components/CommentSection";
import UserAvatar from "@/components/UserAvatar";
import type { Meme, Comment } from "@/types";
import { timeAgo } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const meme = await prisma.meme.findUnique({ where: { id } });
  return { title: meme ? `${meme.title} — Team Ashoka Memes` : "Meme" };
}

async function getMeme(id: string) {
  return prisma.meme.findUnique({
    where: { id, isRemoved: false },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarColor: true } },
      tags: { include: { tag: true } },
      votes: { select: { id: true, type: true, userId: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true, displayName: true, avatarColor: true } },
        },
      },
      _count: { select: { comments: true, votes: true } },
    },
  });
}

export default async function MemePage({ params }: Props) {
  const { id } = await params;
  const meme = await getMeme(id);
  if (!meme) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} /> Back to Feed
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Left: Image */}
        <div className="space-y-4">
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl overflow-hidden">
            <div className="relative bg-[#000000]">
              {meme.imageUrl.includes("/video/") ? (
                <video
                  src={meme.imageUrl}
                  controls
                  className="w-full max-h-[60vh] object-contain"
                />
              ) : (
                <Image
                  src={meme.imageUrl}
                  alt={meme.title}
                  width={800}
                  height={600}
                  className="w-full object-contain max-h-[60vh]"
                  priority
                />
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6">
            <CommentSection
              memeId={meme.id}
              initialComments={meme.comments as unknown as Comment[]}
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-4">
          <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-5 space-y-4">
            {/* Tags */}
            {meme.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {meme.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/?tag=${tag.slug}`}
                    className="text-xs bg-[#7c3aed]/20 text-[#8b5cf6] px-2.5 py-1 rounded-full font-medium hover:bg-[#7c3aed]/30 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-xl font-bold text-white leading-snug">{meme.title}</h1>

            {/* Author */}
            <Link
              href={`/profile/${meme.author.username}`}
              className="flex items-center gap-3 hover:bg-[#111111] rounded-xl p-2 -mx-2 transition-colors"
            >
              <UserAvatar user={meme.author} size="md" />
              <div>
                <p className="text-white font-medium text-sm">{meme.author.displayName}</p>
                <p className="text-[#9ca3af] text-xs">@{meme.author.username}</p>
              </div>
              <p className="text-[#6b7280] text-xs ml-auto">{timeAgo(meme.createdAt)}</p>
            </Link>

            {/* Votes */}
            <div className="pt-2 border-t border-[#222222]">
              <VoteButtons
                memeId={meme.id}
                upvotes={meme.upvotes}
                downvotes={meme.downvotes}
                score={meme.score}
                userVote={null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
