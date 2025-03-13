args=$(filter-out $@,$(MAKECMDGOALS))

.EXPORT_ALL_VARIABLES:

ENV_FILE ?= .env
PROJECT=postgres

# export .env file
-include $(ENV_FILE)
export

all: help ## show all targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

help: ## show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev: ## start server
	docker compose -f ./docker/local/docker-compose.yaml -p $(PROJECT) up $(args) -d ${SERVICE}

build: ## start server
	docker compose -f ./docker/local/docker-compose.yaml -p $(PROJECT) up $(args) --build -d ${SERVICE}

down: ## stop server
	docker compose -f ./docker/local/docker-compose.yaml -p $(PROJECT) down

migration-create: ## create migration
	@if [ -z "$(shell ls -A ./src/database/migration)" ]; then \
		echo "No migrations found, creating initial migration..."; \
		npx mikro-orm migration:create --initial; \
	else \
		echo "Migrations already exist, skipping --initial"; \
		npx mikro-orm migration:create; \
	fi

migration-up: ## apply migration
	npx mikro-orm migration:up

migration-down: ## rollback migration
	npx mikro-orm migration:down

migration-status: ## check migration status
	npx mikro-orm migration:check

migration-list: ## check list of migrations
	npx mikro-orm migration:list

seeding-create:
	npx mikro-orm seeder:create "S$(shell date +%Y%m%d%H%M%S)"

seeding-apply: ## apply seed
	npx mikro-orm seeder:run --class=${SEED_CLASS}

deploy-develop:
	bash ./scripts/deploy.sh dev $(PROJECT)