FROM node:alpine as builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY application/package*.json ./

RUN apk add --no-cache --virtual deps \
    python \
    build-base \
    && npm install \
    && apk del deps

FROM node:alpine as app

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node ./application .

COPY --from=builder /home/node/app/node_modules ./node_modules

EXPOSE 3000

USER node

CMD [ "npm", "run", "start" ]