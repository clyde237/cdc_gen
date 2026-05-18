<script lang="ts">
    import type { Snippet } from "svelte";

    // Dictionnaire des Classes Tailwind selon la variante choisie
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover border border-transparent',
        secondary: 'bg-surface text-text-dark border border-outline hover:bg-gray-50',
        ghost:'bg-transparent text-text-muted border border-transparent hover:bg-gray-100',
        danger: 'bg-danger text-white hover:bg-red-600 border border-transparent',
    };

    // Svelete 5 : Utilisation de $propos() pour récupérer les propriétés
    let {
        variant = 'primary',
        type = 'button',
        disabled = false,
        class : className = '',
        children,
        onclick
    }: {
        variant?: keyof typeof variants,
        type?: 'button' | 'submit' | 'reset',
        disabled?: boolean,
        class?: string,
        children: Snippet,
        onclick?: (event: MouseEvent) => void,
    } = $props();


    // Svelte 5 : $derived permet de recalculer les classes si une prop change
    let baseClasses = 'inline-flex intems-center justify-center px-4 py-2 text-sm fond-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

    let computedClasses = $derived(`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`);
</script>

<button {type} class={computedClasses} {disabled} {onclick}>
    {@render children()}
</button>