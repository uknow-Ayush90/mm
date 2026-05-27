import { PrismaClient } from "@prisma/client";
import { TAGS } from "../lib/tags";

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
  console.log(`Seeded ${TAGS.length} tags.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
