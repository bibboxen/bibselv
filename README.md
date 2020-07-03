# bibbox-website

Bibbox from a website.

## Description

This project a provides library self-service from a website. It consists of the
following parts:

- An administration interface (for configuring machines) and website provider for the frontend (Symfony/PHP).
- A frontend (React) that exposes the library functions available to the user.
- An engine (Node.js) that handles communication between the frontend and FBS and handles state for each machine (Fælles bibliotekssystem).

A user can load a machine by a unique URL that is tied to a machine configuration.

![alt text](docs/architecture.png "Architecture")

The frontend communicates with the engine through a web socket.
The machine state flows from the engine to the frontend.
The frontend reflects the given machine state.
User actions are sent from the frontend to the engine.
The engine then changes the machines state and sends it back to the frontend.

## Tech stack

* Node.js 14.x
* Symfony 5.x
* PHP 7.4
* React 16.x
* Redis
* Docker

## Development setup

A docker based development setup is provided with the project.

```
docker-compose up -d
```

This will start the engine and the frontend.

To install assets for the frontend we use Encore.

To watch for changes in the assets folder, run:
```
npm run dev
```

## Code Linting

When PRs are created towards the develop branch all coding styles are checked by Github Actions.

### Frontend

To check for coding standards, run the following:

```
npm run check-coding-standards
```

To automatically apply coding standards, run:

```
npm run apply-coding-standards
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
npm test
```

### Engine

Engine tests runs with mocha from the `engine/` directory. The tests that
call FBS are mocked with nock recordings.

```
cd engine
npm test
```

## Production

### Building production assets for the frontend

```
npm run build
```
