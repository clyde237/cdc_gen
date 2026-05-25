<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade, slide } from 'svelte/transition';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { toastStore } from '$lib/stores/toast.store.svelte';
	import { projectsApi } from '$lib/api/projects.api';
	import type { ProjectCreate } from '$lib/schemas/project';

	import {
		Check,
		Sparkles,
		LayoutTemplate,
		Cloud,
		ShoppingCart,
		FileText,
		X,
		ArrowRight,
		ArrowLeft,
		Loader2,
		Edit3,
		Download,
		Save
	} from '@lucide/svelte';

	// --- ÉTATS DU WIZARD ---
	let currentStep = $state(1);
	const totalSteps = 4;
	let isGenerating = $state(false);
	let generationProgress = $state(0);
	let createdProjectId = $state<string | null>(null);

	// --- DONNÉES DU FORMULAIRE ---
	let formData = $state({
		// Step 1: Infos
		name: '',
		projetType: 'web',
		template: 'agile_standard',
		mainAI_API: 'claude-3.5-sonnet',

		// Step 2: Config
		description: '',
		objectives: [''],
		scope: '',
		// On remplace l'objet par un tableau stockant les IDs sélectionnés
		selectedConstraints: ['mobile', 'ha'] // Sélections par défaut
	});

    // --- CONSTANTES DE SÉLECTION ---
    // C'est ICI qu'il faut ajouter le tableau `templates` !
    const templates = [
        { id: 'agile_standard', icon: LayoutTemplate, title: 'Agile Standard', desc: 'Structure orientée user stories, sprints et critères d\'acceptation.' },
        { id: 'cloud_infra', icon: Cloud, title: 'Cloud Infrastructure', desc: 'Focus sur l\'architecture, la sécurité, les SLA et flux réseau.' },
        { id: 'ecommerce', icon: ShoppingCart, title: 'E-commerce Complete', desc: 'Spécifications catalogue, tunnel d\'achat, paiements.' },
        { id: 'blank', icon: FileText, title: 'Document Vierge', desc: 'Commencez de zéro avec une structure minimale.' }
    ];

	// On définit les contraintes disponibles clairement
	const availableConstraints = [
		{ id: 'responsive', label: 'Responsive Web' },
		{ id: 'mobile', label: 'Application Mobile' },
		{ id: 'cloud', label: 'Cloud Public (AWS/GCP)' },
		{ id: 'ha', label: 'Haute Disponibilité' }
	];

	// Fonction utilitaire pour cocher/décocher une contrainte
	function toggleConstraint(id: string) {
		if (formData.selectedConstraints.includes(id)) {
			formData.selectedConstraints = formData.selectedConstraints.filter((c) => c !== id);
		} else {
			formData.selectedConstraints = [...formData.selectedConstraints, id];
		}
	}

	// --- ACTIONS ---
	function nextStep() {
		if (currentStep === 1 && !formData.name) {
			toastStore.add('Veuillez donner un nom à votre projet.', 'error');
			return;
		}
		if (currentStep === 2 && (!formData.description || !formData.scope)) {
			toastStore.add('La description et le périmètre sont obligatoires.', 'error');
			return;
		}

		if (currentStep === 2) {
			startGeneration();
		} else {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 1) currentStep--;
	}

	/**
	 * Simule la transition Étape 2 -> Étape 3 (Création API) -> Étape 4 (Résultat)
	 */
	async function startGeneration() {
		currentStep = 3; // Passage à l'écran de chargement
		isGenerating = true;
		generationProgress = 0;

		try {
			// 1. Création des métadonnées du projet via API (M03)
			const createPayload: ProjectCreate = {
				name: formData.name,
				projetType: formData.projetType,
				template: formData.template,
				mainAI_API: formData.mainAI_API
			};

			const response = await projectsApi.create(createPayload);

			if (!response.success) throw new Error(response.error.message);
			createdProjectId = response.data.id;

			// 2. Simulation de la barre de progression de l'IA (Module 12 viendra ici plus tard)
			const interval = setInterval(() => {
				generationProgress += Math.floor(Math.random() * 15) + 5;
				if (generationProgress >= 100) {
					generationProgress = 100;
					clearInterval(interval);
					isGenerating = false;
					currentStep = 4; // Passage à l'écran de résultat final
				}
			}, 600);
		} catch (err: any) {
			toastStore.add(err.message || 'Erreur lors de la génération', 'error');
			currentStep = 2; // Retour en arrière en cas d'erreur
			isGenerating = false;
		}
	}

	function addObjective() {
		formData.objectives = [...formData.objectives, ''];
	}
</script>

<div class="mx-auto w-full max-w-5xl pb-12">
	{#if currentStep < 4}
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="font-sans text-3xl font-bold text-text-dark">
					{currentStep === 1
						? 'Nouveau Projet'
						: currentStep === 2
							? 'Configuration du Cahier des Charges'
							: ''}
				</h1>
				<p class="mt-1 text-sm text-text-muted">
					{currentStep === 1
						? 'Configurez les paramètres initiaux de votre document.'
						: currentStep === 2
							? "Fournissez les détails essentiels pour guider l'IA."
							: ''}
				</p>
			</div>
			<Button
				variant="ghost"
				class="text-text-muted hover:text-text-dark"
				onclick={() => goto('/projects')}
			>
				<X size={20} />
			</Button>
		</div>

		<div class="relative mb-12 flex w-full items-center justify-between">
			<div class="absolute top-1/2 left-0 -z-10 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>

			{#each ['Infos', 'Config', 'Génération', 'Résultat'] as label, i}
				{@const stepNum = i + 1}
				<div class="flex flex-col items-center gap-2 bg-surface px-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300
            {currentStep > stepNum
							? 'bg-primary text-white'
							: currentStep === stepNum
								? 'bg-primary text-white ring-4 ring-primary/20'
								: 'bg-gray-200 text-gray-500'}"
					>
						{#if currentStep > stepNum}
							<Check size={16} />
						{:else}
							{stepNum}
						{/if}
					</div>
					<span
						class="text-[10px] font-bold tracking-wider uppercase {currentStep >= stepNum
							? 'text-primary'
							: 'text-gray-400'}"
					>
						{label}
					</span>
				</div>
			{/each}
		</div>
	{/if}

	<div class="w-full">
		{#if currentStep === 1}
			<div in:fade={{ duration: 200 }} class="grid grid-cols-1 gap-8 lg:grid-cols-12">
				<div class="flex flex-col gap-6 lg:col-span-5">
					<Card class="p-6">
						<h2 class="mb-1 text-lg font-bold text-text-dark">Informations Générales</h2>
						<p class="mb-6 text-xs text-text-muted">Détails fondamentaux du projet.</p>

						<div class="space-y-5">
							<Input
								label="Nom du Projet"
								placeholder="Ex: Refonte Site E-commerce"
								bind:value={formData.name}
							/>

							<div class="flex flex-col gap-1.5">
								<label class="text-[12px] font-semibold tracking-[0.05em] text-text-dark uppercase"
									>Type de Projet</label
								>
								<select
									bind:value={formData.projetType}
									class="w-full rounded border border-outline bg-white px-3 py-2.5 text-sm transition-all outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
								>
									<option value="web">Application Web</option>
									<option value="mobile">Application Mobile</option>
									<option value="api">API / Backend</option>
								</select>
							</div>

							<div class="flex flex-col gap-1.5">
								<label
									class="flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.05em] text-secondary uppercase"
								>
									<Sparkles size={14} /> Modèle IA Principal
								</label>
								<select
									bind:value={formData.mainAI_API}
									class="w-full rounded border border-purple-200 bg-purple-50/50 px-3 py-2.5 text-sm font-medium text-secondary transition-all outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/20"
								>
									<option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Recommandé)</option>
									<option value="gpt-4o">GPT-4o (OpenAI)</option>
									<option value="mistral-large">Mistral Large</option>
								</select>
								<p class="mt-1 text-xs text-text-muted">
									Le modèle principal utilisé pour la rédaction et l'analyse.
								</p>
							</div>
						</div>
					</Card>
				</div>

				<div class="lg:col-span-7">
					<Card class="h-full p-6">
						<div class="mb-6 flex items-end justify-between">
							<div>
								<h2 class="mb-1 text-lg font-bold text-text-dark">Sélection du Template</h2>
								<p class="text-xs text-text-muted">
									Choisissez une base pour structurer votre document.
								</p>
							</div>
							<button class="text-sm font-medium text-primary hover:underline">Voir tout →</button>
						</div>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{#each templates as tpl}
								<button
									class="relative rounded-lg border-2 p-4 text-left transition-all duration-200 {formData.template ===
									tpl.id
										? 'border-primary bg-primary/5'
										: 'border-outline-light hover:border-gray-300'}"
									onclick={() => (formData.template = tpl.id)}
								>
									{#if formData.template === tpl.id}
										<div class="absolute top-3 right-3 text-primary"><Check size={18} /></div>
									{/if}
									<div
										class="mb-3 flex h-10 w-10 items-center justify-center rounded border border-outline-light bg-white text-text-dark shadow-sm"
									>
										<tpl.icon size={20} />
									</div>
									<h3 class="mb-1 font-bold text-text-dark">{tpl.title}</h3>
									<p class="text-xs leading-relaxed text-text-muted">{tpl.desc}</p>
								</button>
							{/each}
						</div>
					</Card>
				</div>
			</div>
		{/if}

		{#if currentStep === 2}
			<div in:fade={{ duration: 200 }}>
				<Card class="p-8">
					<div class="mb-8">
						<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-text-dark">
							<FileText size={20} class="text-primary" /> Contexte du Projet
						</h3>
						<div class="space-y-4">
							<div class="flex flex-col gap-1.5">
								<label class="text-[12px] font-semibold tracking-[0.05em] text-text-dark uppercase"
									>Description du projet <span class="text-danger">*</span></label
								>
								<textarea
									bind:value={formData.description}
									rows="3"
									placeholder="Décrivez brièvement la nature du projet, le problème qu'il résout..."
									class="w-full resize-none rounded border border-outline bg-white p-3 text-sm transition-all outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
								></textarea>
							</div>

							<div class="flex flex-col gap-1.5">
								<label class="text-[12px] font-semibold tracking-[0.05em] text-text-dark uppercase"
									>Objectifs principaux</label
								>
								<div class="flex gap-2">
									<Input
										placeholder="Ajouter un objectif (ex: Augmenter les ventes en ligne)"
										bind:value={formData.objectives[formData.objectives.length - 1]}
										class="flex-1"
									/>
									<Button variant="secondary" onclick={addObjective}>Ajouter</Button>
								</div>
							</div>
						</div>
					</div>

					<hr class="mb-8 border-outline-light" />

					<div class="mb-8">
						<h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-text-dark">
							<Check size={20} class="text-secondary" /> Périmètre & Contraintes
						</h3>
						<div class="relative mb-6 flex flex-col gap-1.5">
							<label class="text-[12px] font-semibold tracking-[0.05em] text-text-dark uppercase"
								>Périmètre fonctionnel <span class="text-danger">*</span></label
							>
							<textarea
								bind:value={formData.scope}
								rows="4"
								placeholder="Listez les fonctionnalités clés incluses dans la première phase..."
								class="w-full resize-none rounded border border-outline bg-white p-3 text-sm transition-all outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
							></textarea>
							<Sparkles size={16} class="absolute right-3 bottom-3 text-secondary opacity-50" />
						</div>

						<div class="flex flex-col gap-2">
							<label class="text-[12px] font-semibold tracking-[0.05em] text-text-dark uppercase"
								>Contraintes techniques</label
							>
							<div class="flex flex-col gap-2">
								<label class="text-[12px] font-semibold tracking-[0.05em] text-text-dark uppercase"
									>Contraintes techniques</label
								>
								<div class="flex flex-wrap gap-3">
									{#each availableConstraints as constraint (constraint.id)}
										{@const isChecked = formData.selectedConstraints.includes(constraint.id)}

										<button
											type="button"
											onclick={() => toggleConstraint(constraint.id)}
											class="flex items-center gap-2 rounded border px-3 py-2 {isChecked
												? 'border-primary bg-primary/5 text-primary'
												: 'border-outline text-text-dark hover:border-gray-300'} cursor-pointer text-sm font-medium transition-colors"
										>
											<div
												class="flex h-4 w-4 items-center justify-center rounded-[4px] border {isChecked
													? 'border-primary bg-primary'
													: 'border-gray-300 bg-white'}"
											>
												{#if isChecked}<Check size={12} class="text-white" />{/if}
											</div>
											{constraint.label}
										</button>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
		{/if}

		{#if currentStep === 3}
			<div in:fade={{ duration: 300 }} class="flex flex-col items-center justify-center py-20">
				<div class="relative mb-8 flex h-32 w-32 items-center justify-center">
					<div
						class="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border-2 border-dashed border-secondary/30"
					></div>
					<div
						class="absolute inset-2 animate-[spin_6s_linear_infinite_reverse] rounded-full border-2 border-secondary/10"
					></div>
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-secondary shadow-inner"
					>
						<Sparkles size={32} class="animate-pulse" />
					</div>
				</div>

				<h2 class="mb-3 text-3xl font-bold text-text-dark">L'IA génère votre document...</h2>
				<p class="mb-8 max-w-md text-center text-text-muted">
					Analyse des contraintes et rédaction du périmètre fonctionnel en cours...
				</p>

				<div class="w-full max-w-md">
					<div
						class="mb-2 flex justify-between text-xs font-bold tracking-widest text-secondary uppercase"
					>
						<span>Progression</span>
						<span>{generationProgress}%</span>
					</div>
					<div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
						<div
							class="h-full bg-secondary transition-all duration-300 ease-out"
							style="width: {generationProgress}%"
						></div>
					</div>
				</div>

				<Button
					variant="ghost"
					class="mt-12 text-text-muted"
					onclick={() => {
						isGenerating = false;
						currentStep = 2;
					}}
				>
					Annuler
				</Button>
			</div>
		{/if}

		{#if currentStep === 4}
			<div in:slide={{ duration: 400 }} class="mx-auto flex max-w-4xl flex-col items-center">
				<div
					class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-success shadow-sm"
				>
					<Check size={32} strokeWidth={3} />
				</div>

				<h2 class="mb-3 text-center text-4xl font-bold text-text-dark">
					Votre Cahier des Charges est prêt !
				</h2>
				<p class="mb-12 max-w-xl text-center text-lg text-text-muted">
					Le document a été généré avec succès. Vous pouvez maintenant le réviser, l'ajuster ou
					l'exporter.
				</p>

				<div class="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
					<div class="flex flex-col gap-3 md:col-span-2">
						<Card class="border-l-4 border-l-primary p-5">
							<div class="mb-3 flex items-center justify-between">
								<h3 class="flex items-center gap-2 font-bold text-text-dark">
									<FileText size={18} /> Introduction & Contexte
								</h3>
							</div>
							<p class="mb-4 text-sm leading-relaxed text-text-muted">
								Ce document définit les spécifications fonctionnelles et techniques pour le
								développement de {formData.name}...
							</p>
							<div class="rounded bg-gray-50 p-3 text-sm text-text-dark">
								<strong>Objectifs Clés :</strong>
								<ul class="mt-1 list-disc pl-5 text-text-muted">
									{#each formData.objectives.filter((o) => o.trim() !== '') as obj}
										<li>{obj}</li>
									{/each}
									{#if formData.objectives.filter((o) => o.trim() !== '').length === 0}
										<li>Modernisation de l'infrastructure</li>
									{/if}
								</ul>
							</div>
						</Card>

						<Card
							class="flex cursor-pointer items-center justify-between p-4 font-medium text-text-dark hover:bg-gray-50"
						>
							Besoins Fonctionnels <ArrowRight size={16} class="text-gray-400" />
						</Card>
						<Card
							class="flex cursor-pointer items-center justify-between p-4 font-medium text-text-dark hover:bg-gray-50"
						>
							Architecture Technique <ArrowRight size={16} class="text-gray-400" />
						</Card>
					</div>

					<div class="md:col-span-1">
						<Card class="sticky top-4 flex flex-col gap-3 p-5">
							<h3 class="mb-2 font-bold text-text-dark">Actions</h3>

							<Button
								variant="secondary"
								class="w-full justify-center gap-2 bg-white"
								onclick={() => goto(`/projects/${createdProjectId || 'demo'}`)}
							>
								<Edit3 size={16} /> Modifier le contenu
							</Button>

							<Button
								variant="ghost"
								class="w-full justify-center gap-2 text-secondary hover:bg-purple-50"
							>
								<Sparkles size={16} /> Régénérer une section
							</Button>

							<hr class="my-2 border-outline-light" />

							<Button variant="primary" class="w-full justify-center gap-2">
								<Download size={16} /> Exporter
							</Button>

							<Button
								variant="primary"
								class="w-full justify-center gap-2"
								onclick={() => goto('/projects')}
							>
								<Save size={16} /> Enregistrer et quitter
							</Button>
						</Card>
					</div>
				</div>
			</div>
		{/if}
	</div>

	{#if currentStep < 3}
		<div class="mt-8 flex justify-end gap-3 border-t border-outline-light pt-6">
			<Button variant="ghost" onclick={() => (currentStep === 1 ? goto('/projects') : prevStep())}>
				{currentStep === 1 ? 'Annuler' : 'Retour'}
			</Button>
			<Button variant="primary" class="gap-2 px-8" onclick={nextStep}>
				Continuer <ArrowRight size={16} />
			</Button>
		</div>
	{/if}
</div>
