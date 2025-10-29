'use client';

import { launchService } from '@/lib/api';
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
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-medium text-gray-900">Statistiques par Année</h3>

        {loadingYearly ? (
          <div className="mt-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Année
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Lancements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Taux de Succès
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {yearlyStats.map((stat) => (
                  <tr key={stat.year}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {stat.year}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {stat.totalLaunches}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-green-600">
                      {stat.successRate.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Liste des lancements */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-lg font-medium text-gray-900">Derniers Lancements</h3>

        {loadingLaunches ? (
          <div className="mt-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Fusée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {launches?.content.map((launch) => (
                  <tr key={launch.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {launch.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(launch.dateUtc).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {launch.rocket?.name ?? 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {launch.success === true && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                          Succès
                        </span>
                      )}
                      {launch.success === false && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                          Échec
                        </span>
                      )}
                      {launch.success === null && (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                          À venir
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {launches && (
              <div className="mt-4 text-sm text-gray-600">
                Page {launches.number + 1} sur {launches.totalPages} ({launches.totalElements}{' '}
                lancements au total)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
