"use client";

import { Zap, Play, CheckCircle2, Clock, Trophy, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getChallenges, startChallenge, logChallengeProgress } from "@/actions/challenges";

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  status: "available" | "active" | "completed";
  currentProgress: number;
}

const statusIcons = { available: Play, active: Clock, completed: CheckCircle2 };

export default function ChallengesPage() {
  const [filter, setFilter] = useState<"all" | "available" | "active" | "completed">("all");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setIsLoading(true);
      const data = await getChallenges();
      // Map database names to UI expectations
      const formatted = data.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description || "",
        duration: d.duration,
        category: d.category,
        status: d.status as "available" | "active" | "completed",
        currentProgress: d.currentProgress,
      }));
      setChallenges(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = async (id: string) => {
    setIsLoading(true);
    await import("@/actions/challenges").then(m => m.startChallenge(id));
    await loadChallenges();
  };

  const handleLog = async (id: string) => {
    setIsLoading(true);
    await import("@/actions/challenges").then(m => m.logChallengeProgress(id));
    await loadChallenges();
  };

  const filtered = filter === "all" ? challenges : challenges.filter((c) => c.status === filter);
  const completedCount = challenges.filter(c => c.status === "completed").length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-nf-warning" />
            <h1 className="text-2xl font-bold tracking-tight">Rewire Challenges</h1>
          </div>
          <p className="text-sm text-nf-text-dim">STRUCTURED PROGRAMS TO BREAK BAD PATTERNS</p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-nf-warning" />
          <span className="text-sm font-mono font-bold text-nf-warning">{completedCount} Completed</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "available", "active", "completed"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("neural-chip cursor-pointer", filter === f && "active")}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Challenge Cards */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-nf-warning animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 stagger-children">
          {filtered.map((ch) => {
            const StatusIcon = statusIcons[ch.status];
            return (
              <div key={ch.id} className={cn("glass-card-solid p-5 transition-all duration-300 hover:-translate-y-1", ch.status === "completed" && "opacity-70")}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={cn("w-4 h-4", ch.status === "active" ? "text-nf-primary-container" : ch.status === "completed" ? "text-nf-success" : "text-nf-text-dim")} />
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-nf-primary bg-nf-primary/10">{ch.category}</span>
                  </div>
                  <span className="tech-label">{ch.duration} DAYS</span>
                </div>

                <h3 className="text-base font-semibold mb-2">{ch.title}</h3>
                <p className="text-xs text-nf-text-muted mb-4 leading-relaxed">{ch.description}</p>

                {/* Progress */}
                {ch.status !== "available" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-nf-text-dim mb-1">
                      <span>Day {ch.currentProgress}/{ch.duration}</span>
                      <span>{Math.round((ch.currentProgress / ch.duration) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-nf-surface-high rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", ch.status === "completed" ? "bg-nf-success" : "bg-gradient-to-r from-nf-primary-deep to-nf-primary-container")} style={{ width: `${(ch.currentProgress / ch.duration) * 100}%` }} />
                    </div>
                  </div>
                )}

                <button 
                  id={ch.status === "available" ? `btn-start-challenge-${ch.id}` : ch.status === "active" ? `btn-log-challenge-${ch.id}` : undefined}
                  onClick={() => {
                    if (ch.status === "available") handleStart(ch.id);
                    if (ch.status === "active") handleLog(ch.id);
                  }}
                  disabled={ch.status === "completed"}
                  className={cn("w-full text-sm py-2 rounded-lg transition-all", ch.status === "available" ? "btn-primary" : ch.status === "active" ? "btn-ghost" : "btn-ghost opacity-50 cursor-default")}
                >
                  {ch.status === "available" ? "Start Challenge" : ch.status === "active" ? "Log Today" : "Completed ✓"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="glass-card-solid p-4 text-center">
        <p className="text-[10px] text-nf-text-dim">FRAMEWORK: THE 21/90 RULE — IT TAKES 21 DAYS TO BUILD A HABIT, 90 DAYS TO BUILD A LIFESTYLE</p>
      </div>
    </div>
  );
}
