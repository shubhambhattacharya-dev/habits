"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accentColor?: "violet" | "emerald" | "amber" | "red";
  className?: string;
}

const accentColors = {
  violet: {
    icon: "text-nf-primary-container",
    bg: "bg-nf-primary-container/10",
    trend: "text-nf-primary",
  },
  emerald: {
    icon: "text-nf-success",
    bg: "bg-nf-success/10",
    trend: "text-nf-success",
  },
  amber: {
    icon: "text-nf-warning",
    bg: "bg-nf-warning/10",
    trend: "text-nf-warning",
  },
  red: {
    icon: "text-nf-error",
    bg: "bg-nf-error/10",
    trend: "text-nf-error",
  },
};

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  accentColor = "violet",
  className,
}: StatCardProps) {
  const colors = accentColors[accentColor];

  return (
    <div
      className={cn(
        "glass-card-solid p-5 flex flex-col gap-3 group hover:bg-nf-surface-mid/80 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="tech-label">{label}</span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors.bg)}>
          <Icon className={cn("w-4 h-4", colors.icon)} />
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold tracking-tight text-nf-text">{value}</p>
        {subtitle && (
          <p className="text-xs text-nf-text-dim mt-0.5">{subtitle}</p>
        )}
      </div>

      {trend && trendValue && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-medium",
              trend === "up" && "text-nf-success",
              trend === "down" && "text-nf-error",
              trend === "neutral" && "text-nf-text-dim"
            )}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
          <span className="text-[10px] text-nf-text-dim">vs yesterday</span>
        </div>
      )}
    </div>
  );
}
