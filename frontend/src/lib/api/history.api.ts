import { apiFetch } from './_client';
import type { ApiResponse } from '$lib/schemas/api';
import type { HistoryResponse } from '$lib/schemas';

export const historyApi = {
  /**
   * Récupérer le journal d'activité de l'utilisateur connecté.
   *
   * La profondeur d'historique dépend du bundle :
   * - Free    → historique indisponible (le backend retourne 403)
   * - Starter → 30 derniers jours
   * - Pro     → historique complet
   * - Business → historique complet
   *
   * @param limit  - Nombre d'entrées à récupérer (défaut serveur : 50)
   * @param offset - Pagination (défaut : 0)
   */
  get: (limit?: number, offset?: number): Promise<ApiResponse<HistoryResponse>> => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.set('limit', String(limit));
    if (offset !== undefined) params.set('offset', String(offset));

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<HistoryResponse>(`/api/history${query}`, {
      method: 'GET',
    });
  },
};