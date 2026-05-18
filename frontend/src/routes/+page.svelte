<script lang="ts">
  import AppShell from '$lib/components/layout/AppShell.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';

  let isModalOpen = $state(false);
</script>

<AppShell>
  <div class="flex flex-col gap-6 items-start">
    <h1 class="text-3xl font-bold text-text-dark tracking-tight">Tableau de bord</h1>
    <p class="text-text-muted">Bienvenue dans votre espace CDC-Gen.</p>

    <Button variant="primary" onclick={() => isModalOpen = true}>
      Ouvrir la Modale
    </Button>
  </div>
</AppShell>

<Modal bind:isOpen={isModalOpen} title="Nouvelle fonctionnalité">
  <p class="text-text-muted mb-6">Ceci est un test de la modale avec élévation secondaire. Le fond est obscurci et on ne peut pas cliquer derrière !</p>
  <div class="flex justify-end gap-3">
    <Button variant="secondary" onclick={() => isModalOpen = false}>Annuler</Button>
    <Button variant="primary" onclick={() => isModalOpen = false}>Valider</Button>
  </div>
</Modal>