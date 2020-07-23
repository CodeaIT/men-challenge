import postService from '../../services/postService';

const findAllPosts = async (req, res, next) => {
  try {
    const posts = await postService.findAll();
    res.status(200).send(posts);
    return next();
  } catch (err) {
    return next(err);
  }
};

export default findAllPosts;
