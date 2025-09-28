<script lang="ts">
  declare global {
    interface Window {
      DEV_MODE?: boolean;
    }
  }
  import { onMount } from 'svelte';
  let themeColors: Record<string, string> = {};
  let colorKeys: string[] = [];
  let selectedKey: string = '';
  let selectedValue: string = '';

  // Fetch theme colors from window API
  onMount(() => {
    if (window.getVscodeThemeColors) {
      themeColors = window.getVscodeThemeColors();
      colorKeys = Object.keys(themeColors).sort();
    }
  });

  function selectColor(key: string) {
    selectedKey = key;
    selectedValue = themeColors[key] ?? '';
  }
</script>

<!--
ThemeColorSelector.svelte
------------------------
This component lists all available VS Code theme color CSS variables at runtime (via window.getVscodeThemeColors).
It allows the user to select a theme color and preview its value.
Usage: Place in your webview and connect to your theme or UI logic as needed.

Primary Goal: This tool is designed to help users adjust the Visual Studio Code chromatic windows and UI elements for accessibility and personal enhancement, especially for those with vision limitations or who require improved contrast and color visibility.

Reference: VS Code Theme Color Documentation
https://code.visualstudio.com/api/references/theme-color#dropdown-control
-->

<div class="theme-color-selector">
  <h3>Select a VS Code Theme Color</h3>
  {#if window.DEV_MODE}
    <button type="button" on:click={() => window.debugLogThemeColors && window.debugLogThemeColors()}>
      Log All Theme Colors (Debug)
    </button>
  {/if}
  <select on:change={(e) => selectColor((e.target as HTMLSelectElement)?.value)}>
    <option value="">-- Choose a color --</option>
    {#each colorKeys as key}
      <option value={key}>{key}</option>
    {/each}
  </select>
  {#if selectedKey}
    <div class="color-preview">
      <div class="color-sample" style="background:{selectedValue};"></div>
      <div class="color-info">
        <strong>{selectedKey}</strong>: <span>{selectedValue}</span>
      </div>
    </div>
  {/if}
</div>

<style>
.theme-color-selector {
  margin: 1rem 0;
}
.color-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.color-sample {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.color-info {
  font-family: monospace;
}
</style>
