/**
 * Utilitaires pour les mocks API.
 * Simule la latence réseau et génère des IDs uniques.
 */

// Simule une latence réseau (300-500ms)
export const delay = (ms: number = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Génère des IDs uniques pour les mocks
export const generateMockId = (prefix: string): string =>
  `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

// Dates utiles
export const now = new Date().toISOString();
export const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
export const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
export const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();