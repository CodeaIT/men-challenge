import chai from 'chai';
import mocha from 'mocha';
import '../../app';
import axios from 'axios';
import { signJwt } from '../../src/utils/jwtUtil';
import User from '../../src/models/user';
import { buildAuthorizationHeader } from '../common/utils/testUtil';
import { generateUser } from '../common/factories/userFactory';
import endpoints from '../../src/constants/endpoints';

const { GET_USER_ME } = endpoints;

const { before, after } = mocha;
const { describe, it } = mocha;
const { assert } = chai;

let existingUser;

const { BASE_URL } = process.env;
const instance = axios.create({
  baseURL: BASE_URL,
});

describe('User Controller', () => {
  before(async () => {
    await User.remove({});
    existingUser = await generateUser();
  });

  describe(`GET ${GET_USER_ME}`, () => {
    it('Should return not authorized (no bearer token)', async () => {
      try {
        await instance.get(GET_USER_ME);
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 401);
      }
    });
  });

  describe('GET /users/me', () => {
    it('Should return user who signed jwt successfully', async () => {
      // TODO: Mock with sinon
      const token = signJwt(existingUser);
      const user = await instance.get(
        GET_USER_ME,
        buildAuthorizationHeader(token),
      );
      assert.equal(user.data._id, existingUser._id);
      assert.equal(user.data.email, existingUser.email);
      assert.isUndefined(user.data.password);
    });
  });

  after(async () => {
    await User.remove({});
  });
});
