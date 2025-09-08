import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post")
    .select("id, title, kind, intent, location_text, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;

  const posts = data ?? [];

  return (
    <section className="space-y-10">
      <div className="panel elevate overflow-hidden relative px-6 py-10 md:py-14">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[radial-gradient(circle_at_30%_0%,hsl(var(--gradient-start)/0.55),transparent_60%),radial-gradient(circle_at_90%_75%,hsl(var(--gradient-end)/0.55),transparent_55%)]" />
        <div className="relative max-w-3xl space-y-5">
          <h1 className="text-gradient">Community Exchange Feed</h1>
          <p className="muted text-sm md:text-base leading-relaxed max-w-prose">Share what you can offer, ask for what you need. Komuna helps neighbors support each other through items, skills and kindness. Start a new post or explore what others have shared.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/post/new" className="relative inline-flex items-center h-11 rounded-md px-6 text-[14px] font-medium bg-[var(--color-brand)] text-white shadow-sm hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] ring-offset-white dark:ring-offset-[var(--bg-alt)]">
              Create Post
            </Link>
            <Link href="#feed" className="inline-flex items-center h-11 rounded-md px-5 text-[13px] font-medium bg-[var(--bg-soft)] dark:bg-[var(--bg-panel-alt)] text-[var(--color-fg)] hover:bg-white dark:hover:bg-[var(--bg-panel)] border border-[var(--color-border)]/70 transition">
              Browse Feed
            </Link>
          </div>
        </div>
      </div>
      <div id="feed" className="space-y-4">
        <div className="flex items-center justify-between pr-1">
          <h2 className="text-lg font-semibold tracking-tight">Latest Posts</h2>
          <span className="text-[11px] uppercase tracking-wider font-medium text-[var(--color-fg-soft)]">{posts.length} active</span>
        </div>
        <div className="grid gap-4">
          {posts.length === 0 && (
            <div className="panel p-8 text-center fade-in">
              <p className="text-sm muted">No posts yet. Be the first to share something helpful.</p>
              <div className="pt-4">
                <Link href="/post/new" className="inline-flex items-center h-10 rounded-md px-5 text-[13px] font-medium bg-[var(--color-brand)] text-white shadow-sm hover:brightness-110 transition">Create a Post</Link>
              </div>
            </div>
          )}
          {posts.map((p) => (
            <PostCard key={p.id} post={p as import("@/components/PostCard").PostCardProps["post"]} />
          ))}
        </div>
      </div>
    </section>
  );
}
