<script lang="ts">
	import type { Snippet } from 'svelte';
  	import { page } from '$app/stores';
  	import { goto } from '$app/navigation';

	import './layout.css';
	import favicon from '$lib/assets/favicon.jpg';

	import { authStore } from '$lib/stores/auth.store.svelte';
  	import Toast from '$lib/components/ui/Toast.svelte';

  	let { children }: { children: Snippet } = $props();

  // Le "Guard" (Garde-fou) : S'exécute à chaque changement de page ou d'état d'authentification
  $effect(() => {
    // On récupère le chemin actuel (ex: '/dashboard' ou '/auth/login')
    const currentPath = $page.url.pathname;
    
    // On définit quelles routes sont publiques
    const isAuthRoute = currentPath.startsWith('/auth');
    const isPublicRoute = currentPath === '/' || isAuthRoute;

    // Règle 1 : Si non connecté et tente d'accéder à une page privée -> Redirection Login
    if (!authStore.isAuthenticated && !isPublicRoute) {
      goto('/auth/login');
    } 
    // Règle 2 : Si déjà connecté et tente d'aller sur une page de login/register -> Redirection Dashboard
    else if (authStore.isAuthenticated && isAuthRoute) {
      goto('/dashboard');
    }
  });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Toast />
{@render children()}
