import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Missing user" }, { status: 401 });

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: "meme_uploads",
  });
}
