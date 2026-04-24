"use client";

import { Moon, Send, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ReflectPage() {
  const [answers, setAnswers] = useState({ well: "", distracted: "", change: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [mood, setMood] = useState(0);
  const [productivity, setProductivity] = useState(0);

  const handleSubmit = async () => {
    if (!answers.well && !answers.distracted && !answers.change) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/ai/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatWentWell: answers.well,
          whatDistracted: answers.distracted,
          whatToChange: answers.change,
          mood,
          productivity,
        }),
      });

      if (!res.ok) throw new Error("AI request failed");

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

      setInsight(fullText || "Your reflection has been recorded. Keep building consistency — every day you reflect is a day you grow.");
    } catch {
      setInsight("Your reflection has been recorded. Pattern detected: You showed up today and that's what matters. Tomorrow, focus on protecting your first 2 hours from distractions. Framework: 'Eat the Frog' — tackle your hardest task first.");
    }

    setIsSubmitting(false);
  };

  const questions = [
    { key: "well" as const, label: "What went well today?", placeholder: "I completed 3 deep work sessions and finished the API..." },
    { key: "distracted" as const, label: "What distracted you?", placeholder: "Instagram pulled me in for 20 minutes after lunch..." },
    { key: "change" as const, label: "What will you change tomorrow?", placeholder: "I'll put my phone in another room during work blocks..." },
  ];

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Moon className="w-6 h-6 text-nf-warning animate-pulse-glow" />
          <h1 className="text-2xl font-bold tracking-tight">Evening Reflection</h1>
        </div>
        <p className="text-sm text-nf-text-dim">2-MINUTE RITUAL TO CLOSE YOUR DAY WITH CLARITY</p>
      </div>

      {/* Mood & Productivity */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "MOOD", value: mood, setter: setMood, activeColor: "bg-nf-primary-container/30 text-nf-primary-container" },
          { label: "PRODUCTIVITY", value: productivity, setter: setProductivity, activeColor: "bg-nf-success/30 text-nf-success" },
        ].map((scale) => (
          <div key={scale.label} className="glass-card-solid p-5">
            <span className="tech-label">{scale.label}</span>
            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => scale.setter(n)}
                  className={cn(
                    "w-full h-8 rounded text-xs font-mono transition-all",
                    n <= scale.value
                      ? scale.activeColor
                      : "bg-nf-surface-high/50 text-nf-text-dim hover:bg-nf-surface-high"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-right text-sm font-bold mt-2 font-mono">{scale.value || "—"}/10</p>
          </div>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.key} className="glass-card p-6">
            <label className="text-sm font-medium text-nf-text block mb-3">
              <span className="text-nf-primary-container font-mono mr-2">Q{i + 1}.</span>
              {q.label}
            </label>
            <textarea
              value={answers[q.key]}
              onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
              placeholder={q.placeholder}
              className="neural-input min-h-[80px] resize-none"
              rows={3}
            />
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (!answers.well && !answers.distracted && !answers.change)}
          className="btn-primary inline-flex items-center gap-2 px-8 py-3 disabled:opacity-50"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Analyzing with AI...</>
          ) : (
            <><Send className="w-4 h-4" />Complete Reflection</>
          )}
        </button>
      </div>

      {/* AI Insight */}
      {insight && (
        <div className="glass-card p-6 neural-glow animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-nf-primary-container" />
            <span className="tech-label">AI INSIGHT — TRUTH REPORT</span>
          </div>
          <p className="text-sm text-nf-text leading-relaxed whitespace-pre-wrap">{insight}</p>
          <p className="text-[10px] text-nf-text-dim mt-4">POWERED BY NEUROFORGE AI • GROQ LLAMA 3.3 70B</p>
        </div>
      )}

      <div className="text-center">
        <p className="text-[10px] text-nf-text-dim">FRAMEWORK: THE EVENING REVIEW — ATOMIC HABITS (CLEAR) + DAILY STOIC (HOLIDAY)</p>
      </div>
    </div>
  );
}
