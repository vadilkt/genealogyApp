# MS Généalogie — Frontend

Application web de gestion généalogique : gestion des profils, arbres généalogiques, lieux et alertes.

## Aperçu

| Application | Description | Port |
|---|---|---|
| `ms-genealogie-app` | Interface principale — gestion des profils, arbres généalogiques, lieux et alertes | `3000` |

---

## Stack technique

- **Framework** : Next.js 13 (Pages Router)
- **Langage** : TypeScript 4.9
- **UI** : Ant Design 5, SCSS Modules
- **État serveur** : TanStack React Query v4
- **Internationalisation** : next-i18next (fr / en)
- **Authentification** : Custom AuthProvider (token en `localStorage`)
- **Gestionnaire de paquets** : Yarn Classic 1.22
- **Tests** : Jest 29 + Testing Library
- **Qualité** : ESLint, Prettier, commitlint, Husky, lint-staged

---

## Prérequis

| Outil | Version minimale |
|---|---|
| Node.js | 20 |
| Yarn | 1.22 |

```bash
# Vérification
node -v   # >= 20.x.x
yarn -v   # 1.22.x

# Installation de Yarn si nécessaire
npm install -g yarn
```

---

## Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd frontend
```

### 2. Installer les dépendances

```bash
yarn install
```

### 3. Activer les hooks Git

```bash
yarn prepare
```

Installe Husky pour le lint-staged et le commitlint automatiques.

### 4. Configurer les variables d'environnement

Créer un fichier `.env.development.local` à la racine à partir de l'exemple ci-dessous.

#### `.env.development.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8190/api
NEXT_PUBLIC_APP_NAME=ms-genealogie
NEXT_PUBLIC_APP_VERSION=0.0.0
```

> **Note :** Les fichiers `.env.*.local` sont ignorés par Git. Ne jamais commiter de secrets.

---

## Lancer en développement

```bash
yarn dev
```

- App : [http://localhost:3000](http://localhost:3000)

---

## Build

```bash
yarn build
```

Le build produit un output `standalone` (compatible Docker). Le serveur autonome est émis dans `.next/standalone/server.js`.

```bash
# Démarrer le build de production
yarn start
```

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `yarn dev` | Démarre l'app en mode développement (port 3000) |
| `yarn build` | Build de production (output standalone) |
| `yarn start` | Démarre le serveur de production |
| `yarn lint` | Lint le code |
| `yarn test` | Exécute les tests |
| `yarn format` | Formate le code avec Prettier |
| `yarn format:check` | Vérifie le formatage sans modifier les fichiers |
| `yarn commit` | Crée un commit guidé via Commitizen |
| `yarn prepare` | Installe les hooks Husky |

---

## Structure du projet

```
frontend/
├── src/
│   ├── components/   # Composants React
│   ├── configs/      # Client HTTP (apiClient) et configuration
│   ├── consts/       # Constantes
│   ├── contexts/     # Contextes React (AuthContext, …)
│   ├── domains/      # Logique métier par domaine (profiles, family, places, …)
│   ├── hooks/        # Hooks React partagés
│   ├── i18n/         # Configuration et ressources i18n
│   ├── pages/        # Routes Next.js (*.page.tsx)
│   ├── services/     # Couche HTTP (HttpClient) et services applicatifs
│   ├── styles/       # Styles globaux SCSS
│   ├── types/        # Types TypeScript partagés
│   └── utils/        # Utilitaires
├── public/           # Assets statiques (locales, favicon, …)
├── next.config.js    # Configuration Next.js
├── next-i18next.config.js # Configuration i18n
├── tsconfig.json     # Configuration TypeScript
├── jest.config.js    # Configuration Jest
├── .eslintrc.js      # Configuration ESLint
├── .prettierrc.json  # Configuration Prettier
├── commitlint.config.js   # Règles Conventional Commits
├── Dockerfile        # Image de production (standalone)
└── sonar-project.properties  # Configuration SonarQube
```

---

## Conventions de développement

| Convention | Détail |
|---|---|
| **Barrel exports** | Chaque module expose son API publique via `index.ts` |
| **Extensions de page** | Les routes Next.js utilisent `.page.tsx` (pas `.tsx`) |
| **SCSS Modules** | Styling par composant via `.module.scss` |
| **Colocation des tests** | `index.test.ts` placé à côté du fichier source |
| **Architecture domaine** | Logique métier isolée dans `src/domains/` |
| **Commits** | Conventional Commits enforced par commitlint (`feat`, `fix`, `docs`, `refactor`, `test`, etc.) |
| **Imports** | Alias `@/` résolu vers `src/` |

---

## Variables d'environnement — référence

| Variable | Usage | Requis |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de base de l'API backend | Oui |
| `NEXT_PUBLIC_APP_NAME` | Nom de l'application | Non |
| `NEXT_PUBLIC_APP_VERSION` | Version affichée dans l'UI | Non |

---

## Tests

```bash
yarn test
```

Les rapports de couverture sont générés dans `coverage/` (format LCOV pour SonarQube).
