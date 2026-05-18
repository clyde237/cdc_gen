<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
</script>

<main class="p-8 min-h-screen bg-background font-sans flex flex-col gap-4 items-start">
  <h1 class="text-2xl font-bold text-text-dark">Test du Design System</h1>
  
  <Button variant="primary" onclick={() => alert('Primary cliqué !')}>Bouton Primary</Button>
  <Button variant="secondary">Bouton Secondary</Button>
  <Button variant="ghost">Bouton Ghost</Button>
  <Button variant="danger">Bouton Danger</Button>
</main>
