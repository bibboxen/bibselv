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
docker-compose run frontend bash -c 'npm install'
```

### Symfony

Install composer packages.
```sh
docker-compose exec phpfpm composer install
```

Install database schema for Symfony using migrations, run
```sh
docker-compose exec phpfpm bash -c 'bin/console doctrine:migrations:migrate'
```

### Restart

Now that we have installed all the dependencies need by the frontend and engine, we need to restart the docker container to ensure that everything gets loaded, run

```sh
docker-compose restart engine
```

### Building assets
To watch for changes in assets and then build:
```sh
docker-compose run frontend bash -c 'npm run watch'
```

## Using the system
To get a running frontend you need to first goto the administration interface and setup a box configuration. Start by adding an SIP2 user, then a school an lastly a bibbox box configuration where you select the other two.

Get url for the administration:
```sh
open http://$(docker-compose port nginx 80)/admin
```

Before logging into the box configuration administrative interface, create an administrative user:
```sh
docker-compose exec phpfpm bash -c 'bin/console app:user:create --email=admin@itkdev.dk --password=admin'
```

Next access the React frontend where `x` below is the id of the configuration entity you just created in the administrative interface.
```sh
open http://$(docker-compose port nginx 80)?id=x
```

### Azure AD login
For working with the Azure Ad login in your local dev environment you need access the box from a URL that qualifies as "secure origin". This means either `https`, `127.0.0.1` or `localhost`. The standard `0.0.0.0` docker IP does not qualify.

Using a non-secure origin will result in browser errors like:
`BrowserAuthError: pkce_not_created: The PKCE code challenge and verifier could not be generated. Detail:TypeError: can't access property "digest", window.crypto.subtle is undefined`

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
docker-compose run frontend bash -c 'npm run check-coding-standards'
```

To automatically apply coding standards, run:

```sh
docker-compose run frontend bash -c 'npm run apply-coding-standards'
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

## Translations
The React front end used (formatJS)[https://formatjs.io/] to handle translations.

To extract new strings in json.
```sh
docker-compose exec frontend bash -c "npm run extract -- 'assets/**/*.js*' --out-file public/lang/en.json --id-interpolation-pattern '[sha512:contenthash:base64:6]'"
```
Make a copy of this file into a new JSON file (public/lang/<LANGCODE>.json) and
change the strings into your language and compile the json file with the
following command (substitute <LANGCODE> with your language code):
```sh
docker-compose exec frontend bash -c "npm run compile -- public/lang/<LANGCODE>.json --ast --out-file public/lang/<LANGCODE>-comp.json"
```

To add the new language, edit `assets/js/app.js` and locate the
`loadTranslations` function and add your translation. Next edit
`src/Utils/Types/LanguageCodes.php` and your language. Re-compile the frontend
and add the new language. You are now ready to use the new language.
