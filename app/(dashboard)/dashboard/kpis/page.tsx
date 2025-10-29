'use client';

import { launchService } from '@/lib/api';
import type { LaunchStats } from '@/types';
import { useEffect, useState } from 'react';

export default function KpisPage() {
  const [stats, setStats] = useState<LaunchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await launchService.getKpis();
        setStats(data);
      } catch (err) {
        console.error('[KpisPage] Failed to load KPIs:', err);
        setError('Erreur lors du chargement des KPIs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Chargement des KPIs...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">KPIs globaux</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Total Lancements</div>
          <div className="text-3xl font-bold">{stats?.totalLaunches ?? 0}</div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Taux de Succès</div>
          <div className="text-3xl font-bold text-green-600">
            {stats ? stats.successRate.toFixed(2) + '%' : '—'}
          </div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Prochain Lancement</div>
          <div className="text-lg font-semibold">{stats?.nextLaunch?.name ?? 'Aucun'}</div>
        </div>
      </div>
    </div>
  );
}
