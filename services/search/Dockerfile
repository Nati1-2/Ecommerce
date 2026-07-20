# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package.json tsconfig.base.json ./
COPY services/common ./services/common
COPY services/search ./services/search

# Install all dependencies (workspace-aware)
RUN npm install --workspace=services/search

# Build common first, then the search service
RUN npm run build --workspace=services/common
RUN npm run build --workspace=services/search

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts and production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/services/common/package.json ./services/common/package.json
COPY --from=builder /app/services/common/dist ./services/common/dist
COPY --from=builder /app/services/search/package.json ./services/search/package.json
COPY --from=builder /app/services/search/dist ./services/search/dist
COPY --from=builder /app/node_modules ./node_modules

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

USER appuser

EXPOSE 8008

CMD ["node", "services/search/dist/index.js"]
