# syntax=docker/dockerfile:1
FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM dependencies AS react-build
COPY . .
RUN npm run build-storybook -- --output-dir /app/storybook-static

# Requires the native Storybook configuration and root build script to be added.
FROM dependencies AS native-build
COPY native/package*.json ./native/
RUN npm ci --prefix native
COPY . .
RUN node -e "if (!require('./package.json').scripts['build-storybook:native']) { console.error('Native docs are not configured: add build-storybook:native before deploying react-native-docs.'); process.exit(1); }"
RUN npm run build-storybook:native -- --output-dir /app/storybook-native-static

FROM nginx:alpine AS static-server
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM static-server AS landing
COPY deployment/landing/ /usr/share/nginx/html/

FROM static-server AS react-native-docs
COPY --from=native-build /app/storybook-native-static/ /usr/share/nginx/html/

# Keep the current web Storybook as the default target during migration.
FROM static-server AS react-docs
COPY --from=react-build /app/storybook-static/ /usr/share/nginx/html/
