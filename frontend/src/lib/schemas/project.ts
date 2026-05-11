/**
 * Interfaces pour les Projets.
 *
 * Architecture hybride :
 * - Les MÉTADONNÉES du projet (id, name, type...) sont en PostgreSQL → retournées par l'API
 * - Le CONTENU du projet (champs IA) est dans ProjetData.json → récupéré séparément
 *
 * Cette séparation se reflète dans les interfaces :
 *   Project       → métadonnées (ce qu'on liste, trie, filtre)
 *   ProjectDetail → métadonnées + contenu complet (ce qu'on édite)
 */

import type { ProjectData } from './project_type'

// ─── Métadonnées projet (réponse API liste) ───────────────────────────────────

export interface Project {
	id: string
	userId: string
	name: string

	/** Référence à un ProjectType.id */
	projetType: string

	/** Référence à un Template.id */
	template: string

	/** Identifiant de l'IA principale (ex: "mistral") */
	mainAI_API: string

	/** Format ISO 8601 */
	createdAt: string

	/** Format ISO 8601 — mis à jour à chaque sauvegarde */
	lastModif: string

	/**
	 * Chemin relatif vers le fichier ProjetData.json dans le système de fichiers.
	 * Ex: "users/{userFolderName}/ProjetsFolder/{id}.json"
	 * Le frontend n'utilise pas ce chemin directement — il passe par l'API.
	 */
	dataFile: string
}

// ─── Projet avec contenu complet (réponse API détail) ────────────────────────

/**
 * Retourné par GET /api/projects/{id}
 * Inclut les métadonnées ET le contenu du ProjetData.json.
 */
export interface ProjectDetail extends Project {
	data: ProjectData
}

// ─── Payload de création ──────────────────────────────────────────────────────

export interface ProjectCreate {
	name: string
	projetType: string
	template: string
	/** Valeur par défaut : "mistral" */
	mainAI_API: string
}

// ─── Payload de mise à jour ───────────────────────────────────────────────────

/**
 * Utilisé pour sauvegarder les modifications d'un projet.
 * name/template/mainAI_API peuvent changer.
 * projetType ne devrait pas changer après création (risque de perte de données).
 * data contient les valeurs des champs du formulaire.
 */
export interface ProjectUpdate {
	name?: string
	template?: string
	mainAI_API?: string
	data?: ProjectData
}

// ─── Statut de génération IA ──────────────────────────────────────────────────

/**
 * État de la génération IA pour un projet.
 * Utilisé dans le streaming (M12) pour gérer l'UI.
 */
export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'failed'

// ─── Payload de demande de génération IA ─────────────────────────────────────

export interface AIGenerateRequest {
	projectId: string
	/** Prompt personnalisé optionnel — si absent, le backend génère le prompt standard */
	customPrompt?: string
	/** Champs spécifiques à regénérer (si absent, génère tout) */
	targetFields?: string[]
}

// ─── Payload d'export ────────────────────────────────────────────────────────

export interface ExportRequest {
	projectId: string
	format: 'pdf'
}

export interface ExportResponse {
	/** URL de téléchargement temporaire du fichier généré */
	downloadUrl: string
	/** Nombre d'exports restants ce mois-ci (null = illimité) */
	exportsRemaining: number | null
}