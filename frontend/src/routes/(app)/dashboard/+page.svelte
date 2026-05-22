<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { toastStore } from '$lib/stores/toast.store.svelte';
	import { formatDate } from '$lib/utils/format';

	// Imports mis à jour selon tes fichiers
	import { projectsApi } from '$lib/api/projects.api';
	import type { Project } from '$lib/schemas/project';
	import type { AsyncState } from '$lib/schemas/api';

	import { Plus, Folder, Sparkles, Clock, TriangleAlert, RefreshCw } from '@lucide/svelte';

	// Gestion stricte des 4 états respectant ton schéma (data: Project[] | null, error: ApiErrorBody | null)
	let projectsState = $state<AsyncState<Project[]>>({
		state: 'idle',
		data: null,
		error: null
	});

	async function loadProjects() {
		projectsState.state = 'loading';
		projectsState.error = null;

		try {
			// Appel de la méthode list() telle que définie dans projects.api.ts
			const response = await projectsApi.list();

			// Utilisation du type narrowing de ta réponse ApiResponse<T>
			if (response.success) {
				projectsState.state = 'success';
				projectsState.data = response.data;
			} else {
				projectsState.state = 'error';
				projectsState.error = response.error; // response.error est parfaitement de type ApiErrorBody
				toastStore.add(response.error.message || 'Erreur lors du chargement', 'error');
			}
		} catch (err) {
			projectsState.state = 'error';
			// Création d'un faux ApiErrorBody pour les erreurs réseaux impromptues
			projectsState.error = {
				code: 500,
				type: 'NETWORK_ERROR',
				message: 'Impossible de contacter le serveur'
			};
		}
	}

	// Chargement automatique au montage du composant
	$effect(() => {
		loadProjects();
	});
</script>

<div class="flex w-full flex-col gap-8 pb-8">
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="font-sans text-3xl font-bold tracking-tight text-text-dark">Tableau de bord</h1>
			<p class="mt-1 text-sm text-text-muted">Bienvenue sur votre espace de travail.</p>
		</div>

		<Button variant="primary" class="gap-2 font-semibold shadow-sm">
			<Plus size={18} /> Nouveau projet
		</Button>
	</div>

	<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
		<Card class="flex items-center gap-4 border-outline-light">
			<div class="rounded-lg bg-blue-50 p-3 text-primary">
				<Folder size={24} />
			</div>
			<div>
				<div class="text-xs font-semibold tracking-wider text-text-muted uppercase">
					Projets Actifs
				</div>
				<div class="mt-0.5 text-2xl font-bold text-text-dark">
					{projectsState.state === 'success' ? projectsState.data?.length || 0 : '—'}
				</div>
			</div>
		</Card>

		<Card class="flex items-center gap-4 border-outline-light">
			<div class="rounded-lg bg-purple-50 p-3 text-secondary">
				<Sparkles size={24} />
			</div>
			<div>
				<div class="text-xs font-semibold tracking-wider text-text-muted uppercase">
					Générations IA
				</div>
				<div class="mt-0.5 text-2xl font-bold text-text-dark">89</div>
			</div>
		</Card>

		<Card class="flex items-center gap-4 border-outline-light">
			<div class="rounded-lg bg-green-50 p-3 text-success">
				<Clock size={24} />
			</div>
			<div>
				<div class="text-xs font-semibold tracking-wider text-text-muted uppercase">
					Dernière Activité
				</div>
				<div class="mt-1 text-sm font-bold text-text-dark">
					{#if projectsState.state === 'success' && projectsState.data?.[0]}
						{formatDate(projectsState.data[0].lastModif)}
					{:else}
						—
					{/if}
				</div>
			</div>
		</Card>
	</div>

	<div class="mt-2 flex flex-col gap-4">
		<h2 class="font-sans text-xl font-bold text-text-dark">Projets récents</h2>

		{#if projectsState.state === 'loading'}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
				{#each Array(3) as _}
					<Card class="flex h-[160px] animate-pulse flex-col gap-4">
						<div class="flex items-start justify-between">
							<div class="h-5 w-1/2 rounded bg-gray-200"></div>
							<div class="h-5 w-16 rounded-pill bg-gray-200"></div>
						</div>
						<div class="mt-2 h-3 w-full rounded bg-gray-200"></div>
						<div class="h-3 w-2/3 rounded bg-gray-200"></div>
						<div class="mt-auto h-3 w-1/3 rounded border-t border-gray-100 bg-gray-200 pt-4"></div>
					</Card>
				{/each}
			</div>
		{:else if projectsState.state === 'error'}
			<Card
				class="flex flex-col items-center justify-center border-2 border-dashed border-red-200 bg-red-50/30 p-12 text-center"
			>
				<TriangleAlert class="mb-3 h-12 w-12 text-danger" />
				<h3 class="text-lg font-semibold text-text-dark">Échec du chargement</h3>
				<p class="mt-1 mb-6 max-w-md text-sm text-text-muted">
					{projectsState.error?.message ||
						'Une erreur est survenue lors de la récupération de vos projets.'}
				</p>
				<Button variant="secondary" class="gap-2" onclick={loadProjects}>
					<RefreshCw size={16} /> Réessayer
				</Button>
			</Card>
		{:else if projectsState.state === 'success'}
			{#if projectsState.data?.length === 0}
				<Card
					class="flex flex-col items-center justify-center border-2 border-dashed border-outline-light p-12 text-center"
				>
					<Folder class="mb-3 h-12 w-12 text-outline opacity-50" />
					<h3 class="text-lg font-semibold text-text-dark">Aucun projet trouvé</h3>
					<p class="mt-1 mb-6 max-w-sm text-sm text-text-muted">
						Vous n'avez pas encore de projet. Créez-en un nouveau pour commencer.
					</p>
					<Button variant="primary" class="gap-2">
						<Plus size={16} /> Créer un projet
					</Button>
				</Card>
			{:else}
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
					{#each projectsState.data as project (project.id)}
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
										variant={project.projetType?.includes('mobile') ? 'pro' : 'starter'}
										class="max-w-[100px] shrink-0 truncate text-[10px] uppercase"
									>
										{project.projetType?.split('-')[0] || 'Générique'}
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
