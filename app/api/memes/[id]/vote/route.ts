import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: memeId } = await params;
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Missing user" }, { status: 401 });

  const { type } = await req.json();
  if (type !== "UPVOTE" && type !== "DOWNVOTE") {
    return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
  }

  const meme = await prisma.meme.findUnique({ where: { id: memeId, isRemoved: false } });
  if (!meme) return NextResponse.json({ error: "Meme not found" }, { status: 404 });

  const existing = await prisma.vote.findUnique({
    where: { userId_memeId: { userId, memeId } },
  });

  let deltaUp = 0;
  let deltaDown = 0;
  let newUserVote: "UPVOTE" | "DOWNVOTE" | null = null;

  if (existing) {
    if (existing.type === type) {
      // Toggle off — undo vote
      await prisma.vote.delete({ where: { id: existing.id } });
      if (type === "UPVOTE") deltaUp = -1;
      else deltaDown = -1;
      newUserVote = null;
    } else {
      // Switch vote
      await prisma.vote.update({ where: { id: existing.id }, data: { type } });
      if (type === "UPVOTE") { deltaUp = 1; deltaDown = -1; }
      else { deltaUp = -1; deltaDown = 1; }
      newUserVote = type;
    }
  } else {
    await prisma.vote.create({ data: { userId, memeId, type } });
    if (type === "UPVOTE") deltaUp = 1;
    else deltaDown = 1;
    newUserVote = type;
  }

  const updatedMeme = await prisma.meme.update({
    where: { id: memeId },
    data: {
      upvotes: { increment: deltaUp },
      downvotes: { increment: deltaDown },
      score: { increment: deltaUp - deltaDown },
    },
  });

  // Update author's total score (only if delta changed)
  if (deltaUp !== 0 || deltaDown !== 0) {
    await prisma.user.updateMany({
      where: { id: meme.authorId },
      data: { totalScore: { increment: deltaUp - deltaDown } },
    });
  }

  return NextResponse.json({
    upvotes: updatedMeme.upvotes,
    downvotes: updatedMeme.downvotes,
    score: updatedMeme.score,
    userVote: newUserVote,
  });
}
