import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deskReviewId } = await params;
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Missing user" }, { status: 401 });

  const { type } = await req.json();
  if (type !== "UPVOTE" && type !== "DOWNVOTE") {
    return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
  }

  const review = await prisma.deskReview.findUnique({ where: { id: deskReviewId, isRemoved: false } });
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  const existing = await prisma.deskReviewVote.findUnique({
    where: { userId_deskReviewId: { userId, deskReviewId } },
  });

  let deltaUp = 0;
  let deltaDown = 0;
  let newUserVote: "UPVOTE" | "DOWNVOTE" | null = null;

  if (existing) {
    if (existing.type === type) {
      await prisma.deskReviewVote.delete({ where: { id: existing.id } });
      if (type === "UPVOTE") deltaUp = -1;
      else deltaDown = -1;
      newUserVote = null;
    } else {
      await prisma.deskReviewVote.update({ where: { id: existing.id }, data: { type } });
      if (type === "UPVOTE") { deltaUp = 1; deltaDown = -1; }
      else { deltaUp = -1; deltaDown = 1; }
      newUserVote = type;
    }
  } else {
    await prisma.deskReviewVote.create({ data: { userId, deskReviewId, type } });
    if (type === "UPVOTE") deltaUp = 1;
    else deltaDown = 1;
    newUserVote = type;
  }

  const updated = await prisma.deskReview.update({
    where: { id: deskReviewId },
    data: {
      upvotes: { increment: deltaUp },
      downvotes: { increment: deltaDown },
      score: { increment: deltaUp - deltaDown },
    },
  });

  if (deltaUp !== 0 || deltaDown !== 0) {
    await prisma.user.updateMany({
      where: { id: review.authorId },
      data: { totalScore: { increment: deltaUp - deltaDown } },
    });
  }

  return NextResponse.json({
    upvotes: updated.upvotes,
    downvotes: updated.downvotes,
    score: updated.score,
    userVote: newUserVote,
  });
}
