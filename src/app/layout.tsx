// Minimal Komuna layout shell with header + auth-aware nav
import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Komuna" };
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        <div className="relative z-10">
          <SiteHeader userEmail={user?.email ?? null} isAuthed={!!user} />
        </div>
        <main className="flex-1 app-shell page-enter">{children}</main>
        <footer>
          <p>Built with care for communities. Komuna © {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}

function SiteHeader({ userEmail, isAuthed }: { userEmail: string | null; isAuthed: boolean }) {
  return (
    <header className="sticky top-0 backdrop-blur-xl bg-white/70 dark:bg-[#0f141b]/65 border-b border-[var(--color-border)]/70 supports-[backdrop-filter]:glass transition-colors">
      <div className="app-shell py-4 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight group">
          <span className="relative inline-block">
            <span className="absolute inset-0 blur-sm opacity-40 bg-gradient-to-tr from-indigo-400 to-cyan-400 rounded-md" />
            <span className="relative px-2 py-1 rounded-md bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white text-sm font-bold shadow-sm">K</span>
          </span>
          <span className="text-gradient">Komuna</span>
        </Link>
        <nav className="ml-auto flex items-center gap-5 text-sm">
          {isAuthed ? (
            <>
              <Link className="text-[13px] font-medium hover:text-[var(--color-brand-accent)] transition" href="/">Feed</Link>
              <Link className="text-[13px] font-medium hover:text-[var(--color-brand-accent)] transition" href="/inbox">Inbox</Link>
              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[var(--color-border)]/60">
                {userEmail && <span className="text-[11px] px-2 py-1 rounded-full bg-[var(--bg-soft)] dark:bg-[var(--bg-panel-alt)] text-[var(--color-fg-soft)]">{userEmail}</span>}
                <form action="/auth/logout" method="post">
                  <button type="submit" className="relative inline-flex items-center h-9 rounded-md px-4 text-[13px] font-medium bg-[var(--color-brand)] text-white shadow-sm hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] ring-offset-white dark:ring-offset-transparent">
                    Logout
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-[13px] font-medium hover:text-[var(--color-brand-accent)]">Login</Link>
              <Link href="/signup" className="relative inline-flex items-center h-9 rounded-md px-4 text-[13px] font-medium bg-[var(--color-brand)] text-white shadow-sm hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand)] ring-offset-white dark:ring-offset-transparent">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

