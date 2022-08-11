import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtExpiration, jwtSecretKey } from '../configs/index';
import { Auth } from '../interfaces/authorization';
import { Exception } from '../interfaces/exception';
import { User } from '../interfaces/user';
import UserModel from '../models/user';

/**
 * Saves the user into the database if the user does not already exist
 */
export const saveUser = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string,
): Promise<User> => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    const error: Exception = { message: 'User exists already', status: 400 };
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const userModel = new UserModel({
    email,
    firstname,
    lastname,
    password: hashedPassword,
  });
  const createdUser = await userModel.save();
  return {
    _id: createdUser.id.toString(),
    email: createdUser.email,
    firstname: createdUser.firstname,
    lastname: createdUser.lastname,
  };
};

/**
 * Returns a JWT token if the user's email and password match the values in the database
 */
export const loginUser = async (email: string, password: string): Promise<Auth> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    const error = { message: 'User was not found', status: 404 };
    throw error;
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error = { message: 'Password is incorrect', status: 401 };
    throw error;
  }
  const userId = user.id.toString();
  const token = jwt.sign({
    userId,
    email: user.email,
  }, jwtSecretKey, { expiresIn: jwtExpiration });
  return { userId, token };
};
