import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import PostForm from "@/components/forms/PostForm";
import { createClient } from "@/lib/supabase/server";

export default function NewPostPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-3 max-w-2xl">
        <h1 className="text-gradient">Create a Post</h1>
        <p className="muted text-sm leading-relaxed">Offer something useful or ask for support. Clear, kind posts foster trust and faster responses.</p>
      </div>
      <PostForm onSubmitAction={createPost} />
    </section>
  );
}

export async function createPost(formData: FormData) {
  "use server";
  const kind = String(formData.get("kind"));
  const intent = String(formData.get("intent"));
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));
  const location_text = formData.get("location_text")
    ? String(formData.get("location_text"))
    : null;

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("post")
    .insert({
      owner_id: user.id,
      kind,
      intent,
      title,
      description,
      location_text,
      photos: [],
    });
  if (error) throw error;

  revalidatePath("/");
  redirect("/");
}
