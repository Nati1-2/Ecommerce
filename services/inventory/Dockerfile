# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package.json tsconfig.base.json ./

# Copy common package
COPY services/common/package.json services/common/tsconfig.json ./services/common/
COPY services/common/src ./services/common/src

# Copy inventory service
COPY services/inventory/package.json services/inventory/tsconfig.json ./services/inventory/
COPY services/inventory/src ./services/inventory/src

# Install all dependencies (workspace-aware)
RUN npm install --workspace=services/common --workspace=services/inventory

# Build common first, then inventory
RUN npm run build --workspace=services/common
RUN npm run build --workspace=services/inventory

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy root workspace files
COPY package.json ./

# Copy common built artifacts
COPY --from=builder /app/services/common/package.json ./services/common/
COPY --from=builder /app/services/common/dist ./services/common/dist

# Copy inventory built artifacts
COPY --from=builder /app/services/inventory/package.json ./services/inventory/
COPY --from=builder /app/services/inventory/dist ./services/inventory/dist

# Install production dependencies only
RUN npm install --workspace=services/common --workspace=services/inventory --omit=dev

WORKDIR /app/services/inventory

EXPOSE 8004

CMD ["node", "dist/index.js"]
