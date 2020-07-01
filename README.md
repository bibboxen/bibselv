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

## Production

### Build production assets for the frontend

```
npm run build
```
