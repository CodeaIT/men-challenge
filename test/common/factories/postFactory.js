import faker from 'faker';
import Post, {
  MAX_TITLE_LENGTH,
  MAX_BODY_LENGTH,
} from '../../../src/models/post';

export const generatePostData = (data) => ({
  title: faker.lorem.words(1),
  body: faker.lorem.words(5),
  ...data,
});

export const generatePostWithoutTitle = (data) => ({
  ...generatePostData(data),
  title: undefined,
});

export const generatePostWithoutInvalidTitle = (data) => ({
  ...generatePostData(data),
  title: faker.lorem.words(MAX_TITLE_LENGTH),
});

export const generatePostWithoutBody = (data) => ({
  ...generatePostData(data),
  body: undefined,
});

export const generatePostWithInvalidBody = (data) => ({
  ...generatePostData(data),
  body: faker.lorem.words(MAX_BODY_LENGTH),
});

export const generatePost = (data) => Post.create(generatePostData(data));

const postFactory = {
  generatePostData,
  generatePost,
};

export default postFactory;
