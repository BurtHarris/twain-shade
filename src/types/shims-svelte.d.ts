// Type declarations for Svelte single-file components
// Allows importing `.svelte` files in TypeScript sources.
import type { SvelteComponentTyped } from "svelte";

declare module "*.svelte" {
  export default class Component<
    Props = Record<string, unknown>,
    Events = Record<string, unknown>,
    Slots = Record<string, unknown>,
  > extends SvelteComponentTyped<Props, Events, Slots> {}
}

export {};
