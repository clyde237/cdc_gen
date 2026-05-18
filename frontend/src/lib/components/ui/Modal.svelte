<script lang="ts">
  import type { Snippet } from 'svelte';
  import { X } from '@lucide/svelte';

  let {
    isOpen = $bindable(false),
    title = '',
    children,
    onclose
  }: {
    isOpen: boolean;
    title?: string;
    children: Snippet;
    onclose?: () => void;
  } = $props();

  let dialogRef: HTMLDialogElement;

  // Svelte 5: Réagit aux changements de la variable isOpen
  $effect(() => {
    if (isOpen && dialogRef && !dialogRef.open) {
      dialogRef.showModal(); // API native HTML5
    } else if (!isOpen && dialogRef && dialogRef.open) {
      dialogRef.close();
    }
  });

  function handleClose() {
    isOpen = false;
    if (onclose) onclose();
  }
</script>

<dialog 
  bind:this={dialogRef}
  onclose={handleClose}
  class="backdrop:bg-slate-900/40 p-0 rounded-lg shadow-xl border border-outline-light w-full max-w-lg bg-surface m-auto transition-all"
>
  <div class="flex flex-col">
    <div class="flex justify-between items-center p-4 border-b border-outline-light">
      <h2 class="text-lg font-semibold font-sans text-text-dark">{title}</h2>
      <button onclick={handleClose} class="text-text-muted hover:text-text-dark transition-colors" aria-label="Fermer">
        <X size={20} />
      </button>
    </div>
    
    <div class="p-6">
      {@render children()}
    </div>
  </div>
</dialog>