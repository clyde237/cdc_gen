import { apiFetch } from './_client';
import type { ApiResponse } from '$lib/schemas/api';
import type { ProjectType } from '$lib/schemas';

export const projectTypesApi = {
  /**
   * Récupérer tous les types de projets disponibles sur la plateforme.
   * (Application Mobile, Site Web, SaaS, Système Embarqué, Projet Interne…)
   *
   * Ces données sont statiques et changent rarement.
   * Le composant appelant peut les mettre en cache localement.
   */
  getAll: (): Promise<ApiResponse<ProjectType[]>> =>
    apiFetch<ProjectType[]>('/api/project-types', {
      method: 'GET',
    }),
};