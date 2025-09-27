<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let palette = [];
  export let onChange: (palette: any[]) => void;

  let newColor = '#ffffff';

  function addColor() {
    palette = [...palette, newColor];
    onChange?.(palette);
    newColor = '#ffffff';
  }

  function updateColor(index: number, color: string) {
    palette[index] = color;
    palette = [...palette];
    onChange?.(palette);
  }

  function removeColor(index: number) {
    palette = palette.filter((_, i) => i !== index);
    onChange?.(palette);
  }

  function handleOk() {
    dispatch('ok', { palette });
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<div class="palette-editor">
  <h2>Palette Editor</h2>
  <div class="palette-list">
    {#each palette as color, i}
      <div class="palette-item">
        <input type="color" bind:value={palette[i]} on:input={(e) => updateColor(i, e.target.value)} />
        <span class="color-value">{color}</span>
        <button type="button" class="remove-btn" on:click={() => removeColor(i)}>Remove</button>
      </div>
    {/each}
  </div>
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
.palette-editor {
  padding: 1rem;
}
.palette-list {
  margin-bottom: 1rem;
}
.palette-item {
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
