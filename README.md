# Bibbox Website

A centralized Bibbox that runs as web-pages.

## Description

This project a provides library self-service from a website. It consists of the following parts:

- A frontend that exposes the library functions available to the user (React).
- An administration interface (for configuring machines) and website provider for the frontend (Symfony/PHP).
- An engine that handles communication between the frontend and FBS (Fælles bibliotekssystem) and handles state for each machine (Node.js).

A user can load a machine by a unique URL that is tied to a machine configuration.

![alt text](docs/architecture.png "Architecture")

The frontend communicates with the engine through a web socket.
The machine state flows from the engine to the frontend.
The frontend reflects the given machine state.
User actions passes from the frontend to the engine.
The engine then changes the machines state and sends it back to the frontend.

## Tech stack

* Node.js 14.x
* Symfony 5.x
* PHP 7.4
* React 16.x

## Development setup

A docker based development setup is provided with the project. So first step is to start the docker compose stack to install the required PHP and NodeJs packages, set configuration files and then restart the stack to make it work corretly.

```sh
docker-compose up --detach
```

### Engine
We start by getting engine dependencies and set it's basic configuration.

Copy engine configuration files:

```sh
cp engine/example_config.json engine/config.json
```

@TOOD: __Note__ that the config.json contains FBS configuration at this point, but will later version be loaded from the Symfony administration backend as box configuration. So this is an hack for now.

Install dependencies for the engine.
```
docker-compose exec engine bash -c './scripts/install.sh'
```

### Frontend

Install the frontend react dependencies.
```sh
docker-compose exec frontend bash -c 'npm install'
```

Install composer packages.
```sh
docker-compose exec phpfpm composer install
```

Install database for Symfony using migrations, run
```sh
docker-compose exec phpfpm bash -c 'bin/console doctrine:migrations:migrate'
```

### Restart

Now that we have installed all the dependencies need by the frontend and engine, we need to restart the docker containers to ensure that everything gets loaded, run

```sh
docker-compose restart engine
docker-compose restart frontend
```

### Install assets
The React frontend is bootstrapped by the symfony backend and assets needs to by build, which happens when the frontend container is started. It's started with file watchers so the assets should be automatically compiled on code changes.

To see logs for the compilation, run
```sh
docker-compose logs frontend
```

## Using the system
To get a running frontend you need to first goto the administration interface and setup a box configuration. Start by adding an SIP2 user, then a school an lastly a bibbox box configuration where you select the other two.

Get url for the administration:
```sh
open http://$(docker-compose port nginx 80)/admin
```

Next access the React frontend where `x` below is the id of the configuration entity you just created in the administrative interface.
```sh
open http://$(docker-compose port nginx 80)?id=x
```

## Logging
The engine uses logstash to log messages, and these can be seen in the docker setup with the following command.
```sh
idc logs -f logstash
```

Which will show lines as json objects eg.
```json
{"@version":"1","level":"info","name":"Unknown","message":"Listening on port 3000","@timestamp":"2020-09-15T09:20:11.838Z","type":"server","location":"Unknown"}
```

## Code Linting

When PRs are created towards the develop branch all coding styles are checked by Github Actions.

### Frontend

To check for coding standards, run the following:

```sh
docker-compose exec frontend bash -c 'npm run check-coding-standards'
```

To automatically apply coding standards, run:

```sh
docker-compose exec frontend bash -c 'npm run apply-coding-standards'
```

### Engine

The same commands apply as frontend, be should be run from the `engine/` folder.

### Symfony

@TODO: Setup coding standards for the Symfony/PHP code.

## Testing

All tests runs with Github Actions for each PR to develop.

### Frontend

Frontend tests runs with jest.

```
docker-compose exec frontend bash -c 'npm test'
```

### Engine

Engine tests runs with mocha from the `engine/` directory. The tests that
call FBS are mocked with nock recordings (see the `test/fixtures` folder).

```
docker-compose exec engine bash -c 'npm test'
```

### Symfony

@TODO: Setup tests for the Symfony/PHP code.

## Production

### Setup symfony

Create a `.env.local` with the correct values for SECRET, DB_USER, DB_PASSWORD, DB_NAME
```
APP_ENV=prod
APP_SECRET=SECRET

DATABASE_URL=mysql://DB_USER:DB_PASSWORD@mariadb:3306/DB_NAME
```

Install symfony packages
```
composer install --no-dev -o
```

Run database migrations
```
bin/console doctrine:migrations:migrate
```

### Building production assets for the frontend

```
docker-compose exec frontend bash -c 'npm run build'
```
