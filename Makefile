
TIME:=$(shell date +"%Y-%m-%d_%H-%M")

build:
	docker build -t telegram-bot-api-proxy  .

up:
	docker run -d -it --rm -p 9000:9000 --name telegram-bot-api-proxy telegram-bot-api-proxy:latest --key mm

down:
	docker stop telegram-bot-api-proxy

logs:
	docker logs telegram-bot-api-proxy

push:
	docker tag telegram-bot-api-proxy:latest pasaopasen/telegram-bot-api-proxy:$(TIME)
	docker push pasaopasen/telegram-bot-api-proxy:$(TIME)
	docker tag telegram-bot-api-proxy:latest pasaopasen/telegram-bot-api-proxy:latest
	docker push pasaopasen/telegram-bot-api-proxy:latest
	



