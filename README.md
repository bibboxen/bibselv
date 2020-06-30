# bibbox-website

Bibbox from a website.

## Description

This project a provides library self-service from a website. It consists of the
following parts:

- An administration interface (for configuring machines) and website provider (Symfony/PHP).
- A frontend (React) that exposes the library functions available to the user.
- An engine (Node.js) that handles communication between the frontend and FBS (Fælles bibliotekssystem).

A user can load a machine by a unique URL that is tied to a machine configuration.


## Development setup

A docker based development setup is provided with the project.

```
docker-compose up -d
```
