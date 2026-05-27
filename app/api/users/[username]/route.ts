import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
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

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}
