/**
 * Codes d'erreur standardisés de l'API CDC-Gen.
 *
 * Ces codes correspondent exactement au contrat API défini dans
 * shared/api_contracts.md. Tout ajout ici doit être validé avec
 * le backend avant d'être implémenté.
 *
 * Note sur les codes non-standard (4031, 4032, 4033) :
 * HTTP ne définit pas ces codes — ce sont des codes applicatifs
 * transportés dans le corps de la réponse (champ error.code),
 * pas dans le status HTTP. Le status HTTP reste 403 pour tous.
 */
export enum ApiErrors {
	// ── Authentification ──────────────────────────────────────────────────────
	/** Non authentifié — token absent ou invalide */
	UNAUTHORIZED = 401,

	// ── Autorisations ─────────────────────────────────────────────────────────
	/** Bundle insuffisant pour cette action */
	FORBIDDEN = 403,

	/** Le bundle de l'utilisateur a expiré */
	BUNDLE_EXPIRED = 4031,

	/** L'utilisateur a atteint la limite de son bundle (ex: exports épuisés) */
	BUNDLE_LIMIT = 4032,

	/** Accès refusé à la zone admin */
	ADMIN_FORBIDDEN = 4033,

	// ── Ressources ────────────────────────────────────────────────────────────
	/** Ressource introuvable (projet, template, user...) */
	NOT_FOUND = 404,

	// ── Serveur ───────────────────────────────────────────────────────────────
	/** Erreur lors de l'écriture d'un fichier JSON (ProjetData, History...) */
	STORAGE_ERROR = 500,

	/** Erreur lors de l'appel à l'API IA (Mistral ou autre) */
	AI_ERROR = 502,

	/** Erreur de base de données PostgreSQL */
	DB_ERROR = 503
}

// ─── Messages utilisateur par code d'erreur ───────────────────────────────────

/**
 * Messages d'erreur affichables à l'utilisateur, par code.
 * Ces messages sont des fallbacks — l'API peut retourner un message
 * plus précis dans error.message qui prend la priorité.
 */
export const ERROR_MESSAGES: Record<ApiErrors, string> = {
	[ApiErrors.UNAUTHORIZED]: 'Votre session a expiré. Veuillez vous reconnecter.',
	[ApiErrors.FORBIDDEN]: "Votre offre actuelle ne permet pas cette action.",
	[ApiErrors.BUNDLE_EXPIRED]: "Votre abonnement a expiré. Renouvelez-le pour continuer.",
	[ApiErrors.BUNDLE_LIMIT]: "Vous avez atteint la limite de votre offre pour cette période.",
	[ApiErrors.ADMIN_FORBIDDEN]: "Accès réservé aux administrateurs.",
	[ApiErrors.NOT_FOUND]: "La ressource demandée est introuvable.",
	[ApiErrors.STORAGE_ERROR]: "Erreur lors de la sauvegarde. Réessayez dans quelques instants.",
	[ApiErrors.AI_ERROR]: "Le service IA est temporairement indisponible. Réessayez plus tard.",
	[ApiErrors.DB_ERROR]: "Erreur serveur. Notre équipe a été notifiée."
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Retourne un message utilisateur à partir d'un code d'erreur.
 * Utilise le message de l'API s'il est fourni, sinon le fallback local.
 */
export function getErrorMessage(code: number, apiMessage?: string): string {
	if (apiMessage) return apiMessage
	return ERROR_MESSAGES[code as ApiErrors] ?? 'Une erreur inattendue est survenue.'
}

/**
 * Indique si l'erreur nécessite une redirection vers le login.
 */
export function isAuthError(code: number): boolean {
	return code === ApiErrors.UNAUTHORIZED
}

/**
 * Indique si l'erreur est liée aux restrictions de bundle.
 * Utile pour afficher une invitation à upgrader.
 */
export function isBundleError(code: number): boolean {
	return code === ApiErrors.FORBIDDEN || code === ApiErrors.BUNDLE_EXPIRED || code === ApiErrors.BUNDLE_LIMIT
}