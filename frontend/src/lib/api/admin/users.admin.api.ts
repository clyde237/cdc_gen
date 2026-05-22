import { apiFetch } from '../_client';
import type { ApiResponse } from '$lib/schemas/api';
import type { User } from '$lib/schemas';
import type { BundleType } from '$lib/schemas/bundle';

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  bundleType?: BundleType | 'all';
  status?: 'active' | 'suspended' | 'all';
}

export const adminUsersApi = {
  /**
   * Lister tous les utilisateurs avec filtres et pagination.
   */
  list: (params: AdminUserListParams = {}): Promise<ApiResponse<User[]>> => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.bundleType && params.bundleType !== 'all') query.set('bundleType', params.bundleType);
    if (params.status && params.status !== 'all') query.set('status', params.status);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<User[]>(`/api/admin/users${qs}`, { method: 'GET' });
  },

  /**
   * Récupérer le détail complet d'un utilisateur (bundle, projets, historique).
   */
  get: (userId: string): Promise<ApiResponse<User>> =>
    apiFetch<User>(`/api/admin/users/${userId}`, { method: 'GET' }),

  /**
   * Suspendre un compte utilisateur.
   * L'utilisateur ne peut plus se connecter mais ses données sont conservées.
   */
  suspend: (userId: string): Promise<ApiResponse<User>> =>
    apiFetch<User>(`/api/admin/users/${userId}/suspend`, { method: 'PUT' }),

  /**
   * Réactiver un compte suspendu.
   */
  activate: (userId: string): Promise<ApiResponse<User>> =>
    apiFetch<User>(`/api/admin/users/${userId}/activate`, { method: 'PUT' }),

  /**
   * Modifier manuellement le bundle d'un utilisateur.
   * Action réservée aux superadmins — utile pour les cas de support.
   */
  setBundle: (userId: string, bundleType: BundleType): Promise<ApiResponse<User>> =>
    apiFetch<User>(`/api/admin/users/${userId}/bundle`, {
      method: 'PUT',
      body: JSON.stringify({ bundleType }),
    }),
};