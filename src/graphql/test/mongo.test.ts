import { Mongoose } from 'mongoose';
import { StartedTestContainer } from 'testcontainers';
import TestModel from './model.mongo';
import { startMongoClient } from './utilities';

const dbPort = 27017;

describe('Test a redis insert and read', () => {
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

  it('Verify the client saves and reads vales correctly', async () => {
    const testModel = new TestModel({
      name: 'test-object',
      value: 'test-key',
    });
    await testModel.save();
  });
});
