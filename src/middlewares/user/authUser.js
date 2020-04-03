import userService from '../../services/user';

const authUser = async (req, res) => {
  try {
    const user = await userService.authenticate(req.body);
    return res.status(200).send(user);
  } catch (err) {
    return res.status(401).send({ message: err });
  }
};

export default authUser;
