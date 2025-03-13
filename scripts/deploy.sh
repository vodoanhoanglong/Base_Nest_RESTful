#!/bin/bash

ENV=${1:-dev}

case "$ENV" in
  dev)  BRANCH="develop" ;;
  prod) BRANCH="production" ;;
  *)    echo "🚨 Environment not support '$ENV'"; exit 1 ;;
esac

COMPOSE_FILE="./docker/$ENV/docker-compose.yaml"
CONFIG_PATH=./dist/core/config/orm.config.js

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "🚨 File not found: $COMPOSE_FILE"
  exit 1
fi

PROJECT=${2:-nestjs}

echo "🚀 Pulling code from '$BRANCH'"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "🚀 Deploying to $ENV environment with $BRANCH branch"
docker-compose -f "$COMPOSE_FILE" -p "$PROJECT" up $ARGS --build -d

echo "🚀 Applying migration"
docker exec -it $PROJECT-server npx mikro-orm migration:up --config=$CONFIG_PATH --context=default

echo "🚀 Deploy successfully"