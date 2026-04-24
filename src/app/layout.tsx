import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NeuroForge — Cognitive Enhancement OS",
  description:
    "AI-powered cognitive enhancement platform. Forge your mind through evidence-based psychology, deep work protocols, and neural habit engineering.",
  keywords: [
    "productivity",
    "cognitive enhancement",
    "deep work",
    "habit tracking",
    "AI coaching",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-nf-void text-nf-text">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
