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

// ── START FOCUS SESSION ──
export async function startFocusSession(data: {
  plannedDuration: number;
  sessionType?: string;
  taskDescription?: string;
}) {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Unauthorized");

    const session = await db.focusSession.create({
      data: {
        userId,
        plannedDuration: data.plannedDuration,
        sessionType: data.sessionType || "deep",
        taskDescription: data.taskDescription || null,
      },
    });
    revalidatePath("/focus");
    return { success: true, session };
  } catch (error) {
    console.error("Failed to start focus session:", error);
    return { success: false, error: "Failed to start session" };
  }
}

// ── END FOCUS SESSION ──
export async function endFocusSession(
  sessionId: string,
  data: { actualDuration: number; focusScore: number; completed: boolean }
) {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Unauthorized");

    const session = await db.focusSession.update({
      where: { id: sessionId, userId },
      data: {
        endedAt: new Date(),
        actualDuration: data.actualDuration,
        focusScore: data.focusScore,
        completed: data.completed,
      },
    });
    revalidatePath("/focus");
    return { success: true, session };
  } catch (error) {
    console.error("Failed to end focus session:", error);
    return { success: false, error: "Failed to end session" };
  }
}

// ── LOG DISTRACTION ──
export async function logDistraction(data: {
  sessionId: string;
  source: string;
  resisted: boolean;
  note?: string;
}) {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Unauthorized");

    // Verify session belongs to user
    const session = await db.focusSession.findUnique({
      where: { id: data.sessionId, userId }
    });
    if (!session) throw new Error("Session not found");

    await db.distraction.create({
      data: {
        sessionId: data.sessionId,
        source: data.source,
        resisted: data.resisted,
        note: data.note || null,
      },
    });

    // Increment distraction count on session
    await db.focusSession.update({
      where: { id: data.sessionId, userId },
      data: { distractionCount: { increment: 1 } },
    });

    revalidatePath("/focus");
    return { success: true };
  } catch (error) {
    console.error("Failed to log distraction:", error);
    return { success: false, error: "Failed to log distraction" };
  }
}

// ── GET TODAY'S FOCUS STATS ──
export async function getTodayFocusStats() {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Unauthorized");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = await db.focusSession.findMany({
      where: { userId, startedAt: { gte: today } },
      include: { distractions: true },
    });

    const deepMinutes = sessions
      .filter((s) => s.sessionType === "deep" && s.actualDuration)
      .reduce((sum, s) => sum + (s.actualDuration || 0), 0);

    const shallowMinutes = sessions
      .filter((s) => s.sessionType === "shallow" && s.actualDuration)
      .reduce((sum, s) => sum + (s.actualDuration || 0), 0);

    const totalDistractions = sessions.reduce(
      (sum, s) => sum + s.distractionCount,
      0
    );

    const completedSessions = sessions.filter((s) => s.completed).length;

    return {
      deepMinutes,
      shallowMinutes,
      totalDistractions,
      completedSessions,
      totalSessions: sessions.length,
    };
  } catch {
    return {
      deepMinutes: 0,
      shallowMinutes: 0,
      totalDistractions: 0,
      completedSessions: 0,
      totalSessions: 0,
    };
  }
}
