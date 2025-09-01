import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to Komuna</h1>
      {user ? (
        <div className="rounded-md border bg-white p-4">
          <p className="text-sm text-gray-600">Signed in as</p>
          <p className="font-medium">{user.email || user.id}</p>
          <div className="mt-3">
            <form action="/auth/logout" method="post">
              <button type="submit" className="text-sm text-red-600 hover:underline">Log out</button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-gray-700">You are not signed in. <a className="text-blue-600 hover:underline" href="/login">Login</a></p>
      )}
    </section>
  );
}
