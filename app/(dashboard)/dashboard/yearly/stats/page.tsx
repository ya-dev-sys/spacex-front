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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques par année</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Année</TableHead>
              <TableHead>Lancements</TableHead>
              <TableHead className="text-right">Taux de Succès</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((s) => (
              <TableRow key={s.year}>
                <TableCell className="font-medium">{s.year}</TableCell>
                <TableCell>{s.totalLaunches}</TableCell>
                <TableCell className="text-right">
                  <span className="text-green-600 font-medium">{s.successRate.toFixed(2)}%</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
