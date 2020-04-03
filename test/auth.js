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
import { assertHasFieldErrors } from './common';
import {
  testEmptyBody,
  testEmptyEmail,
  testEmptyPassword,
  testInvalidEmail,
  testInvalidPasswordLength,
} from './auth.common';

const { before, after } = mocha;
const { describe, it } = mocha;
const { assert } = chai;

const { EMAIL_ALREADY_IN_USE } = locales.user.validations;

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
      try {
        const email = faker.internet.email();
        const password = faker.internet.password(MIN_PASSWORD_LENGTH);

        const user = await instance.post('/auth/register', {
          email,
          password,
        });

        assert.equal(user.status, 200);
        assert.equal(user.data.email, email);
        assert.isUndefined(user.data.password);
      } catch (err) {
        assert.fail();
      }
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
  });

  after(async () => {
    await User.remove({});
  });
});
