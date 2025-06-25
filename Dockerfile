# Dockerfile
FROM node:lts as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN npm run build

# Production image
FROM node:lts

WORKDIR /app

COPY --from=build /app ./

ENV NODE_ENV=production
EXPOSE 3333

CMD ["node", "dist/server.js"]
