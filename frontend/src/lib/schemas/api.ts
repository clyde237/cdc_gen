/**
 * Wrapper générique de toutes les réponses de l'API CDC-Gen.
 *
 * Toutes les réponses du backend respectent ce format :
 *
 * Succès → { success: true, data: T, message: string }
 * Erreur  → { success: false, error: { code, type, message } }
 *
 * L'usage de types discriminés (success: true/false) permet à TypeScript
 * de faire du type narrowing : après un `if (response.success)`, TypeScript
 * sait qu'on est dans ApiSuccess<T> et que `response.data` existe.
 */

// ─── Réponse succès ────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
	success: true
	data: T
	message: string
}

// ─── Corps de l'erreur ────────────────────────────────────────────────────────

export interface ApiErrorBody {
	code: number
	type: string
	message: string
}

// ─── Réponse erreur ───────────────────────────────────────────────────────────

export interface ApiErrorResponse {
	success: false
	error: ApiErrorBody
}

// ─── Union discriminée ────────────────────────────────────────────────────────

/**
 * Type de retour standard de tous les appels API.
 *
 * Exemple d'utilisation :
 *   const response: ApiResponse<Project[]> = await projectsApi.list()
 *   if (response.success) {
 *     console.log(response.data) // Project[] — TypeScript le sait
 *   } else {
 *     console.error(response.error.message) // ApiErrorBody — TypeScript le sait
 *   }
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse

// ─── Helper type guards ───────────────────────────────────────────────────────

/**
 * Type guard pour vérifier si une réponse est un succès.
 * Utile dans les contextes où TypeScript a du mal à inférer.
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
	return response.success === true
}

/**
 * Type guard pour vérifier si une réponse est une erreur.
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
	return response.success === false
}

// ─── Types utilitaires ────────────────────────────────────────────────────────

/**
 * Représente un état de chargement d'une ressource asynchrone.
 * À utiliser dans les stores Svelte pour gérer les états UI.
 *
 * idle    → pas encore chargé (état initial)
 * loading → requête en cours
 * success → données disponibles
 * error   → erreur survenue
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Enveloppe un état async avec ses données et son erreur éventuelle.
 * Utilisé dans les stores pour éviter de jongler avec 3 variables séparées.
 *
 * Exemple dans un store :
 *   let projects = $state<AsyncState<Project[]>>({ state: 'idle', data: null, error: null })
 */
export interface AsyncState<T> {
	state: LoadingState
	data: T | null
	error: ApiErrorBody | null
}