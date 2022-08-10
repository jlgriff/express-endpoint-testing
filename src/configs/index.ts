import { config } from 'dotenv';
import log from '../utilities/logger';

config({ path: '.env' });

interface EnvConfig {
  name: string;
  value: any;
  required: boolean;
}

const checkConfigurations = (configurations: EnvConfig[]): void => {
  configurations
    .filter((c) => c.value === undefined)
    .forEach((c) => {
      if (c.required) {
        log('error', `Missing ${c.name} config. Terminating application startup.`);
        process.exit();
      } else {
        log('warn', `Missing ${c.name} config. Using a default value.`);
      }
    });
};

const {
  PORT, NODE_ENV, GRAPHIQL_ENABLED, JWT_SECRET_KEY, JWT_EXPIRATION, DB_HOST, DB_PORT, DB_NAME,
} = process.env;

const configurations: EnvConfig[] = [
  { name: 'PORT', value: PORT, required: false },
  { name: 'NODE_ENV', value: NODE_ENV, required: false },
  { name: 'GRAPHIQL_ENABLED', value: GRAPHIQL_ENABLED, required: false },
  { name: 'JWT_SECRET_KEY', value: JWT_SECRET_KEY, required: true },
  { name: 'JWT_EXPIRATION', value: JWT_EXPIRATION, required: false },
  { name: 'DB_HOST', value: DB_HOST, required: true },
  { name: 'DB_PORT', value: DB_PORT, required: true },
  { name: 'DB_NAME', value: DB_NAME, required: true },
];

checkConfigurations(configurations);

export const port: number = PORT
  ? parseInt(PORT, 10) || 80
  : 80;
export const environment: string = NODE_ENV || 'development';
export const graphiqlEnabled: boolean = (GRAPHIQL_ENABLED?.toLowerCase() === 'true') || false;
export const minPasswordLength: number = 6;
export const graphqlEndpoint: string = '/graphql';
export const jwtSecretKey: string = JWT_SECRET_KEY!!;
export const jwtExpiration: string = JWT_EXPIRATION || '1hr';
export const dbConnectionString: string = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}?retryWrites=true`;
