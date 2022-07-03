# Build
FROM node:16-alpine as build

ARG TRUYOU_HOST
ENV TRUYOU_HOST=${TRUYOU_HOST}

ARG TRUYOU_PORT
ENV TRUYOU_PORT=${TRUYOU_PORT}

WORKDIR /usr/local/app

COPY . /usr/local/app/
RUN npm ci
RUN npm run build

# Run
FROM nginx:latest

COPY --from=build /usr/local/app/dist /usr/share/nginx/html

EXPOSE 80
