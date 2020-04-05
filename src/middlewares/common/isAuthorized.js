import jwt from 'express-jwt';

export const isAuthorized = jwt({ secret: process.env.JWT_SECRET });

export default { isAuthorized };
