# syntax=docker/dockerfile:1
FROM nginx:alpine AS static-server
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY packages/slice/package.json ./packages/slice/package.json
COPY packages/slice-native/package.json ./packages/slice-native/package.json
COPY apps/website/package.json ./apps/website/package.json
COPY apps/storybook-web/package.json ./apps/storybook-web/package.json
COPY apps/storybook-native/package.json ./apps/storybook-native/package.json
RUN npm ci

FROM dependencies AS landing-build
COPY . .
RUN npm run build:landing

FROM static-server AS landing
COPY --from=landing-build /app/apps/website/out/ /usr/share/nginx/html/

FROM dependencies AS react-build
COPY . .
RUN npm run build-storybook -- --output-dir /app/apps/storybook-web/storybook-static

# Keep the current web Storybook as the default target during migration.
FROM static-server AS react-docs
COPY --from=react-build /app/apps/storybook-web/storybook-static/ /usr/share/nginx/html/
