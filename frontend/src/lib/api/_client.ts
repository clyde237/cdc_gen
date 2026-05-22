import { ApiErrors, getErrorMessage } from '$lib/schemas';
import type { ApiResponse, ApiErrorBody } from '$lib/schemas/api';

// --- Configuration ---
// ⚠️ À basculer sur "false" quand le backend est prêt
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true' || true; // true par défaut pour le dev

// URL de base de l'API (à configurer dans .env)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Headers par défaut
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// --- Wrapper Fetch ---
/**
 * Effectue une requête API avec gestion des erreurs et des headers.
 * @param endpoint - Endpoint relatif (ex: "/api/auth/login")
 * @param options - Options fetch (method, body, headers, etc.)
 * @returns Promise<ApiResponse<T>>
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Si on utilise les mocks, on redirige vers les mocks
  if (USE_MOCKS) {
    return handleMockRequest(endpoint, options);
  }

  // Construction de l'URL complète
  const url = `${API_BASE_URL}${endpoint}`;

  // Fusion des headers
  const headers = new Headers(defaultHeaders);
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => headers.set(key, value));
    } else {
      Object.entries(options.headers).forEach(([key, value]) => headers.set(key, value));
    }
  }

  // Ajout du token JWT si présent dans le localStorage (pour les requêtes authentifiées)
  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Pour les cookies si utilisés
    });

    // Gestion des erreurs HTTP
    if (!response.ok) {
      const errorBody: ApiErrorBody = await response.json().catch(() => ({
        code: response.status,
        type: response.statusText,
        message: `Erreur HTTP ${response.status}`,
      }));
      return {
        success: false,
        error: errorBody,
      };
    }

    // Succès : on retourne les données typées
    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (error) {
    // Erreur réseau ou JSON invalide
    console.error('API Error:', error);
    return {
      success: false,
      error: {
        code: ApiErrors.DB_ERROR, // ou AI_ERROR selon le contexte
        type: 'NETWORK_ERROR',
        message: 'Impossible de joindre le serveur. Vérifiez votre connexion.',
      },
    };
  }
}

// --- Gestion des Mocks ---
/**
 * Gère les requêtes en mode mock.
 * Chaque endpoint doit avoir son mock correspondant dans $lib/api/mocks.
 */
async function handleMockRequest(endpoint: string, options: RequestInit): Promise<ApiResponse<any>> {
  // Import dynamique des mocks pour éviter les dépendances circulaires
  const mocks = await import('$lib/api/mocks');

  // Simulation de la latence réseau
  await mocks.delay(300 + Math.random() * 200); // 300-500ms

  // Routing des endpoints vers les mocks appropriés
  try {
    // Auth
    if (endpoint === '/api/auth/register' && options.method === 'POST') {
      return mocks.mockApiSuccess(mocks.mockAuthResponse);
    }
    if (endpoint === '/api/auth/login' && options.method === 'POST') {
      return mocks.mockApiSuccess(mocks.mockAuthResponse);
    }
    if (endpoint === '/api/auth/logout' && options.method === 'POST') {
      return mocks.mockApiSuccess({ message: 'Déconnexion réussie' });
    }
    if (endpoint === '/api/auth/me' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockUser);
    }

    // Bundles
    if (endpoint === '/api/bundles' && options.method === 'GET') {
      return mocks.mockApiSuccess(Object.values(mocks.mockBundleConfigs));
    }
    if (endpoint === '/api/bundles/current' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockBundle);
    }
    if (endpoint.includes('/api/bundles/subscribe') && options.method === 'POST') {
      return mocks.mockApiSuccess(mocks.mockBundle);
    }

    // Projects
    if (endpoint === '/api/projects' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockProjectList);
    }
    if (endpoint.includes('/api/projects/') && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockProjectDetail);
    }
    if (endpoint === '/api/projects' && options.method === 'POST') {
      return mocks.mockApiSuccess(mocks.mockProject);
    }
    if (endpoint.includes('/api/projects/') && options.method === 'PUT') {
      return mocks.mockApiSuccess(mocks.mockProject);
    }
    if (endpoint.includes('/api/projects/') && options.method === 'DELETE') {
      return mocks.mockApiSuccess({ message: 'Projet supprimé' });
    }
    if (endpoint.includes('/api/projects/duplicate') && options.method === 'POST') {
      return mocks.mockApiSuccess(mocks.mockProject);
    }

    // Templates
    if (endpoint === '/api/templates' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockTemplateList);
    }
    if (endpoint.includes('/api/templates/') && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockTemplateList[0]);
    }

    // Project Types
    if (endpoint === '/api/project-types' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockProjectTypeList);
    }

    // History
    if (endpoint === '/api/history' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockHistoryResponse);
    }

    // Export
    if (endpoint.includes('/api/export/') && options.method === 'POST') {
      return mocks.mockApiSuccess(mocks.mockExportResponse);
    }

    // AI
    if (endpoint === '/api/ai/generate' && options.method === 'POST') {
      return mocks.mockApiSuccess({ stream: true, projectId: mocks.mockProject.id });
    }

    // Admin Auth
    if (endpoint === '/api/admin/auth/login' && options.method === 'POST') {
      return mocks.mockApiSuccess({ admin: mocks.mockAdminUserList[0], token: 'mock_admin_token' });
    }

    // Admin Stats
    if (endpoint === '/api/admin/live/connected' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockLiveConnected);
    }
    if (endpoint === '/api/admin/stats/users' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockUserStats);
    }
    if (endpoint === '/api/admin/stats/registrations' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockRegistrationStats);
    }
    if (endpoint === '/api/admin/stats/bundles' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockBundleStats);
    }
    if (endpoint === '/api/admin/stats/revenue' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockRevenueStats);
    }
    if (endpoint === '/api/admin/stats/countries' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockCountryStats);
    }
    if (endpoint === '/api/admin/stats/timezones' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockTimezoneStats);
    }

    // Admin Users
    if (endpoint === '/api/admin/users' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockAdminUserList);
    }
    if (endpoint.includes('/api/admin/users/') && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockAdminUserList[0]);
    }

    // Admin Events
    if (endpoint === '/api/admin/events' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockAdminEventList);
    }

    // Admin Platform
    if (endpoint === '/api/admin/bundles' && options.method === 'GET') {
      return mocks.mockApiSuccess(Object.values(mocks.mockBundleConfigs));
    }
    if (endpoint.includes('/api/admin/templates') && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockTemplateList);
    }
    if (endpoint === '/api/admin/project-types' && options.method === 'GET') {
      return mocks.mockApiSuccess(mocks.mockProjectTypeList);
    }

    // Si l'endpoint n'est pas trouvé
    return mocks.mockApiError(
      ApiErrors.NOT_FOUND,
      'NOT_FOUND',
      `Endpoint mock non implémenté: ${endpoint}`
    );
  } catch (error) {
    return mocks.mockApiError(
      ApiErrors.STORAGE_ERROR,
      'MOCK_ERROR',
      `Erreur dans le mock pour ${endpoint}: ${error}`
    );
  }
}