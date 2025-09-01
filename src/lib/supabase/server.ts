// Create the server-side Supabase client (reads Next.js cookies)
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClient() {
  // Cast to any to accommodate Next 15's possible Promise-based cookies typing in some contexts
  const cookieStore = cookies() as any;
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value;
          } catch {
            return undefined;
          }
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch {}
        },
        remove(name: string, options: any) {
          try {
            if (typeof cookieStore.delete === "function") cookieStore.delete(name);
            else cookieStore.set(name, "", options);
          } catch {}
        },
      },
    }
  );
}
