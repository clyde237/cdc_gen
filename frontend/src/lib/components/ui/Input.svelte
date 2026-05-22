<script lang="ts">
  let {
    value = $bindable(''), // Svelte 5 : permet au parent d'utiliser bind:value
    label = '',
    error = '',
    type = 'text',
    placeholder = '',
    id = crypto.randomUUID(), // Génère un ID unique si non fourni (pratique pour l'accessibilité)
    disabled = false,
    class: className = ''
  }: {
    value?: string;
    label?: string;
    error?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    placeholder?: string;
    id?: string;
    disabled?: boolean;
    class?: string;
  } = $props();

  // Classes de l'input basées sur DESIGN.md (border #D1D5DB, transition vers primary et glow de 3px)
  let inputBaseClasses = 'w-full bg-white rounded border px-3 py-2 text-sm text-text-dark transition-all outline-none';
  let focusClasses = 'focus:border-primary focus:ring-[3px] focus:ring-primary/20';
  let errorClasses = 'border-danger focus:border-danger focus:ring-danger/20 text-danger';
  let normalClasses = 'border-outline';

  let computedInputClasses = $derived(`${inputBaseClasses} ${error ? errorClasses : normalClasses} ${error ? '' : focusClasses} ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`);
</script>

<div class="flex flex-col gap-1.5 {className}">
  {#if label}
    <label for={id} class="text-[12px] font-semibold tracking-[0.05em] uppercase text-text-dark">
      {label}
    </label>
  {/if}

  <input 
    {id} 
    {type} 
    bind:value 
    {placeholder} 
    {disabled}
    class={computedInputClasses} 
  />

  {#if error}
    <span class="text-xs text-danger font-medium">{error}</span>
  {/if}
</div>