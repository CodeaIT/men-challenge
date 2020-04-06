import postService from '../../services/postService';

const findAllPosts = async (req, res, next) => {
  try {
    const posts = await postService.findAll();
    return res.status(200).send(posts);
  } catch (err) {
    return next(err);
  }
};

export default findAllPosts;
