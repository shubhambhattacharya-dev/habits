"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ── SAVE REFLECTION ──
export async function saveReflection(data: {
  whatWentWell: string;
  whatDistracted: string;
  whatToChange: string;
  overallMood: number;
  productivityScore: number;
  aiInsight?: string;
}) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reflection = await db.dailyReflection.upsert({
      where: { date: today },
      update: {
        whatWentWell: data.whatWentWell,
        whatDistracted: data.whatDistracted,
        whatToChange: data.whatToChange,
        overallMood: data.overallMood,
        productivityScore: data.productivityScore,
        aiInsight: data.aiInsight || null,
      },
      create: {
        date: today,
        whatWentWell: data.whatWentWell,
        whatDistracted: data.whatDistracted,
        whatToChange: data.whatToChange,
        overallMood: data.overallMood,
        productivityScore: data.productivityScore,
        aiInsight: data.aiInsight || null,
      },
    });

    revalidatePath("/reflect");
    return { success: true, reflection };
  } catch (error) {
    console.error("Failed to save reflection:", error);
    return { success: false, error: "Failed to save reflection" };
  }
}

// ── GET RECENT REFLECTIONS ──
export async function getRecentReflections(days: number = 7) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return await db.dailyReflection.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "desc" },
    });
  } catch {
    return [];
  }
}

// ── CALCULATE NEUROSCORE ──
export async function calculateNeuroScore() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Focus score (0-100): based on deep work minutes
    const sessions = await db.focusSession.findMany({
      where: { startedAt: { gte: today } },
    });
    const deepMinutes = sessions
      .filter((s) => s.sessionType === "deep" && s.actualDuration)
      .reduce((sum, s) => sum + (s.actualDuration || 0), 0);
    const focusScore = Math.min(100, Math.round((deepMinutes / 120) * 100));

    // Habit score (0-100): completion rate
    const habits = await db.habit.findMany({ where: { isActive: true } });
    const completions = await db.habitCompletion.findMany({
      where: { completedAt: { gte: today } },
    });
    const habitScore =
      habits.length > 0
        ? Math.round((completions.length / habits.length) * 100)
        : 0;

    // Reflection score (0-100): did you reflect today?
    const reflection = await db.dailyReflection.findFirst({
      where: { date: { gte: today } },
    });
    const reflectionScore = reflection ? 100 : 0;

    // Clarity score (0-100): active clarity sessions
    const claritySessions = await db.claritySession.findMany({
      where: { status: "active" },
    });
    const clarityScore = Math.min(100, claritySessions.length * 25);

    // Challenge score (0-100): active challenges progress
    const activeChallenges = await db.challenge.findMany({
      where: { status: "active" },
      include: { dailyLogs: true },
    });
    const challengeScore =
      activeChallenges.length > 0
        ? Math.round(
            activeChallenges.reduce((sum, c) => {
              const progress = c.dailyLogs.filter((l) => l.completed).length;
              return sum + (progress / c.duration) * 100;
            }, 0) / activeChallenges.length
          )
        : 0;

    // Total: weighted sum scaled to 0-1000
    const totalScore = Math.round(
      (focusScore * 3 +
        habitScore * 3 +
        reflectionScore * 1.5 +
        clarityScore * 1.5 +
        challengeScore * 1) *
        (1000 / 1000)
    );

    // Save to DB
    await db.neuroScoreEntry.create({
      data: {
        focusScore,
        habitScore,
        reflectionScore,
        clarityScore,
        challengeScore,
        totalScore: Math.min(1000, totalScore),
      },
    });

    revalidatePath("/");
    return {
      focusScore,
      habitScore,
      reflectionScore,
      clarityScore,
      challengeScore,
      totalScore: Math.min(1000, totalScore),
    };
  } catch (error) {
    console.error("Failed to calculate NeuroScore:", error);
    return {
      focusScore: 0,
      habitScore: 0,
      reflectionScore: 0,
      clarityScore: 0,
      challengeScore: 0,
      totalScore: 0,
    };
  }
}

// ── GET NEUROSCORE TREND ──
export async function getNeuroScoreTrend(days: number = 14) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return await db.neuroScoreEntry.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    });
  } catch {
    return [];
  }
}
