# Vite Path Aliases

This project uses Vite's path aliasing for imports. The `@` symbol refers to the `src` directory, so you can import files like:

```
import ThemeEditor from '@/extension/webview/ThemeEditor.svelte';
```

instead of using long relative paths. This is configured in `vite.config.ts` and `vitest.config.ts`.

## ESM and testing in this project

ECMAScript Modules (ESM) is the modern JavaScript module system, using `import` and `export` syntax. ESM is the default in Node.js and this project uses ESM (`"type": "module"` in `package.json`).

Vitest is the recommended test runner here — it supports ESM and works well with Svelte and `@testing-library/svelte`. For DOM-style tests ensure the test environment is `jsdom` and load the `@testing-library/jest-dom` matchers via `tests/setupTests.ts` (these matchers work with Vitest).

How to set up ESM and Svelte tests:

- Use `.js` for ESM JavaScript tests and `.ts` for TypeScript tests.
- Ensure `vitest.config.ts` is configured for `test.environment = 'jsdom'` and any Svelte transforms.
- Document any testing setup in this guide.

Examples:

- `ThemeEditor.test.js` (ESM JavaScript)
- `ThemeEditor.test.ts` (ESM TypeScript)

Common pitfalls:

- If you see `Cannot use import statement outside a module`, check that your runner is configured for ESM and that `package.json` includes `"type": "module"`.

Summary:

Always use the `.js` extension for JavaScript and `.ts` for TypeScript. Use Vitest + `@testing-library/svelte` for Svelte component tests and load jest-dom matchers for expressive assertions.

# Svelte Component Testing

Use Vitest and @testing-library/svelte for Svelte component tests. Example command:

```
npx vitest run tests/unit/ThemeEditor.vitest.js
```
