/* eslint-disable object-curly-newline */
import { Mongoose } from 'mongoose';
import { StartedTestContainer } from 'testcontainers';
import agent from 'supertest';
import { loginQueryString, startMongoClient, insertTestUser, responseHasUserIdAndToken, createUserMutationString, responsesMatch } from '../testing-tools/utilities';
import application from '../app';
import { ApplicationConfig } from '../interfaces/config.app';
import { graphqlEndpoint, minPasswordLength } from '../configs';
import { validUserInput } from '../testing-tools/test-data';
import log from '../utilities/logger';

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
  it('Verify that a user with correct credentials can log in', async () => {
    const { firstname, lastname, password } = validUserInput;
    const email = 'valid.user1@test.com';
    await insertTestUser(email, firstname, lastname, password);

    await agent(app)
      .post(graphqlEndpoint)
      .set('Accept', 'application/json')
      .send({ query: loginQueryString(email, password) })
      .expect((res) => {
        const { body, status } = res;
        if (!responseHasUserIdAndToken(body)) {
          const error: Error = new Error(`Response does not contain userId and token:\n${JSON.stringify(body)}`);
          log('error', error.toString());
          throw error;
        }
        if (status !== 200) {
          const error: Error = new Error('Response should return a 200 status');
          log('error', error.toString());
          throw error;
        }
      });
  });

  it('Verify that a user with incorrect credentials cannot log in', async () => {
    const { firstname, lastname, password } = validUserInput;
    const email = 'invalid.user1@test.com';
    await insertTestUser(email, firstname, lastname, password);

    await agent(app)
      .post(graphqlEndpoint)
      .set('Accept', 'application/json')
      .send({ query: loginQueryString(email, 'invalidpassword') })
      .expect((res) => {
        const { body, status } = res;
        if (responseHasUserIdAndToken(body)) {
          const error: Error = new Error(`Response should not contain userId and token:\n${JSON.stringify(body)}`);
          log('error', error.toString());
          throw error;
        }
        if (status === 200) {
          const error: Error = new Error('Response should not return a 200 status');
          log('error', error.toString());
          throw error;
        }
      });
  });
});

describe('Test the createUser resolver', () => {
  it('Verify that a new valid user can be created', async () => {
    const { firstname, lastname, password } = validUserInput;
    const email = 'valid.user1@test.com';
    const expected = {
      data: {
        createUser: {
          _id: '________________________',
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
      .expect((res) => {
        const { body, status } = res;
        if (!responsesMatch(expected, body)) {
          const error: Error = new Error(`Response did not match expected output:\n Expected:\n ${JSON.stringify(expected)}\n Actual:\n ${JSON.stringify(body)}`);
          log('error', error.toString());
          throw error;
        }
        if (status !== 200) {
          const error: Error = new Error('Response should return a 200 status');
          log('error', error.toString());
          throw error;
        }
      });
  });

  it('Verify that an existing user cannot be created', async () => {
    const { firstname, lastname, password } = validUserInput;
    const email = 'invalid.user2@test.com';
    await insertTestUser(email, firstname, lastname, password);
    const expected = {
      errors: [
        {
          message: 'User exists already',
          status: 400,
        },
      ],
    };

    await agent(app)
      .post(graphqlEndpoint)
      .set('Accept', 'application/json')
      .send({ query: createUserMutationString(email, firstname, lastname, password) })
      .expect((res) => {
        const { body, status } = res;
        if (!responsesMatch(expected, body)) {
          const error: Error = new Error(`Response did not match expected output:\n Expected:\n ${JSON.stringify(expected)}\n Actual:\n ${JSON.stringify(body)}`);
          log('error', error.toString());
          throw error;
        }
        if (status === 200) {
          const error: Error = new Error('Response should not return a 200 status');
          log('error', error.toString());
          throw error;
        }
      });
  });

  it('Verify that a user cannot be created with too short of a password', async () => {
    const { firstname, lastname } = validUserInput;
    const email = 'invalid.user3@test.com';
    const password = '123';
    const expected = {
      errors: [
        {
          message: `Password must be at least ${minPasswordLength} characters long`,
          status: 400,
        },
      ],
    };

    await agent(app)
      .post(graphqlEndpoint)
      .set('Accept', 'application/json')
      .send({ query: createUserMutationString(email, firstname, lastname, password) })
      .expect((res) => {
        const { body, status } = res;
        if (!responsesMatch(expected, body)) {
          const error: Error = new Error(`Response did not match expected output:\n Expected:\n ${JSON.stringify(expected)}\n Actual:\n ${JSON.stringify(body)}`);
          log('error', error.toString());
          throw error;
        }
        if (status === 200) {
          const error: Error = new Error('Response should not return a 200 status');
          log('error', error.toString());
          throw error;
        }
      });
  });
});
