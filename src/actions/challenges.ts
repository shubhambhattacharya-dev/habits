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
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: {
        dailyLogs: true
      }
    });

    return challenges.map(ch => {
      const userProgress = ch.dailyLogs[0];
      return {
        ...ch,
        status: userProgress?.completed ? "completed" : userProgress ? "active" : "available",
        currentProgress: userProgress?.dayNumber || 0,
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

    const challenge = await db.challenge.findUnique({
      where: { id: challengeId, userId },
      include: { dailyLogs: true }
    });
    if (!challenge) return { success: false, error: "Challenge not found" };

    await db.challengeDayLog.create({
      data: {
        challengeId,
        dayNumber: 1,
        completed: true,
      }
    });
    await db.challenge.update({
      where: { id: challengeId, userId },
      data: { status: "active", startedAt: new Date() }
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

    const challenge = await db.challenge.findUnique({
      where: { id: challengeId, userId },
      include: { dailyLogs: true }
    });
    if (!challenge) return { success: false, error: "Challenge not found" };

    const existingLogs = challenge.dailyLogs.length;
    const newDay = existingLogs + 1;
    const isCompleted = newDay >= challenge.duration;

    await db.challengeDayLog.create({
      data: {
        challengeId,
        dayNumber: newDay,
        completed: true,
      }
    });

    if (isCompleted) {
      await db.challenge.update({
        where: { id: challengeId, userId },
        data: { status: "completed" }
      });
    }

    revalidatePath("/challenges");
    return { success: true };
  } catch (error) {
    console.error("Failed to log progress:", error);
    return { success: false, error: "Failed to log progress" };
  }
}
