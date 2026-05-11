/**
 * Interfaces pour toutes les statistiques du backoffice admin.
 * Chaque interface correspond à un endpoint GET /api/admin/stats/*.
 *
 * Ces types sont volontairement verbeux : ils documentent exactement
 * ce que le backend doit retourner. En cas de désaccord avec le backend,
 * c'est shared/api_contracts.md qui fait foi.
 */

import type { BundleType } from '../bundle'

// ─── Métriques live ───────────────────────────────────────────────────────────

/** GET /api/admin/live/connected */
export interface LiveConnected {
	/** Nombre de sessions actives en ce moment */
	count: number
	/** Liste légère des utilisateurs connectés (pas le User complet) */
	users: Array<{
		userId: string
		email: string
		bundleType: BundleType
		connectedSince: string
	}>
}

/** GET /api/admin/live/visitors */
export interface LiveVisitors {
	/** Visiteurs non connectés actifs (basé sur les sessions anonymes) */
	count: number
}

// ─── Statistiques utilisateurs ────────────────────────────────────────────────

/** GET /api/admin/stats/users */
export interface UserStats {
	totalUsers: number
	activeUsers: number
	suspendedUsers: number
	/** Nouveaux inscrits aujourd'hui */
	newTodayCount: number
}

/** GET /api/admin/stats/registrations */
export interface RegistrationStats {
	/**
	 * Taux d'inscription = inscriptions / visites, sur la période.
	 * Valeur entre 0 et 1 (ex: 0.12 = 12%).
	 */
	conversionRate: number
	/** Données pour le graphe (un point par jour/mois) */
	series: Array<{
		date: string
		registrations: number
		visits: number
	}>
}

/** GET /api/admin/stats/subscriptions */
export interface SubscriptionStats {
	/** % utilisateurs ayant un bundle payant */
	paidRate: number
	/** Évolution mensuelle */
	series: Array<{
		/** Format "YYYY-MM" */
		month: string
		newSubscriptions: number
		totalActive: number
	}>
}

/** GET /api/admin/stats/usage */
export interface UsageStats {
	/** Utilisateurs actifs (au moins une action dans les 30 derniers jours) */
	activeCount: number
	totalCount: number
	/** Taux entre 0 et 1 */
	usageRate: number
}

/** GET /api/admin/stats/downloads */
export interface DownloadOnlyStats {
	/**
	 * Inscrits sans engagement = utilisateurs qui se sont inscrits
	 * et ont uniquement téléchargé/exporté, sans jamais souscrire.
	 */
	count: number
	percentage: number
}

// ─── Statistiques bundles ─────────────────────────────────────────────────────

/** GET /api/admin/stats/bundles */
export interface BundleStats {
	distribution: Array<{
		bundleType: BundleType
		count: number
		percentage: number
	}>
}

/** GET /api/admin/stats/revenue */
export interface RevenueStats {
	/** Revenus du mois courant en XAF */
	currentMonthTotal: number
	currency: 'XAF'
	/** Évolution mensuelle sur 12 mois */
	series: Array<{
		month: string
		revenue: number
	}>
}

/** GET /api/admin/stats/conversion */
export interface ConversionStats {
	/**
	 * Entonnoir de conversion entre niveaux de bundle.
	 * Chaque étape indique le taux de passage au niveau supérieur.
	 */
	funnel: Array<{
		from: BundleType | 'visitor'
		to: BundleType
		rate: number
		count: number
	}>
}

/** GET /api/admin/stats/churn */
export interface ChurnStats {
	/** Abonnements non renouvelés ce mois-ci */
	count: number
	/** Valeur perdue en XAF */
	lostRevenue: number
	series: Array<{
		month: string
		churns: number
	}>
}

// ─── Statistiques géographiques ───────────────────────────────────────────────

/** GET /api/admin/stats/countries */
export interface CountryStats {
	countries: Array<{
		country: string
		/** Code ISO 3166-1 alpha-2 pour les drapeaux */
		countryCode: string
		userCount: number
		percentage: number
	}>
}

/** GET /api/admin/stats/timezones */
export interface TimezoneStats {
	timezones: Array<{
		/** Décalage UTC en heures */
		gmt: number
		/** Label affiché : "UTC+1", "UTC-5"... */
		label: string
		userCount: number
	}>
}

// ─── Paramètres de filtre communs ─────────────────────────────────────────────

/**
 * Paramètres de période applicables à la plupart des endpoints stats.
 * Passés en query params : ?from=2026-01-01&to=2026-05-11
 */
export interface StatsPeriodFilter {
	/** Format ISO 8601 date */
	from?: string
	to?: string
}