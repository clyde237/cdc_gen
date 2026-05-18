import { apiFetch } from './_client';
import type { ApiResponse } from '$lib/schemas/api';
import type { Bundle, BundleConfig, BundleType } from '$lib/schemas';

export const bundlesApi = {
  /**
   * Récupérer la liste de toutes les offres disponibles avec leur configuration.
   * Utilisé sur la page /pricing pour afficher le comparatif.
   */
  getAll: (): Promise<ApiResponse<BundleConfig[]>> =>
    apiFetch<BundleConfig[]>('/api/bundles', {
      method: 'GET',
    }),

  /**
   * Récupérer le bundle actif de l'utilisateur connecté.
   * Utilisé au chargement du dashboard pour connaître les permissions.
   */
  getCurrent: (): Promise<ApiResponse<Bundle>> =>
    apiFetch<Bundle>('/api/bundles/current', {
      method: 'GET',
    }),

  /**
   * Souscrire à une offre.
   * @param bundleType - Le type d'offre cible ('starter' | 'pro' | 'business')
   *
   * Note : la logique de paiement (Mobile Money, etc.) est gérée
   * en amont côté client avant d'appeler cet endpoint.
   */
  subscribe: (bundleType: BundleType): Promise<ApiResponse<Bundle>> =>
    apiFetch<Bundle>('/api/bundles/subscribe', {
      method: 'POST',
      body: JSON.stringify({ bundleType }),
    }),
};