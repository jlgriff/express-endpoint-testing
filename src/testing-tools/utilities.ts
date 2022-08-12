import bcrypt from 'bcryptjs';
import mongoose, { Mongoose } from 'mongoose';
import { RedisClientType, createClient } from 'redis';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import isEqual from 'lodash.isequal';
import sortBy from 'lodash.sortby';
import supertest from 'supertest';
import { User } from '../interfaces/user';
import UserModel from '../models/user';
import log from '../utilities/logger';
import { Exception } from '../interfaces/exception';

/**
 * Starts up a temporary redis container and uses it to initialize a redis client
 */
export const startRedisClient = async (port: number): Promise<{
  testContainer: StartedTestContainer;
  testClient: RedisClientType;
}> => {
  const testContainer: StartedTestContainer = await new GenericContainer('redis')
    .withExposedPorts(port)
    .start();

  const testClient: RedisClientType = createClient(
    {
      socket: {
        host: testContainer.getHost(),
        port: testContainer.getMappedPort(port),
      },
    },
  );
  await testClient.connect();

  return { testContainer, testClient };
};

/**
 * Starts up a temporary mongoose container and uses it to initialize a mongoose client
 */
export const startMongoClient = async (port: number): Promise<{
  testContainer: StartedTestContainer;
  testClient: Mongoose;
}> => {
  const testContainer: StartedTestContainer = await new GenericContainer('mongo')
    .withExposedPorts(port)
    .start();

  const testDbName = 'endpoint_test';
  const dbConnectionString = `mongodb://${testContainer.getHost()}:${port}/${testDbName}?retryWrites=true`;
  const testClient: Mongoose = await mongoose.connect(dbConnectionString);

  return { testContainer, testClient };
};

/**
 * Logs the supertest error and then throws it
 */
export const handleTestError = (err: any, res: supertest.Response) => {
  if (err) {
    const errorMsg: string = `Test's error response:\n${JSON.stringify(res)}`;
    log('error', errorMsg);
    const error: Exception = { message: errorMsg, status: err.status };
    throw error;
  }
};

/**
 * Hashes the given password for pre-loading a hashed password into the database
 */
export const getHashedPassword = async (
  password: string,
): Promise<string> => bcrypt.hash(password, 12);

/**
 * Queries the database for a particular user email
 */
export const findTestUser = async (email: string): Promise<User | null> => {
  const existingUser = await UserModel.findOne({ email });
  if (!existingUser) {
    return null;
  }
  return {
    _id: existingUser.id,
    email: existingUser.email,
    firstname: existingUser.firstname,
    lastname: existingUser.lastname,
  };
};

/**
 * Inserts a test user into the User collection with the given properties
 */
export const insertTestUser = async (
  email: string,
  firstname: string,
  lastname: string,
  password: string,
): Promise<User> => {
  const userModel = new UserModel({
    email,
    firstname,
    lastname,
    password: await getHashedPassword(password),
  });
  const createdUser = await userModel.save();
  return {
    _id: createdUser.id,
    email,
    firstname,
    lastname,
  };
};

/**
 * Checks if two application responses equal each other
 */
export const responsesMatch = (
  expected: any,
  actual: any,
): boolean => {
  // Checks if both are matching error responses
  if (
    expected.errors
    && expected.errors.length > 0
    && actual.errors
    && actual.errors.length > 0
  ) {
    return (expected.errors.length === actual.errors.length
      && isEqual(sortBy(expected.errors), sortBy(actual.errors)));
  }
  // Checks if both are matching createUser responses
  if (
    expected.data
    && expected.data.createUser
    && expected.data.createUser.email
    && expected.data.createUser.firstname
    && expected.data.createUser.lastname
    && actual.data.createUser
    && expected.data.createUser.email
    && actual.data.createUser.firstname
    && actual.data.createUser.lastname
  ) {
    return expected.data.createUser.email === actual.data.createUser.email
      && expected.data.createUser.firstname === actual.data.createUser.firstname
      && expected.data.createUser.lastname === actual.data.createUser.lastname;
  }
  return false;
};

/**
 * Creates a query string for the login query
 */
export const loginQueryString = (email: string, password: string): string => `
  query {
    login(email: "${email}", password: "${password}") {
      userId token
    }
  }
`;

/**
 * Creates a query string for the createUser mutation
 */
export const createUserMutationString = (email: string, firstname: string, lastname: string, password: string): string => ` 
  mutation { 
    createUser(email: "${email}", firstname: "${firstname}", lastname: "${lastname}", password: "${password}") { 
      _id email firstname lastname 
    } 
  }
`;

export const responseHasUserIdAndToken = (response: any): boolean => response !== null
  && response.data !== null
  && response.data.login !== null
  && response.data.login.userId !== null
  && response.data.login.userId !== ''
  && response.data.login.token !== null
  && response.data.login.token !== '';
