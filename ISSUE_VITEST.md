## Title

Svelte 5 + Vitest: `.svelte` files appear to be transformed to SSR during jsdom tests — lifecycle_function_unavailable

## Summary / problem

When running Svelte component tests under Vitest with `test.environment: 'jsdom'`, some components throw:

```
Error: lifecycle_function_unavailable — "mount(...) is not available on the server"
```

This looks like the component is executing under Svelte's SSR/server runtime rather than the DOM runtime, despite tests being configured for jsdom.

## Questions / assistance requested

1. Is it expected for `.svelte` files to be transformed into SSR modules during Vitest runs even when `test.environment` is `jsdom`? If so, which transform defaults or plugin flags should be used to force web transforms for test files?
2. Is `svelteTesting()` intended to be sufficient, or are there known cases where `testTransformMode` hints are required? If required, is there a recommended configuration snippet to document?
3. Any guidance on what to provide for a minimal repro that would be most useful to debug this with maintainers?

Thanks for any pointers — happy to attach failing logs or create a minimal repro branch if desired.

## What I tried

- Confirmed `test.environment = 'jsdom'` in `vitest.config.ts`.
- Added `svelteTesting()` from `@testing-library/svelte/vite` to the plugins.
- Added `tests/setupTests.ts` importing `@testing-library/jest-dom` and registered via `test.setupFiles`.
- Ensured `vite.config.ts` does not force SSR for dev builds.
- As a last resort, hinted web transforms with `testTransformMode.web` for `.svelte` files in `vitest.config.ts` (this resolved the issue in our environment).

## Environment

- OS: Windows (PowerShell)
- Svelte: 5.39.6
- vitest: 3.2.4
- @sveltejs/vite-plugin-svelte: 6.2.1
- @testing-library/svelte: 5.2.8
- @testing-library/jest-dom: 6.x

## Minimal config used (important bits)

`vitest.config.ts`
```ts
import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setupTests.ts']
  }
})
```

`tests/setupTests.ts`
```ts
import '@testing-library/jest-dom'
```

## Steps to reproduce

1. Clone the repo (or I can provide a minimal repro branch on request).
2. npm install
3. npm test

Expected: components execute with DOM runtime and lifecycle hooks run.
Observed: lifecycle_function_unavailable error and stack traces into Svelte's server runtime.

## System Info (required)

```
System:
  OS: Windows 11 10.0.26100
  CPU: (20) x64 Intel(R) Core(TM) i9-10850K CPU @ 3.60GHz
  Memory: 17.46 GB / 31.83 GB
Binaries:
  Node: 22.19.0 - C:\Program Files\nodejs\node.EXE
  Yarn: 1.22.22 - C:\Program Files\nodejs\yarn.CMD
  npm: 10.9.3 - C:\Program Files\nodejs\npm.CMD
  pnpm: 10.16.1 - C:\Program Files\nodejs\pnpm.CMD
Browsers:
  Edge: Chromium (140.0.3485.54)
  Internet Explorer: 11.0.26100.1882
npmPackages:
  @vitest/ui: ^3.2.4 => 3.2.4
  vite: ^7.1.7 => 7.1.7
  vitest: ^3.2.4 => 3.2.4
```

## Package manager (required)

- [x] npm
- [ ] yarn
- [ ] pnpm

## Pre-submission checklist (required)

- [x] I read the Code of Conduct
- [x] I read the Contributing Guidelines
- [x] I read the Vitest docs
- [x] I checked for an existing issue that reports the same bug
- [ ] The provided reproduction is a minimal reproducible example (or I will provide one on request)

## Example failing output (excerpt)

Below is a short excerpt from the failing Vitest run showing the Svelte server runtime error we observed; full logs are available on request.

```text
Error: lifecycle_function_unavailable — "mount(...) is not available on the server"
  at lifecycle_function_unavailable (node_modules/svelte/src/internal/server/errors.js)
  at Object.mount (node_modules/svelte/src/runtime/server/index.js)
  at render (node_modules/@testing-library/svelte/dist/index.cjs.js)
  at Object.<anonymous> (tests/unit/ThemeEditor.test.js:15)
``` 
