<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    class: className = '',
    noPadding = false // Option utile si tu veux une carte avec une image collée aux bords
  }: {
    children: Snippet;
    class?: string;
    noPadding?: boolean;
  } = $props();

  // On applique les tokens du DESIGN.md (bg-surface, shadow-ambient, p-6 = 24px)
  let baseClasses = 'bg-surface rounded shadow-ambient border border-outline-light';
  let computedClasses = $derived(`${baseClasses} ${noPadding ? '' : 'p-6'} ${className}`);
</script>

<div class={computedClasses}>
  {@render children()}
</div>