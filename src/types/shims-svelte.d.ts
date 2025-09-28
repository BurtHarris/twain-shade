// Type declarations for Svelte single-file components
// Allows importing `.svelte` files in TypeScript sources.
import type { SvelteComponentTyped } from 'svelte';

declare module '*.svelte' {
  export default class Component<
    Props = Record<string, any>,
    Events = Record<string, any>,
    Slots = Record<string, any>
  > extends SvelteComponentTyped<Props, Events, Slots> {}
}

export {};
