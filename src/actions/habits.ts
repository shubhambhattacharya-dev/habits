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

// ── GET ALL HABITS ──
export async function getHabits() {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Unauthorized");

    const habits = await db.habit.findMany({
      where: { isActive: true, userId },
      include: {
        completions: {
          where: {
            completedAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return habits.map((h) => ({
      ...h,
      completedToday: h.completions.length > 0,
      streak: 0, // Will calculate properly
    }));
  } catch (error) {
    console.error("Failed to get habits:", error);
    return [];
  }
}

// ── CREATE HABIT ──
export async function createHabit(data: {
  name: string;
  identityStatement?: string;
  cue?: string;
  craving?: string;
  response?: string;
  reward?: string;
  category?: string;
  difficulty?: string;
}) {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Unauthorized");

    const habit = await db.habit.create({
      data: {
        userId: userId,
        name: data.name,
        identityStatement: data.identityStatement || null,
        cue: data.cue || null,
        craving: data.craving || null,
        response: data.response || null,
        reward: data.reward || null,
        category: data.category || "productivity",
        difficulty: data.difficulty || "easy",
      },
    });
    revalidatePath("/habits");
    return { success: true, habit };
  } catch (error) {
    console.error("Failed to create habit:", error);
    return { success: false, error: "Failed to create habit" };
  }
}

// ── TOGGLE HABIT COMPLETION ──
export async function toggleHabitCompletion(habitId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await db.habitCompletion.findFirst({
      where: {
        habitId,
        completedAt: { gte: today },
      },
    });

    if (existing) {
      await db.habitCompletion.delete({ where: { id: existing.id } });
    } else {
      await db.habitCompletion.create({
        data: { habitId },
      });
    }

    revalidatePath("/habits");
    return { success: true, completed: !existing };
  } catch (error) {
    console.error("Failed to toggle habit:", error);
    return { success: false, error: "Failed to toggle habit" };
  }
}

// ── DELETE HABIT ──
export async function deleteHabit(habitId: string) {
  try {
    await db.habit.update({
      where: { id: habitId },
      data: { isActive: false },
    });
    revalidatePath("/habits");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete habit:", error);
    return { success: false, error: "Failed to delete habit" };
  }
}

// ── GET HABIT STREAK ──
export async function getHabitStreak(habitId: string): Promise<number> {
  try {
    const completions = await db.habitCompletion.findMany({
      where: { habitId },
      orderBy: { completedAt: "desc" },
      select: { completedAt: true },
    });

    if (completions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toDateString();

      const hasCompletion = completions.some(
        (c) => new Date(c.completedAt).toDateString() === dateStr
      );

      if (hasCompletion) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  } catch {
    return 0;
  }
}
