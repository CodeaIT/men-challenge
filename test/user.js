/* eslint-disable no-plusplus */
import chai from 'chai';
import mocha from 'mocha';
import '../app';
import axios from 'axios';
import faker from 'faker';
import User, { MIN_PASSWORD_LENGTH } from '../src/models/user';
import locales from '../src/locales/en.json';

const { before, after } = mocha;
const { describe, it } = mocha;
const { assert } = chai;

const EMAIL_FIELD = 'email';
const PASSWORD_FIELD = 'password';
const { EMAIL_NOT_VALID, PASSWORD_INVALID_LENGTH } = locales.user.validations;

const assertHasFieldErrors = (err, field) => {
  const emailErrors = err.response.data.errors.filter((e) => e.param === field);
  assert.isNotEmpty(emailErrors);
};

const { BASE_URL } = process.env;
const instance = axios.create({
  baseURL: BASE_URL,
});

describe('Auth Controller', () => {
  before(async () => {
    await User.remove({});
  });

  describe('POST /auth/register', () => {
    it('Should return bad request as body is empty', async () => {
      try {
        await instance.post('/auth/register', {});
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, EMAIL_FIELD);
        assertHasFieldErrors(err, PASSWORD_FIELD);
      }
    });

    it('Should return bad request as body email is empty', async () => {
      try {
        const email = faker.internet.email();
        await instance.post('/auth/register', {
          email,
        });
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, PASSWORD_FIELD);
      }
    });

    it('Should return bad request as body password is empty', async () => {
      try {
        const password = faker.internet.password(MIN_PASSWORD_LENGTH);
        await instance.post('/auth/register', {
          password,
        });
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, EMAIL_FIELD);
      }
    });

    it('Should return bad request as email is not valid', async () => {
      try {
        const email = faker.internet.userName();
        const password = faker.internet.password(MIN_PASSWORD_LENGTH);

        await instance.post('/auth/register', {
          email,
          password,
        });
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, EMAIL_FIELD);
        const invalidEmailErr = err.response.data.errors.shift();
        assert.equal(invalidEmailErr.msg, EMAIL_NOT_VALID);
      }
    });

    it('Should return bad request as body password is shorter than min length', async () => {
      try {
        const minPasswordLength = MIN_PASSWORD_LENGTH - 1;
        const email = faker.internet.email();
        const passwordInvalidLength = faker.random.number({
          min: 0,
          max: minPasswordLength,
        });
        const password = faker.internet.password(passwordInvalidLength);

        await instance.post('/auth/register', {
          email,
          password,
        });
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, PASSWORD_FIELD);
        const invalidPasswordErr = err.response.data.errors.shift();
        assert.equal(
          invalidPasswordErr.msg,
          `${PASSWORD_INVALID_LENGTH} ${MIN_PASSWORD_LENGTH}`,
        );
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

  after(async () => {
    await User.remove({});
  });
});
