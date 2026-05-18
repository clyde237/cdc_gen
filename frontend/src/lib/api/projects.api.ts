import { apiFetch } from './_client';
import type { ApiResponse } from '$lib/schemas/api';
import type { Project, ProjectDetail, ProjectCreate, ProjectUpdate } from '$lib/schemas';

export const projectsApi = {
  /**
   * Lister tous les projets de l'utilisateur connecté.
   * Retourne uniquement les métadonnées (pas le contenu IA volumétrique).
   * Utilisé pour afficher la grille de projets sur le dashboard.
   */
  list: (): Promise<ApiResponse<Project[]>> =>
    apiFetch<Project[]>('/api/projects', {
      method: 'GET',
    }),

  /**
   * Récupérer un projet avec son contenu complet (données IA incluses).
   * Plus lourd que list() — à n'appeler qu'à l'ouverture d'un projet.
   */
  get: (id: string): Promise<ApiResponse<ProjectDetail>> =>
    apiFetch<ProjectDetail>(`/api/projects/${id}`, {
      method: 'GET',
    }),

  /**
   * Créer un nouveau projet.
   * La génération IA se fait ensuite via aiApi.generate().
   */
  create: (data: ProjectCreate): Promise<ApiResponse<Project>> =>
    apiFetch<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Modifier les métadonnées ou le contenu d'un projet existant.
   */
  update: (id: string, data: ProjectUpdate): Promise<ApiResponse<Project>> =>
    apiFetch<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Supprimer définitivement un projet et ses données IA.
   * ⚠️ Action irréversible — à confirmer côté UI avant appel.
   */
  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiFetch<{ message: string }>(`/api/projects/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Dupliquer un projet existant.
   * Crée un nouveau projet avec les mêmes métadonnées et données IA.
   * Réservé aux offres Starter, Pro et Business.
   */
  duplicate: (id: string): Promise<ApiResponse<Project>> =>
    apiFetch<Project>(`/api/projects/${id}/duplicate`, {
      method: 'POST',
    }),
};