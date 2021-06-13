import chai from 'chai';
import mocha from 'mocha';
import '../../app';
import axios from 'axios';
import User from '../../src/models/user';
import Post from '../../src/models/post';
import { buildAuthorizationHeader } from '../common/utils/testUtil';
import { signJwt } from '../../src/utils/jwtUtil';
import { generateUser } from '../common/factories/userFactory';
import { generatePost } from '../common/factories/postFactory';

const { before, after } = mocha;
const { describe, it } = mocha;
const { assert } = chai;

let existingUser;
let existingUserToken;

let existingPost;

const { BASE_URL } = process.env;
const instance = axios.create({
  baseURL: BASE_URL,
});

describe('Post Controller', () => {
  before(async () => {
    await User.remove({});
    existingUser = await generateUser();
    existingUserToken = signJwt(existingUser);
  });

  describe('GET /posts', () => {
    before(async () => {
      existingPost = await generatePost({ author: existingUser._id });
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
