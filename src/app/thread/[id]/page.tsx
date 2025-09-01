import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Params = { params: Promise<{ id: string }> };

export default async function ThreadPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw new Error("Not authenticated");

  const { data: thread, error: threadErr } = await supabase
    .from("message_thread")
    .select(
      `id, post_id, owner_id, participant_id,
       post:post!inner(id, title),
       owner:profiles!message_thread_owner_id_fkey(email),
       participant:profiles!message_thread_participant_id_fkey(email)`
    )
  .eq("id", id)
    .single();
  if (threadErr || !thread) throw threadErr || new Error("Thread not found");

  // Normalize join shapes that may be arrays depending on inferred cardinality
  type Profile = { email: string | null };
  type PostSummary = { id: string; title: string };
  type ThreadJoined = typeof thread & {
    post: PostSummary | PostSummary[] | null;
    owner: Profile | Profile[] | null;
    participant: Profile | Profile[] | null;
  };
  const normalizeJoin = <T,>(v: T | T[] | null | undefined): T | null =>
    Array.isArray(v) ? v[0] ?? null : v ?? null;
  const t = thread as ThreadJoined;
  const postObj = normalizeJoin<PostSummary>(t.post);
  const ownerObj = normalizeJoin<Profile>(t.owner);
  const participantObj = normalizeJoin<Profile>(t.participant);
  const otherEmail = thread.owner_id === user.id ? participantObj?.email ?? null : ownerObj?.email ?? null;

  const { data: messages, error: msgErr } = await supabase
    .from("message")
    .select("id, sender_id, body, created_at")
  .eq("thread_id", id)
    .order("created_at", { ascending: true });
  if (msgErr) throw msgErr;

  async function sendMessage(formData: FormData) {
    "use server";
    const body = String(formData.get("body") || "").trim();
    if (!body) return;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { error } = await supabase
      .from("message")
      .insert({ thread_id: id, sender_id: user.id, body });
    if (error) throw error;
    redirect(`/thread/${id}`);
  }

  return (
    <section className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Conversation</h1>
  <p className="text-sm text-gray-600">Post: {postObj?.title}</p>
        {otherEmail && (
          <p className="text-sm text-gray-600">With: {otherEmail}</p>
        )}
      </div>
      <div className="rounded-md border bg-white p-4 space-y-3">
        {(messages ?? []).length === 0 ? (
          <p className="text-sm text-gray-600">No messages yet.</p>
        ) : (
          <ul className="space-y-2">
            {(messages ?? []).map((m) => (
              <li key={m.id} className={`flex ${m.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${m.sender_id === user.id ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
                  <div>{m.body}</div>
                  <div className="mt-1 text-[10px] opacity-70">{new Date(m.created_at as unknown as string).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form action={sendMessage} className="flex items-center gap-2">
        <input
          type="text"
          name="body"
          placeholder="Type a message"
          className="flex-1 rounded-md border px-3 py-2"
        />
        <button type="submit" className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm">
          Send
        </button>
      </form>
    </section>
  );
}
