import userService from '../../services/userService';

const authUser = async (req, res, next) => {
  try {
    const user = await userService.authenticate(req.body);
    res.status(200).send(user);
    return next();
  } catch (err) {
    res.status(401).send({ message: err });
    return next();
  }
};

export default authUser;
