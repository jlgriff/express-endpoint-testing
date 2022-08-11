# Introduction

This project is a proof-of-concept for creating API endpoint tests that:

1. Are deterministic
2. Don't require any setup external to the code
3. Test real database interactions instead of mocks

To do this, I'm using [npm testcontainers](https://www.npmjs.com/package/testcontainers) to programatically spin up an shut down a MongoDB container just for the duration of the `npm test` script.

The service does require Docker to be running to spin up the dynamic test containers, but requires no system setup besides that.

# Installation

1. Run `npm install` to install the dependencies.
2. Run `npm run copy-env:local` to create a `.env` from `.env-local` if `.env` doesn't already exist.
3. Start [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) on the default port (already set in `.env`).
    * On Unix, this can be run via `sudo brew services start mongodb-community@6.0`.
3. Run `npm start` to start the application.

# Development Mode

1. Run `npm run dev` to start the application in live-updating development mode.

# Routes

| Route | Method | Response |
|-------|-------|-------|
| `/graphql` | POST | Provides a GraphQL API |

# Testing

Run `npm test` to run tests.

# Docker

1. Run `docker build -t template-image .` to build the image.

2. Run `docker run --rm --name template template-image` to run the container.
