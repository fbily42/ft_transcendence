APP = nest-api
DB = postgres
NETWORK = transendence
COMPOSE_FILE = ./docker-compose.yml

all:
	@echo "$(BOLD)$(YELLOW)\n ----- Building app ----- \n$(RESET)"
	@docker-compose -f $(COMPOSE_FILE) up --build -d
	@echo "\n$(BOLD)$(GREEN)App ready [ ✔ ]\n$(RESET)"

start:
	@echo "$(BOLD)$(YELLOW)\n ----- Starting containers ----- \n$(RESET)";
	@if [ -n "$$(docker ps -aq)" ]; then \
		docker-compose -f $(COMPOSE_FILE) start; \
		echo "\n$(BOLD)$(GREEN)Containers started [ ✔ ]\n$(RESET)"; \
	else \
		echo "\n$(BOLD)$(RED)No Docker containers found.$(RESET)\n"; \
	fi

stop:
	@echo "$(BOLD)$(YELLOW)\n ----- Stopping containers ----- \n$(RESET)";
	@if [ -n "$$(docker ps -aq)" ]; then \
		docker-compose -f $(COMPOSE_FILE) stop; \
		echo "\n$(BOLD)$(GREEN)Containers stopped [ ✔ ]\n$(RESET)"; \
	else \
		echo "\n$(BOLD)$(RED)No Docker containers found.$(RESET)\n"; \
	fi

restart: stop start

status:
	@echo "\n$(BOLD)$(MAGENTA)docker ps -a $(RESET)" && docker ps -a
	@echo "\n$(BOLD)$(MAGENTA)docker volume ls $(RESET)" && docker volume ls
	@echo "\n$(BOLD)$(MAGENTA)docker images -a $(RESET)" && docker images -a
	@echo "\n$(BOLD)$(MAGENTA)docker network ls $(RESET)" && docker network ls

logs:
	@if [ -n "$$(docker ps -aq)" ]; then \
		echo "$(YELLOW)\n ----- Showing docker logs  ----- \n$(RESET)"; \
		echo "\n$(YELLOW)$(APP) logs:$(RESET)"; docker logs $(APP); \
		echo "\n$(YELLOW)$(DB) logs:$(RESET)\n"; docker logs $(DB); \
	else \
		echo "\n$(BOLD)$(RED)No Docker containers found.$(RESET)\n"; \
	fi

remove_containers:
	@if [ -n "$$(docker ps -aq)" ]; then \
		echo "$(BOLD)$(YELLOW)\n ----- Stopping and removing docker containers  ----- \n$(RESET)"; \
		docker-compose -f $(COMPOSE_FILE) down; \
		echo "\n$(BOLD)$(GREEN)Containers stopped and removed [ ✔ ]\n$(RESET)"; \
	else \
		echo "\n$(BOLD)$(RED)No Docker containers found.$(RESET)\n"; \
	fi	

remove_volumes:
	@if [ -n "$$(docker volume ls -q)" ]; then \
		echo "$(YELLOW)\n ----- Removing docker volumes  ----- \n$(RESET)"; \
		docker-compose -f $(COMPOSE_FILE) down --volumes; \
		echo "\n$(BOLD)$(GREEN)Volumes removed [ ✔ ]\n$(RESET)"; \
	else \
		echo "\n$(BOLD)$(RED)No Docker volumes found.\n$(RESET)"; \
	fi

remove_images:
	@if [ -n "$$(docker images -aq)" ]; then \
		echo "$(YELLOW)\n ----- Removing docker images  ----- \n$(RESET)"; \
		docker rmi -f $$(docker image ls -q); \
		echo "\n$(BOLD)$(GREEN)Images removed [ ✔ ]\n$(RESET)"; \
	else \
		echo "\n$(BOLD)$(RED)No Docker images found.\n$(RESET)"; \
	fi

removes_network:
	@if [ -n "$$(docker network ls | grep $(NETWORK))" ]; then \
		echo "$(YELLOW)\n ----- Removing docker network  ----- \n$(RESET)"; \
		@docker network rm -f $(NETWORK); \
		echo "\n$(BOLD)$(GREEN)Network removed [ ✔ ]\n$(RESET)"; \
	else \
		echo "\n$(BOLD)$(RED)No Docker network found.\n$(RESET)"; \
	fi

clean: remove_containers remove_volumes remove_images removes_network
	@echo "\n$(BOLD)$(GREEN)Cleaned [ ✔ ]\n$(RESET)"

re:
	make clean
	make all

.PHONY: all re cleaen removes_network remove_images remove_volumes remove_containers \
	status logs restart start stop

# COLORS
RESET = \033[0m
WHITE = \033[37m
GREY = \033[90m
RED = \033[91m
DRED = \033[31m
GREEN = \033[92m
DGREEN = \033[32m
YELLOW = \033[93m
DYELLOW = \033[33m
BLUE = \033[94m
DBLUE = \033[34m
MAGENTA = \033[95m
DMAGENTA = \033[35m
CYAN = \033[96m
DCYAN = \033[36m

# FORMAT
BOLD = \033[1m
ITALIC = \033[3m
UNDERLINE = \033[4m
STRIKETHROUGH = \033[9m