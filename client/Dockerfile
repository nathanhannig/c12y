FROM node:15-alpine

# Create app directory
WORKDIR /usr/src/client

# Install app dependencies
COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]