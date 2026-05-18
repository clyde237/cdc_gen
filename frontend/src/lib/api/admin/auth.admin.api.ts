import { apiFetch } from '../_client';
import type { ApiResponse } from '$lib/schemas/api';
import type { Admin, AdminAuthResponse } from '$lib/schemas/admin/admin';

/**
 * adminAuthApi — Authentification du backoffice
 *
 * Entité séparée de l'auth utilisateur.
 * Token admin stocké sous 'admin_token' (différent de 'token').
 * Un token utilisateur compromis ne donne jamais accès au backoffice.
 */
export const adminAuthApi = {
  /**
   * Connexion admin.
   * Le token retourné doit être stocké sous la clé 'admin_token' en localStorage.
   */
  login: (credentials: { email: string; password: string }): Promise<ApiResponse<AdminAuthResponse>> =>
    apiFetch<AdminAuthResponse>('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /**
   * Déconnexion admin.
   * Le composant appelant doit supprimer 'admin_token' du localStorage.
   */
  logout: (): Promise<ApiResponse<{ message: string }>> =>
    apiFetch<{ message: string }>('/api/admin/auth/logout', {
      method: 'POST',
    }),
};