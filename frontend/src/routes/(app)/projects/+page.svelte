<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import { toastStore } from '$lib/stores/toast.store.svelte';
  import { formatDate } from '$lib/utils/format';
  
  import { projectsApi } from '$lib/api/projects.api'; 
  import type { Project } from '$lib/schemas/project';
  import type { AsyncState } from '$lib/schemas/api';
  
  // Package officiel @lucide/svelte requis
  import { 
    Plus, Search, ListFilter, Clock, TriangleAlert, 
    RefreshCw, SlidersHorizontal, List, LayoutGrid, ChevronLeft, ChevronRight 
  } from '@lucide/svelte';

  let projectsState = $state<AsyncState<Project[]>>({
    state: 'idle',
    data: null,
    error: null
  });

  // États pour la vue, la recherche et les filtres
  let viewMode = $state<'list' | 'grid'>('list');
  let searchQuery = $state('');
  let filterType = $state('all');
  let sortBy = $state('recent');

  // NOUVEAU : États pour la pagination
  let currentPage = $state(1);
  const itemsPerPage = 8; // Nombre de projets affichés par page sur le tableau

  async function loadProjects() {
    projectsState.state = 'loading';
    projectsState.error = null;

    try {
      const response = await projectsApi.list(); 
      if (response.success) {
        projectsState.state = 'success';
        projectsState.data = response.data;
      } else {
        projectsState.state = 'error';
        projectsState.error = response.error; 
        toastStore.add(response.error.message || 'Erreur lors du chargement', 'error');
      }
    } catch (err) {
      projectsState.state = 'error';
      projectsState.error = { code: 500, type: 'NETWORK_ERROR', message: 'Impossible de joindre le serveur' };
    }
  }

  // LOGIQUE RÉACTIVE : 1. Filtrage et Tri globaux
  let filteredProjects = $derived.by(() => {
    if (!projectsState.data) return [];

    let result = projectsState.data.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || 
        project.projetType.toLowerCase().includes(filterType.toLowerCase());
      return matchesSearch && matchesType;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.lastModif).getTime();
      const dateB = new Date(b.lastModif).getTime();
      return sortBy === 'recent' ? dateB - dateA : dateA - dateB;
    });

    // Reset de la page courante si le filtre élimine des pages
    return result;
  });

  // LOGIQUE RÉACTIVE : 2. Découpage pour la pagination courante
  let totalPages = $derived(Math.ceil(filteredProjects.length / itemsPerPage) || 1);
  
  let paginatedProjects = $derived.by(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProjects.slice(start, end);
  });

  // Sécurité pour la pagination lors des recherches agressives
  $effect(() => {
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
  });

  $effect(() => {
    loadProjects();
  });
</script>

<div class="flex flex-col gap-8 w-full pb-8">
  
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h1 class="text-3xl font-bold text-text-dark tracking-tight font-sans">
        Mes Projets
      </h1>
      <p class="text-text-muted mt-1 text-sm">
        Gérez, recherchez et éditez l'ensemble de vos spécifications documentaires.
      </p>
    </div>
    <Button variant="primary" class="gap-2 shadow-sm font-semibold">
      <Plus size={18} /> Nouveau projet
    </Button>
  </div>

  <div class="flex flex-col md:flex-row gap-4 items-center w-full bg-surface p-3 rounded border border-outline-light shadow-sm">
    
    <div class="relative w-full md:flex-1">
      <span class="absolute inset-y-0 left-3 flex items-center text-text-muted pointer-events-none">
        <Search size={18} />
      </span>
      <input 
        type="text" 
        placeholder="Rechercher un projet par son nom..." 
        bind:value={searchQuery}
        class="w-full bg-white rounded border border-outline pl-10 pr-4 py-2 text-sm text-text-dark transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20 outline-none"
      />
    </div>

    <div class="flex items-center gap-2 w-full md:w-[180px] shrink-0">
      <span class="text-text-muted hidden xl:inline"><ListFilter size={16} /></span>
      <select 
        bind:value={filterType}
        class="w-full bg-white rounded border border-outline px-3 py-2 text-sm text-text-dark transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20 outline-none h-[38px]"
      >
        <option value="all">Tous les types</option>
        <option value="web">Web App</option>
        <option value="mobile">Mobile App</option>
        <option value="api">API / Backend</option>
      </select>
    </div>

    <div class="flex items-center gap-2 w-full md:w-[160px] shrink-0">
      <span class="text-text-muted hidden xl:inline"><SlidersHorizontal size={16} /></span>
      <select 
        bind:value={sortBy}
        class="w-full bg-white rounded border border-outline px-3 py-2 text-sm text-text-dark transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/20 outline-none h-[38px]"
      >
        <option value="recent">Plus récent</option>
        <option value="oldest">Plus ancien</option>
      </select>
    </div>

    <div class="flex items-center p-1 bg-gray-100 rounded border border-outline-light shrink-0 w-full md:w-auto justify-center md:justify-start">
      <button 
        class="p-1.5 rounded transition-all {viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-text-dark'}"
        onclick={() => viewMode = 'list'}
        aria-label="Vue Tableau Liste"
      >
        <List size={18} />
      </button>
      <button 
        class="p-1.5 rounded transition-all {viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-text-dark'}"
        onclick={() => viewMode = 'grid'}
        aria-label="Vue Grille Cartes"
      >
        <LayoutGrid size={18} />
      </button>
    </div>

  </div>

  <div class="flex flex-col gap-6">
    
    {#if projectsState.state === 'loading'}
      <div class="space-y-4 animate-pulse">
        <div class="h-12 bg-gray-200 rounded w-full"></div>
        <div class="h-10 bg-gray-100 rounded w-full"></div>
        <div class="h-10 bg-gray-100 rounded w-full"></div>
        <div class="h-10 bg-gray-100 rounded w-full"></div>
      </div>

    {:else if projectsState.state === 'error'}
      <Card class="flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-red-200 bg-red-50/30">
        <TriangleAlert class="text-danger w-12 h-12 mb-3" />
        <h3 class="text-lg font-semibold text-text-dark">Échec du chargement</h3>
        <p class="text-sm text-text-muted max-w-md mt-1 mb-6">
          {projectsState.error?.message || 'Erreur réseau inattendue.'}
        </p>
        <Button variant="secondary" class="gap-2" onclick={loadProjects}>
          <RefreshCw size={16} /> Réessayer
        </Button>
      </Card>

    {:else if projectsState.state === 'success'}
      {#if filteredProjects.length === 0}
        <Card class="flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-outline-light bg-surface-dim/20">
          <Search class="text-text-muted w-12 h-12 mb-3 opacity-40" />
          <h3 class="text-lg font-semibold text-text-dark">Aucun projet</h3>
          <p class="text-sm text-text-muted max-w-sm mt-1">
            Modifiez vos filtres de recherche.
          </p>
        </Card>
      {:else}
        
        {#if viewMode === 'list'}
          <div class="w-full bg-white rounded border border-outline shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-surface border-b border-outline-light text-text-muted font-sans text-xs font-semibold uppercase tracking-wider">
                    <th class="py-3 px-4">Nom du Projet</th>
                    <th class="py-3 px-4">Type</th>
                    <th class="py-3 px-4">Modèle Template</th>
                    <th class="py-3 px-4">Moteur IA</th>
                    <th class="py-3 px-4 text-right">Dernière Modification</th>
                  </tr>
                </thead>
                <tbody class="text-sm text-text-dark divide-y divide-outline-light">
                  {#each paginatedProjects as project (project.id)}
                    <tr class="hover:bg-surface-dim/40 transition-colors group">
                      <td class="py-3.5 px-4 font-semibold">
                        <a href="/projects/{project.id}" class="text-text-dark group-hover:text-primary transition-colors block">
                          {project.name}
                        </a>
                      </td>
                      <td class="py-3.5 px-4">
                        <Badge variant={project.projetType.toLowerCase().includes('mobile') ? 'pro' : 'starter'} class="uppercase text-[9px] px-1.5 py-0.5">
                          {project.projetType.split('-')[0] || 'Générique'}
                        </Badge>
                      </td>
                      <td class="py-3.5 px-4 text-text-muted font-mono text-xs">{project.template}</td>
                      <td class="py-3.5 px-4 text-text-muted">{project.mainAI_API}</td>
                      <td class="py-3.5 px-4 text-right text-text-muted font-sans text-xs">
                        {formatDate(project.lastModif)}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>

            <div class="flex items-center justify-between px-4 py-3 bg-surface border-t border-outline-light text-xs text-text-muted">
              <div>
                Affichage de <span class="font-semibold text-text-dark">{(currentPage - 1) * itemsPerPage + 1}</span> à 
                <span class="font-semibold text-text-dark">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> sur 
                <span class="font-semibold text-text-dark">{filteredProjects.length}</span> projets
              </div>
              
              <div class="flex items-center gap-2">
                <button 
                  class="p-1.5 rounded border border-outline bg-white hover:bg-gray-50 text-text-dark disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
                  disabled={currentPage === 1}
                  onclick={() => currentPage--}
                  aria-label="Page Précédente"
                >
                  <ChevronLeft size={16} />
                </button>
                <span class="font-medium px-2">Page {currentPage} sur {totalPages}</span>
                <button 
                  class="p-1.5 rounded border border-outline bg-white hover:bg-gray-50 text-text-dark disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
                  disabled={currentPage === totalPages}
                  onclick={() => currentPage++}
                  aria-label="Page Suivante"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each filteredProjects as project (project.id)}
              <a href="/projects/{project.id}" class="group block h-full">
                <Card class="h-full flex flex-col hover:border-primary hover:shadow-md transition-all duration-200">
                  <div class="flex justify-between items-start gap-2 mb-3">
                    <h3 class="font-bold text-lg text-text-dark group-hover:text-primary transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    <Badge variant={project.projetType.toLowerCase().includes('mobile') ? 'pro' : 'starter'} class="uppercase text-[10px] shrink-0 truncate max-w-[100px]">
                      {project.projetType.split('-')[0] || 'Générique'}
                    </Badge>
                  </div>
                  
                  <p class="text-sm text-text-muted line-clamp-2 mb-6 flex-1">
                    Projet basé sur le template <strong>{project.template}</strong>, piloté par l'IA <em>{project.mainAI_API}</em>.
                  </p>

                  <div class="flex items-center gap-1.5 mt-auto pt-4 border-t border-outline-light text-xs text-text-muted">
                    <Clock size={14} />
                    <span>Modifié le {formatDate(project.lastModif)}</span>
                  </div>
                </Card>
              </a>
            {/each}
          </div>
        {/if}

      {/if}
    {/if}
  </div>
</div>