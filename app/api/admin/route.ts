import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const memes = await prisma.meme.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, displayName: true } },
      _count: { select: { comments: true, votes: true } },
    },
  });

  return NextResponse.json(memes);
}

export async function DELETE(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Reset: remove all votes & reset scores
  await prisma.$transaction([
    prisma.vote.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.meme.updateMany({ data: { upvotes: 0, downvotes: 0, score: 0 } }),
    prisma.user.updateMany({ data: { totalScore: 0 } }),
  ]);

  return NextResponse.json({ success: true });
}
