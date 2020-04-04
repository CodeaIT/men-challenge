import jwt from 'express-jwt';

const isAuthorized = jwt({ secret: process.env.JWT_SECRET });

export default isAuthorized;
