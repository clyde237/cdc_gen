<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Input from '$lib/components/ui/Input.svelte';

  // Utilisation de lucide pour une icone
  import { Sparkles } from '@lucide/svelte';

  // Variables pour tester le bind:value de notre Input
  let email = $state('');
  let password = $state('');

  function handleLogin() {
    console.log('Tentative de connexion avec les données : ', email, password);
  }
</script>

<main class="p-8 min-h-screen bg-background font-sans flex flex-col items-center justify-center">
  
  <Card class="w-full max-w-md flex flex-col gap-6">
    
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-dark">Connexion</h1>
      <Badge variant="pro">
        <Sparkles class="w-3 h-3 mr-1" /> Plan Pro
      </Badge>
    </div>

    <div class="flex flex-col gap-4">
      <Input 
        label="Adresse Email" 
        type="email" 
        placeholder="jean.dupont@exemple.com" 
        bind:value={email} 
      />
      
      <Input 
        label="Mot de passe" 
        type="password" 
        placeholder="••••••••" 
        bind:value={password}
        error={password.length > 0 && password.length < 6 ? "Le mot de passe est trop court" : ""} 
      />
    </div>

    <Button variant="primary" onclick={handleLogin} class="w-full mt-2">
      Se connecter
    </Button>
    
  </Card>

  <div class="mt-8 flex gap-2">
    <Badge variant="free">Free</Badge>
    <Badge variant="starter">Starter</Badge>
    <Badge variant="pro">Pro</Badge>
    <Badge variant="business">Business</Badge>
  </div>
</main>


