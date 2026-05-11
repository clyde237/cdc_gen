/**
 * Interfaces pour les événements analytics (table admin_events).
 *
 * Ces événements sont générés côté backend à chaque action utilisateur
 * significative. Le frontend les consomme via les endpoints /api/admin/stats/*.
 */

import type { BundleType } from '../bundle'

// ─── Types d'événements ───────────────────────────────────────────────────────

/**
 * Correspond exactement à EVENT_TYPES défini dans le backend Python.
 * Toute modification doit être synchronisée avec le backend.
 */
export type EventType =
	| 'visit'           // Visite de la plateforme (non connecté)
	| 'register'        // Création de compte
	| 'login'           // Connexion
	| 'logout'          // Déconnexion
	| 'subscribe'       // Souscription à un bundle
	| 'unsubscribe'     // Fin d'abonnement
	| 'project_create'  // Création d'un projet
	| 'project_export'  // Export d'un projet
	| 'download'        // Téléchargement sans abonnement
	| 'ai_generate'     // Appel à l'IA

// ─── Entité AdminEvent ────────────────────────────────────────────────────────

export interface AdminEvent {
	id: string
	eventType: EventType
	/** null pour les visiteurs non connectés */
	userId: string | null
	/** null pour les événements non liés à un bundle */
	bundleType: BundleType | null
	country: string | null
	ipAddress: string
	/** Valeur brute du User-Agent (pour analytics navigateur/OS) */
	userAgent: string
	/** Données supplémentaires propres à chaque type d'événement */
	metadata: Record<string, unknown> | null
	createdAt: string
}