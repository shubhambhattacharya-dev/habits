"use client";

import { BookOpen, RefreshCw } from "lucide-react";
import { useState } from "react";

const wisdomEntries = [
  {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    book: "Atomic Habits",
    author: "James Clear",
    principle: "Systems > Goals",
  },
  {
    quote: "The ability to perform deep work is becoming increasingly rare and increasingly valuable. If you cultivate this skill, you'll thrive.",
    book: "Deep Work",
    author: "Cal Newport",
    principle: "Depth over Breadth",
  },
  {
    quote: "The psychology of money is not about being smart. It's about behavior. And behavior is hard to teach, even to really smart people.",
    book: "The Psychology of Money",
    author: "Morgan Housel",
    principle: "Behavior > Intelligence",
  },
  {
    quote: "Habit is the intersection of knowledge (what to do), skill (how to do), and desire (want to do).",
    book: "The 7 Habits",
    author: "Stephen Covey",
    principle: "Knowledge × Skill × Desire",
  },
  {
    quote: "Whenever you find yourself on the side of the majority, it is time to pause and reflect.",
    book: "Think and Grow Rich",
    author: "Napoleon Hill",
    principle: "Independent Thinking",
  },
  {
    quote: "Nothing in life is as important as you think it is, while you are thinking about it.",
    book: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    principle: "Focusing Illusion",
  },
];

export function DailyWisdom() {
  const [index, setIndex] = useState(
    () => Math.floor(Date.now() / 86400000) % wisdomEntries.length
  );
  const wisdom = wisdomEntries[index];

  const nextWisdom = () => {
    setIndex((prev) => (prev + 1) % wisdomEntries.length);
  };

  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-nf-primary-deep/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-nf-primary-container" />
            <span className="tech-label">TODAY&apos;S WISDOM</span>
          </div>
          <button
            onClick={nextWisdom}
            className="w-7 h-7 rounded-lg flex items-center justify-center
                       text-nf-text-dim hover:text-nf-text hover:bg-nf-surface-high/50
                       transition-all duration-200"
            aria-label="Next wisdom"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <blockquote className="text-sm text-nf-text leading-relaxed mb-4 italic">
          &ldquo;{wisdom.quote}&rdquo;
        </blockquote>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-nf-text-muted">
              {wisdom.book}
            </p>
            <p className="text-[10px] text-nf-text-dim">{wisdom.author}</p>
          </div>
          <span className="neural-chip active">{wisdom.principle}</span>
        </div>
      </div>
    </div>
  );
}
