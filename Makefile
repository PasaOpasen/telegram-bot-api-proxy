
build:
	docker build -t telegram-bot-api-proxy  .

up:
	docker run -d -it --rm -p 9000:9000 --name telegram-bot-api-proxy telegram-bot-api-proxy:latest

down:
	docker stop telegram-bot-api-proxy

logs:
	docker logs telegram-bot-api-proxy


