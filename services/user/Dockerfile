# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy common package
COPY services/common/package.json services/common/tsconfig.json ./services/common/
COPY services/common/src ./services/common/src

# Copy user service
COPY services/user/package.json services/user/tsconfig.json ./services/user/
COPY services/user/src ./services/user/src

# Copy root config
COPY package.json tsconfig.base.json ./

# Install all dependencies
RUN npm install --workspace=services/common --workspace=services/user

# Build common first, then user service
RUN npm run build --workspace=services/common
RUN npm run build --workspace=services/user

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy built common
COPY --from=builder /app/services/common/dist ./services/common/dist
COPY --from=builder /app/services/common/package.json ./services/common/

# Copy built user service
COPY --from=builder /app/services/user/dist ./services/user/dist
COPY --from=builder /app/services/user/package.json ./services/user/

# Copy root package.json for workspaces
COPY --from=builder /app/package.json ./

# Install production dependencies only
RUN npm install --workspace=services/user --omit=dev

WORKDIR /app/services/user

EXPOSE 8002

CMD ["node", "dist/index.js"]
