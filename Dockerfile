# syntax=docker/dockerfile:1
FROM nginx:alpine AS static-server
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM static-server AS landing
COPY deployment/landing/ /usr/share/nginx/html/

FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM dependencies AS react-build
COPY . .
RUN npm run build-storybook -- --output-dir /app/storybook-static

# Keep the current web Storybook as the default target during migration.
FROM static-server AS react-docs
COPY --from=react-build /app/storybook-static/ /usr/share/nginx/html/
