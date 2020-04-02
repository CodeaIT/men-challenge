import expressValidator from 'express-validator';

const { check } = expressValidator;

const validateUser = () => [
  check('email', 'Invalid email').exists().isEmail(),
  check('password').isString(),
];

export default validateUser;
