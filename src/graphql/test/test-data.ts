export const validUserInput = {
  email: 'test@test.com',
  password: '123456',
  firstname: 'John',
  lastname: 'Doe',
};

export const invalidPasswordUserInput = {
  email: 'test@test.com',
  password: '12345',
  firstname: 'John',
  lastname: 'Doe',
};

export const invalidEmailUserInput = {
  email: 'test@test',
  password: '12345',
  firstname: 'John',
  lastname: 'Doe',
};

export const missingLastnameUserInput = {
  email: 'test@test.com',
  password: '12345',
  firstname: 'John',
  lastname: '',
};
