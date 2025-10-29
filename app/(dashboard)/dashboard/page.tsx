'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { launchService } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Launch, LaunchStats, Page, YearlyStats } from '@/types';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<LaunchStats | null>(null);
  const [yearlyStats, setYearlyStats] = useState<YearlyStats[]>([]);
  const [launches, setLaunches] = useState<Page<Launch> | null>(null);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingYearly, setLoadingYearly] = useState(true);
  const [loadingLaunches, setLoadingLaunches] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Charger les KPIs
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoadingStats(true);
        const data = await launchService.getKpis();
        setStats(data);
        console.log('[Dashboard] KPIs loaded:', data);
      } catch (err) {
        console.error('[Dashboard] Failed to load KPIs:', err);
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  // Charger les stats annuelles
  useEffect(() => {
    const loadYearly = async () => {
      try {
        setLoadingYearly(true);
        const data = await launchService.getYearlyStats();
        setYearlyStats(data);
        console.log('[Dashboard] Yearly stats loaded:', data);
      } catch (err) {
        console.error('[Dashboard] Failed to load yearly stats:', err);
      } finally {
        setLoadingYearly(false);
      }
    };

    loadYearly();
  }, []);

  // Charger les lancements
  useEffect(() => {
    const loadLaunches = async () => {
      try {
        setLoadingLaunches(true);
        const data = await launchService.getLaunches({
          page: 0,
          size: 10,
        });
        setLaunches(data);
        console.log('[Dashboard] Launches loaded:', data);
      } catch (err) {
        console.error('[Dashboard] Failed to load launches:', err);
      } finally {
        setLoadingLaunches(false);
      }
    };

    loadLaunches();
  }, []);

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Vue d&apos;ensemble</h2>
        <p className="mt-1 text-sm text-gray-600">Statistiques et lancements SpaceX</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loadingStats ? (
          <div className="col-span-full text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          </div>
        ) : (
          <>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-sm font-medium text-gray-600">Total Lancements</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.totalLaunches ?? 0}</p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-sm font-medium text-gray-600">Taux de Succès</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {stats?.successRate.toFixed(2) ?? 0}%
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-sm font-medium text-gray-600">Prochain Lancement</h3>
              <p className="mt-2 text-lg font-bold text-gray-900">
                {stats?.nextLaunch?.name ?? 'Aucun'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Stats annuelles */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques par Année</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingYearly ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Année</TableHead>
                  <TableHead>Lancements</TableHead>
                  <TableHead>Taux de Succès</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearlyStats.map((stat) => (
                  <TableRow key={stat.year}>
                    <TableCell className="font-medium">{stat.year}</TableCell>
                    <TableCell>{stat.totalLaunches}</TableCell>
                    <TableCell className="text-green-600">{stat.successRate.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Liste des lancements */}
      <Card>
        <CardHeader>
          <CardTitle>Derniers Lancements</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingLaunches ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Fusée</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {launches?.content.map((launch) => (
                    <TableRow key={launch.id}>
                      <TableCell className="font-medium">{launch.name}</TableCell>
                      <TableCell>{new Date(launch.dateUtc).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{launch.rocket?.name ?? 'N/A'}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                            {
                              'bg-green-100 text-green-700': launch.success === true,
                              'bg-red-100 text-red-700': launch.success === false,
                              'bg-gray-100 text-gray-700': launch.success === null,
                            }
                          )}
                        >
                          {launch.success === true
                            ? 'Succès'
                            : launch.success === false
                            ? 'Échec'
                            : 'À venir'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {launches && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Page {launches.number + 1} sur {launches.totalPages} ({launches.totalElements}{' '}
                  lancements au total)
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
