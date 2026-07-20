# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package.json tsconfig.base.json ./

# Copy common package
COPY services/common/package.json services/common/tsconfig.json ./services/common/
COPY services/common/src ./services/common/src

# Copy cart service
COPY services/cart/package.json services/cart/tsconfig.json ./services/cart/
COPY services/cart/src ./services/cart/src

# Install all dependencies (workspace-aware)
RUN npm install --workspace=services/common --workspace=services/cart

# Build common first, then cart
RUN npm run build --workspace=services/common
RUN npm run build --workspace=services/cart

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy root workspace files
COPY package.json ./

# Copy common built artifacts
COPY --from=builder /app/services/common/package.json ./services/common/
COPY --from=builder /app/services/common/dist ./services/common/dist

# Copy cart built artifacts
COPY --from=builder /app/services/cart/package.json ./services/cart/
COPY --from=builder /app/services/cart/dist ./services/cart/dist

# Install production dependencies only
RUN npm install --workspace=services/common --workspace=services/cart --omit=dev

WORKDIR /app/services/cart

EXPOSE 8005

CMD ["node", "dist/index.js"]
