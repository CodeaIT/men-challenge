import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export const signJwt = (payload) => {
  const token = jwt.sign(payload.toJSON(), JWT_SECRET);
  return token;
};

const jwtUtil = {
  signJwt,
};

export default jwtUtil;
