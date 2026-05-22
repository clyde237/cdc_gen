<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Sparkles } from '@lucide/svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen w-full bg-surface font-sans">
	<div
		class="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-[#004ac6] via-[#2563eb] to-[#7c3aed] p-12 lg:flex lg:w-1/2"
	>
		<div
			class="absolute top-0 right-0 -mt-32 -mr-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl"
		></div>
		<div
			class="absolute bottom-0 left-0 -mb-20 -ml-20 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-3xl"
		></div>

		<div
			class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.03]"
		></div>

		<div class="relative z-10 flex max-w-lg flex-col gap-6 text-white">
			<div
				class="inline-flex w-fit items-center gap-2 rounded-pill border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-md"
			>
				<Sparkles size={16} class="text-[#bdffdb]" />
				<span>Propulsé par Intelligence Artificielle</span>
			</div>

			<h1 class="text-4xl leading-tight font-bold tracking-tight">
				Intelligent Specification Engine
			</h1>

			<p class="text-lg leading-relaxed text-white/80">
				Générez, structurez et pilotez vos cahiers des charges et spécifications techniques en un
				temps record grâce à notre moteur IA d'ingénierie documentaire.
			</p>

			<div
				class="mt-8 flex flex-col gap-3 rounded border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-lg"
			>
				<div
					class="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/60 uppercase"
				>
					<span class="h-2 w-2 rounded-full bg-success"></span> Statut du document
				</div>
				<div class="h-2 w-full overflow-hidden rounded-pill bg-white/10">
					<div class="h-full w-[75%] bg-success" title="75% complété"></div>
				</div>
				<p class="text-sm text-white/90 italic">
					"Section 3.2 : Spécifications de la base de données validées avec succès."
				</p>
			</div>
		</div>

		<div class="absolute bottom-6 text-xs tracking-wide text-white/40">
			© 2026 CDC-Gen. Tous droits réservés.
		</div>
	</div>

	<div
		class="flex w-full flex-col justify-center overflow-y-auto bg-white px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20"
	>
		<div class="mx-auto w-full max-w-md">
			<div class="mb-4 flex items-center gap-3">
				<img
					src="/ise_logo.png"
					alt="Logo KTK-ISE"
					class=""
				/>
			</div>

			{@render children()}
		</div>
	</div>
</div>
