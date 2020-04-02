import validateEmail from './validateEmail';
import validatePassword from './validatePassword';
import validateUniqueEmail from './validateUniqueEmail';

const validateUser = () => [
  validateEmail,
  validatePassword,
  validateUniqueEmail,
];

export default validateUser;
