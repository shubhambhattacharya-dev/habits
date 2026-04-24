"use client";

import { Flame, Plus, Check, X, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getHabits, toggleHabitCompletion } from "@/actions/habits";

interface Habit {
  id: string;
  name: string;
  identityStatement: string | null;
  category: string;
  streak: number;
  completedToday: boolean;
  cue: string | null;
  craving: string | null;
  response: string | null;
  reward: string | null;
}

const categoryColors: Record<string, string> = {
  productivity: "text-nf-primary-container bg-nf-primary-container/10",
  learning: "text-nf-success bg-nf-success/10",
  mindset: "text-nf-warning bg-nf-warning/10",
  health: "text-emerald-400 bg-emerald-400/10",
};

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data as Habit[]);
    } catch (err) {
      console.error("Failed to load habits", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (id: string) => {
    // Optimistic UI update
    setHabits((prev) => prev.map((h) => h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : h.streak - 1 } : h));
    
    // Server update
    await toggleHabitCompletion(id);
  };

  const completed = habits.filter((h) => h.completedToday).length;
  const total = habits.length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-6 h-6 text-nf-success" />
            <h1 className="text-2xl font-bold tracking-tight">Habit Forge</h1>
          </div>
          <p className="text-sm text-nf-text-dim">BUILD YOUR IDENTITY, ONE ATOMIC HABIT AT A TIME</p>
        </div>
        <button id="btn-new-habit" onClick={() => setShowForm(!showForm)} className="btn-primary inline-flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />New Habit
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-nf-primary-container animate-spin" />
        </div>
      ) : habits.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-sm text-nf-text-dim mb-4">You haven't forged any habits yet.</p>
          <button id="btn-create-first-habit" onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />Create Your First Habit
          </button>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="tech-label">TODAY&apos;S PROGRESS</span>
              <span className="text-sm font-mono font-bold text-nf-text">{completed}/{total}</span>
            </div>
            <div className="w-full h-2 bg-nf-surface-high rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-nf-primary-deep to-nf-success rounded-full transition-all duration-500" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-nf-text-dim mt-2">
              {completed === total && total > 0 ? "🔥 All habits complete! Your identity is being forged." : `${total - completed} habits remaining. Keep going.`}
            </p>
          </div>

          {/* New Habit Form */}
          {showForm && (
            <div className="glass-card-solid p-6 border border-nf-primary-container/30 animate-fade-in relative">
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-nf-text-dim hover:text-nf-text">
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-bold mb-4">Forge a New Habit</h2>
              <form action={async (formData) => {
                setIsLoading(true);
                const name = formData.get("name") as string;
                if (!name) return;
                await import("@/actions/habits").then(m => m.createHabit({
                  name,
                  identityStatement: formData.get("identityStatement") as string,
                  category: formData.get("category") as string,
                  cue: formData.get("cue") as string,
                  craving: formData.get("craving") as string,
                  response: formData.get("response") as string,
                  reward: formData.get("reward") as string,
                }));
                setShowForm(false);
                await loadHabits();
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-nf-text-muted">Habit Name</label>
                    <input name="name" type="text" required placeholder="e.g., 30 min Deep Work" className="w-full bg-nf-surface-high border border-nf-outline rounded-md px-3 py-2 text-sm text-nf-text focus:outline-none focus:border-nf-primary-container" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-nf-text-muted">Category</label>
                    <select name="category" className="w-full bg-nf-surface-high border border-nf-outline rounded-md px-3 py-2 text-sm text-nf-text focus:outline-none focus:border-nf-primary-container appearance-none">
                      <option value="productivity">Productivity</option>
                      <option value="learning">Learning</option>
                      <option value="mindset">Mindset</option>
                      <option value="health">Health</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-nf-text-muted">Identity Statement</label>
                  <input name="identityStatement" type="text" placeholder="e.g., I am a focused engineer" className="w-full bg-nf-surface-high border border-nf-outline rounded-md px-3 py-2 text-sm text-nf-text focus:outline-none focus:border-nf-primary-container" />
                </div>
                
                <div className="pt-2 border-t border-nf-outline-dim mt-2">
                  <span className="tech-label mb-2 block">THE 4 LAWS (OPTIONAL)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <input name="cue" type="text" placeholder="Cue: Make it obvious" className="w-full bg-nf-surface-high border border-nf-outline rounded-md px-3 py-2 text-xs text-nf-text focus:outline-none focus:border-nf-primary-container" />
                    <input name="craving" type="text" placeholder="Craving: Make it attractive" className="w-full bg-nf-surface-high border border-nf-outline rounded-md px-3 py-2 text-xs text-nf-text focus:outline-none focus:border-nf-primary-container" />
                    <input name="response" type="text" placeholder="Response: Make it easy" className="w-full bg-nf-surface-high border border-nf-outline rounded-md px-3 py-2 text-xs text-nf-text focus:outline-none focus:border-nf-primary-container" />
                    <input name="reward" type="text" placeholder="Reward: Make it satisfying" className="w-full bg-nf-surface-high border border-nf-outline rounded-md px-3 py-2 text-xs text-nf-text focus:outline-none focus:border-nf-primary-container" />
                  </div>
                </div>
                
                <button type="submit" id="btn-submit-habit" className="w-full btn-primary py-2 mt-2">
                  Forge Habit
                </button>
              </form>
            </div>
          )}

          {/* Habit Cards */}
          <div className="space-y-3 stagger-children">
            {habits.map((habit) => (
              <div key={habit.id} className={cn("glass-card-solid transition-all duration-300", habit.completedToday && "opacity-70")}>
                <div className="p-5 flex items-center gap-4">
                  <button onClick={() => toggleComplete(habit.id)} className={cn("w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0", habit.completedToday ? "bg-nf-success/20 border-nf-success text-nf-success" : "border-nf-outline hover:border-nf-primary-container")}>
                    {habit.completedToday && <Check className="w-4 h-4" />}
                  </button>

                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedId(expandedId === habit.id ? null : habit.id)}>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn("text-sm font-semibold", habit.completedToday && "line-through text-nf-text-dim")}>{habit.name}</h3>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", categoryColors[habit.category] || categoryColors.productivity)}>{habit.category}</span>
                    </div>
                    {habit.identityStatement && <p className="text-xs text-nf-text-dim italic">&quot;{habit.identityStatement}&quot;</p>}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-nf-warning" />
                      <span className="text-sm font-bold font-mono text-nf-warning">{habit.streak}</span>
                    </div>
                    <span className="tech-label">STREAK</span>
                  </div>
                </div>

                {/* Expanded: 4 Laws */}
                {expandedId === habit.id && (
                  <div className="px-5 pb-5 pt-2 border-t border-nf-outline-dim grid grid-cols-4 gap-3 animate-fade-in">
                    {[
                      { law: "1. CUE", value: habit.cue || "Not set", sub: "Make it obvious" },
                      { law: "2. CRAVING", value: habit.craving || "Not set", sub: "Make it attractive" },
                      { law: "3. RESPONSE", value: habit.response || "Not set", sub: "Make it easy" },
                      { law: "4. REWARD", value: habit.reward || "Not set", sub: "Make it satisfying" },
                    ].map((l) => (
                      <div key={l.law} className="bg-nf-surface-high/50 rounded-lg p-3">
                        <span className="tech-label text-nf-primary-container">{l.law}</span>
                        <p className="text-xs text-nf-text mt-1">{l.value}</p>
                        <p className="text-[10px] text-nf-text-dim mt-1 italic">{l.sub}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="glass-card-solid p-4 text-center">
        <p className="text-[10px] text-nf-text-dim">FRAMEWORK: THE 4 LAWS OF BEHAVIOR CHANGE — ATOMIC HABITS (JAMES CLEAR)</p>
      </div>
    </div>
  );
}
