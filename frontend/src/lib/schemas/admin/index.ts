// Barrel export — permet d'importer depuis '$lib/schemas/admin'
export type { Admin, AdminRole, AdminLogin, AdminAuthResponse } from './admin'
export { isSuperAdmin } from './admin'

export type { EventType, AdminEvent } from './events'

export type {
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
	StatsPeriodFilter
} from './stats'