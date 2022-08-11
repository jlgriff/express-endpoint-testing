import validator from 'validator';

import { minPasswordLength } from '../configs/index';
import { loginUser, saveUser } from '../database/user.data';
import { Exception } from '../interfaces/exception';
import { User, UserInput } from '../interfaces/user';

/**
 * Validates the user entity's input, checks if it already exists, and saves it into the database
 */
const createUser = async (userInput: { userInput: UserInput; }, _context: any): Promise<User> => {
  const {
    email, password, firstname, lastname,
  } = userInput.userInput;

  if (!validator.isEmail(email)) {
    const error: Exception = { message: 'Email must be valid', status: 400 };
    throw error;
  } else if (validator.isEmpty(password)
    || !validator.isLength(password, { min: minPasswordLength })) {
    const error: Exception = { message: `Password must be at least ${minPasswordLength} characters long`, status: 400 };
    throw error;
  } else if (validator.isEmpty(firstname) || validator.isEmpty(lastname)) {
    const error: Exception = { message: 'First and last name must be provided', status: 400 };
    throw error;
  }
  return saveUser(email, password, firstname, lastname);
};

/**
 * Returns a JWT token if the user's credentials are correct
 */
const login = async (
  { email, password }: {
    email: string,
    password: string,
  },
  _context: any,
): Promise<string> => loginUser(email, password);

const resolvers = { createUser, login };

export default resolvers;
