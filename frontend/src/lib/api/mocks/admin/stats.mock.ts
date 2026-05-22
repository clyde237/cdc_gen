import type {
  LiveConnected, LiveVisitors, UserStats, RegistrationStats,
  SubscriptionStats, UsageStats, DownloadOnlyStats, BundleStats,
  RevenueStats, ConversionStats, ChurnStats, CountryStats, TimezoneStats,
  StatsPeriodFilter
} from '$lib/schemas/admin/stats';
import { now, oneWeekAgo, oneMonthAgo } from '../_utils';
import { mockUserList } from '../user.mock';
import { mockBundleList } from '../bundle.mock';

// --- Live ---
export const mockLiveConnected: LiveConnected = {
  count: 45,
  users: mockBundleList
    .filter(b => b.isActive)
    .slice(0, 10)
    .map(bundle => ({
      userId: bundle.userId,
      email: mockUserList.find(u => u.id === bundle.userId)?.email || 'unknown@example.com',
      bundleType: bundle.bundleType,
      connectedSince: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    })),
};

export const mockLiveVisitors: LiveVisitors = { count: 120 };

// --- User Stats ---
export const mockUserStats: UserStats = {
  totalUsers: mockUserList.length + 1000,
  activeUsers: Math.floor((mockUserList.length + 1000) * 0.8),
  suspendedUsers: Math.floor((mockUserList.length + 1000) * 0.05),
  newTodayCount: 12,
};

// --- Registration Stats ---
export const mockRegistrationStats: RegistrationStats = {
  conversionRate: 0.25,
  series: Array.from({ length: 11 }, (_, i) => ({
    date: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    registrations: Math.floor(Math.random() * 20) + 5,
    visits: Math.floor(Math.random() * 80) + 20,
  })),
};

// --- Subscription Stats ---
export const mockSubscriptionStats: SubscriptionStats = {
  paidRate: 0.35,
  series: [
    { month: '2026-03', newSubscriptions: 150, totalActive: 400 },
    { month: '2026-04', newSubscriptions: 180, totalActive: 520 },
    { month: '2026-05', newSubscriptions: 200, totalActive: 700 },
  ],
};

// --- Usage Stats ---
export const mockUsageStats: UsageStats = {
  activeCount: Math.floor(mockUserList.length * 0.6),
  totalCount: mockUserList.length + 1000,
  usageRate: 0.6,
};

// --- Download Only Stats ---
export const mockDownloadOnlyStats: DownloadOnlyStats = {
  count: 250,
  percentage: 0.2,
};

// --- Bundle Stats ---
export const mockBundleStats: BundleStats = {
  distribution: [
    { bundleType: 'free', count: 800, percentage: 64 },
    { bundleType: 'starter', count: 250, percentage: 20 },
    { bundleType: 'pro', count: 150, percentage: 12 },
    { bundleType: 'business', count: 50, percentage: 4 },
  ],
};

// --- Revenue Stats ---
export const mockRevenueStats: RevenueStats = {
  currentMonthTotal: 3_250_000,
  currency: 'XAF',
  series: Array.from({ length: 12 }, (_, i) => ({
    month: `2025-${String(5 + i).padStart(2, '0')}`,
    revenue: (1000000 + i * 150000) * (1 + Math.random() * 0.2),
  })),
};

// --- Conversion Stats ---
export const mockConversionStats: ConversionStats = {
  funnel: [
    { from: 'visitor', to: 'free', rate: 0.25, count: 1250 },
    { from: 'free', to: 'starter', rate: 0.20, count: 250 },
    { from: 'starter', to: 'pro', rate: 0.40, count: 100 },
    { from: 'pro', to: 'business', rate: 0.20, count: 20 },
  ],
};

// --- Churn Stats ---
export const mockChurnStats: ChurnStats = {
  count: 30,
  lostRevenue: 150_000,
  series: [
    { month: '2026-01', churns: 5 },
    { month: '2026-02', churns: 8 },
    { month: '2026-03', churns: 10 },
    { month: '2026-04', churns: 7 },
  ],
};

// --- Geo Stats ---
export const mockCountryStats: CountryStats = {
  countries: [
    { country: 'Cameroon', countryCode: 'CM', userCount: 600, percentage: 48 },
    { country: 'Senegal', countryCode: 'SN', userCount: 200, percentage: 16 },
    { country: 'Ivory Coast', countryCode: 'CI', userCount: 150, percentage: 12 },
    { country: 'France', countryCode: 'FR', userCount: 100, percentage: 8 },
    { country: 'Other', countryCode: 'XX', userCount: 120, percentage: 10 },
  ],
};

// --- Timezone Stats ---
export const mockTimezoneStats: TimezoneStats = {
  timezones: [
    { gmt: -5, label: 'UTC-5', userCount: 20 },
    { gmt: 0, label: 'UTC+0', userCount: 300 },
    { gmt: 1, label: 'UTC+1', userCount: 700 },
    { gmt: 2, label: 'UTC+2', userCount: 150 },
  ],
};

// --- Filtre ---
export const mockStatsPeriodFilter: StatsPeriodFilter = {
  from: oneMonthAgo,
  to: now,
};