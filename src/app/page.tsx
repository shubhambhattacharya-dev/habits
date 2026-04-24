"use client";

import { NeuroScoreRing } from "@/components/dashboard/neuro-score-ring";
import { StatCard } from "@/components/dashboard/stat-card";
import { DailyWisdom } from "@/components/dashboard/daily-wisdom";
import {
  Crosshair,
  Flame,
  Brain,
  Zap,
  Target,
  ArrowRight,
  Sun,
  Moon,
  CloudSun,
  Stars,
} from "lucide-react";
import { getTimePhase } from "@/lib/utils";
import Link from "next/link";

export default function HomePage() {
  const phase = getTimePhase();

  const getGreeting = () => {
    switch (phase) {
      case "morning":
        return { text: "Good Morning, Commander", icon: Sun, sub: "Time to forge your neural pathways" };
      case "day":
        return { text: "Stay Sharp, Commander", icon: CloudSun, sub: "Deep work mode activated" };
      case "evening":
        return { text: "Evening Protocol", icon: Moon, sub: "Time to reflect and recharge" };
      case "night":
        return { text: "Night Operations", icon: Stars, sub: "Rest is part of the process" };
    }
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <GreetingIcon className="w-6 h-6 text-nf-primary-container animate-pulse-glow" />
            <h1 className="text-2xl font-bold tracking-tight text-nf-text">
              {greeting.text}
            </h1>
          </div>
          <p className="text-sm text-nf-text-dim">{greeting.sub}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-nf-text-dim">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="tech-label mt-1">NEURAL LATENCY: 24ms</p>
        </div>
      </div>

      {/* ── Main Grid: NeuroScore + Stats ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* NeuroScore Ring */}
        <div className="col-span-4 glass-card p-8 flex flex-col items-center justify-center neural-glow">
          <NeuroScoreRing score={427} size={200} />
          <div className="mt-4 text-center">
            <p className="text-xs text-nf-text-dim">
              Your brain is <span className="text-nf-warning font-medium">building momentum</span>
            </p>
            <p className="text-[10px] text-nf-text-dim mt-1">
              +23 points from yesterday
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="col-span-8 grid grid-cols-2 gap-4">
          <StatCard
            label="FOCUS TIME TODAY"
            value="2h 47m"
            subtitle="3 deep work sessions"
            icon={Crosshair}
            trend="up"
            trendValue="34%"
            accentColor="violet"
          />
          <StatCard
            label="HABITS COMPLETED"
            value="4 / 6"
            subtitle="67% completion rate"
            icon={Flame}
            trend="up"
            trendValue="1 more"
            accentColor="emerald"
          />
          <StatCard
            label="CLARITY SESSIONS"
            value="2"
            subtitle="7 tasks decomposed"
            icon={Brain}
            trend="neutral"
            trendValue="same"
            accentColor="violet"
          />
          <StatCard
            label="CURRENT STREAK"
            value="5 days"
            subtitle="Longest: 12 days"
            icon={Zap}
            trend="up"
            trendValue="growing"
            accentColor="amber"
          />
        </div>
      </div>

      {/* ── One Thing + Wisdom ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* The One Thing */}
        <div className="col-span-7">
          <div className="glass-card p-6 relative overflow-hidden">
            {/* Background pulse */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-nf-primary-container/5 rounded-full blur-3xl animate-pulse-glow" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-nf-primary-container" />
                <span className="tech-label">YOUR ONE THING TODAY</span>
              </div>

              <h2 className="text-xl font-bold text-nf-text mb-2">
                Complete the NeuroForge Focus Shield module
              </h2>
              <p className="text-sm text-nf-text-muted mb-6 leading-relaxed">
                This is your highest-leverage task. Everything else is secondary.
                Focus on building the timer logic and distraction logging first.
              </p>

              <div className="flex items-center gap-3">
                <Link href="/focus" className="btn-primary inline-flex items-center gap-2 text-sm">
                  Start Deep Work
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/clarity" className="btn-ghost inline-flex items-center gap-2 text-sm">
                  Decompose with AI
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-nf-outline-dim">
                <p className="text-[10px] text-nf-text-dim">
                  FRAMEWORK: FIRST THINGS FIRST (COVEY) + TWO-MINUTE RULE (CLEAR)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Wisdom */}
        <div className="col-span-5">
          <DailyWisdom />
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            title: "Start Focus Session",
            desc: "Guard your attention",
            icon: Crosshair,
            href: "/focus",
            color: "text-nf-primary-container",
          },
          {
            title: "Log a Habit",
            desc: "Build your identity",
            icon: Flame,
            href: "/habits",
            color: "text-nf-success",
          },
          {
            title: "Decompose a Problem",
            desc: "Break chaos into clarity",
            icon: Brain,
            href: "/clarity",
            color: "text-nf-primary",
          },
          {
            title: "Evening Reflection",
            desc: "Review & grow",
            icon: Moon,
            href: "/reflect",
            color: "text-nf-warning",
          },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="glass-card-solid p-5 group hover:bg-nf-surface-mid/80
                       transition-all duration-300 hover:-translate-y-1"
          >
            <action.icon className={`w-6 h-6 ${action.color} mb-3 group-hover:scale-110 transition-transform`} />
            <h3 className="text-sm font-semibold text-nf-text mb-1">
              {action.title}
            </h3>
            <p className="text-[11px] text-nf-text-dim">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
