import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Params = { params: Promise<{ id: string }> };

export default async function PostDetailPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("post")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();

  const isOwner = user?.id && post.owner_id === user.id;

  async function expressInterest() {
    "use server";
    const supabase = await createClient();
    const { data: postData, error: postErr } = await supabase
      .from("post")
      .select("id, owner_id")
      .eq("id", id)
      .single();
    if (postErr || !postData) throw postErr || new Error("Post not found");

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) throw new Error("Not authenticated");
    if (postData.owner_id === user.id) {
      // Owners cannot express interest in own post; go to inbox
      redirect("/inbox");
    }

    const { data: thread, error: upsertErr } = await supabase
      .from("message_thread")
      .upsert(
        {
          post_id: postData.id,
          owner_id: postData.owner_id,
          participant_id: user.id,
        },
        { onConflict: "post_id,owner_id,participant_id" }
      )
      .select("id")
      .single();
    if (upsertErr) {
      // If unique violation, try to fetch the existing row
      const { data: existing } = await supabase
        .from("message_thread")
        .select("id")
        .eq("post_id", postData.id)
        .eq("owner_id", postData.owner_id)
        .eq("participant_id", user.id)
        .single();
      if (existing?.id) {
        redirect(`/thread/${existing.id}`);
      }
      throw upsertErr;
    }

  redirect(`/thread/${thread.id}`);
  }

  return (
    <section className="space-y-8 max-w-3xl">
      <div className="panel p-7 md:p-10 space-y-6">
        <div className="space-y-4">
          <h1 className="text-gradient leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="badge" data-variant={post.kind}>{post.kind === "item" ? "Item" : "Service"}</span>
            <span className="badge" data-variant={post.intent}>{post.intent === "offer" ? "Offer" : "Need"}</span>
            {post.location_text && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-soft)] dark:bg-[var(--bg-panel-alt)] text-[var(--color-fg-soft)] font-medium tracking-wide">{post.location_text}</span>
            )}
          </div>
        </div>
        <div className="prose prose-sm max-w-none text-[var(--color-fg)] dark:prose-invert">
          <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{post.description}</p>
        </div>
        <div className="pt-2">
          <form action={expressInterest} className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={!!isOwner}
              className="relative inline-flex items-center h-11 rounded-md px-6 text-[14px] font-medium bg-[var(--color-brand)] text-white shadow-sm hover:brightness-110 transition disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] ring-offset-white dark:ring-offset-transparent"
            >
              {isOwner ? "You are the owner" : "Express Interest"}
            </button>
            {!isOwner && <p className="text-[11px] text-[var(--color-fg-soft)]">Expressing interest opens a private conversation.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
