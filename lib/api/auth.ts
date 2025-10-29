import { AuthResponse, LoginRequest, User } from '@/types';
import { jwtDecode } from 'jwt-decode';
import axios, { apiClient } from './client';

/**
 * Interface pour le payload décodé du JWT
 */
interface JwtPayload {
  sub: string; // username
  roles: string[];
  iat: number;
  exp: number;
}

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connexion utilisateur
   * POST /auth/login
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>('/auth/login', credentials);

      // Sauvegarder le token
      apiClient.setToken(response.data.token);

      console.log('[Auth] Login successful');
      return response.data;
    } catch (error) {
      console.error('[Auth] Login failed:', error);
      throw error;
    }
  },

  /**
   * Déconnexion utilisateur
   */
  logout(): void {
    apiClient.clearToken();
    console.log('[Auth] User logged out');

    // Rediriger vers la page de login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000;

      // Vérifier si le token n'est pas expiré
      return decoded.exp > now;
    } catch {
      return false;
    }
  },

  /**
   * Récupère l'utilisateur actuel depuis le JWT
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      return {
        username: decoded.sub,
        email: decoded.sub, // Le backend utilise email comme username
        roles: decoded.roles,
      };
    } catch (error) {
      console.error('[Auth] Failed to decode token:', error);
      return null;
    }
  },

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Le rôle peut être avec ou sans le préfixe ROLE_
    const normalizedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
    return user.roles.includes(normalizedRole);
  },

  /**
   * Vérifie si l'utilisateur est admin
   */
  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  },

  /**
   * Récupère le token actuel
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
};
