'use client';

import { launchService } from '@/lib/api';
import type { Launch, LaunchFilters, Page } from '@/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LaunchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [launches, setLaunches] = useState<Page<Launch> | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les filtres depuis l'URL
  const filters: LaunchFilters = {
    page: Number(searchParams.get('page')) || 0,
    size: Number(searchParams.get('size')) || 10,
    year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
    success: searchParams.get('success') ? searchParams.get('success') === 'true' : undefined,
  };

  // Mettre à jour l'URL avec les nouveaux filtres
  const updateFilters = (newFilters: Partial<LaunchFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    router.push(`/dashboard/launches?${params.toString()}`);
  };

  // Charger les données avec les filtres
  useEffect(() => {
    const loadLaunches = async () => {
      try {
        setLoading(true);
        const data = await launchService.getLaunches(filters);
        setLaunches(data);
      } catch (err) {
        console.error('[LaunchesPage] Failed to load launches:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLaunches();
  }, [filters.page, filters.size, filters.year, filters.success]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lancements</h1>

        {/* Filtres */}
        <div className="flex gap-4">
          <select
            value={filters.size || 10}
            onChange={(e) => updateFilters({ size: Number(e.target.value) })}
            className="rounded border p-2"
          >
            <option value="5">5 par page</option>
            <option value="10">10 par page</option>
            <option value="25">25 par page</option>
            <option value="50">50 par page</option>
            <option value="100">100 par page</option>
          </select>

          <select
            value={filters.year || ''}
            onChange={(e) =>
              updateFilters({ year: e.target.value ? Number(e.target.value) : undefined })
            }
            className="rounded border p-2"
          >
            <option value="">Toutes années</option>
            {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={filters.success?.toString() || ''}
            onChange={(e) =>
              updateFilters({ success: e.target.value ? e.target.value === 'true' : undefined })
            }
            className="rounded border p-2"
          >
            <option value="">Tous statuts</option>
            <option value="true">Succès</option>
            <option value="false">Échec</option>
          </select>
        </div>
      </div>

      {/* Table des lancements */}
      {loading ? (
        <div className="text-center">Chargement des lancements...</div>
      ) : (
        <>
          <div className="rounded bg-white shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Nom</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Fusée</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {launches?.content.map((l) => (
                  <tr key={l.id}>
                    <td className="px-4 py-2">
                      <Link href={`/dashboard/launches/${l.id}`} className="text-blue-600">
                        {l.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{new Date(l.dateUtc).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-2">{l.rocket?.name ?? 'N/A'}</td>
                    <td className="px-4 py-2">
                      {l.success === true ? 'Succès' : l.success === false ? 'Échec' : 'À venir'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Total: {launches?.totalElements} lancements</div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => updateFilters({ page: filters.page - 1 })}
                disabled={launches?.first}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Précédent
              </button>

              <span>
                Page {(launches?.number ?? 0) + 1} sur {launches?.totalPages ?? 0}
              </span>

              <button
                onClick={() => updateFilters({ page: filters.page + 1 })}
                disabled={launches?.last}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
