# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy common package
COPY services/common/package.json services/common/tsconfig.json ./services/common/
COPY services/common/src ./services/common/src

# Copy product service
COPY services/product/package.json services/product/tsconfig.json ./services/product/
COPY services/product/src ./services/product/src

# Copy root config
COPY package.json tsconfig.base.json ./

# Install all dependencies
RUN npm install --workspace=services/common --workspace=services/product

# Build common first, then product service
RUN npm run build --workspace=services/common
RUN npm run build --workspace=services/product

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy built common
COPY --from=builder /app/services/common/dist ./services/common/dist
COPY --from=builder /app/services/common/package.json ./services/common/

# Copy built product service
COPY --from=builder /app/services/product/dist ./services/product/dist
COPY --from=builder /app/services/product/package.json ./services/product/

# Copy root package.json for workspaces
COPY --from=builder /app/package.json ./

# Install production dependencies only
RUN npm install --workspace=services/product --omit=dev

WORKDIR /app/services/product

EXPOSE 8003

CMD ["node", "dist/index.js"]
