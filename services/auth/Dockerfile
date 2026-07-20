# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy common package
COPY services/common/package.json services/common/
COPY services/common/dist/ services/common/dist/

# Copy auth service package
COPY services/auth/package.json services/auth/
COPY package.json ./

# Install dependencies
RUN npm install --workspace=services/auth --include-workspace-root

# Copy auth source
COPY services/auth/ services/auth/
COPY tsconfig.base.json ./

# Build
RUN npm run build --workspace=services/auth

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy common package
COPY services/common/package.json services/common/
COPY services/common/dist/ services/common/dist/

# Copy auth package.json and root package.json
COPY services/auth/package.json services/auth/
COPY package.json ./

# Install production dependencies only
RUN npm install --workspace=services/auth --include-workspace-root --omit=dev

# Copy built auth service
COPY --from=builder /app/services/auth/dist services/auth/dist

EXPOSE 8001

CMD ["node", "services/auth/dist/index.js"]
