import { defineConfig } from "vitest/config";

export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  test: { include: ["__tests__/**/*.test.{ts,tsx}"], environment: "node" },
});
