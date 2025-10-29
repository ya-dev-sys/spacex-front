'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api';
import { User, LoginRequest, AuthResponse } from '@/types';

/**
 * Interface pour le contexte d'authentification
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}

/**
 * Contexte d'authentification
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props du provider
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider d'authentification
 * Wrap l'application pour fournir l'état d'authentification partout
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  /**
   * Initialise l'utilisateur au chargement du composant
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Vérifie si un utilisateur est déjà connecté (via JWT)
   */
  const initializeAuth = useCallback(() => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        console.log('[AuthContext] User initialized:', currentUser?.username);
      } else {
        console.log('[AuthContext] No authenticated user found');
      }
    } catch (error) {
      console.error('[AuthContext] Failed to initialize auth:', error);
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Connexion
   */
  const login = useCallback(
    async (credentials: LoginRequest): Promise<void> => {
      try {
        setIsLoading(true);
        console.log('[AuthContext] Logging in user:', credentials.email);

        // Appel API de connexion
        const response: AuthResponse = await authService.login(credentials);

        // Récupérer l'utilisateur depuis le JWT décodé
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        console.log('[AuthContext] Login successful:', currentUser?.username);

        // Rediriger vers le dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('[AuthContext] Login failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  /**
   * Déconnexion
   */
  const logout = useCallback(() => {
    console.log('[AuthContext] Logging out user:', user?.username);
    setUser(null);
    authService.logout();
    router.push('/login');
  }, [user, router]);

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user) return false;
      const normalizedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
      return user.roles.includes(normalizedRole);
    },
    [user]
  );

  /**
   * Vérifie si l'utilisateur est admin
   */
  const isAdmin = useCallback((): boolean => {
    return hasRole('ROLE_ADMIN');
  }, [hasRole]);

  /**
   * Valeur du contexte
   */
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * Utilisation: const { user, login, logout } = useAuth();
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Export du contexte pour des cas d'usage avancés
 */
export { AuthContext };
