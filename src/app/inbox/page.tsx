import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function InboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("Not authenticated");

  // 1) Fetch relevant threads without joins
  const { data: threads, error } = await supabase
    .from("message_thread")
    .select("id, post_id, owner_id, participant_id")
    .or(`owner_id.eq.${user.id},participant_id.eq.${user.id}`)
    .order("id", { ascending: false });
  if (error) throw error;

  const postIds = new Set<string>();
  const otherUserIds = new Set<string>();
  for (const t of threads ?? []) {
    if (t.post_id) postIds.add(t.post_id as string);
    const other = t.owner_id === user.id ? (t.participant_id as string) : (t.owner_id as string);
    if (other) otherUserIds.add(other);
  }

  // 2) Fetch posts and profiles in bulk (best-effort; ignore errors and fill blanks)
  const postsMap = new Map<string, string>();
  if (postIds.size) {
    try {
      const { data } = await supabase
        .from("post")
        .select("id, title")
        .in("id", Array.from(postIds));
      for (const p of data ?? []) postsMap.set(p.id as string, (p.title as string) ?? "");
    } catch {}
  }

  const profilesMap = new Map<string, string | null>();
  if (otherUserIds.size) {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", Array.from(otherUserIds));
      for (const pr of data ?? []) profilesMap.set(pr.id as string, (pr.email as string) ?? null);
    } catch {}
  }

  const rows = (threads ?? []).map((t) => {
    const other = t.owner_id === user.id ? (t.participant_id as string) : (t.owner_id as string);
    return {
      id: t.id as string,
      post_id: t.post_id as string,
      title: postsMap.get(t.post_id as string) ?? "",
      otherEmail: other ? profilesMap.get(other) ?? null : null,
    };
  });

  return (
    <section className="space-y-8 max-w-3xl">
      <div className="space-y-3">
        <h1 className="text-gradient">Inbox</h1>
        <p className="muted text-sm">Your active conversations about offers and needs.</p>
      </div>
      {rows.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="text-sm muted">No conversations yet. Express interest in a post to start one.</p>
        </div>
      ) : (
        <div className="list-panel divide-y divide-[var(--color-border)]/70">
          {rows.map((r) => (
            <Link
              key={r.id}
              href={`/thread/${r.id}`}
              className="block p-5 hover:bg-[var(--bg-soft)] dark:hover:bg-[var(--bg-panel-alt)] transition focus-visible:outline-none focus-visible:brand-ring"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 space-y-1">
                  <div className="font-medium tracking-tight text-sm line-clamp-1">{r.title || "(untitled post)"}</div>
                  {r.otherEmail && (
                    <div className="text-[11px] text-[var(--color-fg-soft)]">with {r.otherEmail}</div>
                  )}
                </div>
                <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-brand)]">Open</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
