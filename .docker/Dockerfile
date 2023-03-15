# FROM node:12.16.3-alpine as build
FROM node:16-alpine as build

FROM fholzer/nginx-brotli:v1.12.2

WORKDIR /etc/nginx
ADD nginx.conf /etc/nginx/nginx.conf
ADD dist /var/www/html
ADD .htaccess /var/www/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]