import type { ApiSuccess, ApiErrorResponse, ApiErrorBody } from '$lib/schemas/api';
import { ApiErrors } from '$lib/schemas/errors';
import { generateMockId } from './_utils';

export function mockApiSuccess<T>(data: T, message: string = 'OK'): ApiSuccess<T> {
  return { success: true, data, message };
}

export function mockApiError(
  code: ApiErrors,
  type: string = code.toString(),
  message?: string
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      type,
      message: message || `Erreur ${code}`,
    },
  };
}

// Exemples
export const mockSuccessResponse = mockApiSuccess('Opération réussie');
export const mockErrorUnauthorized = mockApiError(ApiErrors.UNAUTHORIZED, 'UNAUTHORIZED');
export const mockErrorForbidden = mockApiError(ApiErrors.FORBIDDEN, 'FORBIDDEN');
export const mockErrorBundleExpired = mockApiError(ApiErrors.BUNDLE_EXPIRED, 'BUNDLE_EXPIRED');