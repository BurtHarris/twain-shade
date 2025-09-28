import tseslint from "typescript-eslint";
import pluginSvelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";

// Build the flat config array and avoid nested arrays (some provider configs
// may be arrays). If `tseslint.configs.recommended` is an array, spread it.
const svelteConfig = {
  files: ["**/*.svelte"],
  // Use the svelte-eslint-parser for .svelte files and delegate script parsing
  // to @typescript-eslint/parser so embedded <script lang="ts"> blocks parse.
  languageOptions: {
    parser: svelteParser,
    parserOptions: {
      parser: "@typescript-eslint/parser",
      extraFileExtensions: [".svelte"],
    },
  },
  plugins: {
    svelte: pluginSvelte,
  },
  rules: {
    // Add recommended Svelte linting rules
    "svelte/no-at-html-tags": "error",
  },
};

const recommended = (tseslint && tseslint.configs && tseslint.configs.recommended) || undefined;

const configArray: any[] = [svelteConfig];
if (Array.isArray(recommended)) {
  configArray.push(...recommended);
} else if (recommended) {
  configArray.push(recommended);
}

// Include the svelte plugin's recommended flat config if present; this brings
// the plugin's processors and parser settings which correctly handle .svelte files.
const svelteRecommended = (pluginSvelte && pluginSvelte.configs && (pluginSvelte.configs.recommended || pluginSvelte.configs['flat/recommended'])) || undefined;
if (Array.isArray(svelteRecommended)) {
  configArray.push(...svelteRecommended);
} else if (svelteRecommended) {
  configArray.push(svelteRecommended as any);
}

// Export as the flat config array. Keep typing 'any' to avoid type portability issues.
export default configArray as any;
