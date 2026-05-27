import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const memes = await prisma.meme.findMany({
    where: { isRemoved: false },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    take: 20,
    include: {
      author: {
        select: { id: true, username: true, displayName: true, avatarColor: true },
      },
      tags: { include: { tag: true } },
      _count: { select: { comments: true, votes: true } },
    },
  });
  return NextResponse.json(memes);
}
