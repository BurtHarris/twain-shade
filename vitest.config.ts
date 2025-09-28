import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: "jsdom", // Always use jsdom for Svelte and DOM tests
    globals: true,
    setupFiles: ["tests/setupTests.ts"],
    include: ["tests/**/*.test.js", "tests/**/*.test.ts"],
  },
});
