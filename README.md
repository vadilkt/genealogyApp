# MS Généalogie — Frontend

Application web de gestion généalogique, composée d'une interface utilisateur et d'une interface d'administration, organisées en monorepo.

## Aperçu

| Application | Description | Port |
|---|---|---|
| `ms-genealogie-app` | Interface principale — gestion des profils, arbres généalogiques, lieux et alertes | `3000` |
| `ms-genealogie-admin` | Interface d'administration — gestion des accès et supervision | `3001` |

---

## Stack technique

- **Framework** : Next.js 13 (Pages Router)
- **Langage** : TypeScript 4.9
- **UI** : Ant Design 5, SCSS Modules
- **État serveur** : TanStack React Query v4
- **Internationalisation** : next-i18next (fr / en)
- **Authentification** : Custom AuthProvider (app) · NextAuth v4 (admin)
- **Monorepo** : Turborepo + Yarn Workspaces (Yarn Classic 1.22)
- **Tests** : Jest 29 + Testing Library
- **Qualité** : ESLint, Prettier, commitlint, Husky, lint-staged

---

## Prérequis

| Outil | Version minimale |
|---|---|
| Node.js | 18 |
| Yarn | 1.22 |

```bash
# Vérification
node -v   # >= 18.x.x
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

Toutes les dépendances des apps et des packages partagés sont installées en une seule commande grâce à Yarn Workspaces.

### 3. Activer les hooks Git

```bash
yarn prepare
```

Installe Husky pour le lint-staged et le commitlint automatiques.

### 4. Configurer les variables d'environnement

Chaque application dispose de son propre fichier `.env`. Créer les fichiers suivants à partir des exemples ci-dessous.

#### `apps/ms-genealogie-app/.env.development.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8090/api
NEXT_PUBLIC_APP_NAME=ms-genealogie
NEXT_PUBLIC_APP_VERSION=0.0.0
```

#### `apps/ms-genealogie-admin/.env.development.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=ms-genealogie-admin
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-development-secret-change-in-production
```

> **Note :** Les fichiers `.env.*.local` sont ignorés par Git. Ne jamais commiter de secrets.

---

## Lancer en développement

```bash
# Toutes les apps simultanément (recommandé)
yarn dev

# Une app spécifique
yarn workspace @ms-genealogie/app dev
yarn workspace @ms-genealogie/admin dev
```

- App principale : [http://localhost:3000](http://localhost:3000)
- Admin : [http://localhost:3001](http://localhost:3001)

---

## Build

```bash
# Build complet (toutes les apps et packages)
yarn build

# Build d'une app spécifique
yarn workspace @ms-genealogie/app build
yarn workspace @ms-genealogie/admin build
```

Les builds produisent un output `standalone` (compatible Docker).

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `yarn dev` | Démarre toutes les apps en mode développement |
| `yarn build` | Build tous les packages et apps |
| `yarn lint` | Lint l'ensemble du monorepo |
| `yarn test` | Exécute tous les tests |
| `yarn format` | Formate le code avec Prettier |
| `yarn format:check` | Vérifie le formatage sans modifier les fichiers |
| `yarn commit` | Crée un commit guidé via Commitizen |
| `yarn prepare` | Installe les hooks Husky |

---

## Structure du projet

```
frontend/
├── apps/
│   ├── ms-genealogie-app/    # Interface utilisateur (port 3000)
│   └── ms-genealogie-admin/  # Interface d'administration (port 3001)
├── packages/
│   ├── ui/                   # Composants React réutilisables (Ant Design 5, Storybook)
│   ├── services/             # Couche API (fetch natif, sans dépendances runtime)
│   ├── auth/                 # Authentification partagée (NextAuth)
│   ├── utils/                # Utilitaires (dayjs, lodash, query-string)
│   ├── view-engine/          # Moteur de vues dynamiques (json-to-graphql-query)
│   ├── web-sockets/          # Client WebSocket
│   ├── blockly-custom/       # Éditeur visuel de workflows (Google Blockly 10)
│   ├── project-version/      # Gestion sémantique des versions
│   ├── tsconfig/             # Configurations TypeScript partagées
│   ├── eslint-config-custom/ # Configuration ESLint partagée
│   └── jest-config/          # Configuration Jest partagée
├── package.json              # Yarn Workspaces + scripts racine
├── turbo.json                # Pipeline Turborepo
├── .prettierrc.json          # Configuration Prettier
├── commitlint.config.js      # Règles Conventional Commits
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
| **Imports** | Alias `@/` résolu vers `src/` dans chaque app |

---

## Variables d'environnement — référence

| Variable | Usage | Requis |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de base de l'API backend | Oui |
| `NEXT_PUBLIC_APP_NAME` | Nom de l'application | Non |
| `NEXT_PUBLIC_APP_VERSION` | Version affichée dans l'UI | Non |
| `NEXTAUTH_URL` | URL publique de l'app admin (NextAuth) | Admin uniquement |
| `NEXTAUTH_SECRET` | Secret de signature des sessions NextAuth | Admin uniquement |

> **Production :** `NEXTAUTH_SECRET` doit être une chaîne aléatoire sécurisée (min. 32 caractères). Générer avec `openssl rand -base64 32`.

---

## Tests

```bash
# Tous les tests
yarn test

# Tests d'une app ou d'un package spécifique
yarn workspace @ms-genealogie/app test
yarn workspace @ms-genealogie/ui test
```

Les rapports de couverture sont générés dans `coverage/` (format LCOV pour SonarQube).
