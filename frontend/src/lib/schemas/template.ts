/**
 * Interfaces pour les Templates de documents.
 * Un template définit la mise en forme et la structure visuelle
 * d'un CDC généré. Il est distinct du ProjectType qui définit
 * les champs de données.
 */

// ─── Niveau d'accès d'un template ────────────────────────────────────────────

import type { BundleType } from './bundle'

// ─── Entité Template ──────────────────────────────────────────────────────────

export interface Template {
	id: string
	name: string
	description: string

	/**
	 * Niveau de bundle minimum requis pour utiliser ce template.
	 * 'free' = accessible à tous.
	 * Rappel : le bundle Starter accorde 3 templates, Pro et Business = tous.
	 */
	minBundle: BundleType

	/** URL ou chemin vers l'image de prévisualisation du template */
	previewImage: string | null

	/** Catégories pour le filtrage (ex: "Technique", "Commercial", "Résumé") */
	category: string

	/** Ordre d'affichage dans la liste (défini par l'admin) */
	displayOrder: number

	isActive: boolean

	createdAt: string
}

// ─── Payload de création (admin uniquement) ───────────────────────────────────

export interface TemplateCreate {
	name: string
	description: string
	minBundle: BundleType
	category: string
	displayOrder?: number
}