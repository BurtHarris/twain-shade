import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import VitePluginVSCode from '@tomjs/vite-plugin-vscode';
import path from 'path';

export default defineConfig({
  // Top-level tsconfig option (used by some plugins) to avoid deprecated resolve.tsconfigFilename
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  build: {
      rollupOptions: {
    input: 'src/extension/extension.ts',
        external: ['vscode'],
      },
  },

  plugins: [
    svelte(),
    VitePluginVSCode({
      recommended: true,
      extension: {
        entry: 'src/extension/extension.ts',
      }
    })
  ]
});
