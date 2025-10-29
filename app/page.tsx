import { authService, launchService } from '@/lib/api';

export default function Home() {
  // Connexion
  const handleLogin = async () => {
    try {
      const response = await authService.login({
        email: 'admin@example.com',
        password: 'admin123',
      });
      console.log('Token:', response.token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Récupérer les KPIs
  const fetchKpis = async () => {
    try {
      const stats = await launchService.getKpis();
      console.log('KPIs:', stats);
    } catch (error) {
      console.error('Failed to fetch KPIs:', error);
    }
  };

  // Récupérer les lancements
  const fetchLaunches = async () => {
    try {
      const page = await launchService.getLaunches({
        page: 0,
        size: 10,
        year: 2024,
      });
      console.log('Launches:', page.content);
    } catch (error) {
      console.error('Failed to fetch launches:', error);
    }
  };
  return (
    <div>
      <h1>SpaceX Dashboard</h1>
    </div>
  );
}
