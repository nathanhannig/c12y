FROM node:15-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN apk update && \
    apk add --no-cache make gcc g++ python && \
    # legacy-peer-deps is used because of react-admin dependency issues at the moment
    npm install --legacy-peer-deps && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python

EXPOSE 4000

CMD [ "npm", "start" ]