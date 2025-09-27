<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import ThemeColorSelector from './ThemeColorSelector.svelte';
  const dispatch = createEventDispatcher();

  export let theme = [];
  export let onChange: (theme: any[]) => void;

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
PaletteEditor.svelte
-------------------
Now includes ThemeColorSelector for runtime theme color selection and preview.
ThemeColorSelector uses window.getVscodeThemeColors API to enumerate all available theme color CSS variables.
-->

<div class="palette-editor">
  <h2>Theme Editor</h2>
  <div class="theme-list">
    {#each theme as color, i}
      <div class="theme-item">
        <input type="color" bind:value={theme[i]} on:input={(e) => updateColor(i, e.target.value)} />
        <span class="color-value">{color}</span>
        <button type="button" class="remove-btn" on:click={() => removeColor(i)}>Remove</button>
      </div>
    {/each}
  </div>

  <!-- Theme color selector integration -->
  <ThemeColorSelector />
  <div class="add-color">
    <input type="text" bind:value={newColor} class="color-input" placeholder="New Color" />
    <button type="button" class="add-btn" on:click={addColor}>Add Color</button>
  </div>

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
</style>
