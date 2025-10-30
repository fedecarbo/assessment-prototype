# Multi-stage Dockerfile for Next.js application
# Supports both development and production builds

# Base stage - install dependencies
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies stage - install all dependencies
FROM base AS deps
# Copy package files
COPY package.json package-lock.json ./
# Install dependencies
RUN npm install

# Builder stage - build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js application
RUN npm run build

# Production runner stage - minimal runtime image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# Development stage - for docker-compose development
FROM base AS development
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3000

# Run development server
CMD ["npm", "run", "dev"]
