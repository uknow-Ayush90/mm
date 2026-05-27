import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAvatarColor } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { id, username, displayName } = await req.json();

  if (!id || !username?.trim() || !displayName?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const avatarColor = generateAvatarColor(username);

  const user = await prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      username: username.trim().toLowerCase(),
      displayName: displayName.trim(),
      avatarColor,
    },
  });

  return NextResponse.json(user);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: { id: true, username: true, displayName: true, avatarColor: true, totalScore: true, createdAt: true },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}
