import React from "react";
import { vi } from "vitest";
// Extend expect with Testing Library matchers
import "@testing-library/jest-dom/vitest";

// Minimal Next.js module shims for tests that might import them.
// You can extend these as needed for more complex components.
type LinkProps = { href?: string; children?: React.ReactNode } & Record<string, unknown>;
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: LinkProps) => {
    return React.createElement("a", { href: typeof href === "string" ? href : "#", ...props }, children);
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Ensure required env vars exist during tests
process.env.NEXT_PUBLIC_SUPABASE_URL ||= "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= "testing-anon-key";
