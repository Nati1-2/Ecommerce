# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy common package
COPY services/common/package.json services/common/
COPY services/common/tsconfig.json services/common/
COPY services/common/src services/common/src

# Copy order service
COPY services/order/package.json services/order/
COPY services/order/tsconfig.json services/order/

# Copy root config
COPY package.json tsconfig.base.json ./

# Install dependencies
RUN npm install --workspace=services/common --workspace=services/order

# Build common first, then order
RUN npm run build --workspace=services/common
COPY services/order/src services/order/src
RUN npm run build --workspace=services/order

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy root package files
COPY package.json tsconfig.base.json ./

# Copy common built output
COPY --from=builder /app/services/common/package.json services/common/
COPY --from=builder /app/services/common/dist services/common/dist

# Copy order built output
COPY --from=builder /app/services/order/package.json services/order/
COPY --from=builder /app/services/order/dist services/order/dist

# Install production deps only
RUN npm install --workspace=services/common --workspace=services/order --omit=dev

WORKDIR /app/services/order

EXPOSE 8006

CMD ["node", "dist/index.js"]
