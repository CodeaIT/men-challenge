/* eslint-disable arrow-body-style */
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export const signJwt = (payload) => {
  return jwt.sign(payload.toJSON(), JWT_SECRET);
};

export default {
  signJwt,
};
