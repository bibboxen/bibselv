#!/bin/sh

docker-compose --env-file .env.docker.local -f docker-compose.server.yml pull
docker-compose --env-file .env.docker.local -f docker-compose.server.yml up --force-recreate --detach --remove-orphans

docker-compose --env-file .env.docker.local -f docker-compose.server.yml exec engine bash -c './scripts/install.sh'

docker-compose --env-file .env.docker.local -f docker-compose.server.yml restart

docker-compose --env-file .env.docker.local -f docker-compose.server.yml exec --user deploy phpfpm bin/console doctrine:migrations:migrate --no-interaction

# frontend assets will be rebuilt automatically
