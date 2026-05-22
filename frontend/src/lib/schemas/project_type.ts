/**
 * Interfaces pour les Types de Projets.
 *
 * Un ProjectType définit QUELS CHAMPS composent un projet.
 * C'est lui qui alimente le DynamicFieldRenderer (M08).
 *
 * Exemple : le type "CDC Logiciel" peut avoir les champs :
 *   - "Nom du projet" (text, required)
 *   - "Description" (textarea, required)
 *   - "Budget estimé" (number, optional)
 *   - "Technologie cible" (select, options: ["Web", "Mobile", "Desktop"])
 */

// ─── Types de champs disponibles ──────────────────────────────────────────────

export type FieldType = 'text' | 'textarea' | 'select' | 'number' | 'boolean'

// ─── Définition d'un champ de projet ─────────────────────────────────────────

/**
 * Décrit un champ individuel d'un formulaire de projet.
 * Ces définitions viennent du backend (ProjectType.fields).
 */
export interface ProjectTypeField {
	/** Clé unique du champ, utilisée dans ProjetData.json */
	key: string

	/** Label affiché à l'utilisateur */
	label: string

	type: FieldType

	required: boolean

	/** Texte d'aide affiché sous le champ */
	helpText?: string

	/** Pour type === 'text' | 'textarea' */
	placeholder?: string

	/** Pour type === 'select' uniquement */
	options?: string[]

	/** Pour type === 'number' */
	min?: number
	max?: number

	/**
	 * Ordre d'affichage dans le formulaire.
	 * Les champs sont triés par displayOrder croissant.
	 */
	displayOrder: number
}

// ─── Entité ProjectType ───────────────────────────────────────────────────────

export interface ProjectType {
	id: string
	name: string
	description: string

	/** Icône Lucide à afficher (ex: "FileText", "Code", "ShoppingBag") */
	icon: string

	/**
	 * Liste des champs qui composent ce type de projet.
	 * C'est cette liste qui alimente le DynamicFieldRenderer.
	 */
	fields: ProjectTypeField[]

	isActive: boolean
	createdAt: string
}

// ─── Données d'un projet (ProjetData.json) ────────────────────────────────────

/**
 * Contenu dynamique d'un projet — structure à N champs.
 * Les clés correspondent aux ProjectTypeField.key du type choisi.
 *
 * On utilise un Record générique car la structure dépend du ProjectType
 * et ne peut pas être connue statiquement.
 *
 * Exemple pour un type "CDC Logiciel" :
 * {
 *   "projectName": "App CDC-Gen",
 *   "description": "Une plateforme SaaS...",
 *   "budget": 500000,
 *   "targetTech": "Web"
 * }
 */
export type ProjectData = Record<string, string | number | boolean | null>