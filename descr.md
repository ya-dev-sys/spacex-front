Architecture globale
┌─────────────────┐ HTTP/REST + JWT ┌─────────────────┐
│ │────────────────────────────────────│ │
│ Next.js │ JSON Responses │ Spring Boot │
│ Frontend │◄──────────────────────────────────│ Backend │
│ (Port 3000) │ │ (Port 8080) │
│ │ │ │
└─────────────────┘ └─────────────────┘
│ │
│ │
└─────── localStorage (JWT Token) ──────────┬─────────┘
│
PostgreSQL + Redis

Configuration de l'API

1. Variables d'environnement
   Backend (spacex-backend/.env)
   envSERVER_PORT=8080
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/spacex_dashboard
   POSTGRES_USER=spacex
   POSTGRES_PASSWORD=secret123
   JWT_SECRET=oWJZwXVsfdM2X69qxwqAsumSoYZQ/BmRUE7qjymy7gjmlJl2Jy/kwAIrKE2usDe
   JWT_EXPIRATION_MS=86400000
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   Frontend (spacex-frontend/.env.local)

   NEXT_PUBLIC_API_URL=http://localhost:8080/

# Nom de l'application

Exemple :

- Controller : `@RequestMapping("/auth")`
- URL finale : `http://localhost:8080/auth/login`

---

## Authentification JWT

### Flow d'authentification

```

1. Login Request
   POST /auth/login
   Body: { "email": "admin@example.com", "password": "admin123" }

2. Backend Response
   { "token": "eyJhbGciOiJIUzI1NiJ9...", "type": "Bearer" }

3. Next.js stocke le token
   localStorage.setItem('token', token)

4. Requêtes suivantes
   Header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
   Décodage du JWT
   Le token JWT contient :
   json{
   "sub": "admin", // Username
   "roles": ["ROLE_ADMIN", "ROLE_USER"],
   "iat": 1234567890, // Issued at
   "exp": 1234654290 // Expiration
   }
   Next.js utilise jwt-decode pour extraire ces informations :
   typescriptimport { jwtDecode } from 'jwt-decode';

const decoded = jwtDecode<JwtPayload>(token);
console.log(decoded.sub); // "admin"
console.log(decoded.roles); // ["ROLE_ADMIN", "ROLE_USER"]

Endpoints disponibles
🔓 Endpoints publics (sans authentification)

1. Login
   httpPOST /auth/login
   Content-Type: application/json

Request:
{
"email": "admin@example.com",
"password": "admin123"
}

Response (200 OK):
{
"token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwiaWF0IjoxNzMwMTYwMDAwLCJleHAiOjE3MzAyNDY0MDB9...",
"type": "Bearer"
}

Response (401 Unauthorized):
{
"error": "Unauthorized",
"message": "Invalid credentials"
}
Utilisateurs par défaut :
EmailPasswordRôlesadmin@example.comadmin123ROLE_ADMIN, ROLE_USERuser@example.comuser123ROLE_USER

🔒 Endpoints protégés (nécessitent JWT)
Tous les endpoints ci-dessous nécessitent le header :
httpAuthorization: Bearer <token> 2. KPIs globaux
httpGET /api/dashboard/kpis

Response (200 OK):
{
"totalLaunches": 200,
"successRate": 95.5,
"nextLaunch": {
"id": "5eb87d47ffd86e000604b38a",
"name": "Starlink-15 (v1.0)",
"dateUtc": "2025-11-05T09:30:00.000Z",
"success": null,
"details": "This mission will launch...",
"rocket": {
"id": "5e9d0d95eda69973a809d1ec",
"name": "Falcon 9",
"type": "rocket",
"active": true,
"country": "United States",
"company": "SpaceX"
},
"launchPad": {
"id": "5e9e4502f509094188566f88",
"name": "LC-39A",
"locality": "Cape Canaveral",
"region": "Florida",
"latitude": 28.6080585,
"longitude": -80.6039558
},
"payloads": []
}
} 3. Statistiques annuelles
httpGET /dashboard/stats/yearly

Response (200 OK):
[
{
"year": 2023,
"totalLaunches": 61,
"successRate": 98.36
},
{
"year": 2024,
"totalLaunches": 87,
"successRate": 96.55
}
] 4. Liste paginée des lancements
httpGET /dashboard/launches?page=0&size=10&year=2024&success=true

Query Parameters:

- page: Numéro de page (0-indexed)
- size: Nombre d'éléments par page
- year: Filtrer par année (optionnel)
- success: Filtrer par succès true/false (optionnel)
- sort: Champ de tri (défaut: dateUtc,desc)

Response (200 OK):
{
"content": [
{
"id": "5eb87d47ffd86e000604b38a",
"name": "Starlink-15 (v1.0)",
"dateUtc": "2024-10-24T15:31:00.000Z",
"success": true,
"details": "This mission launched...",
"rocket": { ... },
"launchPad": { ... },
"payloads": []
}
],
"pageable": {
"sort": {
"empty": false,
"sorted": true,
"unsorted": false
},
"offset": 0,
"pageNumber": 0,
"pageSize": 10,
"paged": true,
"unpaged": false
},
"last": false,
"totalElements": 200,
"totalPages": 20,
"size": 10,
"number": 0,
"sort": { ... },
"first": true,
"numberOfElements": 10,
"empty": false
} 5. Détail d'un lancement
httpGET /dashboard/launches/{id}

Response (200 OK):
{
"id": "5eb87d47ffd86e000604b38a",
"name": "Starlink-15 (v1.0)",
"dateUtc": "2024-10-24T15:31:00.000Z",
"success": true,
"details": "This mission launched...",
"rocket": {
"id": "5e9d0d95eda69973a809d1ec",
"name": "Falcon 9",
"type": "rocket",
"active": true,
"country": "United States",
"company": "SpaceX"
},
"launchPad": {
"id": "5e9e4502f509094188566f88",
"name": "LC-39A",
"locality": "Cape Canaveral",
"region": "Florida",
"latitude": 28.6080585,
"longitude": -80.6039558
},
"payloads": [
{
"id": "5eb0e4d0b6c3bb0006eeb253",
"name": "Starlink V1.0 L15",
"type": "Satellite",
"massKg": 15400,
"orbit": "LEO",
"customer": null
}
]
}

Response (404 Not Found):
{
"timestamp": "2024-10-28T17:32:32.462+00:00",
"status": 404,
"error": "Not Found",
"message": "Launch not found",
"path": "/dashboard/launches/invalid-id"
}

👑 Endpoints ADMIN uniquement 6. Resynchronisation avec SpaceX API
httpPOST /admin/resync
Authorization: Bearer <admin-token>

Response (200 OK):
{
"success": true,
"message": "Synchronization completed successfully",
"launchesProcessed": 200
}

Response (403 Forbidden):
{
"timestamp": "2024-10-28T17:32:32.462+00:00",
"status": 403,
"error": "Forbidden",
"message": "Access Denied",
"path": "/api/admin/resync"
}

Utilisation dans Next.js

1. Configuration du client API
   Le client Axios est configuré dans lib/api/client.ts :
   typescriptimport axios from 'axios';

const client = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:8080/
timeout: 30000,
headers: {
'Content-Type': 'application/json',
},
});

// Intercepteur pour ajouter le JWT automatiquement
client.interceptors.request.use(
(config) => {
const token = localStorage.getItem('token');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
}
); 2. Services API
Service d'authentification (lib/api/auth.ts)
typescriptimport axios from './client';
import { LoginRequest, AuthResponse } from '@/types';

export const authService = {
async login(credentials: LoginRequest): Promise<AuthResponse> {
const response = await axios.post<AuthResponse>('/auth/login', credentials);
// Sauvegarder le token
localStorage.setItem('token', response.data.token);
return response.data;
},

logout() {
localStorage.removeItem('token');
window.location.href = '/login';
},

isAuthenticated(): boolean {
const token = localStorage.getItem('token');
if (!token) return false;

    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp > Date.now() / 1000;

},
};
Service des lancements (lib/api/launches.ts)
typescriptimport axios from './client';
import { LaunchStats, YearlyStats, Launch, Page } from '@/types';

export const launchService = {
async getKpis(): Promise<LaunchStats> {
const response = await axios.get<LaunchStats>('/dashboard/kpis');
return response.data;
},

async getYearlyStats(): Promise<YearlyStats[]> {
const response = await axios.get<YearlyStats[]>('/dashboard/stats/yearly');
return response.data;
},

async getLaunches(filters?: {
page?: number;
size?: number;
year?: number;
success?: boolean;
}): Promise<Page<Launch>> {
const params = new URLSearchParams();
if (filters?.page) params.append('page', filters.page.toString());
if (filters?.size) params.append('size', filters.size.toString());
if (filters?.year) params.append('year', filters.year.toString());
if (filters?.success !== undefined) params.append('success', filters.success.toString());

    const response = await axios.get<Page<Launch>>(
      `/dashboard/launches?${params.toString()}`
    );
    return response.data;

},

async getLaunchById(id: string): Promise<Launch> {
const response = await axios.get<Launch>(`/dashboard/launches/${id}`);
return response.data;
},

async resynchronize(): Promise<{ success: boolean; message: string; launchesProcessed: number }> {
const response = await axios.post('/admin/resync');
return response.data;
},
};

Gestion des erreurs
Types d'erreurs Spring Boot
typescriptinterface ApiError {
timestamp: string;
status: number;
error: string;
message: string;
path: string;
}
Codes d'erreur HTTP
CodeSignificationAction Next.js401Non authentifiéSupprimer le token, rediriger vers /login403Accès refusé (rôle insuffisant)Rediriger vers /dashboard404Ressource non trouvéeAfficher message d'erreur500Erreur serveurAfficher message d'erreur générique
Intercepteur d'erreurs Axios
typescriptaxios.interceptors.response.use(
(response) => response,
(error) => {
if (error.response?.status === 401) {
// Token invalide ou expiré
localStorage.removeItem('token');
window.location.href = '/login';
}

    if (error.response?.status === 403) {
      // Pas les droits
      console.error('Access denied');
    }

    return Promise.reject(error.response?.data || error);

}
);

Exemples pratiques
Exemple 1 : Login dans un composant
tsx'use client';

import { useState } from 'react';
import { authService } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setError('');

    try {
      await authService.login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }

};

return (
<form onSubmit={handleSubmit}>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="Email"
/>
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Password"
/>
{error && <p className="text-red-500">{error}</p>}
<button type="submit">Login</button>
</form>
);
}
Exemple 2 : Afficher les KPIs
tsx'use client';

import { useEffect, useState } from 'react';
import { launchService } from '@/lib/api';
import { LaunchStats } from '@/types';

export default function Dashboard() {
const [stats, setStats] = useState<LaunchStats | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
loadStats();
}, []);

const loadStats = async () => {
try {
const data = await launchService.getKpis();
setStats(data);
} catch (error) {
console.error('Failed to load KPIs:', error);
} finally {
setLoading(false);
}
};

if (loading) return <div>Loading...</div>;
if (!stats) return <div>No data</div>;

return (
<div>
<h1>Dashboard</h1>
<p>Total Launches: {stats.totalLaunches}</p>
<p>Success Rate: {stats.successRate.toFixed(2)}%</p>
<p>Next Launch: {stats.nextLaunch?.name || 'None'}</p>
</div>
);
}
Exemple 3 : Liste paginée avec filtres
tsx'use client';

import { useEffect, useState } from 'react';
import { launchService } from '@/lib/api';
import { Launch, Page } from '@/types';

export default function LaunchesList() {
const [launches, setLaunches] = useState<Page<Launch> | null>(null);
const [page, setPage] = useState(0);
const [year, setYear] = useState<number | undefined>();

useEffect(() => {
loadLaunches();
}, [page, year]);

const loadLaunches = async () => {
try {
const data = await launchService.getLaunches({
page,
size: 10,
year,
});
setLaunches(data);
} catch (error) {
console.error('Failed to load launches:', error);
}
};

return (
<div>
<select onChange={(e) => setYear(Number(e.target.value) || undefined)}>
<option value="">All years</option>
<option value="2024">2024</option>
<option value="2023">2023</option>
</select>

      <ul>
        {launches?.content.map((launch) => (
          <li key={launch.id}>
            {launch.name} - {new Date(launch.dateUtc).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <button onClick={() => setPage(page - 1)} disabled={launches?.first}>
        Previous
      </button>
      <span>Page {(launches?.number ?? 0) + 1} of {launches?.totalPages}</span>
      <button onClick={() => setPage(page + 1)} disabled={launches?.last}>
        Next
      </button>
    </div>

);
}
Exemple 4 : Resync (ADMIN uniquement)
tsx'use client';

import { useState } from 'react';
import { launchService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPanel() {
const { isAdmin } = useAuth();
const [loading, setLoading] = useState(false);

if (!isAdmin()) {
return <div>Access denied</div>;
}

const handleResync = async () => {
setLoading(true);
try {
const result = await launchService.resynchronize();
alert(`Synced ${result.launchesProcessed} launches!`);
} catch (error) {
alert('Resync failed');
} finally {
setLoading(false);
}
};

return (
<div>
<h1>Admin Panel</h1>
<button onClick={handleResync} disabled={loading}>
{loading ? 'Syncing...' : 'Resync SpaceX Data'}
</button>
</div>
);
}

```

---

## Troubleshooting

### ❌ Problème : CORS Error

**Erreur** :

```

Access to XMLHttpRequest at 'http://localhost:8080/api/auth/login' from origin 'http://localhost:3000'
has been blocked by CORS policy
Solution :
Vérifier que le backend autorise l'origine du frontend dans application.yml :
yamlcors:
allowed-origins: http://localhost:3000

❌ Problème : 401 Unauthorized sur endpoints protégés
Erreur :
json{
"timestamp": "2024-10-28T17:32:32.462+00:00",
"status": 401,
"error": "Unauthorized",
"path": "/api/dashboard/kpis"
}
Causes possibles :

Token absent ou expiré
Token mal formaté dans le header
Préfixe Bearer manquant

Solution :
typescript// Vérifier que le token est présent
const token = localStorage.getItem('token');
console.log('Token:', token);

// Vérifier que le header est correct
headers: {
'Authorization': `Bearer ${token}` // Espace après Bearer !
}

❌ Problème : 403 Forbidden sur /admin/resync
Erreur :
json{
"status": 403,
"error": "Forbidden",
"message": "Access Denied"
}
Cause : L'utilisateur n'a pas le rôle ROLE_ADMIN.
Solution :
typescriptconst user = authService.getCurrentUser();
console.log('User roles:', user?.roles); // Doit contenir "ROLE_ADMIN"

// Utiliser admin@example.com / admin123 pour les tests

```

---

### ❌ Problème : 404 Not Found

// ✅ CORRECT
baseURL: 'http://localhost:8080/'

❌ Problème : Token décodé mais rôles absents
Cause : Le backend n'a pas inclus les rôles dans le JWT.
Solution : Vérifier JwtUtil.java :
javaString token = Jwts.builder()
.setSubject(userDetails.getUsername())
.claim("roles", roles) // ← IMPORTANT : Ajouter les rôles
.setIssuedAt(now)
.setExpiration(exp)
.signWith(key, SignatureAlgorithm.HS256)
.compact();

Résumé des URLs
EndpointURL complèteAuthRôleLoginhttp://localhost:8080/api/auth/login❌-KPIshttp://localhost:8080/dashboard/kpis✅USER, ADMINStats annuelleshttp://localhost:8080/dashboard/stats/yearly✅USER, ADMIN Liste lancementshttp://localhost:8080/dashboard/launches✅USER, ADMIN Détail lancementhttp://localhost:8080/dashboard/launches/{id}✅USER, ADMINResynchttp://localhost:8080/admin/resync✅ADMIN

Checklist de démarrage
Backend

PostgreSQL démarré
Redis démarré
Backend démarré (mvn spring-boot:run ou docker-compose up)
Vérifier logs : ✓ Created admin user: admin@example.com / admin123
Test API : curl http://localhost:8080/actuator/health

Frontend

.env.local configuré avec NEXT_PUBLIC_API_URL=http://localhost:8080/api
Dépendances installées (npm install)
Frontend démarré (npm run dev)
Test login : admin@example.com / admin123
