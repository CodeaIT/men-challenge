import expressValidator from 'express-validator';

const { check } = expressValidator;

const validateId = check('id').isString();

export default validateId;
