import bcrypt from 'bcryptjs';
import mongoose, { Mongoose } from 'mongoose';
import { RedisClientType, createClient } from 'redis';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

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

export const getHashedPassword = async (
  password: string,
): Promise<string> => bcrypt.hash(password, 12);
