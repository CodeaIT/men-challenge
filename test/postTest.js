import chai from 'chai';
import mocha from 'mocha';
import '../app';
import axios from 'axios';
import faker from 'faker';
import User, { MIN_PASSWORD_LENGTH } from '../src/models/user';
import Post, {
  MAX_TITLE_LENGTH,
  MAX_BODY_LENGTH,
  TITLE_FIELD_NAME,
  BODY_FIELD_NAME,
  AUTHOR_FIELD_NAME,
} from '../src/models/post';
import locales from '../src/locales/en.json';
import { assertHasFieldErrors, buildAuthorizationHeader } from './testUtil';
import { signJwt } from '../src/utils/jwtUtil';

const { before, after } = mocha;
const { describe, it } = mocha;
const { assert } = chai;

const { TITLE_INVALID_LENGTH, BODY_INVALID_LENGTH } = locales.post.validations;
const { USER_NOT_EXISTS } = locales.user.responses;

let existingUser = {
  email: faker.internet.email(),
  password: faker.internet.password(MIN_PASSWORD_LENGTH),
};
let existingUserToken;

const { BASE_URL } = process.env;
const instance = axios.create({
  baseURL: BASE_URL,
});

describe('Post Controller', () => {
  before(async () => {
    await User.remove({});
    existingUser = await User.create(existingUser);
    existingUserToken = signJwt(existingUser);
  });

  describe('POST /posts', () => {
    it('Should return unauthorized as no header is sent', async () => {
      try {
        await instance.post('/posts', {});
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 401);
      }
    });
    it('Should return bad request as body is empty', async () => {
      try {
        await instance.post(
          '/posts',
          {},
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, TITLE_FIELD_NAME);
        assertHasFieldErrors(err, BODY_FIELD_NAME);
        assertHasFieldErrors(err, AUTHOR_FIELD_NAME);
      }
    });
    it('Should return bad request as title is empty', async () => {
      try {
        const post = {
          body: faker.lorem.words(10),
          author: existingUser._id,
        };
        await instance.post(
          '/posts',
          post,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, TITLE_FIELD_NAME);
      }
    });
    it('Should return bad request as title length is greater than max chars allowed', async () => {
      try {
        const post = {
          title: faker.lorem.words(MAX_TITLE_LENGTH),
          body: faker.lorem.words(10),
          author: existingUser._id,
        };
        await instance.post(
          '/posts',
          post,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, TITLE_FIELD_NAME);
        const invalidTitleErr = err.response.data.errors.shift();
        assert.equal(
          invalidTitleErr.msg,
          `${TITLE_INVALID_LENGTH} ${MAX_TITLE_LENGTH}`,
        );
      }
    });
    it('Should return bad request as post body is empty', async () => {
      try {
        const post = {
          title: faker.lorem.words(2),
          author: existingUser._id,
        };
        await instance.post(
          '/posts',
          post,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, BODY_FIELD_NAME);
      }
    });
    it('Should return bad request as post body length is greater than max chars allowed', async () => {
      try {
        const post = {
          title: faker.lorem.words(2),
          body: faker.lorem.words(MAX_BODY_LENGTH),
          author: existingUser._id,
        };
        await instance.post(
          '/posts',
          post,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, BODY_FIELD_NAME);
        const invalidBodyErr = err.response.data.errors.shift();
        assert.equal(
          invalidBodyErr.msg,
          `${BODY_INVALID_LENGTH} ${MAX_BODY_LENGTH}`,
        );
      }
    });
    it('Should return bad request as author id is invalid', async () => {
      try {
        const post = {
          title: faker.lorem.words(2),
          body: faker.lorem.words(10),
          author: faker.random.uuid(),
        };
        await instance.post(
          '/posts',
          post,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, AUTHOR_FIELD_NAME);
      }
    });
    it('Should return bad request as author does not exist', async () => {
      try {
        const post = {
          title: faker.lorem.words(2),
          body: faker.lorem.words(10),
          author: '5e8b658cb5297dae7ae1fa8e',
        };
        await instance.post(
          '/posts',
          post,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 422);
        assert.isNotEmpty(err.response.data.errors);
        assertHasFieldErrors(err, AUTHOR_FIELD_NAME);
        const invalidAuthorErr = err.response.data.errors.shift();
        assert.equal(invalidAuthorErr.msg, USER_NOT_EXISTS);
      }
    });
    it('Should create a new post successfully', async () => {
      try {
        const post = {
          title: faker.lorem.words(2),
          body: faker.lorem.words(10),
          author: existingUser._id,
        };
        const createdPost = await instance.post(
          '/posts',
          post,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.equal(createdPost.status, 200);
        assert.equal(existingUser._id, createdPost.data.author);
        assert.equal(post.title, createdPost.data.title);
        assert.equal(post.body, createdPost.data.body);
        assert.isNotEmpty(createdPost.data.date);
      } catch (err) {
        assert.fail();
      }
    });
  });

  after(async () => {
    await User.remove({});
    await Post.remove({});
  });
});
