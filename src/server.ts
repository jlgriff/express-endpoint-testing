import application from './app';
import { environment, port, graphiqlEnabled } from './configs';
import { ApplicationConfig } from './interfaces/config.app';

const appConfig: ApplicationConfig = { port, environment, graphiqlEnabled };
const app = application(appConfig);
const server = app.listen(appConfig.port);

export default server;
