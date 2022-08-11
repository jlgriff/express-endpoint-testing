import { RedisClientType, createClient } from 'redis';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

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

export default startRedisClient;
