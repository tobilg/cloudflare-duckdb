FROM node:20-bookworm-slim as builder

#USER node
WORKDIR /app
 
COPY package.json .
COPY container/tsconfig.json .
COPY container/ src/
RUN npm i 
RUN npm run build

FROM node:20-bookworm-slim
COPY --from=builder /app /app

WORKDIR /app

EXPOSE 3000
 
CMD ["node", "dist/src/index.js"]