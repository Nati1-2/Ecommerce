# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy common package
COPY services/common/package.json services/common/
COPY services/common/dist/ services/common/dist/

# Copy gateway package
COPY gateway/package.json gateway/
COPY package.json ./

# Install dependencies
RUN npm install --workspace=gateway --include-workspace-root

# Copy gateway source
COPY gateway/ gateway/
COPY tsconfig.base.json ./

# Build
RUN npm run build --workspace=gateway

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy common package
COPY services/common/package.json services/common/
COPY services/common/dist/ services/common/dist/

# Copy gateway package.json and root package.json
COPY gateway/package.json gateway/
COPY package.json ./

# Install production dependencies only
RUN npm install --workspace=gateway --include-workspace-root --omit=dev

# Copy built gateway
COPY --from=builder /app/gateway/dist gateway/dist

EXPOSE 8000

CMD ["node", "gateway/dist/index.js"]
