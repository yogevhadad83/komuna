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

  // Fetch the base thread row first (no joins to avoid constraint-name coupling)
  const { data: thread, error: threadErr } = await supabase
    .from("message_thread")
    .select("id, post_id, owner_id, participant_id")
    .eq("id", id)
    .single();
  if (threadErr || !thread) throw threadErr || new Error("Thread not found");

  // Best-effort lookups for post title and other participant email; ignore failures
  let postTitle: string | null = null;
  try {
    const { data } = await supabase
      .from("post")
      .select("id, title")
      .eq("id", thread.post_id)
      .single();
    postTitle = data?.title ?? null;
  } catch {}

  let otherEmail: string | null = null;
  const otherUserId = thread.owner_id === user.id ? thread.participant_id : thread.owner_id;
  if (otherUserId) {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", otherUserId)
        .single();
      otherEmail = (data as { email?: string } | null)?.email ?? null;
    } catch {}
  }

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
    <section className="space-y-8 max-w-3xl">
      <div className="space-y-2">
        <h1 className="text-gradient">Conversation</h1>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[var(--color-fg-soft)]">
          {postTitle && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-soft)] dark:bg-[var(--bg-panel-alt)]">Post: {postTitle}</span>}
          {otherEmail && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-soft)] dark:bg-[var(--bg-panel-alt)]">With: {otherEmail}</span>}
        </div>
      </div>
      <div className="panel p-5 md:p-7 space-y-4 max-h-[60vh] overflow-y-auto">
        {(messages ?? []).length === 0 ? (
          <p className="text-sm muted">No messages yet. Start the conversation.</p>
        ) : (
          <ul className="space-y-3">
            {(messages ?? []).map((m) => {
              const mine = m.sender_id === user.id;
              return (
                <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${mine ? "bubble-own" : "bubble-other"}`}>
                    <div>{m.body}</div>
                    <div className={`mt-1 text-[10px] opacity-70 ${mine ? "text-white" : "text-[var(--color-fg-soft)]"}`}>{new Date(m.created_at as unknown as string).toLocaleTimeString()}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <form action={sendMessage} className="flex items-center gap-3">
        <input
          type="text"
          name="body"
          placeholder="Type a message to continue the exchange"
          className="flex-1"
        />
        <button type="submit" className="relative inline-flex items-center h-11 rounded-md px-6 text-[13px] font-medium bg-[var(--color-brand)] text-white shadow-sm hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] ring-offset-white dark:ring-offset-transparent">Send</button>
      </form>
    </section>
  );
}
