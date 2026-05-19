<script lang="ts">
  import { goto } from '$app/navigation';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { authStore } from '$lib/stores/auth.store.svelte';
  import { toastStore } from '$lib/stores/toast.store.svelte';

  let email = $state('');
  let password = $state('');
  
  let isLoading = $derived(authStore.authState.state === 'loading');

  async function handleLogin(e: Event) {
    e.preventDefault();
    
    if (!email || !password) {
      toastStore.add('Veuillez remplir tous les champs', 'error');
      return;
    }

    const result = await authStore.login({ email, password });
    
    if (result.success) {
      toastStore.add('Ravi de vous revoir !', 'success');
      goto('/dashboard');
    } else {
      toastStore.add(result.error || 'Identifiants invalides', 'error');
    }
  }
</script>

<div class="flex flex-col gap-2 mb-8">
  <h2 class="text-3xl font-bold tracking-tight text-text-dark font-sans">Connexion</h2>
  <p class="text-sm text-text-muted">Accédez à votre gestionnaire de spécifications.</p>
</div>

<form onsubmit={handleLogin} class="flex flex-col gap-5">
  <Input 
    label="Adresse Email" 
    type="email" 
    placeholder="nom@entreprise.com" 
    bind:value={email}
    disabled={isLoading}
  />
  
  <div>
    <div class="flex justify-between items-center mb-1">
      <label class="text-[12px] font-semibold tracking-[0.05em] uppercase text-text-dark">
        Mot de passe
      </label>
      <a href="#forgot" class="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
        Oublié ?
      </a>
    </div>
    <Input 
      type="password" 
      placeholder="••••••••" 
      bind:value={password}
      disabled={isLoading}
    />
  </div>

  <Button type="submit" variant="primary" class="w-full py-2.5 font-semibold shadow-md mt-2" disabled={isLoading}>
    {isLoading ? 'Authentification...' : 'Se connecter'}
  </Button>
</form>

<div class="mt-8 pt-6 border-t border-outline-light text-center text-sm text-text-muted">
  Nouveau sur la plateforme ? 
  <a href="/auth/register" class="font-semibold text-primary hover:text-primary-hover transition-colors">
    Créer un compte gratuitement
  </a>
</div>