import { PrismaClient } from "@prisma/client";
import { TAGS } from "../lib/tags";
import { DESK_TAGS } from "../lib/desk-tags";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding tags...");
  for (const tag of TAGS) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: { name: tag.name, slug: tag.slug },
    });
  }
  console.log(`Seeded ${TAGS.length} meme tags.`);

  console.log("Seeding desk tags...");
  for (const tag of DESK_TAGS) {
    await prisma.deskTag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: { name: tag.name, slug: tag.slug },
    });
  }
  console.log(`Seeded ${DESK_TAGS.length} desk tags.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
