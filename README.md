# Introduction

There's typically a fundamental tradeoff when deciding how to build integration/endpoint tests:

1. If the tests simply mock the database interactions, they will have the benefit of always being deterministic, but at the cost of validating those database interactions.
2. If the tests interact with a real database, they will have the benefit of validating those database interactions, but will require significant system setup to connect the app to a running database.

This project—however—implements a middle-ground in its `resolvers.test.ts` file: The tests validate **real database interactions**, but require essentially **no prior system setup**.

To do this, I'm using [npm testcontainers](https://www.npmjs.com/package/testcontainers) to programatically spin up an shut down database containers only for the duration of the `npm test` script. Using these real database clients means that the application code can be tested without relying on a single mock.

Because of how self-contained these tests are, the only setup required to run `npm test` is a running Docker daemon.

# Installation

1. Run `npm install` to install the dependencies.
2. Run `npm run copy-env:local` to create a `.env` from `.env-local` if `.env` doesn't already exist.
3. Start [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) on the default port (already set in `.env`).
   - On Unix, this can be run via `sudo brew services start mongodb-community@6.0`.
4. Run `npm start` to start the application.

# Development Mode

1. Run `npm run dev` to start the application in live-updating development mode.

# Routes

| Route      | Method | Response               |
| ---------- | ------ | ---------------------- |
| `/graphql` | POST   | Provides a GraphQL API |

# Testing

With Docker running, run `npm test`.
