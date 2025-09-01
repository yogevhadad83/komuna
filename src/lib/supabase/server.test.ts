import { vi, describe, it, expect } from "vitest";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
      signOut: vi.fn(async () => ({ error: null })),
      exchangeCodeForSession: vi.fn(async () => ({ error: null })),
    },
  })),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => undefined,
    set: () => undefined,
    delete: () => undefined,
  }),
}));

import { createClient } from "./server";

describe("supabase server createClient", () => {
  it("creates a client with mocked modules", async () => {
    const client = await createClient();
    expect(client).toBeDefined();
    expect(typeof client.auth.getUser).toBe("function");
  });
});
