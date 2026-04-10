FROM node:20

RUN corepack enable

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/

RUN corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 4444 4445 5173

CMD ["node", "dist/apps/backend/main"]