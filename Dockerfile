FROM node:20-slim AS deps
WORKDIR /app

RUN apt-get update && \
    apt-get install -y openssl libssl-dev curl bash && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install all deps (including dev, needed for prisma CLI)
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm install; fi

FROM node:20-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run prisma generate + build (no second install)
RUN npx prisma generate
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update && \
    apt-get install -y openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only what’s needed for runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
