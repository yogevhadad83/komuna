"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[Komuna] /login PASSWORD-FIRST rendering");
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) router.replace("/");
    });
    return () => { mounted = false; };
  }, [router, supabase]);

  async function onPasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.replace("/");
  }

  return (
    <section className="max-w-md mx-auto space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-gradient">Welcome Back</h1>
        <p className="muted text-sm max-w-sm mx-auto">Sign in to continue sharing, offering and receiving support from your community.</p>
      </div>
      <form onSubmit={onPasswordLogin} className="panel p-6 md:p-8 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium tracking-wide uppercase text-[var(--color-fg-soft)]" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium tracking-wide uppercase text-[var(--color-fg-soft)]" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="pt-2 space-y-3">
          <button className="w-full relative inline-flex items-center justify-center h-11 rounded-md px-6 text-[14px] font-medium bg-[var(--color-brand)] text-white shadow-sm hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] ring-offset-white dark:ring-offset-transparent">Log In</button>
          {error && <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger-bg)] px-3 py-2 rounded-md border border-[var(--color-danger)]/40">{error}</p>}
          <p className="text-xs text-center text-[var(--color-fg-soft)]">No account? <Link href="/signup" className="text-[var(--color-brand)] hover:text-[var(--color-brand-accent)] font-medium">Create one</Link></p>
        </div>
      </form>
    </section>
  );
}
