import express, { Application } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { ApplicationConfig } from './interfaces/config.app.js';

import errorMiddleware from './middleware/error.js';
import log from './utilities/logger.js';
import { graphqlEndpoint } from './configs/index.js';
import schema from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';

const application = (config: ApplicationConfig): Application => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(graphqlEndpoint, graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: config.graphiqlEnabled,
  }));

  app.use(errorMiddleware);

  log('info', `Application is running on port ${config.port} with the ${config.environment} environment`);

  return app;
};

export default application;
