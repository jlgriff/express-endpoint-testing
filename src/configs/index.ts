import { config } from 'dotenv';
import log from '../utilities/logger';

config({ path: '.env' });

const {
  PORT, NODE_ENV, JWT_SECRET_KEY, JWT_EXPIRATION,
} = process.env;
const defaultPort = 80;
const defaultEnv = 'development';

if (!JWT_SECRET_KEY) {
  log('error', 'Missing JWT_SECRET_KEY config! Defaulting to an empty private key.');
}

if (!JWT_EXPIRATION) {
  log('error', 'Missing JWT_EXPIRATION config! Defaulting to 1hr.');
}

export const port: number = PORT
  ? parseInt(PORT, 10) || defaultPort
  : defaultPort;
export const environment: string = NODE_ENV || defaultEnv;
export const minPasswordLength: number = 6;
export const graphqlEndpoint: string = 'graphql';
export const jwtSecretKey: string = JWT_SECRET_KEY || '';
export const jwtExpiration: string = JWT_EXPIRATION || '1hr';
