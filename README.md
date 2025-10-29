# SpaceX Dashboard Frontend

Interface utilisateur moderne pour suivre les lancements SpaceX, construite avec Next.js 14 et TypeScript.

## 📋 Prérequis

### Développement local

- Node.js 20.x ou supérieur
- npm 10.x ou supérieur
- Un backend SpaceX Dashboard fonctionnel (voir le repo backend)

### Déploiement Docker

- Docker 24.x ou supérieur
- Docker Compose v2.x ou supérieur

## 🚀 Installation

### Sans Docker (développement)

1. Cloner le repository

```bash
git clone <repo-url>
cd spacex-project/frontend
```

2. Installer les dépendances

```bash
npm install
```

3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Éditer .env.local avec vos valeurs:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/
```

4. Lancer l'application en développement

```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000

### Avec Docker

1. Cloner le repository et se placer dans le dossier

```bash
git clone <repo-url>
cd spacex-project/frontend
```

2. Construction et démarrage avec Docker Compose

```bash
# Construction de l'image
docker compose build

# Démarrage des conteneurs
docker compose up -d

# Voir les logs
docker compose logs -f
```

L'application sera disponible sur http://localhost:3000

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement

# Production
npm run build        # Build l'application
npm run start        # Démarre l'application en production

# Docker
npm run docker:build      # Construction de l'image Docker
npm run docker:run        # Lance le conteneur Docker
npm run docker:compose:up # Démarre avec Docker Compose
```

## 🏗️ Architecture

```
frontend/
├── app/                    # Pages et routing (Next.js App Router)
│   ├── (auth)/            # Routes d'authentification
│   └── (dashboard)/       # Routes du dashboard
├── components/            # Composants React réutilisables
│   ├── ui/               # Composants UI génériques
│   └── layouts/          # Layouts et templates
├── contexts/             # Contexts React (ex: AuthContext)
├── lib/                  # Utilitaires et services
│   ├── api/             # Services API
│   └── utils.ts         # Fonctions utilitaires
└── types/               # Types TypeScript
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification. Comptes de test disponibles :

- Admin:

  - Email: admin@example.com
  - Password: admin123

- User:
  - Email: user@example.com
  - Password: user123

## 🌍 Variables d'environnement

| Variable              | Description    | Valeur par défaut        |
| --------------------- | -------------- | ------------------------ |
| `NEXT_PUBLIC_API_URL` | URL du backend | `http://localhost:8080/` |
| `NODE_ENV`            | Environnement  | `development`            |

## 🔧 Configuration

### TypeScript

Le projet utilise TypeScript avec une configuration stricte. Voir `tsconfig.json` pour les détails.

### ESLint

Configuration ESLint standard Next.js avec règles TypeScript.

### Docker

Le projet inclut:

- `Dockerfile` optimisé pour Next.js
- Multi-stage build pour une image légère
- Configuration Docker Compose pour le développement

## 🚥 Statut du projet

- ✅ Authentication JWT
- ✅ Dashboard interactif
- ✅ Statistiques des lancements
- ✅ Liste des lancements avec filtres
- ✅ Détails des lancements
- ✅ Interface admin

## 📚 Documentation API

L'application consomme une API REST. La documentation complète des endpoints est disponible dans le README du backend.

Endpoints principaux:

- `POST /auth/login` - Authentification
- `GET /dashboard/kpis` - Statistiques globales
- `GET /dashboard/launches` - Liste des lancements
- `GET /dashboard/launches/{id}` - Détail d'un lancement
- `GET /dashboard/stats/yearly` - Statistiques annuelles

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
