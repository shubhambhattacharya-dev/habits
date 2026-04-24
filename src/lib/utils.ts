import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the current time-of-day phase for contextual UI
 */
export function getTimePhase(): "morning" | "day" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/**
 * Format a duration in seconds to "Xh Ym" or "Xm Ys"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

/**
 * Calculate streak from an array of dates
 */
export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates]
    .map((d) => new Date(d).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (sorted[i] === expected.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * NeuroScore color based on value (0-1000)
 */
export function getScoreColor(score: number): string {
  if (score >= 800) return "text-emerald-400";
  if (score >= 600) return "text-violet-400";
  if (score >= 400) return "text-amber-400";
  return "text-red-400";
}

export function getScoreGradient(score: number): string {
  if (score >= 800) return "from-emerald-500 to-emerald-300";
  if (score >= 600) return "from-violet-500 to-violet-300";
  if (score >= 400) return "from-amber-500 to-amber-300";
  return "from-red-500 to-red-300";
}
