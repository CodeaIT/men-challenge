import postService from '../../services/postService';
import locales from '../../locales/en.json';

const { POST_NOT_EXISTS } = locales.post.responses;

const findPostById = async (req, res, next) => {
  try {
    const post = await postService.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: POST_NOT_EXISTS });
    }
    return res.status(200).send(post);
  } catch (err) {
    return next(err);
  }
};

export default findPostById;
