## Question: Are `.svelte` files sometimes transformed to SSR during Vitest (jsdom) runs? (Svelte 5 + Vitest)

I'm seeing Svelte components execute under the SSR/runtime path during Vitest tests even though the test environment is `jsdom`. Is this expected behavior or a misconfiguration? Specifically:

1. Are `.svelte` files sometimes transformed for SSR during Vitest runs even when `test.environment` is `jsdom`? If so, which plugin/transform defaults should contributors use or be aware of?
2. Is `svelteTesting()` from `@testing-library/svelte/vite` generally sufficient to guarantee DOM runtime transforms for Svelte 5 tests, or are there known gaps that require `testTransformMode` hints for some setups?
3. Is there an authoritative `vitest.config.ts` recipe for Svelte 5 + Vitest testing that the community recommends?

## Problem (concise)

When running Svelte component tests with Vitest (jsdom) under Svelte 5, components sometimes throw:

```
Error: lifecycle_function_unavailable — "mount(...) is not available on the server"
```

This indicates the component is executing under Svelte's SSR/runtime mode instead of the DOM runtime, even though Vitest is configured to use jsdom.

## Workaround (short)

In this troubleshooting, I applied the following to work around the issue:

- Added `svelteTesting()` from `@testing-library/svelte/vite` to the Vitest plugins.
- Imported `@testing-library/jest-dom` in `tests/setupTests.ts` and registered it via `test.setupFiles`.
- When needed, added a `testTransformMode.web` hint for `.svelte` files in `vitest.config.ts`.

## Environment

- OS: Windows (PowerShell)
- Svelte: 5.39.6
- vitest: 3.2.4
- @sveltejs/vite-plugin-svelte: 6.2.1
- @testing-library/svelte: 5.2.8
- @testing-library/jest-dom: 6.x

## Key config snippets (what we used)

`vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import path from "path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["tests/setupTests.ts"],
    include: ["tests/**/*.test.{js,ts}"],
    testTransformMode: {
      web: [/\.svelte$/],
      ssr: [],
    },
  },
});
```

`tests/setupTests.ts`

```ts
import "@testing-library/jest-dom";
```

`vite.config.ts` (dev)

```ts
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  plugins: [svelte()],
});
```
