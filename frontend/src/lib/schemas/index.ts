// Barrel export principal — permet d'importer depuis '$lib/schemas'
// Exemple : import type { User, Project, ApiResponse } from '$lib/schemas'

export type { ApiSuccess, ApiErrorResponse, ApiErrorBody, ApiResponse, LoadingState, AsyncState } from './api'
export { isApiSuccess, isApiError } from './api'

export { ApiErrors, ERROR_MESSAGES, getErrorMessage, isAuthError, isBundleError } from './errors'

export type { User, UserRegister, UserLogin, UserUpdate, UserPasswordUpdate, AuthResponse } from './user'
export { getFullName, getUserInitials } from './user'

export type { BundleType, Bundle, BundleConfig, BundleSubscribe } from './bundle'
export { BUNDLE_RANK, BUNDLE_LABELS, hasBundleLevel, isBundleExpired } from './bundle'

export type { Template, TemplateCreate } from './template'

export type { FieldType, ProjectTypeField, ProjectType, ProjectData } from './project_type'

export type {
	Project,
	ProjectDetail,
	ProjectCreate,
	ProjectUpdate,
	GenerationStatus,
	AIGenerateRequest,
	ExportRequest,
	ExportResponse
} from './project'

export type { HistoryAction, HistoryEntry, HistoryResponse, HistoryFilters } from './history'
export { HISTORY_ICONS } from './history'

export * from './admin'