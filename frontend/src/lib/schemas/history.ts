/**
 * Interfaces pour l'Historique utilisateur (History.json).
 *
 * L'historique est stocké en fichier JSON côté serveur (pas en PostgreSQL)
 * car son volume est croissant et non structuré pour les requêtes.
 * Le backend le lit et le retourne paginé via GET /api/history.
 */

// ─── Types d'actions traçées ──────────────────────────────────────────────────

/**
 * Actions utilisateur enregistrées dans l'historique.
 * Sous-ensemble des admin_events — ce sont les actions visibles par l'user.
 */
export type HistoryAction =
	| 'subscription'  // Changement de bundle
	| 'project_create'
	| 'project_update'
	| 'project_delete'
	| 'project_duplicate'
	| 'project_export'
	| 'ai_generate'
	| 'login'
	| 'logout'

// ─── Entité HistoryEntry ──────────────────────────────────────────────────────

/**
 * Une entrée de l'historique.
 * Correspond à la structure de History.json côté serveur.
 */
export interface HistoryEntry {
	/** Format ISO 8601 */
	date: string

	/** Titre court de l'action (ex: "Souscription", "Projet", "Export") */
	title: string

	/** Description de l'action (ex: "From Free to Pro Bundle") */
	action: string

	/**
	 * Référence à la ressource concernée.
	 * Format : "#Type.identifiant" — ex: "#Bundle.Pro", "#Project.mon-projet"
	 */
	reference: string

	/** Type d'action — utilisé pour les icônes et les filtres */
	actionType: HistoryAction
}

// ─── Réponse paginée ──────────────────────────────────────────────────────────

export interface HistoryResponse {
	entries: HistoryEntry[]
	total: number
	/** Page actuelle (base 1) */
	page: number
	/** Nombre d'entrées par page */
	pageSize: number
}

// ─── Paramètres de filtre ─────────────────────────────────────────────────────

export interface HistoryFilters {
	actionType?: HistoryAction
	/** Format ISO 8601 */
	dateFrom?: string
	dateTo?: string
	page?: number
	pageSize?: number
}

// ─── Mapping icônes Lucide par type d'action ─────────────────────────────────

/**
 * Noms d'icônes Lucide à utiliser dans HistoryItem.svelte.
 * Centraliser ici évite d'éparpiller cette logique dans les composants.
 */
export const HISTORY_ICONS: Record<HistoryAction, string> = {
	subscription: 'CreditCard',
	project_create: 'FolderPlus',
	project_update: 'FilePen',
	project_delete: 'Trash2',
	project_duplicate: 'Copy',
	project_export: 'Download',
	ai_generate: 'Sparkles',
	login: 'LogIn',
	logout: 'LogOut'
}