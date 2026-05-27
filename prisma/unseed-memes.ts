import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
} as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  const user = await prisma.user.findUnique({ where: { username: "memebot" } });
  if (!user) {
    console.log("memebot not found — nothing to delete");
    return;
  }

  const memes = await prisma.meme.findMany({ where: { authorId: user.id } });
  const memeIds = memes.map((m) => m.id);
  console.log(`Found ${memeIds.length} memes to delete`);

  await prisma.memeTag.deleteMany({ where: { memeId: { in: memeIds } } });
  await prisma.vote.deleteMany({ where: { memeId: { in: memeIds } } });
  await prisma.comment.deleteMany({ where: { memeId: { in: memeIds } } });
  await prisma.meme.deleteMany({ where: { id: { in: memeIds } } });
  await prisma.user.delete({ where: { id: user.id } });

  console.log(`✅ Deleted memebot + ${memeIds.length} memes`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
