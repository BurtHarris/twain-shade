# Vite Path Aliases

This project uses Vite's path aliasing for imports. The `@` symbol refers to the `src` directory, so you can import files like:

```
import ThemeEditor from '@/extension/webview/ThemeEditor.svelte';
```

instead of using long relative paths. This is configured in `vite.config.ts` and `vitest.config.ts`.

# Jest ESM Test File Instructions

## What is ESM?

ECMAScript Modules (ESM) is the modern JavaScript module system, using `import` and `export` syntax. ESM is now the default in Node.js and many modern projects. In this project, all source, config, and test files use the `.js` extension with ESM syntax, and your `package.json` includes `"type": "module"`.

## Why does ESM matter for Jest?

Jest needs to know how to handle ESM files. In this project, all test files use the `.js` extension with ESM `import` syntax. Jest is configured to treat `.js` files as ESM modules, so you can use `import` statements in all test files. If Jest is not configured for ESM, you may see errors like `SyntaxError: Cannot use import statement outside a module`.

-## How to set up ESM and Svelte tests

- Use the `.js` extension for all config files and test files, and the `.ts` extension for TypeScript source and test files. TypeScript is allowed and encouraged throughout the project.
- Ensure your Jest config (`jest.config.js`) is set up for ESM and Svelte transforms. No need for `extensionsToTreatAsEsm` if your `package.json` uses `"type": "module"`.
- Document this in your project's testing or contribution guide.

## Example

- `ThemeEditor.test.js` (for ESM JavaScript)
- `ThemeEditor.test.ts` (for ESM TypeScript)

## Common Pitfalls

- Using `.js` for ESM tests is correct in this project, as Jest is configured to treat `.js` files as ESM. `.ts` files are also allowed and encouraged for TypeScript. If you see import errors, check your Jest config and ensure Babel is set up for ESM.
- Forgetting to update Jest config for ESM projects can cause transform issues.

## Summary

Always use the `.js` extension for JavaScript and `.ts` for TypeScript. For Svelte and TypeScript component tests, use Vitest with @testing-library/svelte. Jest is used for general JS/TS tests. This ensures smooth test execution and avoids common syntax errors.

# Svelte Component Testing

Use Vitest and @testing-library/svelte for Svelte component tests. Example command:

```
npx vitest run tests/unit/ThemeEditor.vitest.js
```
