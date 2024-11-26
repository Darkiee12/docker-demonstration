# Build Stage
FROM oven/bun:latest AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . . 
RUN bun run build

# Serve Stage
FROM node:18-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/dist /app/dist
EXPOSE 3000

CMD [ "serve", "-s", "dist" ]