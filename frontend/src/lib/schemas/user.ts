/**
 * Interfaces TypeScript pour l'entité Utilisateur.
 * Conformes au contrat API (shared/api_contracts.md) et aux Pydantic models backend.
 *
 * Mapping backend → frontend (snake_case → camelCase) :
 *   user_folder_name → userFolderName
 *   created_at       → createdAt
 *   last_login       → lastLogin
 *   is_active        → isActive
 *
 * Note : Le champ `password` n'apparaît JAMAIS dans les réponses API.
 * Il est uniquement présent dans les payloads d'envoi (UserRegister).
 */

// ─── Entité principale (réponse API) ─────────────────────────────────────────

export interface User {
	/** UUID généré par PostgreSQL */
	id: string

	nom: string
	prenom: string
	email: string

	/**
	 * Identifiant unique du dossier utilisateur dans le système de fichiers.
	 * Format : "{id}_{nom}_{prenom}" — généré côté backend à la création.
	 * Utilisé pour localiser History.json et ProjetsFolder/.
	 */
	userFolderName: string

	/** Code pays ISO 3166-1 alpha-2 ou nom complet — à préciser avec le backend */
	country: string | null

	town: string | null

	/**
	 * Décalage UTC en heures (ex: -1, 0, 1, 3...).
	 * Utilisé pour afficher les dates dans le bon fuseau.
	 */
	gmt: number

	/** Format ISO 8601 — ex: "2026-05-03T14:30:00Z" */
	createdAt: string

	/** null si l'utilisateur ne s'est jamais connecté */
	lastLogin: string | null

	/** false si le compte a été suspendu par un admin */
	isActive: boolean
}

// ─── Payload d'inscription ────────────────────────────────────────────────────

export interface UserRegister {
	nom: string
	prenom: string
	email: string
	/** Mot de passe en clair — sera hashé côté backend */
	password: string
	country: string | null
	town: string | null
	gmt: number
}

// ─── Payload de connexion ─────────────────────────────────────────────────────

export interface UserLogin {
	email: string
	password: string
}

// ─── Payload de mise à jour du profil ────────────────────────────────────────

/**
 * Tous les champs sont optionnels pour permettre des mises à jour partielles.
 * Le email et password ont leurs propres endpoints dédiés (sécurité).
 */
export interface UserUpdate {
	nom?: string
	prenom?: string
	country?: string | null
	town?: string | null
	gmt?: number
}

// ─── Payload changement de mot de passe ──────────────────────────────────────

export interface UserPasswordUpdate {
	currentPassword: string
	newPassword: string
}

// ─── Réponse de connexion ─────────────────────────────────────────────────────

/**
 * Retourné par POST /api/auth/login
 * Le token JWT est stocké côté client (cookie httpOnly côté serveur, ou store).
 * À préciser avec le backend (cookie vs localStorage).
 */
export interface AuthResponse {
	user: User
	token: string
}

// ─── Helper types ─────────────────────────────────────────────────────────────

/**
 * Nom complet formaté pour l'affichage.
 * Utile dans Avatar, TopBar, messages de bienvenue.
 */
export function getFullName(user: Pick<User, 'prenom' | 'nom'>): string {
	return `${user.prenom} ${user.nom}`
}

/**
 * Initiales pour l'Avatar (ex: "JD" pour Jean Dupont).
 */
export function getUserInitials(user: Pick<User, 'prenom' | 'nom'>): string {
	return `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
}