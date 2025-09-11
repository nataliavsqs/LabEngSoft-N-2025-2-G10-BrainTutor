# Dockerfile para aplicação React (register-app)
# Utiliza imagem oficial do Node para build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
COPY register-app/package*.json ./register-app/

RUN npm install
WORKDIR /app/register-app
RUN npm install
COPY register-app/ ./
RUN npm run build

# Utiliza Nginx para servir o build
FROM nginx:alpine
COPY --from=build /app/register-app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
