
FROM node:25 as app

RUN mkdir -p /app

WORKDIR /app

COPY package.json .
RUN yarn install
COPY app.js .

CMD [ "node", "app.js" ]


