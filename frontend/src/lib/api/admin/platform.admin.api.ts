import { apiFetch } from '../_client';
import type { ApiResponse } from '$lib/schemas/api';
import type { Template, TemplateCreate } from '$lib/schemas';
import type { ProjectType } from '$lib/schemas/project_type';
import type { BundleConfig, BundleType } from '$lib/schemas/bundle';

/**
 * adminPlatformApi — Gestion de la plateforme (réservé superadmin)
 *
 * Permet de modifier la configuration des bundles, gérer les templates
 * disponibles, les types de projets et les moteurs IA actifs.
 */
export const adminPlatformApi = {
  // --- Bundles ---

  /** Récupérer la configuration actuelle de tous les bundles */
  getBundleConfigs: (): Promise<ApiResponse<BundleConfig[]>> =>
    apiFetch<BundleConfig[]>('/api/admin/bundles', { method: 'GET' }),

  /**
   * Modifier la configuration d'un bundle (prix, limites, features).
   * ⚠️ Impact immédiat sur tous les utilisateurs ayant ce bundle actif.
   */
  updateBundleConfig: (
    bundleType: BundleType,
    config: Partial<BundleConfig>
  ): Promise<ApiResponse<BundleConfig>> =>
    apiFetch<BundleConfig>(`/api/admin/bundles/${bundleType}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    }),

  // --- Templates ---

  /** Lister tous les templates de la plateforme (y compris les désactivés) */
  getTemplates: (): Promise<ApiResponse<Template[]>> =>
    apiFetch<Template[]>('/api/admin/templates', { method: 'GET' }),

  /**
   * Ajouter un nouveau template à la bibliothèque.
   * Réservé aux comptes Business pour les templates custom.
   */
  createTemplate: (data: TemplateCreate): Promise<ApiResponse<Template>> =>
    apiFetch<Template>('/api/admin/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Supprimer un template.
   * ⚠️ Vérifier avant suppression qu'aucun projet actif n'utilise ce template.
   */
  deleteTemplate: (templateId: string): Promise<ApiResponse<{ message: string }>> =>
    apiFetch<{ message: string }>(`/api/admin/templates/${templateId}`, {
      method: 'DELETE',
    }),

  // --- Types de projets ---

  /** Lister tous les types de projets configurés sur la plateforme */
  getProjectTypes: (): Promise<ApiResponse<ProjectType[]>> =>
    apiFetch<ProjectType[]>('/api/admin/project-types', { method: 'GET' }),

  // --- Moteurs IA ---

  /** Lister les moteurs IA disponibles et leur statut (actif/inactif) */
  getAIs: (): Promise<ApiResponse<{ id: string; name: string; isActive: boolean }[]>> =>
    apiFetch<{ id: string; name: string; isActive: boolean }[]>('/api/admin/ais', {
      method: 'GET',
    }),
};