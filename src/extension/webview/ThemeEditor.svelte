<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import ThemeColorSelector from './ThemeColorSelector.svelte';
  const dispatch = createEventDispatcher();

  export let theme: string[] = [];
  export let onChange: (theme: string[]) => void;
  export let themeName: string = '';
  export let colorCustomizations: Record<string, string> = {};

  let newColor = '#ffffff';

  function addColor() {
    theme = [...theme, newColor];
    onChange?.(theme);
    newColor = '#ffffff';
  }

  function updateColor(index: number, color: string) {
    theme[index] = color;
    theme = [...theme];
    onChange?.(theme);
  }

  function removeColor(index: number) {
    theme = theme.filter((_, i) => i !== index);
    onChange?.(theme);
  }

  function handleOk() {
    dispatch('ok', { theme });
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<!--
ThemeEditor.svelte
-----------------
This component allows editing a list of theme colors for accessibility and customization.
Integrates ThemeColorSelector for runtime selection and preview of VS Code theme colors.
-->

<div class="theme-editor">
  <h2>Theme Editor</h2>
  <div class="theme-name">
    <div>Current Theme: <strong>{themeName}</strong></div>
    {#if Object.keys(colorCustomizations).length > 0}
      <div class="customization-info">
        <span>Live Customizations Active</span>
        <details>
          <summary>Show Customizations</summary>
          <pre>{JSON.stringify(colorCustomizations, null, 2)}</pre>
        </details>
      </div>
    {/if}
  </div>
  <div class="theme-list">
    {#each theme as color, i}
      <div class="theme-item">
        <input type="color" bind:value={theme[i]} on:input={(e) => updateColor(i, (e.target as HTMLInputElement).value)} />
        <span class="color-value">{color}</span>
        <button type="button" class="remove-btn" on:click={() => removeColor(i)}>Remove</button>
      </div>
    {/each}
  </div>
  <div class="add-color">
    <input type="text" bind:value={newColor} class="color-input" placeholder="New Color" />
    <button type="button" class="add-btn" on:click={addColor}>Add Color</button>
  </div>

  <ThemeColorSelector />

  <div class="action-buttons">
    <button type="button" class="ok-btn" on:click={handleOk}>OK</button>
    <button type="button" class="cancel-btn" on:click={handleCancel}>Cancel</button>
  </div>
</div>

<style>
  .theme-editor {
    padding: 1rem;
  }
  .theme-list {
    margin-bottom: 1rem;
  }
  .theme-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  .color-value {
    min-width: 80px;
    font-family: monospace;
  }
  .add-color {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .theme-name {
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  .customization-info {
    margin-top: 0.5rem;
    font-size: 0.95rem;
    color: #666;
  }
  .customization-info pre {
    background: #f8f8f8;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    max-height: 200px;
    overflow: auto;
  }
</style>
