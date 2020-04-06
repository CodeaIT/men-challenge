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
const { POST_NOT_EXISTS } = locales.post.responses;

let existingUser = {
  email: faker.internet.email(),
  password: faker.internet.password(MIN_PASSWORD_LENGTH),
};
let existingUserToken;

const generatePost = () => ({
  title: faker.lorem.words(1),
  body: faker.lorem.words(5),
});
let existingPost;

const { BASE_URL } = process.env;
const instance = axios.create({
  baseURL: BASE_URL,
});

const FAKE_OBJECT_ID = '5e8b658cb5297dae7ae1fa8e';

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
          body: faker.lorem.words(5),
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
          body: faker.lorem.words(5),
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
          title: faker.lorem.words(1),
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
          title: faker.lorem.words(1),
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
          title: faker.lorem.words(1),
          body: faker.lorem.words(5),
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
          title: faker.lorem.words(1),
          body: faker.lorem.words(5),
          author: FAKE_OBJECT_ID,
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
          title: faker.lorem.words(1),
          body: faker.lorem.words(5),
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

    after(async () => {
      await Post.remove({});
    });
  });

  describe('GET /posts', () => {
    before(async () => {
      const postToCreate = {
        ...generatePost(),
        ...{ author: existingUser._id },
      };
      existingPost = await Post.create(postToCreate);
    });

    it('Should return unauthorized as no header is sent', async () => {
      try {
        await instance.get('/posts');
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 401);
      }
    });

    it('Should return existing posts', async () => {
      try {
        const posts = await instance.get(
          '/posts',
          buildAuthorizationHeader(existingUserToken),
        );
        assert.equal(posts.status, 200);
        assert.isNotEmpty(posts.data);
        const foundPost = posts.data.shift();
        assert.equal(foundPost.author, existingPost.author);
        assert.equal(foundPost.title, existingPost.title);
        assert.equal(foundPost.body, existingPost.body);
        assert.equal(foundPost._id, existingPost._id);
      } catch (err) {
        assert.fail();
      }
    });
    after(async () => {
      await Post.remove({});
    });
  });

  describe('GET /posts/:id', () => {
    before(async () => {
      const postToCreate = {
        ...generatePost(),
        ...{ author: existingUser._id },
      };
      existingPost = await Post.create(postToCreate);
    });

    it('Should return unauthorized as no header is sent', async () => {
      try {
        await instance.get(`/posts/${existingPost._id}`);
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 401);
      }
    });

    it('Should return not found as post does not exist', async () => {
      try {
        await instance.get(
          `/posts/${FAKE_OBJECT_ID}`,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.fail();
      } catch (err) {
        assert.equal(err.response.status, 404);
        assert.equal(err.response.data.message, POST_NOT_EXISTS);
      }
    });

    it('Should return post by id successfully', async () => {
      try {
        const post = await instance.get(
          `/posts/${existingPost._id}`,
          buildAuthorizationHeader(existingUserToken),
        );
        assert.equal(post.status, 200);
        assert.equal(post.data._id, existingPost._id);
        assert.equal(post.data.title, existingPost.title);
        assert.equal(post.data.body, existingPost.body);
        assert.equal(post.data.author, existingPost.author);
      } catch (err) {
        assert.fail();
      }
    });

    after(async () => {
      await Post.remove({});
    });
  });

  after(async () => {
    await User.remove({});
    await Post.remove({});
  });
});
