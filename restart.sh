#!/bin/sh

# Pull and up containers
docker-compose --env-file .env.docker.local -f docker-compose.server.yml pull
docker-compose --env-file .env.docker.local -f docker-compose.server.yml up --force-recreate --detach --remove-orphans

# Install frontend packages
docker-compose --env-file .env.docker.local -f docker-compose.server.yml exec frontend bash -c 'npm install'

# Install engine packages
docker-compose --env-file .env.docker.local -f docker-compose.server.yml exec engine bash -c './scripts/install.sh'

# Install php bundles
docker-compose --env-file .env.docker.local -f docker-compose.server.yml exec --user deploy phpfpm composer install --no-dev -o

# Migrate database
docker-compose --env-file .env.docker.local -f docker-compose.server.yml exec --user deploy phpfpm bin/console doctrine:migrations:migrate --no-interaction

# Restart containers
# Frontend assets will be rebuilt automatically when the container is restarted
docker-compose --env-file .env.docker.local -f docker-compose.server.yml restart
