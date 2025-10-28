# Use Node 20 (minimum required)
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build --configuration production

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/trackify-frontend/browser /usr/share/nginx/html
EXPOSE 80
