import mongoose, { Model, model } from 'mongoose';

const { Schema } = mongoose;

interface ITestObject {
  name: string;
  value: string;
}

const createTestModel = (): Model<ITestObject> => {
  const testSchema = new Schema<ITestObject>({
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  });
  return model<ITestObject>('Test', testSchema);
};

const TestModel = createTestModel();

export default TestModel;
