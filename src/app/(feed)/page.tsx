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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Feed</h1>
        <Link
          href="/post/new"
          className="rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700"
        >
          Create Post
        </Link>
      </div>
      <div className="grid gap-3">
        {posts.length === 0 && (
          <p className="text-sm text-gray-600">No posts yet.</p>
        )}
        {posts.map((p) => (
          <PostCard key={p.id} post={p as import("@/components/PostCard").PostCardProps["post"]} />
        ))}
      </div>
    </section>
  );
}
