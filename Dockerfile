# See https://hono.dev/docs/getting-started/nodejs#dockerfile
FROM node:20-bookworm-slim as builder

#USER node
WORKDIR /app
 
COPY package*.json .
COPY container/tsconfig.json .
COPY container/ src/
COPY extensions/ extensions/
RUN npm ci && \
    npm run build && \
    npm prune --production

FROM node:20-bookworm-slim
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/extensions /app/extensions
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono

EXPOSE 3000
 
CMD ["node", "/app/dist/src/index.js"]