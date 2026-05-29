import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deskReviewId } = await params;
  const comments = await prisma.deskReviewComment.findMany({
    where: { deskReviewId },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarColor: true } },
    },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deskReviewId } = await params;
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Missing user" }, { status: 401 });

  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Empty comment" }, { status: 400 });

  const review = await prisma.deskReview.findUnique({ where: { id: deskReviewId } });
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  const comment = await prisma.deskReviewComment.create({
    data: { body: body.trim(), authorId: userId, deskReviewId },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarColor: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
