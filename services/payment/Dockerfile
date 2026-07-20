# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy common package
COPY services/common/package.json services/common/
COPY services/common/tsconfig.json services/common/
COPY services/common/src services/common/src

# Copy payment service
COPY services/payment/package.json services/payment/
COPY services/payment/tsconfig.json services/payment/

# Copy root config
COPY package.json tsconfig.base.json ./

# Install dependencies
RUN npm install --workspace=services/common --workspace=services/payment

# Build common first, then payment
RUN npm run build --workspace=services/common
COPY services/payment/src services/payment/src
RUN npm run build --workspace=services/payment

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy root package files
COPY package.json tsconfig.base.json ./

# Copy common built output
COPY --from=builder /app/services/common/package.json services/common/
COPY --from=builder /app/services/common/dist services/common/dist

# Copy payment built output
COPY --from=builder /app/services/payment/package.json services/payment/
COPY --from=builder /app/services/payment/dist services/payment/dist

# Install production deps only
RUN npm install --workspace=services/common --workspace=services/payment --omit=dev

WORKDIR /app/services/payment

EXPOSE 8007

CMD ["node", "dist/index.js"]
