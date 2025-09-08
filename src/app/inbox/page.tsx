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
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Inbox</h1>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-600">No conversations yet.</p>
      ) : (
        <ul className="divide-y rounded-md border bg-white">
          {rows.map((r) => (
            <li key={r.id} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{r.title}</div>
                {r.otherEmail && (
                  <div className="text-xs text-gray-600">with {r.otherEmail}</div>
                )}
              </div>
              <Link
                className="text-sm text-blue-600 hover:underline"
                href={`/thread/${r.id}`}
              >
                Open
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
