"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  Crosshair,
  Flame,
  LayoutDashboard,
  BookOpen,
  Moon,
  Zap,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  {
    label: "Command",
    icon: LayoutDashboard,
    href: "/",
    description: "Home Dashboard",
  },
  {
    label: "Clarity",
    icon: Brain,
    href: "/clarity",
    description: "Clarity Engine",
  },
  {
    label: "Focus",
    icon: Crosshair,
    href: "/focus",
    description: "Focus Shield",
  },
  {
    label: "Forge",
    icon: Flame,
    href: "/habits",
    description: "Habit Forge",
  },
  {
    label: "Reflect",
    icon: Moon,
    href: "/reflect",
    description: "Evening Reflection",
  },
  {
    label: "Wisdom",
    icon: BookOpen,
    href: "/wisdom",
    description: "Book Wisdom",
  },
  {
    label: "Rewire",
    icon: Zap,
    href: "/challenges",
    description: "Rewire Challenges",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-50 flex flex-col",
        "bg-nf-surface border-r border-nf-outline-dim",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-nf-outline-dim">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nf-primary to-nf-primary-container flex items-center justify-center flex-shrink-0">
          <Trophy className="w-4 h-4 text-nf-on-primary" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold tracking-wide text-nf-primary">
              NEUROFORGE
            </h1>
            <p className="text-[10px] text-nf-text-dim tracking-widest uppercase">
              Cognitive OS
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg",
                "transition-all duration-200 relative",
                isActive
                  ? "bg-nf-secondary-container/50 text-nf-primary"
                  : "text-nf-text-muted hover:text-nf-text hover:bg-nf-surface-high/50"
              )}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-nf-primary-container" />
              )}

              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-nf-primary-container" : "text-nf-text-dim group-hover:text-nf-text-muted"
                )}
              />

              {!collapsed && (
                <div className="overflow-hidden">
                  <span className="text-sm font-medium block">{item.label}</span>
                  {isActive && (
                    <span className="text-[10px] text-nf-text-dim block">
                      {item.description}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout Button ── */}
      <div className="px-3 pb-2 pt-4 mt-auto border-t border-nf-outline-dim">
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 text-sm font-medium",
            !collapsed && "px-3 justify-start"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* ── Collapse Toggle ── */}
      <div className="px-3 pb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                     text-nf-text-dim hover:text-nf-text-muted hover:bg-nf-surface-high/30
                     transition-all duration-200 text-xs"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
