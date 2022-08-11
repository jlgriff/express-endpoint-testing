import express, { Application } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLError } from 'graphql';
import { ApplicationConfig } from './interfaces/config.app';

import errorMiddleware from './middleware/error';
import { graphqlEndpoint } from './configs/index';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import handleError from './utilities/error';

const application = (config: ApplicationConfig): Application => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(graphqlEndpoint, graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: config.graphiqlEnabled,
    customFormatErrorFn(err: GraphQLError) {
      return handleError(err);
    },
  }));

  app.use(errorMiddleware);

  return app;
};

export default application;
