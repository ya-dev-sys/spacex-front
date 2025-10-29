import { ApiError } from '@/types';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Client API Axios configuré avec intercepteurs JWT
 */
class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Singleton pattern pour avoir une seule instance du client
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Configure les intercepteurs pour ajouter automatiquement le JWT
   */
  private setupInterceptors(): void {
    // Request interceptor: Ajoute le token JWT à chaque requête
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor: Gère les erreurs globalement
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error: AxiosError<ApiError>) => {
        console.error('[API] Response error:', error);

        // Si 401 Unauthorized, déconnecter l'utilisateur
        if (error.response?.status === 401) {
          console.warn('[API] Unauthorized - clearing token');
          this.clearToken();

          // Rediriger vers login si on n'y est pas déjà
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }

        // Si 403 Forbidden
        if (error.response?.status === 403) {
          console.error('[API] Forbidden - insufficient permissions');
        }

        // Retourner une erreur formatée
        const apiError: ApiError = error.response?.data || {
          timestamp: new Date().toISOString(),
          status: error.response?.status || 500,
          error: error.message,
          message: error.response?.data?.message || 'An unexpected error occurred',
          path: error.config?.url || '',
        };

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Récupère le token JWT depuis localStorage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Sauvegarde le token JWT dans localStorage
   */
  public setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  /**
   * Supprime le token JWT de localStorage
   */
  public clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  /**
   * Expose l'instance Axios pour les requêtes
   */
  public getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
export default apiClient.getClient();
