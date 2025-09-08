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
    <section className="max-w-sm">
      <h1 className="text-2xl font-semibold mb-4">Login to Komuna — PASSWORD FIRST</h1>
      <form onSubmit={onPasswordLogin} className="space-y-3">
        <label className="block text-sm">
          Email
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            required
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </label>
        <button className="w-full rounded-md border px-3 py-2">Log In</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-sm pt-2">
          No account? <Link href="/signup" className="underline">Create one</Link>
        </p>
      </form>
    </section>
  );
}
