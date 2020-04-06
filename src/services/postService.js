import models from '../models';

const { Post } = models;

const create = (post) => Post.create(post);

const findAll = () => Post.find({});

const findById = (id) => Post.findById(id);

const postService = { create, findAll, findById };

export default postService;
