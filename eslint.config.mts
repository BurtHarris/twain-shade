import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginSvelte from "eslint-plugin-svelte";
import svelte from "eslint-plugin-svelte";

const config: any[] = [
  {
    files: ["**/*.svelte"],
    plugins: {
      svelte: pluginSvelte,
    },
    rules: {
      // Add recommended Svelte linting rules
      "svelte/no-at-html-tags": "error",
      "svelte/no-deprecated-events": "warn",
      // Add more rules as needed
    },
  },
  tseslint.configs.recommended,
];

// Explicitly annotate the default export to avoid TypeScript inferring a non-portable type.
export default config as any;
