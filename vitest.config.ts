import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.tsx"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html", "lcov"],
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "next-env.d.ts",
        "node_modules/**",
        ".next/**",
        "**/vitest.setup.*",
        "**/vitest.config.*",
        "src/app/**/route.ts",
        "src/app/globals.css",
      ],
    },
  },
});
