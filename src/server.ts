import mongoose from 'mongoose';
import { ApplicationConfig } from './interfaces/config.app';
import {
  environment, port, graphiqlEnabled, dbConnectionString,
} from './configs/index';
import application from './app';
import log from './utilities/logger';

const appConfig: ApplicationConfig = { graphiqlEnabled };
const app = application(appConfig);

app.on('ready', () => {
  app.listen(port, () => {
    log('info', `Application is running on port ${port} in the ${environment} environment`);
  });
});

log('info', 'Initializing the database.');
mongoose.connect(dbConnectionString)
  .catch((err) => {
    log('error', `Could not connect to the database: ${err}`);
    process.exit();
  });
mongoose.connection.once('open', () => {
  app.emit('ready');
});
