'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Props du composant ProtectedRoute
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Composant pour protéger les routes
 * Redirige vers /login si non authentifié
 * Redirige vers /dashboard si admin requis mais user simple
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Attendre que le chargement soit terminé
    if (isLoading) return;

    // Si non authentifié, rediriger vers login
    if (!isAuthenticated) {
      console.log('[ProtectedRoute] User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }

    // Si admin requis mais user simple, rediriger vers dashboard
    if (requireAdmin && !isAdmin()) {
      console.log(
        '[ProtectedRoute] Admin required but user is not admin, redirecting to dashboard'
      );
      router.push('/dashboard');
      return;
    }

    console.log('[ProtectedRoute] Access granted to:', pathname);
  }, [isAuthenticated, isLoading, requireAdmin, isAdmin, router, pathname]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Si non authentifié ou pas les droits, ne rien afficher (redirection en cours)
  if (!isAuthenticated || (requireAdmin && !isAdmin())) {
    return null;
  }

  // Sinon, afficher le contenu protégé
  return <>{children}</>;
}
