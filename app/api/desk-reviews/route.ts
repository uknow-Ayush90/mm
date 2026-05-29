import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { SortMode } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sort = (searchParams.get("sort") as SortMode) ?? "hot";
  const tag = searchParams.get("tag") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = {
    isRemoved: false,
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
  };

  const orderBy =
    sort === "new"
      ? [{ createdAt: "desc" as const }]
      : [{ score: "desc" as const }, { createdAt: "desc" as const }];

  const [reviews, total] = await Promise.all([
    prisma.deskReview.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarColor: true },
        },
        tags: { include: { tag: true } },
        votes: { select: { id: true, type: true, userId: true } },
        _count: { select: { comments: true, votes: true } },
      },
    }),
    prisma.deskReview.count({ where }),
  ]);

  return NextResponse.json({ reviews, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Missing user" }, { status: 401 });

  const body = await req.json();
  const { title, imageUrl, publicId, tagSlugs } = body;

  if (!title?.trim() || !imageUrl || !publicId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const review = await prisma.deskReview.create({
    data: {
      title: title.trim(),
      imageUrl,
      publicId,
      authorId: userId,
      tags: tagSlugs?.length
        ? {
            create: (tagSlugs as string[]).map((slug: string) => ({ tagSlug: slug })),
          }
        : undefined,
    },
    include: {
      author: { select: { id: true, username: true, displayName: true, avatarColor: true } },
      tags: { include: { tag: true } },
      votes: { select: { id: true, type: true, userId: true } },
      _count: { select: { comments: true, votes: true } },
    },
  });

  return NextResponse.json(review, { status: 201 });
}
