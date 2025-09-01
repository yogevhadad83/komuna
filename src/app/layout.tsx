// Minimal Komuna layout shell with header + auth-aware nav
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Komuna" };
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900" suppressHydrationWarning>
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
            <Link href="/" className="font-semibold">Komuna</Link>
            <nav className="ml-auto flex items-center gap-3 text-sm">
              {user ? (
                <>
                  <span className="text-gray-600 hidden sm:inline">{user.email}</span>
                  <Link href="/inbox" className="hover:underline">Inbox</Link>
                  <form action="/auth/logout" method="post">
                    <button className="rounded-md border px-2 py-1 hover:bg-gray-50" type="submit">
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login">Login</Link>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
