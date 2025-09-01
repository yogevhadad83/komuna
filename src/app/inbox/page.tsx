import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function InboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("Not authenticated");

  // We need threads where user is owner or participant; then compute the other party's email
  const { data: threads, error } = await supabase
    .from("message_thread")
    .select(
      `id, post_id, owner_id, participant_id,
       post:post!inner(id, title),
       owner:profiles!message_thread_owner_id_fkey(email),
       participant:profiles!message_thread_participant_id_fkey(email)`
    )
    .or(`owner_id.eq.${user.id},participant_id.eq.${user.id}`)
    .order("id", { ascending: false });
  if (error) throw error;

  type Profile = { email: string | null };
  type PostSummary = { id: string; title: string };
  type ThreadJoined = {
    id: string;
    post_id: string;
    owner_id: string;
    participant_id: string;
    post: PostSummary | PostSummary[] | null;
    owner: Profile | Profile[] | null;
    participant: Profile | Profile[] | null;
  };

  const normalizeJoin = <T,>(v: T | T[] | null | undefined): T | null =>
    Array.isArray(v) ? v[0] ?? null : v ?? null;

  const rows = ((threads ?? []) as ThreadJoined[]).map((t) => {
    const ownerObj = normalizeJoin<Profile>(t.owner);
    const participantObj = normalizeJoin<Profile>(t.participant);
    const postObj = normalizeJoin<PostSummary>(t.post);
    const otherEmail = t.owner_id === user.id ? participantObj?.email ?? null : ownerObj?.email ?? null;
    return {
      id: t.id,
      post_id: t.post_id,
      title: postObj?.title ?? "",
      otherEmail,
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
