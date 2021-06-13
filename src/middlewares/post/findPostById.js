import errorCodes from '../../constants/errorCodes';
import postService from '../../services/postService';

const { POST_NOT_EXISTS } = errorCodes;

const findPostById = async (req, res, next) => {
  try {
    const post = await postService.findById(req.params.id);
    if (!post) {
      res.status(404).send({ message: POST_NOT_EXISTS });
      return next();
    }
    res.status(200).send(post);
    return next();
  } catch (err) {
    return next(err);
  }
};

export default findPostById;
