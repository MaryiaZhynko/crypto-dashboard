# Use the official Node.js image as the base image
FROM node:20

# pnpm must be on PATH so docker-entrypoint.sh does not rewrite the command to `node pnpm ...`
RUN corepack enable

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and lockfile to the working directory
COPY package.json pnpm-lock.yaml ./

# Install the application dependencies
RUN corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build all Nest apps (backend + ticker-service)
RUN pnpm run build

# HTTP API + TCP microservice
EXPOSE 4444 4445

# Default: API only (override in docker-compose for ticker-service)
CMD ["node", "dist/apps/backend/main"]