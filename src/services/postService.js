import models from '../models';

const { Post } = models;

const create = (post) => Post.create(post);

const postService = { create };

export default postService;
