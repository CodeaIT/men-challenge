/* eslint-disable object-curly-newline */
import models from '../models';
import locales from '../locales/en.json';
import { signJwt } from '../utils/jwtUtil';

const { USER_NOT_EXISTS, PASSWORD_NOT_VALID } = locales.user.responses;
const { User } = models;

const findByEmail = (email) => User.findOne({ email });

const findById = (id) => User.findById(id);

const create = (user) => User.create(user);

const authenticate = async (credentials) => {
  try {
    const user = await findByEmail(credentials.email);
    if (!user) throw new Error(USER_NOT_EXISTS);
    const isPasswordValid = await user.validatePassword(credentials.password);
    if (!isPasswordValid) {
      throw new Error(PASSWORD_NOT_VALID);
    }
    const token = signJwt(user);
    return { ...user.toJSON(), ...{ token } };
  } catch (err) {
    return Promise.reject(err.message);
  }
};

const userService = { findById, findByEmail, create, authenticate };

export default userService;
