# Build Angular app
FROM node:22 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build --configuration production

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/trackify-frontend /usr/share/nginx/html
EXPOSE 80
