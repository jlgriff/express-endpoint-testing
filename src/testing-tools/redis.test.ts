import { StartedTestContainer } from 'testcontainers';
import { RedisClientType } from 'redis';
import { startRedisClient } from './utilities';

const dbPort = 6379;

describe('Test a redis insert and read', () => {
  let container: StartedTestContainer;
  let client: RedisClientType;

  beforeAll(async () => {
    const { testContainer, testClient } = await startRedisClient(dbPort);
    container = testContainer;
    client = testClient;
  });

  afterAll(async () => {
    await client.quit();
    await container.stop();
  });

  it('Verify the client saves and reads vales correctly', async () => {
    await client.set('key', 'val');
    expect(await client.get('key')).toBe('val');
  });
});
