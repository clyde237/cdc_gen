<script lang="ts">
  import { Bell, Menu } from '@lucide/svelte';
</script>

<header class="h-16 bg-surface border-b border-outline-light flex items-center justify-between px-6">
  <button class="md:hidden p-2 text-text-muted hover:bg-surface-dim rounded">
    <Menu size={24} />
  </button>

  <div class="flex-1"></div>

  <div class="flex items-center gap-4">
    <button class="relative p-2 text-text-muted hover:text-text-dark transition-colors">
      <Bell size={20} />
      <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-surface"></span>
    </button>
    
    <div class="flex items-center gap-3 border-l border-outline-light pl-4 cursor-pointer hover:opacity-80">
      <div class="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold text-sm">
        JD
      </div>
      <span class="text-sm font-medium text-text-dark hidden sm:block">Jean Dupont</span>
    </div>
  </div>
</header>