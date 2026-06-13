FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY demo/package*.json demo/
RUN npm ci && npm --prefix demo ci
COPY . .
RUN npm --prefix demo run build

FROM nginx:alpine
COPY --from=build /app/demo/dist /usr/share/nginx/html
