
FROM node:25 as app

RUN groupadd -r user -g 1444 && \
    useradd -u 1444 -s /bin/bash -g user user && \
    mkdir -p /app/cert && \
    chown user:user -R /app && \
    chmod u+rw -R /app

WORKDIR /app
USER user

COPY --chown=user:user --chmod=700 package.json .
RUN yarn install
COPY --chown=user:user --chmod=700 app.js .

ENTRYPOINT [ "node", "app.js" ]


