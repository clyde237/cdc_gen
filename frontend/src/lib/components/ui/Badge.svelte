<script lang="ts">
  import type { Snippet } from 'svelte';

  const variants = {
    free: 'bg-[#F3F4F6] text-[#4B5563]',
    starter: 'bg-[#DBEAFE] text-[#1E40AF]',
    pro: 'bg-[#EDE9FE] text-[#5B21B6]',
    business: 'bg-[#FEF3C7] text-[#92400E]',
    // Ajout de variantes standards utiles
    success: 'bg-green-100 text-success',
    danger: 'bg-red-100 text-danger',
    default: 'bg-gray-100 text-text-muted'
  };

  let {
    variant = 'default',
    class: className = '',
    children
  }: {
    variant?: keyof typeof variants;
    class?: string;
    children: Snippet;
  } = $props();

  // rounded-pill correspond à 9999px comme défini dans ton tailwind.config
  let computedClasses = $derived(`inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-semibold whitespace-nowrap ${variants[variant]} ${className}`);
</script>

<span class={computedClasses}>
  {@render children()}
</span>