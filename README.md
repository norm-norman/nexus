# Nexus

A monorepo for **Nexus — Connect Time and Space**, a platform for visualizing calendar events on a map.

## Structure

```
apps/
  web/       Next.js web application
  api/       Backend API
  mobile/    Mobile app
packages/
  types/     Shared TypeScript types (@nexus/types)
  eslint-config/  Shared ESLint configuration
  typescript-config/  Shared TypeScript configuration
  shared/    Shared utilities
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all apps and packages |
| `pnpm format` | Format code with Prettier |

Built with [Turborepo](https://turbo.build/repo), [pnpm](https://pnpm.io), and [Next.js](https://nextjs.org).
