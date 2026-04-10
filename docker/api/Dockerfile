FROM node:20-alpine

WORKDIR /app

RUN corepack enable

# Copy workspace manifests first for better layer caching.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json

# Install only the API workspace and its dependencies.
RUN pnpm install --frozen-lockfile --filter api...

# Copy source code needed to build and run the API.
COPY apps/api apps/api
COPY packages/types packages/types

WORKDIR /app/apps/api

# Prisma config requires DATABASE_URL to exist at generate-time.
ENV DATABASE_URL=postgresql://nexus:nexus@prisma:5432/nexus?schema=public

RUN pnpm prisma generate --schema=prisma/schema.prisma
RUN pnpm build

EXPOSE 9000

CMD ["sh", "-c", "pnpm prisma migrate deploy --schema=prisma/schema.prisma && node dist/src/main.js"]
