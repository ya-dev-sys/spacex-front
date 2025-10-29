'use client';

import { launchService } from '@/lib/api';
import type { Launch, Page } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LaunchesPage() {
  const [launches, setLaunches] = useState<Page<Launch> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await launchService.getLaunches({ page, size: 10 });
        setLaunches(data);
      } catch (err) {
        console.error('[LaunchesPage] Failed to load launches:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lancements</h1>

      {loading ? (
        <div>Chargement des lancements...</div>
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

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={launches?.first}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Précédent
            </button>
            <span>
              Page {launches ? launches.number + 1 : 0} sur {launches?.totalPages ?? 0}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={launches?.last}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}
