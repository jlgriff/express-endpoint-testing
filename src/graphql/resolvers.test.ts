import { Mongoose } from 'mongoose';
import { StartedTestContainer } from 'testcontainers';
import agent from 'supertest';
import { getHashedPassword, startMongoClient } from './test/utilities';
import application from '../app';
import { ApplicationConfig } from '../interfaces/config.app';
import { graphqlEndpoint } from '../configs';
import UserModel from '../models/user';

const appConfig: ApplicationConfig = { graphiqlEnabled: false };
const app = application(appConfig);
const dbPort = 27017;

const validUserInput = {
  email: 'test@test.com',
  password: '123456',
  firstname: 'John',
  lastname: 'Doe',
};

const loginQueryString = (email: string, password: string): string => `
  query {
    login(email: "${email}", password: "${password}") {
      userId token
    }
  }
`;

const createUserMutationString = (email: string, firstname: string, lastname: string, password: string): string => ` 
  mutation { 
    createUser(email: "${email}", firstname: "${firstname}", lastname: "${lastname}", password: "${password}") { 
      _id email firstname lastname 
    } 
  }
`;

describe('Test each resolver', () => {
  let container: StartedTestContainer;
  let client: Mongoose;

  beforeAll(async () => {
    const { testContainer, testClient } = await startMongoClient(dbPort);
    container = testContainer;
    client = testClient;
  });

  beforeEach(async () => {
    await client.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await client.connection.close();
    await container.stop();
  });

  it('Verify that a user with correct credentials can log in', async () => {
    const {
      email, firstname, lastname, password,
    } = validUserInput;

    const userModel = new UserModel({
      email,
      firstname,
      lastname,
      password: await getHashedPassword(password),
    });
    await userModel.save();

    const response: agent.Test = agent(app)
      .post(graphqlEndpoint)
      .send({ query: loginQueryString(email, password) })
      .set('Accept', 'application/json');

    response
      .expect(200);
  });

  it('Verify that a new valid user can be created', async () => {
    const {
      email, firstname, lastname, password,
    } = validUserInput;

    const response: agent.Test = agent(app)
      .post(graphqlEndpoint)
      .send({ query: createUserMutationString(email, firstname, lastname, password) })
      .set('Accept', 'application/json');

    response
      .expect(200);
  });
});
