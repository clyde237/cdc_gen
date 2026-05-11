/**
 * Interfaces TypeScript pour les Bundles (abonnements).
 * C'est l'un des types les plus critiques du projet : le bundle actif
 * conditionne l'accès à quasiment toutes les features de l'application.
 */

// ─── Type d'offre ─────────────────────────────────────────────────────────────

/**
 * Les 4 niveaux d'offre disponibles.
 * L'ordre de la liste reflète la hiérarchie (Free < Starter < Pro < Business).
 * Utilisé pour les comparaisons de niveau dans bundle-guard.ts.
 */
export type BundleType = 'free' | 'starter' | 'pro' | 'business'

/** Hiérarchie numérique des bundles pour les comparaisons */
export const BUNDLE_RANK: Record<BundleType, number> = {
	free: 0,
	starter: 1,
	pro: 2,
	business: 3
}

// ─── Entité Bundle (réponse API) ──────────────────────────────────────────────

export interface Bundle {
	id: string
	userId: string
	bundleType: BundleType
	subscribedDate: string
	/** null pour le bundle Free (pas d'expiration formelle, mais pas d'accès payant) */
	expirationDate: string | null
	isActive: boolean
}

// ─── Configuration d'un bundle (depuis les fichiers JSON côté serveur) ────────

/**
 * Représente la configuration complète d'une offre bundle.
 * Ces données viennent de GET /api/bundles et reflètent les *BundleConf.json.
 *
 * Utile pour :
 * - Afficher la page pricing (M09)
 * - Alimenter le bundle.store avec les limites exactes
 */
export interface BundleConfig {
	type: BundleType
	costUnit: 'XAF'
	bundleCost: number
	bundlePeriodicity: number
	bundlePeriodicityUnit: 'month'

	/** Coût d'export en XAF (0 si inclus dans l'offre) */
	exportCost: number

	/** Nombre d'exports sans watermark par période (0 = aucun, -1 = illimité) */
	nbExpNoWatermark: number | 'unlimited'

	branding: boolean
	brandingType: 'unavailable' | 'default' | 'advanced' | 'Full'

	/** Nombre de jours d'historique (0 = pas d'historique, -1 = illimité) */
	projectHistoryDays: number
	fullHistory: boolean

	duplicateProject: boolean

	/** Nombre de templates accordés (0 = aucun, -1 = tous) */
	nbTemplatesAccorded: number | 'full'

	customTemplate: boolean

	/** Nombre d'utilisateurs supplémentaires (0 = solo) */
	nbUsers: number

	support: boolean
	/** Délai de réponse support en heures */
	supportHoursDelay: number

	accessAIsAPIs: boolean
}

// ─── Payload de souscription ──────────────────────────────────────────────────

export interface BundleSubscribe {
	bundleType: BundleType
}

// ─── Helper : vérifications de features ──────────────────────────────────────

/**
 * Vérifie si un bundle est d'un niveau supérieur ou égal à un niveau cible.
 * Exemple : hasBundleLevel('pro', 'starter') → true
 *           hasBundleLevel('free', 'starter') → false
 *
 * Cette fonction est la base de toute la logique de permissions.
 * Elle est utilisée dans bundle-guard.ts (M04).
 */
export function hasBundleLevel(current: BundleType, required: BundleType): boolean {
	return BUNDLE_RANK[current] >= BUNDLE_RANK[required]
}

/**
 * Vérifie si un bundle est expiré.
 * Un bundle Free n'expire jamais (expirationDate = null).
 */
export function isBundleExpired(bundle: Bundle): boolean {
	if (!bundle.expirationDate) return false
	return new Date(bundle.expirationDate) < new Date()
}

/**
 * Retourne le label affichable d'un type de bundle.
 */
export const BUNDLE_LABELS: Record<BundleType, string> = {
	free: 'Free',
	starter: 'Starter',
	pro: 'Pro',
	business: 'Business'
}