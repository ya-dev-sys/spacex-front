'use client';

import { ProtectedRoute } from '@/components/layouts/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const navigation = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Launches', href: '/dashboard/launches' },
  { name: 'yearly/stats', href: '/dashboard/yearly/stats' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header moderne et compact */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-12 items-center justify-between px-4">
            {/* Logo et Navigation */}
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                SpaceX
              </Link>

              <nav className="flex items-center gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative px-3 py-1.5 text-sm transition-colors hover:text-foreground',
                      {
                        'text-foreground': pathname === item.href,
                        'text-foreground/60': pathname !== item.href,
                      }
                    )}
                  >
                    {item.name}
                    {pathname === item.href && (
                      <span className="absolute inset-x-0 -bottom-[9px] h-0.5 bg-foreground" />
                    )}
                  </Link>
                ))}
                {user?.roles.includes('ROLE_ADMIN') && (
                  <Link
                    href="/admin"
                    className={cn(
                      'relative px-3 py-1.5 text-sm transition-colors hover:text-foreground',
                      {
                        'text-foreground': pathname === '/admin',
                        'text-foreground/60': pathname !== '/admin',
                      }
                    )}
                  >
                    Admin
                    {pathname === '/admin' && (
                      <span className="absolute inset-x-0 -bottom-[9px] h-0.5 bg-foreground" />
                    )}
                  </Link>
                )}
              </nav>
            </div>

            {/* User Info et Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground/60">{user?.email}</span>
                {user?.roles.includes('ROLE_ADMIN') && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    ADMIN
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Contenu principal avec padding optimisé */}
        <main className="container mx-auto max-w-7xl px-4 py-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
