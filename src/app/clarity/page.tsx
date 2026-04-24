"use client";

import { Brain, Send, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DecomposedTask {
  id: string;
  title: string;
  priority: "critical" | "high" | "medium" | "low";
  urgency: number;
  impact: number;
  estimatedTime: string;
  steps: string[];
  completed: boolean;
}

const priorityColors: Record<string, string> = {
  critical: "text-nf-error border-nf-error/30 bg-nf-error/5",
  high: "text-nf-warning border-nf-warning/30 bg-nf-warning/5",
  medium: "text-nf-primary border-nf-primary/30 bg-nf-primary/5",
  low: "text-nf-text-dim border-nf-outline-dim bg-nf-surface-high/30",
};

export default function ClarityPage() {
  const [problem, setProblem] = useState("");
  const [tasks, setTasks] = useState<DecomposedTask[]>([]);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDecompose = async () => {
    if (!problem.trim()) return;
    setIsDecomposing(true);
    setHasResult(false);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/ai/clarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });

      if (!res.ok) {
        if (res.status === 500) {
           setErrorMsg("AI service unavailable. Did you forget to set GROQ_API_KEY in .env?");
        } else {
           setErrorMsg("AI request failed. Please try again.");
        }
        throw new Error("AI request failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
      }

      // Try to extract JSON from the response
      const jsonMatch = fullText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setTasks(
          parsed.map((t: DecomposedTask, i: number) => ({
            ...t,
            id: String(i + 1),
            completed: false,
          }))
        );
        setHasResult(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      // Don't set fallback data immediately, show error to user so they know they need an API key
      console.error(err);
      if (!errorMsg) setErrorMsg("Could not decompose the problem. Ensure GROQ_API_KEY is set.");
    } finally {
      setIsDecomposing(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-nf-primary-container" />
          <h1 className="text-2xl font-bold tracking-tight">Clarity Engine</h1>
        </div>
        <p className="text-sm text-nf-text-dim">BREAK YOUR CHAOS INTO CLARITY</p>
      </div>

      {/* Input */}
      <div className="glass-card p-6 border-nf-outline">
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="I want to get a backend developer job but I don't know where to start..."
          className="neural-input min-h-[100px] resize-none mb-4"
          rows={3}
        />
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-nf-error/10 border border-nf-error/30 rounded-md text-nf-error text-sm">
            {errorMsg}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <p className="tech-label">
            {isDecomposing ? "NEURAL PROCESSING..." : "POWERED BY GROQ LLAMA 3.3 70B"}
          </p>
          <button
            id="btn-decompose"
            onClick={handleDecompose}
            disabled={!problem.trim() || isDecomposing}
            className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {isDecomposing ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Decomposing...</>
            ) : (
              <><Send className="w-4 h-4" />DECOMPOSE</>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {hasResult && (
        <div className="space-y-4 stagger-children">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-nf-primary-container" />
            <span className="tech-label">OPTIMAL PATH GENERATED</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div key={task.id} className={cn("glass-card-solid p-5 transition-all duration-300", task.completed && "opacity-50")}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold mb-1">{task.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", priorityColors[task.priority])}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-nf-text-dim">
                        URG: {task.urgency} • IMP: {task.impact}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-nf-text-dim font-mono">{task.estimatedTime}</span>
                </div>

                <div className="space-y-1.5">
                  {task.steps.map((step, i) => (
                    <label key={i} className="flex items-start gap-2 text-sm text-nf-text-muted cursor-pointer group">
                      <input type="checkbox" className="mt-1 accent-nf-primary-container" onChange={() => toggleTask(task.id)} />
                      <span className="group-hover:text-nf-text transition-colors">{step}</span>
                    </label>
                  ))}
                </div>

                {task.completed && (
                  <div className="mt-3 flex items-center gap-1.5 text-nf-success text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />Completed
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button className="btn-primary px-8 py-3 neural-glow inline-flex items-center gap-2 text-base">
              <Sparkles className="w-5 h-5" />WHAT SHOULD I DO RIGHT NOW?
            </button>
          </div>

          <p className="text-center text-[10px] text-nf-text-dim">
            FRAMEWORK: FIRST THINGS FIRST (COVEY) + TWO-MINUTE RULE (CLEAR)
          </p>
        </div>
      )}
    </div>
  );
}
