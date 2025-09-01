// Minimal Komuna layout shell with header + Login link
import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Komuna" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
            <Link href="/" className="font-semibold">Komuna</Link>
            <nav className="ml-auto flex items-center gap-3 text-sm">
              <Link href="/login">Login</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
