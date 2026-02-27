# MS Généalogie — Monorepo

Monorepo structuré avec **Turborepo** + **Yarn Workspaces** (Yarn Classic 1.22).

## Prérequis

- Node.js ≥ 18
- Yarn Classic 1.22 (`npm install -g yarn`)

## Installation

```bash
yarn install
```

## Scripts

| Commande | Description |
|---|---|
| `yarn dev` | Démarre toutes les apps en mode développement |
| `yarn build` | Build tous les packages et apps |
| `yarn lint` | Lint tous les packages et apps |
| `yarn test` | Exécute tous les tests |
| `yarn format` | Formate tout le code avec Prettier |
| `yarn commit` | Message de commit guidé (Commitizen) |

## Structure

```
frontend/
├── apps/
│   ├── ms-genealogie-app/    # App principale (Next.js 13, Pages Router, port 3000)
│   └── ms-genealogie-admin/  # App admin (Next.js 13, Pages Router, port 3001)
├── packages/
│   ├── ui/                   # Composants réutilisables (Ant Design 5, Storybook)
│   ├── services/             # Couche API (fetch natif)
│   ├── auth/                 # Authentification (NextAuth)
│   ├── utils/                # Utilitaires (dayjs, lodash, query-string)
│   ├── view-engine/          # Moteur de vues dynamiques (GraphQL)
│   ├── web-sockets/          # WebSocket client
│   ├── blockly-custom/       # Éditeur visuel de workflows (Blockly)
│   ├── project-version/      # Gestion des versions
│   ├── tsconfig/             # Configs TypeScript partagées
│   ├── eslint-config-custom/ # Config ESLint partagée
│   └── jest-config/          # Config Jest partagée
├── package.json              # Yarn Workspaces
├── turbo.json                # Turborepo pipeline
└── ...configs
```

## Conventions

- **Barrel exports** : chaque module exporte via `index.ts`
- **Custom page extensions** : `.page.tsx` pour les routes Next.js
- **SCSS Modules** : `.module.scss` pour le styling par composant
- **Colocation des tests** : `index.test.ts` à côté du code source
- **DDD-like** : domaines isolés dans `src/domains/`
- **Conventional Commits** : enforced par commitlint
