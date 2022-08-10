import express, { Application } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { ApplicationConfig } from './interfaces/config.app';

import errorMiddleware from './middleware/error';
import { graphqlEndpoint } from './configs/index';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';

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

  return app;
};

export default application;
