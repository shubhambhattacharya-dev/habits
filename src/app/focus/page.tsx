"use client";

import { Crosshair, Play, Pause, Square, AlertTriangle, Clock, Zap, Ban } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export default function FocusPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(45 * 60); // 45 min default
  const [totalSeconds] = useState(45 * 60);
  const [sessionCount, setSessionCount] = useState(0);
  const [distractions, setDistractions] = useState<{ source: string; time: string; resisted: boolean }[]>([]);
  const [showTempted, setShowTempted] = useState(false);
  const [temptedCountdown, setTemptedCountdown] = useState(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
      setSessionCount((c) => c + 1);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, seconds]);

  useEffect(() => {
    if (showTempted && temptedCountdown > 0) {
      const t = setInterval(() => setTemptedCountdown((c) => c - 1), 1000);
      return () => clearInterval(t);
    } else if (temptedCountdown === 0) {
      setShowTempted(false);
      setTemptedCountdown(60);
    }
  }, [showTempted, temptedCountdown]);

  const handleTempted = useCallback(() => {
    setShowTempted(true);
    setTemptedCountdown(60);
    setDistractions((d) => [...d, { source: "Temptation", time: new Date().toLocaleTimeString(), resisted: true }]);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Crosshair className="w-6 h-6 text-nf-primary-container" />
          <h1 className="text-2xl font-bold tracking-tight">Focus Shield</h1>
        </div>
        <p className="text-sm text-nf-text-dim">GUARD YOUR ATTENTION. OWN YOUR TIME.</p>
      </div>

      {/* Tempted Overlay */}
      {showTempted && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md">
            <AlertTriangle className="w-16 h-16 text-nf-warning mx-auto animate-pulse-glow" />
            <h2 className="text-3xl font-bold text-nf-warning">HOLD THE LINE</h2>
            <p className="text-nf-text-muted">
              &quot;The urge to break focus is just your brain seeking cheap dopamine. 
              You are stronger than a notification.&quot;
            </p>
            <div className="text-6xl font-bold text-nf-primary font-mono">{temptedCountdown}s</div>
            <p className="text-xs text-nf-text-dim">Breathe. This craving will pass in {temptedCountdown} seconds.</p>
            <p className="tech-label">FRAMEWORK: URGE SURFING — DEEP WORK (NEWPORT)</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Timer */}
        <div className="col-span-7 glass-card p-8 flex flex-col items-center neural-glow">
          <div className="score-ring mb-6">
            <svg width={280} height={280}>
              <circle cx={140} cy={140} r={radius} fill="none" stroke="var(--nf-surface-high)" strokeWidth={10} opacity={0.5} />
              <circle cx={140} cy={140} r={radius} fill="none" stroke={isRunning ? "#A078FF" : "#494454"} strokeWidth={10} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="tech-label mb-2">{isRunning ? "DEEP WORK ACTIVE" : "READY"}</span>
              <span className="text-5xl font-bold font-mono text-nf-text tracking-tight">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </span>
              <span className="tech-label mt-2">Session #{sessionCount + 1}</span>
            </div>
          </div>

          {/* Duration Selector */}
          {!isRunning && (
            <div className="flex items-center gap-2 mb-6">
              {[25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  id={`btn-duration-${mins}`}
                  onClick={() => { setSeconds(mins * 60); }}
                  className={cn("px-3 py-1 text-xs rounded-full border transition-all", seconds === mins * 60 ? "border-nf-primary-container text-nf-primary-container bg-nf-primary-container/10" : "border-nf-outline text-nf-text-dim hover:text-nf-text")}
                >
                  {mins} min
                </button>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <button id="btn-start-focus" onClick={() => setIsRunning(!isRunning)} className={cn(isRunning ? "btn-ghost" : "btn-primary", "inline-flex items-center gap-2 px-6")}>
              {isRunning ? <><Pause className="w-4 h-4" />Pause</> : <><Play className="w-4 h-4" />Start</>}
            </button>
            <button id="btn-reset-focus" onClick={() => { setIsRunning(false); setSeconds(totalSeconds); }} className="btn-ghost inline-flex items-center gap-2 px-6">
              <Square className="w-4 h-4" />Reset
            </button>
          </div>

          {/* I'm Tempted */}
          <button id="btn-tempted" onClick={handleTempted} className="btn-warning inline-flex items-center gap-2 px-8 py-3 text-sm neural-glow-warning">
            <AlertTriangle className="w-4 h-4" />
            I&apos;M TEMPTED — HELP ME
          </button>
        </div>

        {/* Stats Panel */}
        <div className="col-span-5 space-y-4">
          <div className="glass-card-solid p-5">
            <span className="tech-label">TODAY&apos;S FOCUS LOG</span>
            <div className="mt-4 space-y-3">
              {[
                { label: "Deep Work", value: "2h 47m", icon: Zap, color: "text-nf-success" },
                { label: "Shallow Work", value: "1h 10m", icon: Clock, color: "text-nf-text-dim" },
                { label: "Distractions", value: `${distractions.length}`, icon: Ban, color: "text-nf-warning" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                    <span className="text-sm text-nf-text-muted">{stat.label}</span>
                  </div>
                  <span className="text-sm font-mono font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Distraction Log */}
          <div className="glass-card-solid p-5">
            <span className="tech-label">DISTRACTION LOG</span>
            <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
              {distractions.length === 0 ? (
                <p className="text-xs text-nf-text-dim py-4 text-center">No distractions yet. Stay focused! 🛡️</p>
              ) : (
                distractions.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-nf-outline-dim last:border-0">
                    <span className="text-nf-text-muted">{d.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-nf-text-dim">{d.time}</span>
                      {d.resisted && <span className="text-nf-success">✓ Resisted</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card-solid p-4">
            <p className="text-[10px] text-nf-text-dim leading-relaxed">
              RULE: Schedule every minute. Embrace boredom. — Deep Work (Cal Newport)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
