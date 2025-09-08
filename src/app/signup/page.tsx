"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        if (data.session) router.replace("/");
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setMessage("Account created. Check your inbox to confirm (if required), then you can log in.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign up.";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-md mx-auto space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-gradient">Join Komuna</h1>
        <p className="muted text-sm max-w-sm mx-auto">Create an account to start exchanging items and support with people nearby.</p>
      </div>
      <form onSubmit={onSubmit} className="panel p-6 md:p-8 space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium tracking-wide uppercase text-[var(--color-fg-soft)]">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium tracking-wide uppercase text-[var(--color-fg-soft)]">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
          />
        </div>
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full relative inline-flex items-center justify-center h-11 rounded-md px-6 text-[14px] font-medium bg-[var(--color-brand)] text-white shadow-sm hover:brightness-110 transition disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] ring-offset-white dark:ring-offset-transparent"
          >
            {loading ? "Creating…" : "Sign Up"}
          </button>
          {message && <p className="text-sm text-[var(--color-fg-soft)] bg-[var(--bg-soft)] dark:bg-[var(--bg-panel-alt)] px-3 py-2 rounded-md border border-[var(--color-border)]/60">{message}</p>}
        </div>
      </form>
    </section>
  );
}
