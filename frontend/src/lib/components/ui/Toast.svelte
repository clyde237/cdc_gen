<script lang="ts">
  import { toastStore } from '$lib/stores/toast.store.svelte';
  // On peut utiliser Lucide pour les icônes
  import { CircleCheck, CircleAlert, Info, X } from '@lucide/svelte';

  const typeStyles = {
    success: 'bg-green-50 border-success text-success',
    error: 'bg-red-50 border-danger text-danger',
    info: 'bg-blue-50 border-primary text-primary'
  };

  const typeIcons = {
    success: CircleCheck,
    error: CircleAlert,
    info: Info
  };
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
  {#each toastStore.toasts as toast (toast.id)}
    <div 
      class="flex items-center gap-3 p-4 rounded shadow-lg border min-w-[300px] pointer-events-auto transition-all {typeStyles[toast.type]}"
      role="alert"
    >
      <svelte:component this={typeIcons[toast.type]} class="w-5 h-5" />
      <span class="flex-1 text-sm font-medium">{toast.message}</span>
      <button 
        class="opacity-70 hover:opacity-100" 
        onclick={() => toastStore.remove(toast.id)}
        aria-label="Fermer"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  {/each}
</div>