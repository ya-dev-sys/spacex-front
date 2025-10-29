import { Launch, LaunchFilters, LaunchStats, Page, ResyncResponse, YearlyStats } from '@/types';
import axios from './client';

/**
 * Service pour la gestion des lancements SpaceX
 */
export const launchService = {
  /**
   * Récupère les KPIs globaux
   * GET /dashboard/kpis
   */
  async getKpis(): Promise<LaunchStats> {
    const response = await axios.get<LaunchStats>('/dashboard/kpis');
    return response.data;
  },

  /**
   * Récupère les statistiques par année
   * GET /dashboard/stats/yearly
   */
  async getYearlyStats(): Promise<YearlyStats[]> {
    const response = await axios.get<YearlyStats[]>('/dashboard/stats/yearly');
    return response.data;
  },

  /**
   * Récupère la liste paginée des lancements avec filtres
   * GET /dashboard/launches?year=2023&success=true&page=0&size=10
   */
  async getLaunches(filters?: LaunchFilters): Promise<Page<Launch>> {
    const params = new URLSearchParams();

    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.success !== undefined) params.append('success', filters.success.toString());
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    if (filters?.sort) params.append('sort', filters.sort);

    const response = await axios.get<Page<Launch>>(`/dashboard/launches?${params.toString()}`);
    return response.data;
  },

  /**
   * Récupère le détail d'un lancement
   * GET /dashboard/launches/{id}
   */
  async getLaunchById(id: string): Promise<Launch> {
    const response = await axios.get<Launch>(`/dashboard/launches/${id}`);
    return response.data;
  },

  /**
   * Force la resynchronisation avec l'API SpaceX (ADMIN uniquement)
   * POST /admin/resync
   */
  async resynchronize(): Promise<ResyncResponse> {
    const response = await axios.post<ResyncResponse>('/admin/resync');
    return response.data;
  },
};
