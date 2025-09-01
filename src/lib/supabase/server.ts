// Create the server-side Supabase client (reads Next.js cookies)
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  // In Next 15, cookies() can be async; await it to avoid sync dynamic API errors
  const cookieStore = await cookies();
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
        set(name: string, value: string, options?: unknown) {
          try {
            // options is opaque here; if cookieStore.set supports it, pass it through
            // @ts-expect-error - set options shape depends on runtime cookie store type
            cookieStore.set(name, value, options);
          } catch {}
        },
        remove(name: string, options?: unknown) {
          try {
            if (typeof cookieStore.delete === "function") cookieStore.delete(name);
            else {
              // @ts-expect-error - set options shape depends on runtime cookie store type
              cookieStore.set(name, "", options);
            }
          } catch {}
        },
      },
    }
  );
}
