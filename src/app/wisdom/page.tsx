"use client";

import { BookOpen, ChevronDown, ChevronUp, MessageSquare, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const books = [
  {
    title: "Atomic Habits", author: "James Clear", category: "habits",
    principles: [
      { name: "The 1% Rule", text: "Get 1% better every day. Small habits compound into remarkable results over time.", application: "Track daily micro-improvements in NeuroScore." },
      { name: "Identity-Based Habits", text: "Focus on who you want to become, not what you want to achieve.", application: "Write identity statements for each habit: 'I am the type of person who...'" },
      { name: "The 4 Laws", text: "Make it Obvious, Attractive, Easy, Satisfying. Invert them to break bad habits.", application: "Use the Habit Forge 4-Laws wizard for every new habit." },
    ],
  },
  {
    title: "Deep Work", author: "Cal Newport", category: "focus",
    principles: [
      { name: "Deep Work Hypothesis", text: "The ability to perform deep work is becoming increasingly rare and increasingly valuable.", application: "Use Focus Shield for distraction-free blocks every day." },
      { name: "Embrace Boredom", text: "Don't take breaks from distraction. Take breaks from focus.", application: "When tempted, use the I'm Tempted button instead of giving in." },
    ],
  },
  {
    title: "Psychology of Money", author: "Morgan Housel", category: "money",
    principles: [
      { name: "Compounding", text: "The biggest returns come from consistent, long-term effort — not big one-time wins.", application: "Think of habits as compound interest for your brain." },
      { name: "Tail Events", text: "A few decisions drive the majority of your outcomes.", application: "Use Clarity Engine to identify your highest-leverage actions." },
    ],
  },
  {
    title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "mindset",
    principles: [
      { name: "System 1 vs System 2", text: "Your brain has two systems: fast/intuitive and slow/deliberate. Most mistakes come from using the wrong one.", application: "Use Evening Reflection to catch System 1 errors in your day." },
      { name: "Focusing Illusion", text: "Nothing is as important as you think it is while you are thinking about it.", application: "Step back. Use the Clarity Engine to get objective perspective." },
    ],
  },
];

const categoryColors: Record<string, string> = {
  habits: "bg-nf-success/10 text-nf-success",
  focus: "bg-nf-primary-container/10 text-nf-primary-container",
  money: "bg-nf-warning/10 text-nf-warning",
  mindset: "bg-violet-500/10 text-violet-400",
};

export default function WisdomPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-nf-primary-container" />
          <h1 className="text-2xl font-bold tracking-tight">Book Wisdom</h1>
        </div>
        <p className="text-sm text-nf-text-dim">LEARN THE FRAMEWORKS. TEACH THEM BACK. OWN THE KNOWLEDGE.</p>
      </div>

      <div className="space-y-4 stagger-children">
        {books.map((book) => (
          <div key={book.title} className="glass-card-solid overflow-hidden">
            <button onClick={() => setExpanded(expanded === book.title ? null : book.title)} className="w-full p-5 flex items-center justify-between text-left">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold">{book.title}</h3>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", categoryColors[book.category])}>{book.category}</span>
                </div>
                <p className="text-xs text-nf-text-dim">{book.author} • {book.principles.length} principles</p>
              </div>
              {expanded === book.title ? <ChevronUp className="w-5 h-5 text-nf-text-dim" /> : <ChevronDown className="w-5 h-5 text-nf-text-dim" />}
            </button>

            {expanded === book.title && (
              <div className="px-5 pb-5 space-y-3 animate-fade-in">
                {book.principles.map((p) => (
                  <div key={p.name} className="bg-nf-surface-high/30 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-nf-primary mb-1">{p.name}</h4>
                    <p className="text-sm text-nf-text-muted mb-2">{p.text}</p>
                    <div className="flex items-start gap-2 mt-2 p-2 bg-nf-surface/50 rounded">
                      <Sparkles className="w-3.5 h-3.5 text-nf-primary-container mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-nf-text-dim"><span className="font-medium text-nf-text-muted">Apply:</span> {p.application}</p>
                    </div>
                  </div>
                ))}
                <button className="btn-ghost w-full inline-flex items-center justify-center gap-2 text-sm mt-2">
                  <MessageSquare className="w-4 h-4" />Teach Back — Test My Understanding
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
