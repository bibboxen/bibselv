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

- Node.js 14.x
- Symfony 5.x
- PHP 7.4
- React 16.x

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

@TODO: __Note__ that the config.json contains FBS configuration at this point, but will later version be loaded from the Symfony administration backend as box configuration. So this is an hack for now.

Install dependencies for the engine.

```sh
docker compose run engine bash -c './scripts/install.sh --also=dev'
```

### Environment variables

For the system to work, create a `.env.local` file and replace the environment variables from the `.env`:

```sh
CONFIGURATION_URL=APP_CONFIGURATION_URL # Url to OpenId Discovery document
CLIENT_ID=APP_CLIENT_ID                 # Client id assigned by authorizer
CLIENT_SECRET=APP_CLIENT_SECRET         # Client password assigned by authorizer
REDIRECT_URI=APP_REDIRECT_URI           # Redirect URI registered at identity provider
CLI_REDIRECT=APP_CLI_REDIRECT_URI       # Redirect route for CLI login
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

To populate the database with meaningful test data run the doctrine fixtures

```sh
docker-compose exec phpfpm bash -c 'bin/console doctrine:fixtures:load'
```

To create a test user run

```sh
docker-compose exec phpfpm bash -c 'bin/console app:user:create --email=admin@example.com --password=admin'
```



### Restart

Now that we have installed all the dependencies need by the frontend and engine, we need to restart the docker container to ensure that everything gets loaded, run

```sh
docker-compose restart engine
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

To test locally see "Bibselv OpenIDConnect" credentials in 1Password.

Login flow is as follows:
Box frontend -> Symfony (route: box_ad_login) -> Azure -> Symfony (route: box_ad_redirect_uri) -> Box frontend (calls config w. state)

#### Symfony (route: box_ad_login)

Receives the box id `uniqueId` and the `boxState` to indicate if the box entered "check out" or "status". Then adds this to the Azure AD login url as openid state, before redirecting to Azure.

#### Symfony (route: box_ad_redirect_uri)

Receives the redirect back from Azure after login, validates the credentials and gets username and type. Gets box id and box state from openid connect state and caches it all as a `AdLoginState` keyed by the box id. Then redirects to the box URL.

#### Symfony (route: box_frontend_load)

Endpoint for the individual box. Loads the box. Then the box calls the config box config endpoint.

#### Symfony (route: box_configuration)

Endpoint for box configuration. If there is a cached `AdLoginState` object it loads this and includes it in the config as `adLoginState`. If no state is cached `adLoginState` is set to `null`

```json
{
    "id": 25,
    "hasPrinter": true,
    "reservedMaterialInstruction": "Dolor est ut ea natus iusto deserunt inventore.",
    "inactivityTimeOut": 360000,
    "soundEnabled": false,
    "school": {
        "name": "Beder Skole"
    },
    "loginMethod": "azure_ad_login",
    "adLoginState": {
        "state": "checkoutitems",
        "accountType": "student",
        "userName": "test1234"
    },
    "hasTouch": false,
    "hasKeyboard": false,
    "sip2User": {
        "username": "test_test",
        "password": "12345678",
        "agencyId": "DK-718680",
        "location": "Kalvehave"
    },
    "defaultPassword": "0000",
    "debugEnabled": false,
    "defaultLanguageCode": "da",
    "hasFrontpageCheckIn": true
}
```

### Azure AD logout

@TODO Needs to be implemented in <https://github.com/itk-dev/openid-connect> to support the `BoxAdLogoutController`

### Azure AD error handling

@TODO We need to decide how and when to expose errors from Azure to the end user.

#### Frontend box

Loads the config and enters flow based on exposed state.

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

### Code linting frontend

To check for coding standards, run the following:

```sh
docker-compose run frontend bash -c 'npm run check-coding-standards'
```

To automatically apply coding standards, run:

```sh
docker-compose run frontend bash -c 'npm run apply-coding-standards'
```

### Code linting Engine

The same commands apply as frontend, be should be run from the `engine/` folder.

### Code linting Symfony

@TODO: Setup coding standards for the Symfony/PHP code.

## Testing

All tests runs with Github Actions for each PR to develop.

### Testing frontend

The frontend is [component tested](https://docs.cypress.io/guides/core-concepts/testing-types#What-is-Component-Testing) with Cypress.

```sh
docker compose run --rm cypress run --component
```

To run outside docker:
```sh
# Open mode
npm run cypress:open
```

```sh
# cli
npm run cypress:run
```
### Testing engine

Engine tests runs with mocha from the `engine/` directory. The tests that
call FBS are mocked with nock recordings (see the `test/fixtures` folder).

```sh
docker compose exec engine bash -c 'npm test'
```

### Testing symfony

@TODO: Setup tests for the Symfony/PHP code.

## Production

### Setup symfony

To install and build please run the `../scripts/deploy.sh` script on the `prod` server
and give the tag to deploy as argument to the script.

```sh
../scripts/deploy.sh <git tag>
```

## Translations

The React front end used [formatJS](https://formatjs.io/) to handle translations.

To extract new strings in json.

```sh
docker compose exec frontend bash -c "npm run extract -- 'assets/**/*.js*' --out-file public/lang/en.json --id-interpolation-pattern '[sha512:contenthash:base64:6]'"
```

Make a copy of this file into a new JSON file (public/lang/<LANGCODE>.json) and
change the strings into your language and compile the json file with the
following command (substitute <LANGCODE> with your language code):

```sh
docker compose exec frontend bash -c "npm run compile -- public/lang/<LANGCODE>.json --ast --out-file public/lang/<LANGCODE>-comp.json"
```

### Danish

```sh
docker compose exec frontend bash -c "npm run compile -- public/lang/da.json --ast --out-file public/lang/da-comp.json"
```

### English

```sh
docker compose exec frontend bash -c "npm run compile -- public/lang/en.json --ast --out-file public/lang/en-comp.json"
```

To add the new language, edit `assets/js/app.js` and locate the
`loadTranslations` function and add your translation. Next edit
`src/Utils/Types/LanguageCodes.php` and your language. Re-compile the frontend
and add the new language. You are now ready to use the new language.
