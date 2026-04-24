"use client";

import { cn } from "@/lib/utils";

interface NeuroScoreRingProps {
  score: number; // 0-1000
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function NeuroScoreRing({
  score,
  size = 200,
  strokeWidth = 8,
  className,
}: NeuroScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 1000) * circumference;
  const offset = circumference - progress;

  const getColor = () => {
    if (score >= 800) return { stroke: "#10B981", glow: "rgba(16,185,129,0.3)" };
    if (score >= 600) return { stroke: "#A078FF", glow: "rgba(160,120,255,0.3)" };
    if (score >= 400) return { stroke: "#FFB869", glow: "rgba(255,184,105,0.3)" };
    return { stroke: "#FFB4AB", glow: "rgba(255,180,171,0.3)" };
  };

  const color = getColor();

  const getLabel = () => {
    if (score >= 800) return "ELITE";
    if (score >= 600) return "STRONG";
    if (score >= 400) return "BUILDING";
    if (score >= 200) return "AWAKENING";
    return "INITIALIZING";
  };

  return (
    <div className={cn("score-ring", className)}>
      <svg width={size} height={size}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--nf-surface-high)"
          strokeWidth={strokeWidth}
          opacity={0.5}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#glow)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tech-label mb-1">NEUROSCORE</span>
        <span
          className="text-4xl font-bold tracking-tight"
          style={{ color: color.stroke }}
        >
          {score}
        </span>
        <span className="tech-label mt-1" style={{ color: color.stroke }}>
          {getLabel()}
        </span>
      </div>
    </div>
  );
}
