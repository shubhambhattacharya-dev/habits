"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ── START FOCUS SESSION ──
export async function startFocusSession(data: {
  plannedDuration: number;
  sessionType?: string;
  taskDescription?: string;
}) {
  try {
    const session = await db.focusSession.create({
      data: {
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
    const session = await db.focusSession.update({
      where: { id: sessionId },
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
      where: { id: data.sessionId },
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = await db.focusSession.findMany({
      where: { startedAt: { gte: today } },
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
