"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const callback = `${origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: callback },
      });
      if (error) throw error;
      setMessage("Check your email for the magic link.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send magic link.";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Login to Komuna</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send Magic Link"}
        </button>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </form>
    </section>
  );
}
