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
    if (upsertErr) throw upsertErr;

  redirect(`/thread/${thread.id}`);
  }

  return (
    <section className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-gray-100 px-2 py-0.5">
            {post.kind === "item" ? "Item" : "Service"}
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5">
            {post.intent === "offer" ? "Offer" : "Need"}
          </span>
          {post.location_text && (
            <span className="text-gray-600">• {post.location_text}</span>
          )}
        </div>
      </div>
      <p className="whitespace-pre-wrap text-gray-800">{post.description}</p>

      <div className="pt-2">
        <form action={expressInterest}>
          <button
            type="submit"
            disabled={!!isOwner}
            className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm disabled:opacity-50"
          >
            {isOwner ? "You are the owner" : "Express Interest"}
          </button>
        </form>
      </div>
    </section>
  );
}
