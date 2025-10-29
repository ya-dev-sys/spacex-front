'use client';

import { launchService } from '@/lib/api';
import type { YearlyStats } from '@/types';
import { useEffect, useState } from 'react';

export default function YearlyStatsPage() {
  const [stats, setStats] = useState<YearlyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await launchService.getYearlyStats();
        setStats(data);
      } catch (err) {
        console.error('[YearlyStatsPage] Failed to load yearly stats:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Chargement des statistiques annuelles...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Statistiques par année</h1>
      <div className="rounded bg-white shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Année</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Lancements</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Taux</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.map((s) => (
              <tr key={s.year}>
                <td className="px-4 py-2">{s.year}</td>
                <td className="px-4 py-2">{s.totalLaunches}</td>
                <td className="px-4 py-2">{s.successRate.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
