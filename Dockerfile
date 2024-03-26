# first container
FROM node:18.19 as build
LABEL authors="zeljko"

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-css
RUN npm run build

# second container
FROM nginx

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

