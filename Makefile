.PHONY: up down restart list network-local help

RED = \033[0;31m
YELLOW = \033[0;33m
RESET = \033[0m

up: server-up web-server-up
down: server-down web-server-down 
restart: server-restart

server-up:
	docker compose -f docker/source/docker-compose.yml up -d --build

server-down:
	docker compose -f docker/source/docker-compose.yml down

server-restart:
	docker compose -f docker/source/docker-compose.yml restart
	docker compose -f docker/web-server/docker-compose.yml restart

web-server-up:
	docker compose -f docker/web-server/docker-compose.yml up -d --build

web-server-down:
	docker compose -f docker/web-server/docker-compose.yml down

network-local:
	docker network create local

list:
	@echo "Listing containers for app1, app2, and web-server:"
	@echo "----------------------------------------------"
	@echo "Containers:\n"
	@cd docker&& docker container ls --filter label=com.docker.compose.project
	@echo "----------------------------------------------"

help:
	@echo "\n"
	@echo "$(RED)Usage: make [TARGET]$(RESET)"
	@echo "$(YELLOW)Targets:$(RESET)"
	@echo "$(YELLOW)  up                  : Start services$(RESET)"
	@echo "$(YELLOW)  down                : Stop services$(RESET)"
	@echo "$(YELLOW)  restart             : restart services$(RESET)"
	@echo "$(YELLOW)  list                : List containers$(RESET)"
	@echo "$(YELLOW)  network-local       : Add network local$(RESET)"
	@echo "$(YELLOW)  help                : Show this help message$(RESET)"
	@echo "\n"


