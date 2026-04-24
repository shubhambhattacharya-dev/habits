"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getAuthUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded?.userId || null;
}

// ── GET ALL CHALLENGES ──
export async function getChallenges() {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Unauthorized");

    const challenges = await db.challenge.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        progress: {
          where: { userId }
        }
      }
    });

    return challenges.map(ch => {
      const userProgress = ch.progress[0];
      return {
        ...ch,
        status: userProgress ? (userProgress.completedAt ? "completed" : "active") : "available",
        currentProgress: userProgress?.currentDay || 0,
      };
    });
  } catch (error) {
    console.error("Failed to get challenges:", error);
    return [];
  }
}

// ── START CHALLENGE ──
export async function startChallenge(challengeId: string) {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Unauthorized");

    await db.challengeProgress.create({
      data: {
        userId,
        challengeId,
        currentDay: 0,
      }
    });
    revalidatePath("/challenges");
    return { success: true };
  } catch (error) {
    console.error("Failed to start challenge:", error);
    return { success: false, error: "Failed to start challenge" };
  }
}

// ── LOG PROGRESS ──
export async function logChallengeProgress(challengeId: string) {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Unauthorized");

    const progress = await db.challengeProgress.findFirst({
      where: { userId, challengeId, completedAt: null }
    });

    if (!progress) return { success: false, error: "Challenge not active" };

    const challenge = await db.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) return { success: false, error: "Challenge not found" };

    const newDay = progress.currentDay + 1;
    const isCompleted = newDay >= challenge.durationDays;

    await db.challengeProgress.update({
      where: { id: progress.id },
      data: {
        currentDay: newDay,
        lastLoggedAt: new Date(),
        ...(isCompleted && { completedAt: new Date() })
      }
    });

    revalidatePath("/challenges");
    return { success: true };
  } catch (error) {
    console.error("Failed to log progress:", error);
    return { success: false, error: "Failed to log progress" };
  }
}
