"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (mode === "register" && password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login" 
        ? { email, password } 
        : { email, password, name };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Success, redirect to dashboard (habits)
      router.push("/habits");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-nf-surface text-nf-text min-h-screen flex flex-col font-body selection:bg-nf-primary-container selection:text-nf-on-primary-container">
      <main className="flex-grow flex flex-col md:flex-row relative z-10 overflow-hidden min-h-screen">
        
        {/* Left Side: Dramatic Typography & Neural Network Abstract */}
        <section className="w-full md:w-[60%] lg:w-[65%] relative flex flex-col justify-center items-start p-12 md:p-24 lg:p-32 bg-nf-surface-high overflow-hidden">
          {/* Background Graphic / Pulse */}
          <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-gradient-radial from-nf-secondary-container/20 via-nf-surface to-nf-surface opacity-50 blur-3xl pointer-events-none z-0"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="text-xl font-black tracking-tighter text-nf-text-dim mb-12 uppercase">SYNAPSE</div>
            <h1 className="font-display font-black text-6xl md:text-8xl lg:text-[140px] leading-[0.85] tracking-[-0.04em] text-nf-text">
              FORGING<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nf-primary to-nf-primary-container">
                YOUR MIND
              </span>
            </h1>
            <p className="font-body text-xl text-nf-text-muted max-w-lg mt-8 leading-relaxed">
              Initialize your neural connection. Enter the command center to optimize cognitive performance.
            </p>
          </div>
        </section>

        {/* Right Side: Authentication Glassmorphic Card */}
        <section className="w-full md:w-[40%] lg:w-[35%] bg-nf-surface flex items-center justify-center p-6 md:p-12 relative z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
          {/* Glassmorphic Container */}
          <div className="w-full max-w-md bg-nf-surface-high/60 backdrop-blur-[20px] rounded-xl p-8 border border-nf-outline-dim relative overflow-hidden">
            {/* Radial Glow Top Left */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-nf-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Segmented Control Toggle */}
            <div className="flex p-1 bg-nf-surface-low rounded-lg mb-8" role="tablist">
              <button 
                onClick={() => { setMode("login"); setErrorMsg(""); }}
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg font-label text-sm font-bold tracking-wider uppercase transition-all shadow-md",
                  mode === "login" ? "bg-nf-surface-high text-nf-text" : "text-nf-text-dim hover:text-nf-text shadow-none bg-transparent"
                )}
                role="tab"
              >
                Access
              </button>
              <button 
                onClick={() => { setMode("register"); setErrorMsg(""); }}
                className={cn(
                  "flex-1 py-3 px-4 rounded-lg font-label text-sm font-bold tracking-wider uppercase transition-all shadow-md",
                  mode === "register" ? "bg-nf-surface-high text-nf-text" : "text-nf-text-dim hover:text-nf-text shadow-none bg-transparent"
                )}
                role="tab"
              >
                Initialize
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 p-3 rounded-lg bg-nf-error/10 border border-nf-error/30 text-nf-error text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {mode === "register" && (
                <div className="space-y-1 fade-in">
                  <label htmlFor="name" className="block font-label text-[10px] tracking-widest uppercase text-nf-text-dim">
                    Operative Designation (Name)
                  </label>
                  <input 
                    id="name" 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full bg-nf-surface-low border border-nf-outline/20 rounded-lg px-4 py-3 text-nf-text placeholder-nf-text-dim/50 focus:border-nf-primary focus:ring-1 focus:ring-nf-primary focus:outline-none transition-all font-body" 
                  />
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="block font-label text-[10px] tracking-widest uppercase text-nf-text-dim">
                  Neural Identifier (Email)
                </label>
                <input 
                  id="email" 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operative@synapse.network" 
                  className="w-full bg-nf-surface-low border border-nf-outline/20 rounded-lg px-4 py-3 text-nf-text placeholder-nf-text-dim/50 focus:border-nf-primary focus:ring-1 focus:ring-nf-primary focus:outline-none transition-all font-body" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label htmlFor="password" className="block font-label text-[10px] tracking-widest uppercase text-nf-text-dim">
                    Security Cipher
                  </label>
                  {mode === "login" && (
                    <a href="#" className="text-[10px] text-nf-primary hover:text-nf-primary-container transition-colors underline decoration-nf-primary/30 underline-offset-2">
                      Override
                    </a>
                  )}
                </div>
                <input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-nf-surface-low border border-nf-outline/20 rounded-lg px-4 py-3 text-nf-text placeholder-nf-text-dim/50 focus:border-nf-primary focus:ring-1 focus:ring-nf-primary focus:outline-none transition-all font-body" 
                />
              </div>

              {mode === "register" && (
                <div className="space-y-1 fade-in">
                  <label htmlFor="confirmPassword" className="block font-label text-[10px] tracking-widest uppercase text-nf-text-dim">
                    Confirm Cipher
                  </label>
                  <input 
                    id="confirmPassword" 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-nf-surface-low border border-nf-outline/20 rounded-lg px-4 py-3 text-nf-text placeholder-nf-text-dim/50 focus:border-nf-primary focus:ring-1 focus:ring-nf-primary focus:outline-none transition-all font-body" 
                  />
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-md bg-gradient-to-r from-nf-primary to-nf-primary-container text-nf-on-primary-container font-label text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === "login" ? "ACCESS TERMINAL" : "INITIALIZE PROFILE"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/5 bg-nf-surface-dim flex flex-col md:flex-row justify-between items-center px-12 gap-4 relative z-20">
        <div className="font-label text-[10px] tracking-widest uppercase font-bold text-nf-primary-container">
          © 2026 SYNAPTIC COMMAND. ALL RIGHTS RESERVED.
        </div>
        <nav className="flex gap-6">
          <Link href="#" className="font-label text-[10px] tracking-widest uppercase font-bold text-nf-text-dim hover:text-nf-primary transition-colors">Privacy Protocol</Link>
          <Link href="#" className="font-label text-[10px] tracking-widest uppercase font-bold text-nf-text-dim hover:text-nf-primary transition-colors">Neural Terms</Link>
          <Link href="#" className="font-label text-[10px] tracking-widest uppercase font-bold text-nf-text-dim hover:text-nf-primary transition-colors">Latency Status</Link>
        </nav>
</footer>
  );
}

export default function AuthPortal() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-nf-surface" />}>
      <AuthForm />
    </Suspense>
  );
}
