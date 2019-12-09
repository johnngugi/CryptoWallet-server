FROM node:12.13.1 as builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN apt-get -q update && apt-get -qy install netcat

USER node

RUN npm install

FROM node:12.13.1-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . .
## Copy built node modules and binaries
COPY --from=builder /home/node/app/node_modules ./node_modules

USER node

EXPOSE 3000

CMD [ "npm", "run", "start" ]