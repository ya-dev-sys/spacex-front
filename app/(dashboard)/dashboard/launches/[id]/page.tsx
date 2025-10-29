'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { launchService } from '@/lib/api';
import type { Launch } from '@/types';

export default function LaunchDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await launchService.getLaunchById(id);
        setLaunch(data);
      } catch (err) {
        console.error('[LaunchDetailPage] Failed to load launch:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (!id) return <div>ID manquant</div>;
  if (loading) return <div>Chargement du lancement...</div>;
  if (!launch) return <div>Lancement introuvable</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{launch.name}</h1>
      <p className="text-sm text-gray-600">{new Date(launch.dateUtc).toLocaleString('fr-FR')}</p>

      <div className="rounded bg-white p-4 shadow">
        <h2 className="font-semibold">Détails</h2>
        <p>{launch.details ?? 'Aucun détail'}</p>

        <h3 className="mt-4 font-semibold">Fusée</h3>
        <p>{launch.rocket?.name ?? 'N/A'} ({launch.rocket?.company ?? '—'})</p>

        <h3 className="mt-4 font-semibold">Lanceur</h3>
        <p>{launch.launchPad?.name ?? 'N/A'} — {launch.launchPad?.locality ?? ''}</p>

        <h3 className="mt-4 font-semibold">Payloads</h3>
        <ul className="list-disc pl-5">
          {launch.payloads.length === 0 && <li>Aucun payload</li>}
          {launch.payloads.map((p) => (
            <li key={p.id}>
              {p.name ?? 'N/A'} — {p.type ?? '—'} — {p.massKg ?? '—'} kg
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
