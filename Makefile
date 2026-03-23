
TIME:=$(shell date +"%Y-%m-%d_%H-%M")

build:
	docker build -t telegram-bot-api-proxy  .

up:
	docker run -d -it --rm \
		-p 9000:9000 \
		-v ./cert:/app/cert \
		--name telegram-bot-api-proxy telegram-bot-api-proxy:latest \
		--key my-key --skey /app/cert/selfsigned.key --cert /app/cert/selfsigned.crt

down:
	docker stop telegram-bot-api-proxy

restart:
	make down || true
	make up

logs:
	docker logs telegram-bot-api-proxy

logs-follow:
	docker logs -f telegram-bot-api-proxy

redo:
	make down || true
	make build up logs-follow

push:
	docker tag telegram-bot-api-proxy:latest pasaopasen/telegram-bot-api-proxy:$(TIME)
	docker push pasaopasen/telegram-bot-api-proxy:$(TIME)
	docker tag telegram-bot-api-proxy:latest pasaopasen/telegram-bot-api-proxy:latest
	docker push pasaopasen/telegram-bot-api-proxy:latest
	
.PHONY: cert
cert:
	mkdir -p cert
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert/selfsigned.key -out cert/selfsigned.crt
	sudo chown 1444 -R cert

