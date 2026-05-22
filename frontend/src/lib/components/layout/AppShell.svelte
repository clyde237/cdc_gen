<script lang="ts">
  import type { Snippet } from 'svelte';
  import Sidebar from './Sidebar.svelte';
  import TopBar from './TopBar.svelte';
  import Toast from '$lib/components/ui/Toast.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex h-screen bg-background overflow-hidden font-sans">
  <Sidebar />

  <div class="flex-1 flex flex-col h-screen overflow-hidden">
    <TopBar />
    
    <main class="flex-1 overflow-y-auto p-4 md:p-8">
      <div class="max-w-[1280px] mx-auto w-full h-full">
        {@render children()}
      </div>
    </main>
  </div>
</div>

<Toast />