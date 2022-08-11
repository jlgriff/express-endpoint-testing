import { Mongoose } from 'mongoose';
import { StartedTestContainer } from 'testcontainers';
import agent from 'supertest';
import { startMongoClient } from './test/utilities';
import application from '../app';
import { ApplicationConfig } from '../interfaces/config.app';
import { graphqlEndpoint } from '../configs';
import { UserInput } from '../interfaces/user';

const appConfig: ApplicationConfig = { graphiqlEnabled: false };
const app = application(appConfig);
const dbPort = 27017;

describe('Test the createUser mutation', () => {
  let container: StartedTestContainer;
  let client: Mongoose;

  beforeAll(async () => {
    const { testContainer, testClient } = await startMongoClient(dbPort);
    container = testContainer;
    client = testClient;
  });

  afterAll(async () => {
    await client.connection.close();
    await container.stop();
  });

  it('Verify that a new valid user gets created', async () => {
    const userInput: UserInput = {
      email: 'test@test.com',
      password: '123456',
      firstname: 'John',
      lastname: 'Doe',
    };
    const mutation: string = `{ 
      createUser(userInput: ${userInput}) {
        _id
        email
      }
    }`;
    const response: agent.Test = agent(app)
      .post(graphqlEndpoint)
      .send({ mutation })
      .set('Accept', 'application/json');
    response
      .expect('Content-Type', /json/)
      .expect(200);
  });
});
