import type { Bundle, BundleConfig, BundleType } from '$lib/schemas/bundle';
import { generateMockId, now, oneWeekAgo, oneMonthAgo, twoMonthsAgo } from './_utils';
import { mockUser, mockUserList } from './user.mock';

// --- Configurations des bundles (correspond aux BundleConf.json du backend) ---
// ⚠️ SANS defaultExpCostUnit, nbExpNoWatermarkPeriodicity, nbExpNoWatermarkPeriodicityUnit
export const mockBundleConfigs: Record<BundleType, BundleConfig> = {
  free: {
    type: 'free',
    costUnit: 'XAF',
    bundleCost: 0,
    bundlePeriodicity: 1,
    bundlePeriodicityUnit: 'month',
    exportCost: 500,
    nbExpNoWatermark: 0, // 0 = aucun export sans watermark
    branding: false,
    brandingType: 'unavailable',
    projectHistoryDays: 0, // 0 = pas d'historique
    fullHistory: false,
    duplicateProject: false,
    nbTemplatesAccorded: 0, // 0 = aucun template accordé
    customTemplate: false,
    nbUsers: 0,
    support: false,
    supportHoursDelay: 48,
    accessAIsAPIs: false,
  },
  starter: {
    type: 'starter',
    costUnit: 'XAF',
    bundleCost: 2000,
    bundlePeriodicity: 1,
    bundlePeriodicityUnit: 'month',
    exportCost: 0,
    nbExpNoWatermark: 5, // 5 exports sans watermark/mois
    branding: true,
    brandingType: 'default',
    projectHistoryDays: 30, // 30 jours d'historique
    fullHistory: false,
    duplicateProject: true,
    nbTemplatesAccorded: 3, // 3 templates accordés
    customTemplate: false,
    nbUsers: 0,
    support: true,
    supportHoursDelay: 24,
    accessAIsAPIs: false,
  },
  pro: {
    type: 'pro',
    costUnit: 'XAF',
    bundleCost: 5000,
    bundlePeriodicity: 1,
    bundlePeriodicityUnit: 'month',
    exportCost: 0,
    nbExpNoWatermark: 20, // 20 exports sans watermark/mois
    branding: true,
    brandingType: 'advanced',
    projectHistoryDays: 0, // 0 = historique complet
    fullHistory: true,
    duplicateProject: true,
    nbTemplatesAccorded: 'full', // Tous les templates
    customTemplate: false,
    nbUsers: 0,
    support: true,
    supportHoursDelay: 24,
    accessAIsAPIs: false,
  },
  business: {
    type: 'business',
    costUnit: 'XAF',
    bundleCost: 10000,
    bundlePeriodicity: 1,
    bundlePeriodicityUnit: 'month',
    exportCost: 0,
    nbExpNoWatermark: 'unlimited', // Illimité
    branding: true,
    brandingType: 'Full',
    projectHistoryDays: 0,
    fullHistory: true,
    duplicateProject: true,
    nbTemplatesAccorded: 'full',
    customTemplate: true,
    nbUsers: 3,
    support: true,
    supportHoursDelay: 8,
    accessAIsAPIs: true,
  },
};

// --- Mocks des bundles utilisateurs ---
export const mockBundle: Bundle = {
  id: generateMockId('bundle'),
  userId: mockUser.id,
  bundleType: 'pro',
  subscribedDate: oneWeekAgo,
  expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
  isActive: true,
};

export const mockBundleList: Bundle[] = [
  mockBundle,
  {
    id: generateMockId('bundle'),
    userId: mockUserList[1].id,
    bundleType: 'free',
    subscribedDate: oneMonthAgo,
    expirationDate: null, // Free n'a pas d'expiration
    isActive: true,
  },
  {
    id: generateMockId('bundle'),
    userId: mockUserList[2].id,
    bundleType: 'business',
    subscribedDate: twoMonthsAgo,
    expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // +15 jours
    isActive: true,
  },
  {
    id: generateMockId('bundle'),
    userId: mockUserList[3].id,
    bundleType: 'starter',
    subscribedDate: oneMonthAgo,
    expirationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Expiré il y a 5 jours
    isActive: false,
  },
  // Génération de bundles pour les autres utilisateurs
  ...mockUserList.slice(4, 20).map((user, i) => ({
    id: generateMockId('bundle'),
    userId: user.id,
    bundleType: ['free', 'starter', 'pro', 'business'][i % 4] as BundleType,
    subscribedDate: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    // Free et Business n'ont pas d'expiration
    expirationDate:
      ['free', 'business'].includes(['free', 'starter', 'pro', 'business'][i % 4] as string)
        ? null
        : new Date(Date.now() + (30 - i) * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  })),
];

// Liste des types de bundles
export const mockBundleTypeList: BundleType[] = ['free', 'starter', 'pro', 'business'];