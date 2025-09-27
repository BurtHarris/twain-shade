# Svelte + Vitest Testing Investigation (2025-09-27)

## Summary
This document records the troubleshooting steps, findings, and remaining issues encountered while attempting to run Svelte component tests using Vitest in the `twain-shade` project.

## Goals
- Run Svelte component tests (using `@testing-library/svelte` and Vitest)
- Ensure DOM lifecycle functions (e.g., `onMount`) work in tests

## Actions Taken
1. **Verified Vitest Configuration**
   - Confirmed `vitest.config.ts` uses `environment: 'jsdom'` for DOM testing.
   - Checked for local test overrides and SSR imports—none found.
2. **Checked Dependencies**
   - All relevant packages (`svelte`, `@sveltejs/vite-plugin-svelte`, `@testing-library/svelte`, `vitest`) are installed at compatible versions.
   - No duplicate or conflicting installations.
3. **Cleaned Install**
   - Purged `node_modules` and lock files, reinstalled dependencies.
4. **Test Execution**
   - Ran tests using both `npm test` and `npx vitest run --environment jsdom`.
   - Confirmed only one test run per command.
5. **Reviewed Component and Build Configs**
   - `ThemeEditor.svelte` uses only DOM lifecycle and browser APIs.
   - `vite.config.ts` does not force SSR mode.
   - Attempted to force DOM mode in plugin config (option not supported).
6. **Checked for Multiple Configs and Double Runs**
   - Only one config file for Vitest and Vite; no duplicate test runs.

## Key Learnings
- Svelte 5+ and Vitest (as of September 2025) have compatibility issues for DOM-based component testing.
- The error `lifecycle_function_unavailable` (`mount(...)` is not available on the server) occurs when Svelte tests run in SSR/server mode, even with `jsdom` configured.
- No local code or config is forcing SSR; the issue is likely in the Svelte/Vitest integration for Svelte 5+.
- Downgrading Svelte to v4.x is a known workaround, but not desired for this project.
- Alternative test runners (e.g., Jest) may have better support for Svelte 5+ DOM testing.

## Remaining Problem
- **Svelte component tests fail with SSR lifecycle errors in Vitest, despite correct jsdom configuration and compatible dependencies.**
- The root cause is likely a limitation or bug in the Svelte 5+ and Vitest integration for DOM testing.

## Next Steps
- Monitor Svelte and Vitest changelogs for improved Svelte 5+ DOM test support.
- Consider experimenting with Jest or other test runners for Svelte 5+.
- Revisit Svelte 5+ testing as new releases become available.

## Web research
I searched Svelte, Vitest, and Testing Library resources for authoritative references about the `lifecycle_function_unavailable` error and Svelte + Vitest testing.

- Vitest config docs — environment, transform modes, and deps optimizer
   - Link: https://vitest.dev/config/
   - Notes: Vitest uses `environment: 'jsdom'` to run tests in a browser-like JSDOM. It also controls transform mode (web vs ssr) and dependency optimization which affect how Vite plugins (including the Svelte plugin) transform modules for tests. If transformMode.ssr/web is misaligned, plugins may process components in SSR mode.

- Svelte Testing Library (@testing-library/svelte)
   - Link: https://github.com/testing-library/svelte-testing-library
   - Notes: Official guidance recommends adding `svelteTesting()` plugin from `@testing-library/svelte/vite` to `vite.config.ts`/`vitest.config.ts`. The library supports Svelte 3, 4, and 5 and contains fixes and PRs for Svelte 5 compatibility. It also implements auto-cleanup for Vitest.

- Svelte GitHub issues
   - Example: "Svelte 5: vitest + jsdom error: mount(...) is not available on the server" (closed) and other issues mentioning lifecycle errors
   - Link: https://github.com/sveltejs/svelte/issues?q=lifecycle_function_unavailable
   - Notes: There are multiple Svelte issues and discussions around Svelte 5 compatibility with testing tools; some were fixed, others remain open. The `lifecycle_function_unavailable` error appears when code is executed with server-side (SSR) runtime rather than DOM mode. There are PRs and issues around plugin transform flags and test runner integration.

# Lessons learned: Svelte + Vitest testing (2025-09-27)

This note captures the root cause, the fixes we applied, practical lessons, and concrete recipes so future contributors can recover quickly from Svelte/Vitest testing issues.

## One-line summary
If you see errors like `lifecycle_function_unavailable` or "mount(...) is not available on the server" when rendering Svelte components in Vitest, the test run is executing with Svelte's SSR/runtime mode instead of a DOM (web) transform; fix it by ensuring jsdom + the testing helper plugin are active and match the transform mode.

## Root cause
- Vitest runs tests via Vite plugin transforms. If Svelte files are transformed/loaded in SSR mode, Svelte's server runtime is used and lifecycle functions that call `mount()` are not available. This can happen even when `test.environment === 'jsdom'` if transform mode/dependency optimization yields SSR transforms.

## What we did in this repo (quick)
- Added `svelteTesting()` from `@testing-library/svelte/vite` to `vitest.config.ts` so the testing pipeline applies the right transforms and wiring for Svelte tests.
- Added a `tests/setupTests.ts` file that imports `@testing-library/jest-dom` and wired it via `test.setupFiles` so expect-matchers from jest-dom work (e.g., `toBeInTheDocument`).
- Updated brittle assertions in two tests to match the actual DOM shape (Svelte sometimes splits text across nodes).

Result: All tests pass locally after these changes.

## Practical checklist (do this in order)
1) Confirm jsdom environment
   - Ensure `vitest.config.ts` contains `test.environment = 'jsdom'` or run one-off: `npx vitest run --environment jsdom`.

2) Add the Testing Library Svelte plugin
   - Install (if needed):

```powershell
npm install -D @testing-library/svelte
import { defineConfig } from 'vitest/config'

   - Add to `vitest.config.ts` (or `vite.config.ts` if you prefer):

```ts
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'

plugins: [svelte(), svelteTesting()]
```

3) Add jest-dom matchers (recommended)
   - Create `tests/setupTests.ts` with:

```ts
import '@testing-library/jest-dom'
```

   - Register it in `vitest.config.ts`:

```ts
test: {
  environment: 'jsdom',
  setupFiles: ['tests/setupTests.ts']
}
```

4) Adjust transform mode only if necessary
   - If components still behave like they were transformed for SSR, add a `testTransformMode` hint in `vitest.config.ts` to prefer web transforms for `.svelte` files:

```ts
test: {
  testTransformMode: {
    web: [/\.svelte$/],
    ssr: []
  }
}
```

5) Make tests resilient to DOM shape
   - Avoid matching concatenated strings that Svelte may split across nodes. Query the meaningful pieces (e.g., theme name) or use role/label queries and regex when content is inside `<pre>` or split elements.

6) When all else fails: minimal repro and issue
   - Create a tiny repo with one Svelte component and one Vitest test reproducing the error, include `package.json` and `vitest.config.ts` and open an issue with Svelte or Testing Library teams.

## Copyable config recipes

`vitest.config.ts` (example)
```ts
import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import path from 'path'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setupTests.ts'],
    include: ['tests/**/*.test.{js,ts}'],
    // Optional: force web transforms for .svelte during tests
    testTransformMode: {
      web: [/\.svelte$/],
      ssr: []
    }
  }
})
```

`vite.config.ts` (dev/build)
```ts
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  plugins: [svelte()]
})
```

`tests/setupTests.ts`
```ts
import '@testing-library/jest-dom'
```

`package.json` (devDependencies snippet)
```json
{
  "devDependencies": {
    "svelte": "^5.x",
    "@sveltejs/vite-plugin-svelte": "^6.x",
    "vitest": "^3.x",
    "@testing-library/svelte": "^5.x",
    "@testing-library/jest-dom": "^6.x"
  }
}
```

## Short troubleshooting examples
- Run tests forcing jsdom:

```powershell
npx vitest run --environment jsdom
```

- If you see "mount(...) is not available on the server":
  1. Confirm `svelteTesting()` is installed and present in the plugins.
  2. Confirm `tests/setupTests.ts` imports `@testing-library/jest-dom` and `test.setupFiles` points to it.
  3. Try adding `testTransformMode.web` for `.svelte` files.

## Follow-ups and open questions
- Should we add this doc as `docs/testing.md` or `tests/README.md` so it's discoverable for contributors? I can add it as a small follow-up PR.
- Monitor upstream: Svelte and Vitest changelogs for clarifications about transform modes and Svelte 5 support.

---
Updated 2025-09-27 — converted to Lessons Learned; includes fixes applied and reproducible recipes for future contributors.
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import path from 'path'

export default defineConfig({
   resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
   plugins: [svelte(), svelteTesting()],
   test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['tests/setupTests.ts'],
      include: ['tests/**/*.test.{js,ts}'],
      testTransformMode: {
         web: [/\.svelte$/],
         ssr: []
      }
   }
})
```

`vite.config.ts` (if you want plugin present for local dev too)
```ts
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
   resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
   plugins: [svelte()],
})
```

`tests/setupTests.ts`
```ts
import '@testing-library/jest-dom'
```

Minimal `package.json` devDependencies snippet (for reference)
```json
{
   "devDependencies": {
      "svelte": "^5.x",
      "@sveltejs/vite-plugin-svelte": "^6.x",
      "vitest": "^3.x",
      "@testing-library/svelte": "^5.x",
      "@testing-library/jest-dom": "^6.x"
   }
}
```

## Notes and rationale
- The testing-library Svelte plugin is intentionally small and low-risk: it primarily adjusts transforms and provides auto-cleanup hooks that improve test reliability.
- Loading `@testing-library/jest-dom` keeps tests expressive and cross-compatible with jest-style assertions.
- Adjusting `testTransformMode` is advanced; try it only if tests still behave as if running in SSR mode.

## TL;DR (for teammates)
- If Svelte component tests fail with "mount(...) is not available on the server":
   1. Add `svelteTesting()` to your test config.
   2. Ensure `test.environment === 'jsdom'` and load `@testing-library/jest-dom`.
   3. If still failing, force web transforms for `.svelte` test files via `testTransformMode` and open a minimal repro for maintainers if necessary.

---
Updated 2025-09-27 — added step-by-step troubleshooting and example configs to help other contributors.


---
Document created by GitHub Copilot on 2025-09-27.
