import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const review = await prisma.deskReview.findUnique({
    where: { id, isRemoved: false },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarColor: true } },
      tags: { include: { tag: true } },
      votes: { select: { id: true, type: true, userId: true } },
      _count: { select: { comments: true, votes: true } },
    },
  });

  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(review);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.deskReview.update({ where: { id }, data: { isRemoved: true } });
  return NextResponse.json({ success: true });
}
