FROM nginx:alpine
MAINTAINER Fabio Pavesi - fabio@adamassoft.it
COPY ./dist /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80