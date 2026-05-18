import { apiFetch } from '../_client';
import type { ApiResponse } from '$lib/schemas/api';
import type {
  LiveConnected,
  LiveVisitors,
  UserStats,
  RegistrationStats,
  SubscriptionStats,
  UsageStats,
  DownloadOnlyStats,
  BundleStats,
  RevenueStats,
  ConversionStats,
  ChurnStats,
  CountryStats,
  TimezoneStats,
  StatsPeriodFilter,
} from '$lib/schemas/admin/stats';

/**
 * Convertit un filtre de période en query string.
 */
function periodToQuery(filter?: StatsPeriodFilter): string {
  if (!filter) return '';
  const params = new URLSearchParams();
  if (filter.from) params.set('from', filter.from);
  if (filter.to) params.set('to', filter.to);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const adminStatsApi = {
  // --- Live (temps réel) ---

  /** Utilisateurs actuellement connectés sur la plateforme */
  getLiveConnected: (): Promise<ApiResponse<LiveConnected>> =>
    apiFetch<LiveConnected>('/api/admin/live/connected', { method: 'GET' }),

  /** Visiteurs non connectés actuellement sur la plateforme */
  getLiveVisitors: (): Promise<ApiResponse<LiveVisitors>> =>
    apiFetch<LiveVisitors>('/api/admin/live/visitors', { method: 'GET' }),

  // --- Utilisateurs ---

  /** Vue globale : total, actifs, suspendus, nouveaux aujourd'hui */
  getUsers: (): Promise<ApiResponse<UserStats>> =>
    apiFetch<UserStats>('/api/admin/stats/users', { method: 'GET' }),

  /** Taux d'inscription (inscriptions / visites) par jour */
  getRegistrations: (filter?: StatsPeriodFilter): Promise<ApiResponse<RegistrationStats>> =>
    apiFetch<RegistrationStats>(`/api/admin/stats/registrations${periodToQuery(filter)}`, { method: 'GET' }),

  /** Taux d'abonnement payant et évolution mensuelle */
  getSubscriptions: (filter?: StatsPeriodFilter): Promise<ApiResponse<SubscriptionStats>> =>
    apiFetch<SubscriptionStats>(`/api/admin/stats/subscriptions${periodToQuery(filter)}`, { method: 'GET' }),

  /** Taux d'utilisation active de la plateforme */
  getUsage: (): Promise<ApiResponse<UsageStats>> =>
    apiFetch<UsageStats>('/api/admin/stats/usage', { method: 'GET' }),

  /** Utilisateurs inscrits ayant uniquement téléchargé/exporté sans s'abonner */
  getDownloadOnly: (): Promise<ApiResponse<DownloadOnlyStats>> =>
    apiFetch<DownloadOnlyStats>('/api/admin/stats/downloads', { method: 'GET' }),

  // --- Bundles & Revenus ---

  /** Distribution des utilisateurs par offre */
  getBundles: (): Promise<ApiResponse<BundleStats>> =>
    apiFetch<BundleStats>('/api/admin/stats/bundles', { method: 'GET' }),

  /** Revenus mensuels (souscriptions actives) */
  getRevenue: (filter?: StatsPeriodFilter): Promise<ApiResponse<RevenueStats>> =>
    apiFetch<RevenueStats>(`/api/admin/stats/revenue${periodToQuery(filter)}`, { method: 'GET' }),

  /** Taux de conversion entre offres (visitor → free → starter → pro → business) */
  getConversion: (): Promise<ApiResponse<ConversionStats>> =>
    apiFetch<ConversionStats>('/api/admin/stats/conversion', { method: 'GET' }),

  /** Abonnements non renouvelés (churns) */
  getChurn: (filter?: StatsPeriodFilter): Promise<ApiResponse<ChurnStats>> =>
    apiFetch<ChurnStats>(`/api/admin/stats/churn${periodToQuery(filter)}`, { method: 'GET' }),

  // --- Géographie ---

  /** Distribution des utilisateurs par pays */
  getCountries: (): Promise<ApiResponse<CountryStats>> =>
    apiFetch<CountryStats>('/api/admin/stats/countries', { method: 'GET' }),

  /** Distribution des utilisateurs par fuseau horaire */
  getTimezones: (): Promise<ApiResponse<TimezoneStats>> =>
    apiFetch<TimezoneStats>('/api/admin/stats/timezones', { method: 'GET' }),
};