import mongoose from 'mongoose';
import { ApplicationConfig } from './interfaces/config.app.js';

import {
  environment, port, graphiqlEnabled, dbConnectionString,
} from './configs/index.js';
import application from './app.js';

const appConfig: ApplicationConfig = { port, environment, graphiqlEnabled };
const app = application(appConfig);

await mongoose.connect(dbConnectionString);
const server = app.listen(appConfig.port);

export default server;
