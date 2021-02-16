FROM node:15-alpine

# Create app directory
WORKDIR /usr/src/server

# Install app dependencies
COPY package*.json ./

RUN apk update && \
    apk add --no-cache make gcc g++ python && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python

EXPOSE 8080

CMD [ "npm", "run", "dev" ]