import faker from 'faker';
import User, { MIN_PASSWORD_LENGTH } from '../../../src/models/user';

export const generateUserData = (data) => ({
  email: faker.internet.email(),
  password: faker.internet.password(MIN_PASSWORD_LENGTH),
  ...data,
});

export const generateUser = (data) => User.create(generateUserData(data));

const userFactory = {
  generateUserData,
  generateUser,
};

export default userFactory;
