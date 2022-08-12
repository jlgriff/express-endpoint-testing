/* eslint-disable object-curly-newline */
import { Mongoose } from 'mongoose';
import { StartedTestContainer } from 'testcontainers';
import agent from 'supertest';
import { loginQueryString, startMongoClient, insertTestUser, responseHasUserIdAndToken, createUserMutationString, responsesMatch } from './utilities';
import application from '../../app';
import { ApplicationConfig } from '../../interfaces/config.app';
import { graphqlEndpoint } from '../../configs';
import { validUserInput } from './test-data';
import log from '../../utilities/logger';

const appConfig: ApplicationConfig = { graphiqlEnabled: false };
const app = application(appConfig);
const dbPort = 27017;

let container: StartedTestContainer;
let client: Mongoose;

beforeAll(async () => {
  const { testContainer, testClient } = await startMongoClient(dbPort);
  container = testContainer;
  client = testClient;
  return client.connection.db.dropDatabase();
});

afterAll(async () => {
  await client.connection.close();
  return container.stop();
});

afterEach(async () => client.connection.db.dropDatabase());

describe('Test the login resolver', () => {
  it('login: Verify that a user with correct credentials can log in', async () => {
    const { firstname, lastname, password } = validUserInput;
    const email = 'valid.user1@test.com';
    await insertTestUser(email, firstname, lastname, password);

    await agent(app)
      .post(graphqlEndpoint)
      .set('Accept', 'application/json')
      .send({ query: loginQueryString(email, password) })
      .expect(200)
      .expect((res) => {
        const { body } = res;
        if (!responseHasUserIdAndToken(body)) {
          const error: Error = new Error(`Response does not contain userId and token:\n${JSON.stringify(body)}`);
          log('error', error.toString());
          throw error;
        }
      });
  });
});

describe('Test the createUser resolver', () => {
  it('createUser: Verify that a new valid user can be created', async () => {
    const { firstname, lastname, password } = validUserInput;
    const email = 'valid.user1@test.com';
    const expected = {
      data: {
        createUser: {
          _id: '                        ',
          email,
          firstname,
          lastname,
        },
      },
    };

    await agent(app)
      .post(graphqlEndpoint)
      .set('Accept', 'application/json')
      .send({ query: createUserMutationString(email, firstname, lastname, password) })
      .expect(200)
      .expect((res) => {
        const { body } = res;
        if (!responsesMatch(expected, body)) {
          const error: Error = new Error(`Response not match expected output:\n Expected:\n ${JSON.stringify(expected)}\n Actual:\n ${JSON.stringify(body)}`);
          log('error', error.toString());
          throw error;
        }
      });
  });
});
