import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import VitePluginVSCode from "@tomjs/vite-plugin-vscode";
import path from "path";

export default defineConfig({
  // NOTE: previously set a top-level `tsconfig` here for some plugins; remove because
  // `UserConfigExport` does not include `tsconfig` and it causes a type error.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  build: {
    rollupOptions: {
      input: "src/extension/extension.ts",
      external: ["vscode"],
    },
  },

  plugins: [
    svelte(),
    VitePluginVSCode({
      recommended: true,
      extension: {
        entry: "src/extension/extension.ts",
      },
    }),
  ],
});
