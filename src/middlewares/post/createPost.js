import postService from '../../services/postService';

const createPost = async (req, res, next) => {
  try {
    const user = await postService.create(req.body);
    return res.status(200).send(user);
  } catch (err) {
    return next(err);
  }
};

export default createPost;
