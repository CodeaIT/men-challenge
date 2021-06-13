import chai from 'chai';
import mocha from 'mocha';
import '../app';
import axios from 'axios';
import faker from 'faker';
import User, {
  MIN_PASSWORD_LENGTH,
  EMAIL_FIELD_NAME,
} from '../src/models/user';
import locales from '../src/locales/en.json';
import { assertHasFieldErrors } from './testUtil';
import {
  testEmptyBody,
  testEmptyEmail,
  testEmptyPassword,
  testInvalidEmail,
  testInvalidPasswordLength,
} from './authTestShared';

const { before, after } = mocha;
const { describe, it } = mocha;
const { assert } = chai;

const { EMAIL_ALREADY_IN_USE } = locales.user.validations;
const { PASSWORD_NOT_VALID, USER_NOT_EXISTS } = locales.user.responses;

const ALREADY_CREATED_EMAIL = faker.internet.email();
const ALREADY_CREATED_PASSWORD = faker.internet.password(MIN_PASSWORD_LENGTH);

const { BASE_URL } = process.env;
const instance = axios.create({
  baseURL: BASE_URL,
});

describe('Auth Controller', () => {
  before(async () => {
    await User.remove({});
    await User.create({
      email: ALREADY_CREATED_EMAIL,
      password: ALREADY_CREATED_PASSWORD,
    });
  });

  describe('POST /auth/register', () => {
    it(
      'Should return bad request as body is empty',
      testEmptyBody(instance, '/auth/register'),
    );

    it(
      'Should return bad request as body email is empty',
      testEmptyEmail(instance, '/auth/register'),
    );

    it(
      'Should return bad request as body password is empty',
      testEmptyPassword(instance, '/auth/register'),
    );

    it(
      'Should return bad request as email is not valid',
      testInvalidEmail(instance, '/auth/register'),
    );

    it(
      'Should return bad request as body password is shorter than min length',
      testInvalidPasswordLength(instance, '/auth/register'),
    );

    it('Should return bad request as email already exist', async () => {
      try {
        const email = ALREADY_CREATED_EMAIL;
        const password = faker.internet.password(MIN_PASSWORD_LENGTH);

        await instance.post('/auth/register', {
          email,
          password,
        });
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, EMAIL_FIELD_NAME);
        const invalidEmailErr = err.response.data.errors.shift();
        assert.equal(invalidEmailErr.msg, EMAIL_ALREADY_IN_USE);
      }
    });

    it('Should create the user successfully', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password(MIN_PASSWORD_LENGTH);

      const user = await instance.post('/auth/register', {
        email,
        password,
      });

      assert.equal(user.status, 200);
      assert.equal(user.data.email, email);
      assert.isUndefined(user.data.password);
    });
  });

  describe('POST /auth', () => {
    it(
      'Should return bad request as body is empty',
      testEmptyBody(instance, '/auth'),
    );

    it(
      'Should return bad request as body email is empty',
      testEmptyEmail(instance, '/auth'),
    );

    it(
      'Should return bad request as body password is empty',
      testEmptyPassword(instance, '/auth'),
    );

    it(
      'Should return bad request as email is not valid',
      testInvalidEmail(instance, '/auth'),
    );

    it(
      'Should return bad request as body password is shorter than min length',
      testInvalidPasswordLength(instance, '/auth'),
    );

    it('Should return bad request as user with that email does not exist', async () => {
      try {
        const email = faker.internet.email();
        const password = faker.internet.password(MIN_PASSWORD_LENGTH);

        await instance.post('/auth', {
          email,
          password,
        });
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 401);
        assert.equal(err.response.data.message, USER_NOT_EXISTS);
      }
    });

    it('Should return bad request as password is incorrect', async () => {
      try {
        const email = ALREADY_CREATED_EMAIL;
        const password = faker.internet.password(MIN_PASSWORD_LENGTH);

        await instance.post('/auth', {
          email,
          password,
        });
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 401);
        assert.equal(err.response.data.message, PASSWORD_NOT_VALID);
      }
    });

    it('Should login successfully', async () => {
      const email = ALREADY_CREATED_EMAIL;
      const password = ALREADY_CREATED_PASSWORD;

      const user = await instance.post('/auth', {
        email,
        password,
      });

      assert.equal(user.status, 200);
      assert.isNotEmpty(user.data._id);
      assert.equal(user.data.email, email);
      assert.isNotEmpty(user.data.token);
      assert.isUndefined(user.data.password);
    });
  });

  after(async () => {
    await User.remove({});
  });
});
