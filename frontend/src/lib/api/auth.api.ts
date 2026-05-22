import { apiFetch } from './_client';
import type { ApiResponse } from '$lib/schemas/api';
import type { User, UserRegister, UserLogin, AuthResponse } from '$lib/schemas';

/**
 * authApi — Authentification utilisateur
 *
 * Tous les appels passent par apiFetch qui gère :
 * - Le routing mock/réel selon USE_MOCKS
 * - Les headers JWT
 * - La gestion d'erreurs réseau
 */
export const authApi = {
  /**
   * Créer un compte utilisateur.
   * Retourne un token JWT + les infos du compte créé.
   */
  register: (data: UserRegister): Promise<ApiResponse<AuthResponse>> =>
    apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Se connecter avec email + mot de passe.
   * Le token retourné doit être stocké en localStorage par le composant appelant.
   */
  login: (data: UserLogin): Promise<ApiResponse<AuthResponse>> =>
    apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Se déconnecter (invalide la session côté serveur).
   * Le composant appelant doit également supprimer le token du localStorage.
   */
  logout: (): Promise<ApiResponse<{ message: string }>> =>
    apiFetch<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  /**
   * Récupérer le profil de l'utilisateur actuellement connecté.
   * Utilisé au démarrage de l'app pour hydrater le store utilisateur.
   */
  me: (): Promise<ApiResponse<User>> =>
    apiFetch<User>('/api/auth/me', {
      method: 'GET',
    }),
};