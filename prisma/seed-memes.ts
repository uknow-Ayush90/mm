import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
} as ConstructorParameters<typeof PrismaClient>[0]);

const MEMES = [
  { title: "When the code works on first try", tags: ["debugging"], img: "https://picsum.photos/seed/meme1/600/400" },
  { title: "Git push to main on a Friday evening", tags: ["devops", "git"], img: "https://picsum.photos/seed/meme2/600/400" },
  { title: "Stack Overflow copy paste goes wrong in prod", tags: ["debugging", "backend"], img: "https://picsum.photos/seed/meme3/600/400" },
  { title: "Me explaining my spaghetti code to the interviewer", tags: ["placements"], img: "https://picsum.photos/seed/meme4/600/400" },
  { title: "AI writes 200 lines, I write 2 line fix", tags: ["ai-ml"], img: "https://picsum.photos/seed/meme5/600/400" },
  { title: "npm install and go make chai", tags: ["frontend"], img: "https://picsum.photos/seed/meme6/600/400" },
  { title: "It works on my machine — ship the machine", tags: ["devops"], img: "https://picsum.photos/seed/meme7/600/400" },
  { title: "LeetCode hard at 2am before placement drive", tags: ["leetcode", "placements"], img: "https://picsum.photos/seed/meme8/600/400" },
  { title: "Senior dev: just a small change. Junior: 3 days later...", tags: ["startup-life"], img: "https://picsum.photos/seed/meme9/600/400" },
  { title: "The WiFi password is the only thing standing between me and deployment", tags: ["devops", "debugging"], img: "https://picsum.photos/seed/meme10/600/400" },
  { title: "CSS centering: 47 Stack Overflow tabs open", tags: ["frontend"], img: "https://picsum.photos/seed/meme11/600/400" },
  { title: "sudo make me a sandwich", tags: ["cybersecurity", "backend"], img: "https://picsum.photos/seed/meme12/600/400" },
  { title: "My code has no bugs, it has undocumented features", tags: ["debugging"], img: "https://picsum.photos/seed/meme13/600/400" },
  { title: "AI will replace programmers they said. My AI-written code: 404", tags: ["ai-ml"], img: "https://picsum.photos/seed/meme14/600/400" },
  { title: "git blame and it's yourself from 3 months ago", tags: ["git"], img: "https://picsum.photos/seed/meme15/600/400" },
  { title: "The standup was 5 mins they said", tags: ["meetings"], img: "https://picsum.photos/seed/meme16/600/400" },
  { title: "Password: 123456 — Hacker: thank you very much", tags: ["cybersecurity"], img: "https://picsum.photos/seed/meme17/600/400" },
  { title: "Coffee to code conversion rate: 1:1", tags: ["coffee-code"], img: "https://picsum.photos/seed/meme18/600/400" },
  { title: "Placement season: everyone suddenly loves DSA", tags: ["placements", "leetcode"], img: "https://picsum.photos/seed/meme19/600/400" },
  { title: "Backend developer: it's a frontend issue. Frontend: it's a backend issue.", tags: ["frontend", "backend"], img: "https://picsum.photos/seed/meme20/600/400" },
  { title: "Docker: works in container. Production: container on fire", tags: ["devops"], img: "https://picsum.photos/seed/meme21/600/400" },
  { title: "ChatGPT writes my code. I write my excuses.", tags: ["ai-ml", "startup-life"], img: "https://picsum.photos/seed/meme22/600/400" },
  { title: "undefined is not a function — my daily motivational quote", tags: ["frontend", "debugging"], img: "https://picsum.photos/seed/meme23/600/400" },
  { title: "We need to talk about your commit messages: 'asdfgh fix'", tags: ["git"], img: "https://picsum.photos/seed/meme24/600/400" },
  { title: "Interview: reverse a linked list. Job: Excel formulas all day", tags: ["placements"], img: "https://picsum.photos/seed/meme25/600/400" },
  { title: "The meeting could have been an email. The email could have been silence.", tags: ["meetings"], img: "https://picsum.photos/seed/meme26/600/400" },
  { title: "Merge conflict on my will to live", tags: ["git", "debugging"], img: "https://picsum.photos/seed/meme27/600/400" },
  { title: "5th cup of coffee: I am the algorithm", tags: ["coffee-code", "leetcode"], img: "https://picsum.photos/seed/meme28/600/400" },
  { title: "SQL injection? In MY app? It's more likely than you think.", tags: ["cybersecurity", "backend"], img: "https://picsum.photos/seed/meme29/600/400" },
  { title: "Startup equity: 0.001%. Work hours: 100%.", tags: ["startup-life"], img: "https://picsum.photos/seed/meme30/600/400" },
];

async function main() {
  // Create a seed user
  const seedUser = await prisma.user.upsert({
    where: { username: "memebot" },
    update: {},
    create: {
      id: "u_memebot_seed_001",
      username: "memebot",
      displayName: "Meme Bot 🤖",
      avatarColor: "#7c3aed",
    },
  });

  console.log(`Seed user: ${seedUser.displayName}`);

  // Get all tags
  const allTags = await prisma.tag.findMany();
  const tagMap = Object.fromEntries(allTags.map((t) => [t.slug, t.id]));

  let count = 0;
  for (const meme of MEMES) {
    const tagIds = meme.tags
      .filter((slug) => tagMap[slug])
      .map((slug) => ({ tagId: tagMap[slug] }));

    await prisma.meme.create({
      data: {
        title: meme.title,
        imageUrl: meme.img,
        publicId: `seed_${count + 1}`,
        authorId: seedUser.id,
        tags: { create: tagIds },
      },
    });

    count++;
    process.stdout.write(`\rUploaded: ${count}/${MEMES.length}`);
  }

  console.log(`\n✅ ${count} memes seeded!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
