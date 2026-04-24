// Seed script for NeuroForge
// Run: npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
// Or add to package.json prisma seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧠 Seeding NeuroForge database...");

  // ── Upsert Demo User ──
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@neuroforge.app" },
    update: {},
    create: {
      email: "demo@neuroforge.app",
      password: "$2b$10$Ep7.S7xG3I0R5.j3f8V.2eY5lR9S7xG3I0R5.j3f8V.2eY5lR9", // "password123" hashed
      name: "Demo Operative",
    },
  });

  const userId = demoUser.id;

  // ── Seed Book Wisdom ──
  const wisdomData = [
    { userId, bookTitle: "Atomic Habits", principle: "The 1% Rule", explanation: "Get 1% better every day. Small habits compound into remarkable results over time.", application: "Track daily micro-improvements in NeuroScore.", category: "habits" },
    { userId, bookTitle: "Atomic Habits", principle: "Identity-Based Habits", explanation: "Focus on who you want to become, not what you want to achieve.", application: "Write identity statements: 'I am the type of person who...'", category: "habits" },
    { userId, bookTitle: "Atomic Habits", principle: "The 4 Laws of Behavior Change", explanation: "Make it Obvious, Attractive, Easy, Satisfying. Invert to break bad habits.", application: "Use the Habit Forge 4-Laws wizard for every habit.", category: "habits" },
    { userId, bookTitle: "Deep Work", principle: "Deep Work Hypothesis", explanation: "The ability to perform deep work is becoming increasingly rare and valuable.", application: "Use Focus Shield for daily distraction-free blocks.", category: "focus" },
    { userId, bookTitle: "Deep Work", principle: "Embrace Boredom", explanation: "Don't take breaks from distraction. Take breaks from focus.", application: "Use the I'm Tempted button instead of giving in.", category: "focus" },
    { userId, bookTitle: "The Psychology of Money", principle: "Compounding", explanation: "Biggest returns come from consistent, long-term effort — not big one-time wins.", application: "Think of habits as compound interest for your brain.", category: "money" },
    { userId, bookTitle: "The Psychology of Money", principle: "Tail Events", explanation: "A few decisions drive the majority of your outcomes.", application: "Use Clarity Engine to identify highest-leverage actions.", category: "money" },
    { userId, bookTitle: "Thinking, Fast and Slow", principle: "System 1 vs System 2", explanation: "Your brain has two systems: fast/intuitive and slow/deliberate.", application: "Use Evening Reflection to catch System 1 errors.", category: "mindset" },
    { userId, bookTitle: "The 7 Habits", principle: "Begin With The End In Mind", explanation: "Define your destination before you start the journey.", application: "Use Clarity Engine to define your optimal path.", category: "mindset" },
    { userId, bookTitle: "The 7 Habits", principle: "Put First Things First", explanation: "Spend time on what's important, not just what's urgent.", application: "Focus on Quadrant 2 activities in your daily planning.", category: "mindset" },
  ];

  for (const w of wisdomData) {
    await prisma.bookWisdom.create({ data: w });
  }
  console.log(`📚 Seeded ${wisdomData.length} book wisdom entries`);

  // ── Seed Challenges ──
  const challengeData = [
    { userId, title: "7 Days Without Reels", description: "Eliminate Instagram Reels and YouTube Shorts for a full week. Reclaim your dopamine baseline.", duration: 7, category: "distraction" },
    { userId, title: "14 Days of Deep Work", description: "Complete at least one 45-minute deep work session every day for two weeks.", duration: 14, category: "focus" },
    { userId, title: "21-Day Habit Streak", description: "Complete all your daily habits without missing a single day for 21 days.", duration: 21, category: "habits" },
    { userId, title: "7-Day Clarity Sprint", description: "Decompose one problem in the Clarity Engine every day for a week.", duration: 7, category: "clarity" },
    { userId, title: "14-Day Reading Challenge", description: "Read at least 10 pages every day for two weeks. No excuses.", duration: 14, category: "learning" },
    { userId, title: "7-Day Phone Detox", description: "No phone for the first 2 hours after waking up. Protect your morning brain.", duration: 7, category: "distraction" },
  ];

  for (const c of challengeData) {
    await prisma.challenge.create({ data: c });
  }
  console.log(`⚡ Seeded ${challengeData.length} challenges`);

  console.log("✅ NeuroForge database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
