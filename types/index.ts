// ============================================
// Auth Types
// ============================================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string; // "Bearer"
}

export interface User {
  username: string;
  email: string;
  roles: string[]; // ["ROLE_USER", "ROLE_ADMIN"]
}

// ============================================
// Launch Types (basé sur Launch.java)
// ============================================
export interface Launch {
  id: string;
  name: string;
  dateUtc: string; // ISO 8601 format
  success: boolean | null;
  details: string | null;
  rocket: Rocket | null;
  launchPad: LaunchPad | null;
  payloads: Payload[];
}

// ============================================
// Rocket Types (basé sur Rocket.java)
// ============================================
export interface Rocket {
  id: string;
  name: string;
  type: string;
  active: boolean;
  country: string | null;
  company: string | null;
}

// ============================================
// LaunchPad Types (basé sur LaunchPad.java)
// ============================================
export interface LaunchPad {
  id: string;
  name: string;
  locality: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
}

// ============================================
// Payload Types (basé sur Payload.java)
// ============================================
export interface Payload {
  id: string;
  name: string | null;
  type: string | null;
  massKg: number | null;
  orbit: string | null;
  customer: string | null;
}

// ============================================
// Dashboard Stats Types (basé sur les DTOs)
// ============================================
export interface LaunchStats {
  totalLaunches: number;
  successRate: number;
  nextLaunch: Launch | null;
}

export interface YearlyStats {
  year: number;
  totalLaunches: number;
  successRate: number;
}

// ============================================
// Spring Data Pagination Types
// ============================================
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // Page actuelle (0-indexed)
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// ============================================
// Filter Types pour les requêtes
// ============================================
export interface LaunchFilters {
  year?: number;
  success?: boolean;
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

// ============================================
// API Error Types (Spring Boot error response)
// ============================================
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// ============================================
// Admin Response Types
// ============================================
export interface ResyncResponse {
  success: boolean;
  message: string;
  launchesProcessed: number;
}

// ============================================
// Utility Types
// ============================================

// Type pour les requêtes de pagination
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

// Type pour les réponses génériques
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Type pour les états de chargement
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Type pour les filtres de recherche
export interface SearchFilters extends PaginationParams {
  query?: string;
  year?: number;
  success?: boolean;
}
