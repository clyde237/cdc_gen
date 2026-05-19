<script lang="ts">
  import { goto } from '$app/navigation';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { authStore } from '$lib/stores/auth.store.svelte';
  import { toastStore } from '$lib/stores/toast.store.svelte';
  import type { UserRegister } from '$lib/schemas/user';

  let prenom = $state('');
  let nom = $state('');
  let email = $state('');
  let password = $state('');
  let country = $state('Cameroun');
  let town = $state('');
  let gmt = $state(1);

  let isLoading = $derived(authStore.authState.state === 'loading');
  
  let passwordError = $derived(
    password.length > 0 && password.length < 8 ? '8 caractères minimum requis' : ''
  );

  const countries = ['Cameroun', 'Côte d\'Ivoire', 'Sénégal', 'Mali', 'Gabon', 'France', 'Autre'];
  
  const gmtOptions = [
    { label: 'GMT+0 (Abidjan, Dakar)', value: 0 },
    { label: 'GMT+1 (Douala, Libreville, Paris)', value: 1 },
    { label: 'GMT+2 (Kigali)', value: 2 }
  ];

  async function handleRegister(e: Event) {
    e.preventDefault();
    
    if (!prenom || !nom || !email || !password || !country || !town) {
      toastStore.add('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    if (passwordError) {
      toastStore.add('Le mot de passe ne respecte pas les critères', 'error');
      return;
    }

    const payload: UserRegister = { prenom, nom, email, password, country, town, gmt };
    console.log("Inscription payload:", payload);
    
    toastStore.add('Compte créé ! Veuillez vous connecter.', 'success');
    goto('/auth/login'); 
  }
</script>

<div class="flex flex-col gap-2 mb-6">
  <h2 class="text-3xl font-bold tracking-tight text-text-dark font-sans">Inscription</h2>
  <p class="text-sm text-text-muted">Commencez à rédiger vos cahiers des charges intelligemment.</p>
</div>

<form onsubmit={handleRegister} class="flex flex-col gap-4">
  
  <div class="grid grid-cols-2 gap-4">
    <Input label="Prénom" placeholder="Jean" bind:value={prenom} disabled={isLoading} />
    <Input label="Nom" placeholder="Dupont" bind:value={nom} disabled={isLoading} />
  </div>

  <Input label="Adresse Email professionnel" type="email" placeholder="j.dupont@entreprise.com" bind:value={email} disabled={isLoading} />
  
  <Input label="Mot de passe" type="password" placeholder="••••••••" bind:value={password} error={passwordError} disabled={isLoading} />

  <div class="grid grid-cols-2 gap-4">
    <div class="flex flex-col gap-1.5">
      <label for="country" class="text-[12px] font-semibold tracking-[0.05em] uppercase text-text-dark">Pays</label>
      <select id="country" bind:value={country} disabled={isLoading} class="w-full bg-white rounded border border-outline px-3 py-2 text-sm text-text-dark transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20 outline-none h-[38px] {isLoading ? 'opacity-60 bg-gray-50' : ''}">
        {#each countries as c}
          <option value={c}>{c}</option>
        {/each}
      </select>
    </div>

    <Input label="Ville" placeholder="Douala" bind:value={town} disabled={isLoading} />
  </div>

  <div class="flex flex-col gap-1.5">
    <label for="gmt" class="text-[12px] font-semibold tracking-[0.05em] uppercase text-text-dark">Fuseau Horaire (GMT)</label>
    <select id="gmt" bind:value={gmt} disabled={isLoading} class="w-full bg-white rounded border border-outline px-3 py-2 text-sm text-text-dark transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20 outline-none h-[38px] {isLoading ? 'opacity-60 bg-gray-50' : ''}">
      {#each gmtOptions as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <Button type="submit" variant="primary" class="w-full py-2.5 font-semibold shadow-md mt-2" disabled={isLoading}>
    {isLoading ? 'Création du compte...' : 'Créer mon compte'}
  </Button>
</form>

<div class="mt-6 pt-4 border-t border-outline-light text-center text-sm text-text-muted">
  Vous possédez déjà un compte ? 
  <a href="/auth/login" class="font-semibold text-primary hover:text-primary-hover transition-colors">
    Se connecter
  </a>
</div>