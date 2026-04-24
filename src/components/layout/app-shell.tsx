"use client";

import { Sidebar } from "./sidebar";
import { usePathname } from "next/navigation";

const authRoutes = ["/login", "/register"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));

  // On auth pages, render children directly without the sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-nf-void">
      <Sidebar />
      <main
        className="transition-all duration-300 ease-in-out ml-[240px] min-h-screen"
      >
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto page-content">
          {children}
        </div>
      </main>
    </div>
  );
}

