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
		Plus,
		Search,
		ListFilter,
		Clock,
		TriangleAlert,
		RefreshCw,
		SlidersHorizontal,
		List,
		LayoutGrid,
		ChevronLeft,
		ChevronRight
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
			projectsState.error = {
				code: 500,
				type: 'NETWORK_ERROR',
				message: 'Impossible de joindre le serveur'
			};
		}
	}

	// LOGIQUE RÉACTIVE : 1. Filtrage et Tri globaux
	let filteredProjects = $derived.by(() => {
		if (!projectsState.data) return [];

		let result = projectsState.data.filter((project) => {
			const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesType =
				filterType === 'all' || project.projetType.toLowerCase().includes(filterType.toLowerCase());
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

<div class="flex w-full flex-col gap-8 pb-8">
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="font-sans text-3xl font-bold tracking-tight text-text-dark">Mes Projets</h1>
			<p class="mt-1 text-sm text-text-muted">
				Gérez, recherchez et éditez l'ensemble de vos spécifications documentaires.
			</p>
		</div>
		<a
			href="/projects/new"
			class="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
		>
			<Plus size={18} /> Nouveau projet
		</a>
	</div>

	<div
		class="flex w-full flex-col items-center gap-4 rounded border border-outline-light bg-surface p-3 shadow-sm md:flex-row"
	>
		<div class="relative w-full md:flex-1">
			<span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted">
				<Search size={18} />
			</span>
			<input
				type="text"
				placeholder="Rechercher un projet par son nom..."
				bind:value={searchQuery}
				class="w-full rounded border border-outline bg-white py-2 pr-4 pl-10 text-sm text-text-dark transition-all outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
			/>
		</div>

		<div class="flex w-full shrink-0 items-center gap-2 md:w-[180px]">
			<span class="hidden text-text-muted xl:inline"><ListFilter size={16} /></span>
			<select
				bind:value={filterType}
				class="h-[38px] w-full rounded border border-outline bg-white px-3 py-2 text-sm text-text-dark transition-all outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
			>
				<option value="all">Tous les types</option>
				<option value="web">Web App</option>
				<option value="mobile">Mobile App</option>
				<option value="api">API / Backend</option>
			</select>
		</div>

		<div class="flex w-full shrink-0 items-center gap-2 md:w-[160px]">
			<span class="hidden text-text-muted xl:inline"><SlidersHorizontal size={16} /></span>
			<select
				bind:value={sortBy}
				class="h-[38px] w-full rounded border border-outline bg-white px-3 py-2 text-sm text-text-dark transition-all outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
			>
				<option value="recent">Plus récent</option>
				<option value="oldest">Plus ancien</option>
			</select>
		</div>

		<div
			class="flex w-full shrink-0 items-center justify-center rounded border border-outline-light bg-gray-100 p-1 md:w-auto md:justify-start"
		>
			<button
				class="rounded p-1.5 transition-all {viewMode === 'list'
					? 'bg-white text-primary shadow-sm'
					: 'text-gray-400 hover:text-text-dark'}"
				onclick={() => (viewMode = 'list')}
				aria-label="Vue Tableau Liste"
			>
				<List size={18} />
			</button>
			<button
				class="rounded p-1.5 transition-all {viewMode === 'grid'
					? 'bg-white text-primary shadow-sm'
					: 'text-gray-400 hover:text-text-dark'}"
				onclick={() => (viewMode = 'grid')}
				aria-label="Vue Grille Cartes"
			>
				<LayoutGrid size={18} />
			</button>
		</div>
	</div>

	<div class="flex flex-col gap-6">
		{#if projectsState.state === 'loading'}
			<div class="animate-pulse space-y-4">
				<div class="h-12 w-full rounded bg-gray-200"></div>
				<div class="h-10 w-full rounded bg-gray-100"></div>
				<div class="h-10 w-full rounded bg-gray-100"></div>
				<div class="h-10 w-full rounded bg-gray-100"></div>
			</div>
		{:else if projectsState.state === 'error'}
			<Card
				class="flex flex-col items-center justify-center border-2 border-dashed border-red-200 bg-red-50/30 p-12 text-center"
			>
				<TriangleAlert class="mb-3 h-12 w-12 text-danger" />
				<h3 class="text-lg font-semibold text-text-dark">Échec du chargement</h3>
				<p class="mt-1 mb-6 max-w-md text-sm text-text-muted">
					{projectsState.error?.message || 'Erreur réseau inattendue.'}
				</p>
				<Button variant="secondary" class="gap-2" onclick={loadProjects}>
					<RefreshCw size={16} /> Réessayer
				</Button>
			</Card>
		{:else if projectsState.state === 'success'}
			{#if filteredProjects.length === 0}
				<Card
					class="bg-surface-dim/20 flex flex-col items-center justify-center border-2 border-dashed border-outline-light p-12 text-center"
				>
					<Search class="mb-3 h-12 w-12 text-text-muted opacity-40" />
					<h3 class="text-lg font-semibold text-text-dark">Aucun projet</h3>
					<p class="mt-1 max-w-sm text-sm text-text-muted">Modifiez vos filtres de recherche.</p>
				</Card>
			{:else if viewMode === 'list'}
				<div class="w-full overflow-hidden rounded border border-outline bg-white shadow-sm">
					<div class="overflow-x-auto">
						<table class="w-full border-collapse text-left">
							<thead>
								<tr
									class="border-b border-outline-light bg-surface font-sans text-xs font-semibold tracking-wider text-text-muted uppercase"
								>
									<th class="px-4 py-3">Nom du Projet</th>
									<th class="px-4 py-3">Type</th>
									<th class="px-4 py-3">Modèle Template</th>
									<th class="px-4 py-3">Moteur IA</th>
									<th class="px-4 py-3 text-right">Dernière Modification</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-outline-light text-sm text-text-dark">
								{#each paginatedProjects as project (project.id)}
									<tr class="hover:bg-surface-dim/40 group transition-colors">
										<td class="px-4 py-3.5 font-semibold">
											<a
												href="/projects/{project.id}"
												class="block text-text-dark transition-colors group-hover:text-primary"
											>
												{project.name}
											</a>
										</td>
										<td class="px-4 py-3.5">
											<Badge
												variant={project.projetType.toLowerCase().includes('mobile')
													? 'pro'
													: 'starter'}
												class="px-1.5 py-0.5 text-[9px] uppercase"
											>
												{project.projetType.split('-')[0] || 'Générique'}
											</Badge>
										</td>
										<td class="px-4 py-3.5 font-mono text-xs text-text-muted">{project.template}</td
										>
										<td class="px-4 py-3.5 text-text-muted">{project.mainAI_API}</td>
										<td class="px-4 py-3.5 text-right font-sans text-xs text-text-muted">
											{formatDate(project.lastModif)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div
						class="flex items-center justify-between border-t border-outline-light bg-surface px-4 py-3 text-xs text-text-muted"
					>
						<div>
							Affichage de <span class="font-semibold text-text-dark"
								>{(currentPage - 1) * itemsPerPage + 1}</span
							>
							à
							<span class="font-semibold text-text-dark"
								>{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span
							>
							sur
							<span class="font-semibold text-text-dark">{filteredProjects.length}</span> projets
						</div>

						<div class="flex items-center gap-2">
							<button
								class="rounded border border-outline bg-white p-1.5 text-text-dark shadow-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
								disabled={currentPage === 1}
								onclick={() => currentPage--}
								aria-label="Page Précédente"
							>
								<ChevronLeft size={16} />
							</button>
							<span class="px-2 font-medium">Page {currentPage} sur {totalPages}</span>
							<button
								class="rounded border border-outline bg-white p-1.5 text-text-dark shadow-sm transition-all hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
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
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
					{#each filteredProjects as project (project.id)}
						<a href="/projects/{project.id}" class="group block h-full">
							<Card
								class="flex h-full flex-col transition-all duration-200 hover:border-primary hover:shadow-md"
							>
								<div class="mb-3 flex items-start justify-between gap-2">
									<h3
										class="line-clamp-1 text-lg font-bold text-text-dark transition-colors group-hover:text-primary"
									>
										{project.name}
									</h3>
									<Badge
										variant={project.projetType.toLowerCase().includes('mobile')
											? 'pro'
											: 'starter'}
										class="max-w-[100px] shrink-0 truncate text-[10px] uppercase"
									>
										{project.projetType.split('-')[0] || 'Générique'}
									</Badge>
								</div>

								<p class="mb-6 line-clamp-2 flex-1 text-sm text-text-muted">
									Projet basé sur le template <strong>{project.template}</strong>, piloté par l'IA
									<em>{project.mainAI_API}</em>.
								</p>

								<div
									class="mt-auto flex items-center gap-1.5 border-t border-outline-light pt-4 text-xs text-text-muted"
								>
									<Clock size={14} />
									<span>Modifié le {formatDate(project.lastModif)}</span>
								</div>
							</Card>
						</a>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>
