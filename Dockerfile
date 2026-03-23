
FROM node:25 as app

RUN mkdir -p /app

WORKDIR /app

COPY package.json .
RUN yarn install
COPY app.js .

ENTRYPOINT [ "node", "app.js" ]


