
build:
	docker build -t telegram-bot-api-proxy  .

up:
	docker run -d -it --rm -p 9000:9000 telegram-bot-api-proxy:latest
