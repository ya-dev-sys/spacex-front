'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Lancements</CardTitle>
        <div className="flex items-center space-x-4">
          <Select
            value={String(filters.size)}
            onValueChange={(value) => updateFilters({ size: Number(value) })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Nombre par page" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} par page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.year?.toString() || 'all'}
            onValueChange={(value) => updateFilters({ year: value === 'all' ? undefined : Number(value) })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes années</SelectItem>
              {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.success?.toString() || 'all'}
            onValueChange={(value) =>
              updateFilters({
                success: value === 'all' ? undefined : value === 'true'
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="true">Succès</SelectItem>
              <SelectItem value="false">Échec</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
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
                {launches?.content.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <Link href={`/dashboard/launches/${l.id}`} className="text-blue-600">
                        {l.name}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(l.dateUtc).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{l.rocket?.name ?? 'N/A'}</TableCell>
                    <TableCell>
                      {l.success === true ? 'Succès' : l.success === false ? 'Échec' : 'À venir'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total: {launches?.totalElements} lancements
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => updateFilters({ page: filters.page - 1 })}
                  disabled={launches?.first}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateFilters({ page: filters.page + 1 })}
                  disabled={launches?.last}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
