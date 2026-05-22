/**
 * $lib/api — Point d'entrée unique pour tous les appels API
 *
 * Usage depuis n'importe quel composant Svelte :
 *
 * ```typescript
 * import { projectsApi, authApi, USE_MOCKS } from '$lib/api';
 * ```
 *
 * Quand le backend est prêt :
 * 1. Mettre VITE_USE_MOCKS=false dans .env
 * 2. Aucun composant n'a besoin d'être modifié
 */

// Config du client
export { USE_MOCKS, API_BASE_URL } from './_client';

// APIs utilisateur
export { authApi } from './auth.api';
export { bundlesApi } from './bundles.api';
export { projectsApi } from './projects.api';
export { templatesApi } from './templates.api';
export { projectTypesApi } from './project-types.api';
export { historyApi } from './history.api';
export { exportApi } from './export.api';
export { aiApi } from './ai.api';
export type { GenerateRequest, GenerateStreamCallbacks } from './ai.api';
export type { ExportOptions, ExportResult } from './export.api';


// APIs admin
export { adminAuthApi, adminUsersApi, adminStatsApi, adminPlatformApi } from './admin';