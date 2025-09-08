import Link from "next/link";

export type PostCardProps = {
  post: {
    id: string;
    title: string;
    kind: "item" | "service";
    intent: "offer" | "need";
    location_text: string | null;
    created_at: string;
  };
};

export default async function PostCard({ post }: PostCardProps) {
  const kindLabel = post.kind === "item" ? "Item" : "Service";
  const intentLabel = post.intent === "offer" ? "Offer" : "Need";
  const timestamp = new Date(post.created_at).toLocaleString();
  return (
    <article className="panel interactive-card fade-in group p-5 flex flex-col gap-3">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="font-semibold tracking-tight leading-snug text-[15px]">
            <Link className="relative inline-block focus-visible:outline-none focus-visible:brand-ring after:absolute after:inset-0" href={`/post/${post.id}`}>
              <span className="bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-cyan-500/0 -mx-1 px-1 py-0.5 rounded transition-colors group-hover:via-indigo-500/20">{post.title}</span>
            </Link>
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="badge" data-variant={post.kind}>{kindLabel}</span>
            <span className="badge" data-variant={post.intent}>{intentLabel}</span>
            {post.location_text && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-soft)] dark:bg-[var(--bg-panel-alt)] text-[var(--color-fg-soft)] font-medium tracking-wide">{post.location_text}</span>
            )}
          </div>
        </div>
        <time className="shrink-0 text-[10px] uppercase tracking-wider font-medium text-[var(--color-fg-soft)] pt-1">
          {timestamp}
        </time>
      </div>
      <div className="flex items-center justify-end">
        <Link href={`/post/${post.id}`} className="text-[11px] font-medium tracking-wide h-8 inline-flex items-center px-3 rounded-md bg-[var(--bg-soft)] dark:bg-[var(--bg-panel-alt)] border border-[var(--color-border)]/70 hover:bg-white dark:hover:bg-[var(--bg-panel)] transition">
          View
        </Link>
      </div>
    </article>
  );
}
