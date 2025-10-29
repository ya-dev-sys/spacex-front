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
import type { Launch } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }
  if (!launch) return <div>Lancement introuvable</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{launch.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {new Date(launch.dateUtc).toLocaleString('fr-FR')}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Détails</h3>
            <p className="text-muted-foreground">{launch.details ?? 'Aucun détail'}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Informations</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Fusée</TableCell>
                  <TableCell>
                    {launch.rocket?.name ?? 'N/A'} ({launch.rocket?.company ?? '—'})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lanceur</TableCell>
                  <TableCell>
                    {launch.launchPad?.name ?? 'N/A'} — {launch.launchPad?.locality ?? ''}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payloads</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Masse</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {launch.payloads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Aucun payload
                    </TableCell>
                  </TableRow>
                ) : (
                  launch.payloads.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name ?? 'N/A'}</TableCell>
                      <TableCell>{p.type ?? '—'}</TableCell>
                      <TableCell className="text-right">
                        {p.massKg ? `${p.massKg} kg` : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
