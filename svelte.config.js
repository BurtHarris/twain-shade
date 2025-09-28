import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * Basic Svelte config for Vite projects.
 * Add preprocessors or custom options as needed.
 */
const config = {
  preprocess: vitePreprocess(),
  // You can add more options here
};

export default config;
