import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import UserAvatar from "@/components/UserAvatar";
import MemeGrid from "@/components/MemeGrid";
import type { Meme } from "@/types";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findUnique({ where: { username: username.toLowerCase() } });
  return { title: user ? `${user.displayName} (@${user.username}) — Team Ashoka Memes` : "Profile" };
}

async function getProfile(username: string) {
  return prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      memes: {
        where: { isRemoved: false },
        orderBy: { score: "desc" },
        include: {
          author: { select: { id: true, username: true, displayName: true, avatarColor: true } },
          tags: { include: { tag: true } },
          _count: { select: { comments: true, votes: true } },
        },
      },
      _count: { select: { memes: true } },
    },
  });
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const user = await getProfile(username);
  if (!user) notFound();

  const bestMeme = user.memes[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Profile Card */}
      <div className="bg-[#0a0a0a] border border-[#222222] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <UserAvatar user={user} size="lg" />

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
            <p className="text-[#9ca3af]">@{user.username}</p>
          </div>

          <div className="flex gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{user._count.memes}</p>
              <p className="text-[#9ca3af] text-xs">Memes</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${user.totalScore >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                {user.totalScore > 0 ? `+${user.totalScore}` : user.totalScore}
              </p>
              <p className="text-[#9ca3af] text-xs">Score</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 pt-4 border-t border-[#222222] flex flex-wrap gap-4 text-sm text-[#9ca3af]">
          <span className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-[#7c3aed]" />
            Best meme: {bestMeme ? `+${bestMeme.score} score` : "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#7c3aed]" />
            Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Memes */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">
          {user.displayName} ke Memes
        </h2>
        <MemeGrid memes={user.memes as unknown as Meme[]} />
      </div>
    </div>
  );
}
