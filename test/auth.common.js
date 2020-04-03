import chai from 'chai';
import faker from 'faker';
import { assertHasFieldErrors } from './common';
import {
  EMAIL_FIELD_NAME,
  PASSWORD_FIELD_NAME,
  MIN_PASSWORD_LENGTH,
} from '../src/models/user';
import locales from '../src/locales/en.json';

const { assert } = chai;

const { EMAIL_NOT_VALID, PASSWORD_INVALID_LENGTH } = locales.user.validations;

export const testEmptyBody = (instance, route) => async () => {
  try {
    await instance.post(route, {});
    assert.fail();
  } catch (err) {
    assert.equal(err.response.status, 422);
    assert.isNotEmpty(err.response.data.errors);
    assertHasFieldErrors(err, EMAIL_FIELD_NAME);
    assertHasFieldErrors(err, PASSWORD_FIELD_NAME);
  }
};

export const testEmptyEmail = (instance, route) => async () => {
  try {
    const email = faker.internet.email();
    await instance.post(route, {
      email,
    });
    assert.fail();
  } catch (err) {
    assert.equal(err.response.status, 422);
    assert.isNotEmpty(err.response.data.errors);
    assertHasFieldErrors(err, PASSWORD_FIELD_NAME);
  }
};

export const testEmptyPassword = (instance, route) => async () => {
  try {
    const password = faker.internet.password(MIN_PASSWORD_LENGTH);
    await instance.post(route, {
      password,
    });
    assert.fail();
  } catch (err) {
    assert.equal(err.response.status, 422);
    assert.isNotEmpty(err.response.data.errors);
    assertHasFieldErrors(err, EMAIL_FIELD_NAME);
  }
};

export const testInvalidEmail = (instance, route) => async () => {
  try {
    const email = faker.internet.userName();
    const password = faker.internet.password(MIN_PASSWORD_LENGTH);

    await instance.post(route, {
      email,
      password,
    });
    assert.fail();
  } catch (err) {
    assert.equal(err.response.status, 422);
    assert.isNotEmpty(err.response.data.errors);
    assertHasFieldErrors(err, EMAIL_FIELD_NAME);
    const invalidEmailErr = err.response.data.errors.shift();
    assert.equal(invalidEmailErr.msg, EMAIL_NOT_VALID);
  }
};

export const testInvalidPasswordLength = (instance, route) => async () => {
  try {
    const minPasswordLength = MIN_PASSWORD_LENGTH - 1;
    const email = faker.internet.email();
    const passwordInvalidLength = faker.random.number({
      min: 0,
      max: minPasswordLength,
    });
    const password = faker.internet.password(passwordInvalidLength);

    await instance.post(route, {
      email,
      password,
    });
    assert.fail();
  } catch (err) {
    assert.equal(err.response.status, 422);
    assert.isNotEmpty(err.response.data.errors);
    assertHasFieldErrors(err, PASSWORD_FIELD_NAME);
    const invalidPasswordErr = err.response.data.errors.shift();
    assert.equal(
      invalidPasswordErr.msg,
      `${PASSWORD_INVALID_LENGTH} ${MIN_PASSWORD_LENGTH}`,
    );
  }
};

export default {
  testEmptyBody,
  testEmptyEmail,
  testEmptyPassword,
  testInvalidEmail,
  testInvalidPasswordLength,
};
