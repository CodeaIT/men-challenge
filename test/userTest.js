import chai from 'chai';
import mocha from 'mocha';
import '../app';
import axios from 'axios';
import faker from 'faker';
import { signJwt } from '../src/utils/jwtUtil';
import User, { MIN_PASSWORD_LENGTH } from '../src/models/user';

const { before, after } = mocha;
const { describe, it } = mocha;
const { assert } = chai;

let existingUser = {
  email: faker.internet.email(),
  password: faker.internet.password(MIN_PASSWORD_LENGTH),
};

const { BASE_URL } = process.env;
const instance = axios.create({
  baseURL: BASE_URL,
});

describe('User Controller', () => {
  before(async () => {
    await User.remove({});
    existingUser = await User.create(existingUser);
  });

  describe('GET /users/me', () => {
    it('Should return not authorized (no bearer token)', async () => {
      try {
        await instance.get('/users/me');
      } catch (err) {
        assert.equal(err.response.status, 401);
      }
    });
  });

  describe('GET /users/me', () => {
    it('Should return user who signed jwt successfully', async () => {
      try {
        // TODO: Mock with sinon
        const token = signJwt(existingUser);
        const user = await instance.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        assert.equal(user.data._id, existingUser._id);
        assert.equal(user.data.email, existingUser.email);
        assert.isUndefined(user.data.password);
      } catch (err) {
        assert.fail();
      }
    });
  });

  after(async () => {
    await User.remove({});
  });
});
