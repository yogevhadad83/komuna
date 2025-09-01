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
  return (
    <article className="rounded-md border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">
            <Link className="hover:underline" href={`/post/${post.id}`}>
              {post.title}
            </Link>
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1">
              <span className="rounded-full bg-gray-100 px-2 py-0.5">{kindLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="rounded-full bg-gray-100 px-2 py-0.5">{intentLabel}</span>
            </span>
            {post.location_text && (
              <span className="truncate">• {post.location_text}</span>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500 whitespace-nowrap">
          {new Date(post.created_at).toLocaleString()}
        </div>
      </div>
    </article>
  );
}
