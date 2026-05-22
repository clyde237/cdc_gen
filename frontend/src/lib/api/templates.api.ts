import { apiFetch } from './_client';
import type { ApiResponse } from '$lib/schemas/api';
import type { Template } from '$lib/schemas';

export const templatesApi = {
  /**
   * Récupérer tous les templates accessibles selon le bundle de l'utilisateur.
   * Le filtrage par bundle est fait côté serveur.
   */
  getAll: (): Promise<ApiResponse<Template[]>> =>
    apiFetch<Template[]>('/api/templates', {
      method: 'GET',
    }),

  /**
   * Récupérer le détail d'un template (structure complète des sections).
   */
  get: (id: string): Promise<ApiResponse<Template>> =>
    apiFetch<Template>(`/api/templates/${id}`, {
      method: 'GET',
    }),
};