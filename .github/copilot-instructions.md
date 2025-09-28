## Repository guidance for AI coding agents

This file contains short, actionable notes to help an AI agent be productive in this repository.

### Big picture (what this repo is)
- VS Code extension written with Svelte UI (Svelte components live under `src/extension/webview/`), built with Vite.
- Extension entry: `src/extension/extension.ts` (exports `activate`/`deactivate`). Package main points to `dist/extension/extension.js` after build.
- Build uses `vite` + `@tomjs/vite-plugin-vscode`. `vscode` is external at bundle time (see `vite.config.ts`).

### Important files to read first
- `package.json` — scripts, devDependencies, and `
 - `package.json` — scripts, devDependencies, and `type: module` (affects config file extensions).
- `vite.config.ts` — build inputs, plugin list, and externalization rules.
- `vitest.config.ts` and `tests/setupTests.ts` — test environment and injected test setup.
- `CONTRIBUTING.md` — spec-driven workflow with `specify` and Conventional Commits guidance.

### Developer workflows (commands an agent can run)
- Install & prepare hooks: `npm install` then `npm run prepare` (installs Husky hooks).
- Run tests: `npm test` (uses Vitest with jsdom). CI run: `npm run test:ci`.
- Build extension: `npm run build` (runs repo prebuild checks then `vite build`). Developer dev server: `npm run dev`.

### Testing specifics
- Vitest is configured to always use `jsdom` and includes Svelte testing plugin (`svelteTesting()`), and registers `tests/setupTests.ts` for `@testing-library/jest-dom` matchers.
- If Svelte transform issues appear, check `testTransformMode` hints or `svelteTesting()` plugin order.

### Project-specific conventions & gotchas
- Repository uses `type: module` in `package.json`. Configuration files that must be CommonJS (e.g. `commitlint.config.cjs`) should use `.cjs` extension.
- Husky + commitlint are enforced; commit messages must follow Conventional Commits (type(scope): subject). The commit hook runs `npx --no -- commitlint --edit "$1"`.
- Extension build expects `src/extension/extension.ts` as the entry; the `build.rollupOptions.input` points to it.
- `vscode` must be treated as external in the bundle (see `vite.config.ts`).

### Integration points & external dependencies
- VS Code extension host: `vscode` is provided by the host — don’t bundle it.
- Svelte & Vite: plugin order matters; prefer `svelte()` before other Vite plugins related to web/tests.
- Test infra: `vitest` + `@testing-library/svelte` with `svelteTesting()`.

### Typical code changes an agent might make
- Add a command handler: modify `src/extension/extension.ts` and register via `vscode.commands.registerCommand`.
- Add webview component: add Svelte file under `src/extension/webview/`, wire to webview loader in `themeEditorWebview.ts`.
- Tests: add a `tests/*.test.ts` file and import `@testing-library/svelte` utilities; the test runner uses jsdom.

### Quick examples
- Run tests with coverage in CI style:
	- `npm run test:ci`
- Start dev server (for webview hot reload):
	- `npm run dev`
- Build for publishing (runs prebuild checks):
	- `npm run build`

### Where to look for more context
- `CONTRIBUTING.md` — project workflow and spec-kit usage.
- `specs/` — design/specs for larger features (useful to grok the "why").

If anything above is unclear or you want more examples (e.g. test templates, or a sample PR body), ask and I’ll expand this file.
