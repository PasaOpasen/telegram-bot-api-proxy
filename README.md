
# telegram-bot-api-proxy

simple express app for forwarding request to api.telegram.org 

## How to use

```sh
$ docker run -it --rm  telegram-bot-api-proxy:latest --help
Options:
      --version  Show version number                                   [boolean]
  -k, --key      Specify the server key to check all requests by tg-proxy-key
                 header, empty means to not use authentification
                                                          [string] [default: ""]
  -c, --skey     Specify the server key for https         [string] [default: ""]
  -t, --cert     Specify the server certificate for https [string] [default: ""]
  -h, --help     Show help                                             [boolean]
```

```sh
docker run -d -it --rm \
    -p 9000:9000 \
    -v ./cert:/app/cert \
    --name telegram-bot-api-proxy telegram-bot-api-proxy:latest \
    --key my-key --skey /app/cert/selfsigned.key --cert /app/cert/selfsigned.crt
```

## Endpoint

change `https://api.telegram.org` to `http://<your ip>:<your port>` (or `https://<your ip>:<your port>`)


