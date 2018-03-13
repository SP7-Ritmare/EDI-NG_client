FROM node:9-alpine
MAINTAINER Fabio Pavesi - fabio@adamassoft.it
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]