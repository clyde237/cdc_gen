/**
 * Interfaces pour les Administrateurs.
 *
 * L'authentification admin est SÉPARÉE de l'authentification utilisateur :
 * - Table distincte (admins vs users)
 * - Endpoint distinct (POST /api/admin/auth/login)
 * - Token JWT distinct (signé avec ADMIN_SECRET_KEY)
 * - Store distinct (admin.store.ts)
 *
 * Cette séparation est une décision de sécurité : un token utilisateur
 * compromis ne donne jamais accès au backoffice.
 */

// ─── Rôles admin ──────────────────────────────────────────────────────────────

/**
 * admin      → accès au dashboard, users, analytics
 * superadmin → accès + gestion de la plateforme (bundles, templates, AIs)
 */
export type AdminRole = 'admin' | 'superadmin'

// ─── Entité Admin ─────────────────────────────────────────────────────────────

export interface Admin {
	id: string
	email: string
	role: AdminRole
	createdAt: string
}

// ─── Payload de connexion admin ───────────────────────────────────────────────

export interface AdminLogin {
	email: string
	password: string
}

// ─── Réponse de connexion admin ───────────────────────────────────────────────

export interface AdminAuthResponse {
	admin: Admin
	token: string
}

// ─── Helper : vérification des droits ────────────────────────────────────────

/**
 * Vérifie si un admin a le droit d'accéder aux fonctions de gestion plateforme.
 * Seul le superadmin peut modifier les bundles, templates, AIs.
 */
export function isSuperAdmin(admin: Admin): boolean {
	return admin.role === 'superadmin'
}