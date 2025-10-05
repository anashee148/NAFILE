# Multistage Dockerfile for React (Vite) frontend
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY . .
RUN npm ci --silent
RUN npm run build

# Production stage: use a small Node image and serve the static `dist` on port 4000
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist

# Install a tiny static server (serve) and run the built files
RUN npm install -g serve@14.1.2 --silent

ENV PORT=4000
EXPOSE 4000

CMD ["sh", "-c", "serve -s dist -l $PORT"]