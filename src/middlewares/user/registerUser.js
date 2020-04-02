import userService from '../../services/user';

const registerUser = async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    return res.status(200).send(user);
  } catch (err) {
    return next(err);
  }
};

export default registerUser;
