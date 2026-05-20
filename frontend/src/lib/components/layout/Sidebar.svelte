<script lang="ts">
  import { House, FolderGit2, History, Settings } from '@lucide/svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
</script>

<aside class="w-64 bg-surface border-r border-outline-light h-screen hidden md:flex flex-col">
  <div class="p-6 flex items-center gap-3 border-b border-outline-light">
    <img
					src="/ise_logo.png"
					alt="Logo KTK-ISE"
					class=""
				/>
  </div>

  <nav class="flex-1 p-4 flex flex-col gap-2">
    
    <a href="/dashboard" class="group flex items-center gap-3 px-3 py-2 rounded text-text-muted hover:bg-blue-50 hover:text-primary focus:bg-primary focus:text-white font-medium transition-all">
      <House size={18} class="transition-transform group-hover:scale-110" /> 
      Dashboard
    </a>
    
    <a href="/projects" class="group flex items-center gap-3 px-3 py-2 rounded text-text-muted hover:bg-blue-50 hover:text-primary focus:bg-primary focus:text-white font-medium transition-all">
      <FolderGit2 size={18} class="transition-transform group-hover:scale-110" /> 
      Projets
    </a>
    
    <a href="/history" class="group flex items-center gap-3 px-3 py-2 rounded text-text-muted hover:bg-blue-50 hover:text-primary focus:bg-primary focus:text-white font-medium transition-all">
      <History size={18} class="transition-transform group-hover:scale-110" /> 
      Historique
    </a>
    
    <a href="/settings" class="group flex items-center gap-3 px-3 py-2 rounded text-text-muted hover:bg-blue-50 hover:text-primary focus:bg-primary focus:text-white font-medium transition-all">
      <Settings size={18} class="transition-transform group-hover:scale-110" /> 
      Paramètres
    </a>
    
  </nav>

  <div class="p-4 border-t border-outline-light flex flex-col gap-2">
    <div class="text-[12px] font-semibold text-text-muted uppercase tracking-[0.05em]">Votre Forfait</div>
    <Badge variant="pro" class="w-full justify-center py-1.5">Plan Pro Actif</Badge>
  </div>
</aside>