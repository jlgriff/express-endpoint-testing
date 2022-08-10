import express, { Application } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { ApplicationConfig } from './interfaces/config.app';

import errorMiddleware from './middleware/error';
import log from './utilities/logger';
import { graphqlEndpoint } from './configs';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';

const application = (config: ApplicationConfig): Application => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(graphqlEndpoint, graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
  }));

  app.use(errorMiddleware);

  log('info', `Application is running on port ${config.port} with the ${config.environment} environment`);

  return app;
};

export default application;
