# ---- build ----
  FROM node:22-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build && npm prune --omit=dev
  
  # ---- runtime ----
  FROM node:22-alpine
  WORKDIR /app
  ENV NODE_ENV=production
  COPY --from=build /app/node_modules ./node_modules
  COPY --from=build /app/dist ./dist
  # copy only if you want default .env baked (usually not); we’ll mount/use env_file instead
  CMD ["node", "dist/main.js"]
  