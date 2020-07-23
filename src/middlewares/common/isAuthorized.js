import jwt from 'express-jwt';

export const isAuthorized = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

export default { isAuthorized };
